const http = require('http');
const url = require('url');
const { randomUUID, randomBytes, createHmac, scryptSync, timingSafeEqual } = require('crypto');
const { readDatabase, writeDatabase } = require('./storage');
const {
  createNewUserProfile,
  mergeUserProfile,
  formatUserForClient,
} = require('./defaultData');

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'codinglearn-dev-secret-change-me';
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const sendJson = (res, statusCode, payload, headers = {}) => {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    ...headers,
  });
  res.end(body);
};

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });

const createToken = (userId) => {
  const payload = {
    sub: userId,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const jsonPayload = JSON.stringify(payload);
  const encodedPayload = Buffer.from(jsonPayload, 'utf-8').toString('base64url');
  const signature = createHmac('sha256', JWT_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
};

const verifyToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token');
  }

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) {
    throw new Error('Invalid token');
  }

  const expectedSignature = createHmac('sha256', JWT_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (expectedSignature !== signature) {
    throw new Error('Invalid signature');
  }

  const payloadJson = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
  const payload = JSON.parse(payloadJson);

  if (!payload.sub || typeof payload.exp !== 'number') {
    throw new Error('Invalid payload');
  }

  if (payload.exp < Date.now()) {
    throw new Error('Token expired');
  }

  return payload;
};

const hashPassword = (password) => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
};

const verifyPassword = (password, storedHash) => {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, 64).toString('hex');
  return cryptoSafeEqual(key, derivedKey);
};

const cryptoSafeEqual = (a, b) => {
  const bufferA = Buffer.from(a, 'hex');
  const bufferB = Buffer.from(b, 'hex');

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
};

const buildCorsHeaders = (req) => {
  const requestOrigin = req.headers.origin;
  const headers = {
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '600',
  };

  if (allowedOrigins.includes('*')) {
    headers['Access-Control-Allow-Origin'] = '*';
  } else if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    headers['Access-Control-Allow-Origin'] = requestOrigin;
  }

  return headers;
};

const handleOptions = (req, res) => {
  const headers = buildCorsHeaders(req);
  res.writeHead(204, headers);
  res.end();
};

const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');
  return token;
};

const server = http.createServer(async (req, res) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    handleOptions(req, res);
    return;
  }

  const parsedUrl = url.parse(req.url, true);

  const notFound = () => sendJson(res, 404, { message: 'Ressource introuvable.' }, corsHeaders);

  try {
    if (req.method === 'GET' && parsedUrl.pathname === '/health') {
      sendJson(res, 200, { status: 'ok' }, corsHeaders);
      return;
    }

    if (req.method === 'POST' && parsedUrl.pathname === '/api/leads') {
      const body = await readRequestBody(req);
      const { name, email, goals } = body;
      const trimmedName = name?.trim();
      const trimmedEmail = email?.trim().toLowerCase();
      const trimmedGoals = goals?.trim();

      if (!trimmedName || !trimmedEmail || !trimmedGoals) {
        sendJson(res, 400, { message: 'Merci de renseigner votre nom, email et vos objectifs.' }, corsHeaders);
        return;
      }

      const db = await readDatabase();
      const leadEntry = {
        id: randomUUID(),
        name: trimmedName,
        email: trimmedEmail,
        goals: trimmedGoals,
        createdAt: new Date().toISOString(),
      };

      db.leads = [leadEntry, ...db.leads];
      await writeDatabase(db);

      sendJson(res, 201, { status: 'ok' }, corsHeaders);
      return;
    }

    if (req.method === 'POST' && parsedUrl.pathname === '/api/auth/register') {
      const body = await readRequestBody(req);
      const { fullName, email, password, cohort } = body;
      const trimmedName = fullName?.trim();
      const trimmedEmail = email?.trim().toLowerCase();
      const trimmedPassword = password?.trim();

      if (!trimmedName || !trimmedEmail || !trimmedPassword) {
        sendJson(res, 400, { message: 'Merci de renseigner votre nom, email et mot de passe.' }, corsHeaders);
        return;
      }

      const db = await readDatabase();
      const emailAlreadyUsed = db.users.some((storedUser) => storedUser.email === trimmedEmail);

      if (emailAlreadyUsed) {
        sendJson(res, 409, { message: 'Un compte existe déjà avec cet email.' }, corsHeaders);
        return;
      }

      const profile = createNewUserProfile({
        id: randomUUID(),
        fullName: trimmedName,
        email: trimmedEmail,
        cohort,
      });

      const passwordHash = hashPassword(trimmedPassword);
      db.users.push({ ...profile, password: passwordHash });
      await writeDatabase(db);

      const token = createToken(profile.id);
      sendJson(res, 201, { token, user: profile }, corsHeaders);
      return;
    }

    if (req.method === 'POST' && parsedUrl.pathname === '/api/auth/login') {
      const body = await readRequestBody(req);
      const { email, password } = body;
      const trimmedEmail = email?.trim().toLowerCase();
      const trimmedPassword = password?.trim();

      if (!trimmedEmail || !trimmedPassword) {
        sendJson(res, 400, { message: 'Veuillez renseigner votre email et votre mot de passe.' }, corsHeaders);
        return;
      }

      const db = await readDatabase();
      const storedUser = db.users.find((user) => user.email === trimmedEmail);

      if (!storedUser || !verifyPassword(trimmedPassword, storedUser.password)) {
        sendJson(res, 401, { message: 'Identifiants invalides. Vérifiez votre email ou votre mot de passe.' }, corsHeaders);
        return;
      }

      const now = new Date();
      const lastLoginAt = storedUser.lastLoginAt ? new Date(storedUser.lastLoginAt) : null;
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      let nextStreak = storedUser.streakCount ?? 1;

      if (lastLoginAt) {
        const diffInDays = Math.floor((now - lastLoginAt) / millisecondsPerDay);
        if (diffInDays === 1) {
          nextStreak += 1;
        } else if (diffInDays > 1) {
          nextStreak = 1;
        }
      } else {
        nextStreak = 1;
      }

      const updatedProfile = mergeUserProfile(storedUser, {
        lastLoginAt: now.toISOString(),
        previousLoginAt: storedUser.lastLoginAt ?? null,
        streakCount: nextStreak,
      });

      const updatedUserWithPassword = { ...storedUser, ...updatedProfile };
      db.users = db.users.map((user) => (user.id === storedUser.id ? updatedUserWithPassword : user));
      await writeDatabase(db);

      const token = createToken(storedUser.id);
      sendJson(res, 200, { token, user: formatUserForClient(updatedUserWithPassword) }, corsHeaders);
      return;
    }

    if (req.method === 'GET' && parsedUrl.pathname === '/api/auth/me') {
      const token = extractTokenFromHeader(req);

      if (!token) {
        sendJson(res, 401, { message: 'Authentification requise.' }, corsHeaders);
        return;
      }

      let payload;
      try {
        payload = verifyToken(token);
      } catch (error) {
        sendJson(res, 401, { message: 'Session expirée. Merci de vous reconnecter.' }, corsHeaders);
        return;
      }

      const db = await readDatabase();
      const storedUser = db.users.find((user) => user.id === payload.sub);

      if (!storedUser) {
        sendJson(res, 401, { message: 'Compte introuvable.' }, corsHeaders);
        return;
      }

      sendJson(res, 200, { user: formatUserForClient(storedUser) }, corsHeaders);
      return;
    }

    if (req.method === 'PATCH' && parsedUrl.pathname === '/api/users/me') {
      const token = extractTokenFromHeader(req);

      if (!token) {
        sendJson(res, 401, { message: 'Authentification requise.' }, corsHeaders);
        return;
      }

      let payload;
      try {
        payload = verifyToken(token);
      } catch (error) {
        sendJson(res, 401, { message: 'Session expirée. Merci de vous reconnecter.' }, corsHeaders);
        return;
      }

      const body = await readRequestBody(req);
      const updates = body?.user;

      if (!updates || typeof updates !== 'object') {
        sendJson(res, 400, { message: 'Aucune mise à jour fournie.' }, corsHeaders);
        return;
      }

      const db = await readDatabase();
      const storedUser = db.users.find((user) => user.id === payload.sub);

      if (!storedUser) {
        sendJson(res, 401, { message: 'Compte introuvable.' }, corsHeaders);
        return;
      }

      const updatedProfile = mergeUserProfile(storedUser, updates);
      const updatedUserWithPassword = { ...storedUser, ...updatedProfile };

      db.users = db.users.map((user) => (user.id === storedUser.id ? updatedUserWithPassword : user));
      await writeDatabase(db);

      sendJson(res, 200, { user: formatUserForClient(updatedUserWithPassword) }, corsHeaders);
      return;
    }

    notFound();
  } catch (error) {
    console.error('Request failed', error);
    sendJson(res, 500, { message: 'Une erreur interne est survenue.' }, corsHeaders);
  }
});

const startServer = () =>
  server.listen(PORT, () => {
    console.log(`CodingLearn API listening on port ${PORT}`);
  });

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
