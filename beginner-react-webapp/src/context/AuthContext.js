import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const ACTIVE_USER_KEY = 'codinglearn:active-user';
const TOKEN_STORAGE_KEY = 'codinglearn:auth-token';
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api').replace(/\/$/, '');

const defaultProgress = {
  onboarding: 'not_started',
  javascriptBasics: 'not_started',
  firstReactApp: 'not_started',
  productionDeployment: 'not_started',
  projectPlanning: 'not_started',
  careerPreparation: 'not_started',
};

const defaultLearningGoal = {
  focus: 'Renforcer vos bases JavaScript et React',
  hoursPerWeek: 6,
  nextCheckpoint: 'Soumettre le mini-projet #1 cette semaine',
};

const defaultTasks = [
  {
    id: 'setup-environment',
    label: 'Configurer votre environnement de développement (Node, Git, éditeur)',
    category: 'Onboarding',
    completed: false,
    locked: true,
  },
  {
    id: 'watch-live',
    label: 'Participer à la prochaine session live de coaching',
    category: 'Communauté',
    completed: false,
    locked: true,
  },
  {
    id: 'submit-project',
    label: 'Soumettre le mini-projet #1 pour relecture',
    category: 'Projet',
    completed: false,
    locked: true,
  },
  {
    id: 'practice-js',
    label: 'Réaliser 3 exercices pratiques JavaScript',
    category: 'Pratique',
    completed: false,
    locked: true,
  },
];

const AuthContext = createContext();

const isBrowser = () => typeof window !== 'undefined' && !!window.localStorage;

const cloneDefaultTasks = () => defaultTasks.map((task) => ({ ...task }));

const hydrateTasks = (tasks) => {
  const seenIds = new Set();
  const normalised = (tasks ?? []).map((task, index) => {
    const baseId = task.id || `task-${index}`;
    let candidateId = baseId;

    while (seenIds.has(candidateId)) {
      candidateId = `${baseId}-${Math.random().toString(16).slice(2, 6)}`;
    }

    seenIds.add(candidateId);

    return {
      ...task,
      id: candidateId,
      completed: Boolean(task.completed),
      locked: Boolean(task.locked),
    };
  });

  if (normalised.length === 0) {
    return cloneDefaultTasks();
  }

  return normalised;
};

const hydrateUser = (rawUser) => {
  if (!rawUser) {
    return rawUser;
  }

  return {
    ...rawUser,
    progress: {
      ...defaultProgress,
      ...(rawUser.progress ?? {}),
    },
    dashboard: {
      learningGoal: {
        ...defaultLearningGoal,
        ...(rawUser.dashboard?.learningGoal ?? {}),
      },
      tasks: hydrateTasks(rawUser.dashboard?.tasks),
      notes: rawUser.dashboard?.notes ?? '',
    },
    streakCount: rawUser.streakCount ?? 1,
    previousLoginAt: rawUser.previousLoginAt ?? null,
  };
};

const readStorage = (key, fallback) => {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    console.warn('Unable to read storage key', key, error);
    return fallback;
  }
};

const writeStorage = (key, value) => {
  if (!isBrowser()) {
    return;
  }

  try {
    if (value === undefined || value === null) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Unable to write storage key', key, error);
  }
};

const persistActiveUser = (user) => writeStorage(ACTIVE_USER_KEY, user);
const persistToken = (token) => writeStorage(TOKEN_STORAGE_KEY, token);

const sanitiseUserForUpdate = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    cohort: user.cohort,
    role: user.role,
    progress: { ...user.progress },
    dashboard: {
      learningGoal: { ...user.dashboard.learningGoal },
      tasks: user.dashboard.tasks.map((task) => ({ ...task })),
      notes: user.dashboard.notes,
    },
    lastLoginAt: user.lastLoginAt,
    previousLoginAt: user.previousLoginAt,
    streakCount: user.streakCount,
    createdAt: user.createdAt,
  };
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => readStorage(TOKEN_STORAGE_KEY, null));
  const [user, setUser] = useState(() => hydrateUser(readStorage(ACTIVE_USER_KEY, null)));
  const [authError, setAuthError] = useState(null);

  const callApi = useCallback(
    async (endpoint, { method = 'GET', body, auth = false } = {}) => {
      const headers = {};
      const init = { method, headers };

      if (auth) {
        if (!token) {
          throw new Error('AUTH_TOKEN_MISSING');
        }
        headers.Authorization = `Bearer ${token}`;
      }

      if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(body);
      }

      let response;
      try {
        response = await fetch(`${API_BASE_URL}/${endpoint}`, init);
      } catch (error) {
        const networkError = new Error('NETWORK_ERROR');
        networkError.cause = error;
        throw networkError;
      }

      let payload = null;
      try {
        payload = await response.json();
      } catch (error) {
        payload = null;
      }

      if (!response.ok) {
        const message = payload?.message || 'Une erreur est survenue lors de la communication avec le serveur.';
        const apiError = new Error(message);
        apiError.status = response.status;
        throw apiError;
      }

      return payload;
    },
    [token],
  );

  const syncActiveUser = useCallback((nextUser, nextToken) => {
    const hydratedUser = hydrateUser(nextUser);
    setUser(hydratedUser);
    persistActiveUser(hydratedUser);
    const resolvedToken = nextToken ?? null;
    setToken(resolvedToken);
    persistToken(resolvedToken);
  }, []);

  useEffect(() => {
    if (!token) {
      persistActiveUser(null);
      setUser(null);
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        const data = await callApi('auth/me', { auth: true });
        if (isMounted) {
          const hydratedUser = hydrateUser(data.user);
          setUser(hydratedUser);
          persistActiveUser(hydratedUser);
        }
      } catch (error) {
        if (isMounted) {
          syncActiveUser(null, null);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [callApi, syncActiveUser, token]);

  const persistUserRemotely = useCallback(
    async (nextUser) => {
      if (!token || !nextUser) {
        return;
      }

      try {
        await callApi('users/me', {
          method: 'PATCH',
          body: { user: sanitiseUserForUpdate(nextUser) },
          auth: true,
        });
      } catch (error) {
        console.warn('Unable to synchronise profile with the server', error);
      }
    },
    [callApi, token],
  );

  const updateCurrentUser = useCallback(
    (project) => {
      setUser((currentUser) => {
        if (!currentUser) {
          return currentUser;
        }

        const nextUser = hydrateUser(project(currentUser));
        persistActiveUser(nextUser);
        void persistUserRemotely(nextUser);
        return nextUser;
      });
    },
    [persistUserRemotely],
  );

  const register = useCallback(
    async ({ fullName, email, password, cohort }) => {
      const trimmedName = fullName?.trim();
      const trimmedEmail = email?.trim().toLowerCase();
      const trimmedPassword = password?.trim();

      if (!trimmedName || !trimmedEmail || !trimmedPassword) {
        setAuthError('Merci de renseigner votre nom, email et mot de passe.');
        return false;
      }

      try {
        const payload = await callApi('auth/register', {
          method: 'POST',
          body: {
            fullName: trimmedName,
            email: trimmedEmail,
            password: trimmedPassword,
            cohort,
          },
        });

        syncActiveUser(payload.user, payload.token);
        setAuthError(null);
        return true;
      } catch (error) {
        if (error.message === 'NETWORK_ERROR') {
          setAuthError('Impossible de contacter le serveur. Vérifiez votre connexion.');
        } else {
          setAuthError(error.message);
        }
        return false;
      }
    },
    [callApi, syncActiveUser],
  );

  const login = useCallback(
    async (email, password) => {
      const trimmedEmail = email?.trim().toLowerCase();
      const trimmedPassword = password?.trim();

      if (!trimmedEmail || !trimmedPassword) {
        setAuthError('Veuillez renseigner votre email et votre mot de passe.');
        return false;
      }

      try {
        const payload = await callApi('auth/login', {
          method: 'POST',
          body: {
            email: trimmedEmail,
            password: trimmedPassword,
          },
        });

        syncActiveUser(payload.user, payload.token);
        setAuthError(null);
        return true;
      } catch (error) {
        if (error.message === 'NETWORK_ERROR') {
          setAuthError('Impossible de contacter le serveur. Vérifiez votre connexion.');
        } else {
          setAuthError(error.message);
        }
        return false;
      }
    },
    [callApi, syncActiveUser],
  );

  const logout = useCallback(() => {
    syncActiveUser(null, null);
    setAuthError(null);
  }, [syncActiveUser]);

  const updateProgress = useCallback(
    (moduleKey, status) => {
      updateCurrentUser((currentUser) => {
        const safeStatus = ['not_started', 'in_progress', 'completed'].includes(status)
          ? status
          : 'not_started';

        return {
          ...currentUser,
          progress: {
            ...currentUser.progress,
            [moduleKey]: safeStatus,
          },
        };
      });
    },
    [updateCurrentUser],
  );

  const updateLearningGoal = useCallback(
    (partialGoal) => {
      updateCurrentUser((currentUser) => ({
        ...currentUser,
        dashboard: {
          ...currentUser.dashboard,
          learningGoal: {
            ...currentUser.dashboard.learningGoal,
            ...partialGoal,
          },
        },
      }));
    },
    [updateCurrentUser],
  );

  const toggleTaskCompletion = useCallback(
    (taskId) => {
      updateCurrentUser((currentUser) => ({
        ...currentUser,
        dashboard: {
          ...currentUser.dashboard,
          tasks: currentUser.dashboard.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task,
          ),
        },
      }));
    },
    [updateCurrentUser],
  );

  const addTask = useCallback(
    (label, category = 'Personnel') => {
      const trimmedLabel = label?.trim();
      if (!trimmedLabel) {
        return false;
      }

      const taskId = `task-${Date.now().toString(16)}`;
      updateCurrentUser((currentUser) => ({
        ...currentUser,
        dashboard: {
          ...currentUser.dashboard,
          tasks: [
            ...currentUser.dashboard.tasks,
            {
              id: taskId,
              label: trimmedLabel,
              category,
              completed: false,
              locked: false,
            },
          ],
        },
      }));

      return true;
    },
    [updateCurrentUser],
  );

  const removeTask = useCallback(
    (taskId) => {
      updateCurrentUser((currentUser) => ({
        ...currentUser,
        dashboard: {
          ...currentUser.dashboard,
          tasks: currentUser.dashboard.tasks.filter((task) => task.id !== taskId || task.locked),
        },
      }));
    },
    [updateCurrentUser],
  );

  const updateNotes = useCallback(
    (notes) => {
      updateCurrentUser((currentUser) => ({
        ...currentUser,
        dashboard: {
          ...currentUser.dashboard,
          notes: notes ?? '',
        },
      }));
    },
    [updateCurrentUser],
  );

  const clearError = useCallback(() => setAuthError(null), []);

  const value = useMemo(
    () => ({
      user,
      authError,
      login,
      logout,
      register,
      updateProgress,
      updateLearningGoal,
      toggleTaskCompletion,
      addTask,
      removeTask,
      updateNotes,
      clearError,
    }),
    [
      addTask,
      authError,
      clearError,
      login,
      logout,
      register,
      removeTask,
      toggleTaskCompletion,
      updateLearningGoal,
      updateNotes,
      updateProgress,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider');
  }

  return context;
};
