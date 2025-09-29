import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const USERS_KEY = 'codinglearn:users';
const ACTIVE_USER_KEY = 'codinglearn:active-user';

const defaultProgress = {
  onboarding: 'not_started',
  javascriptBasics: 'not_started',
  firstReactApp: 'not_started',
  productionDeployment: 'not_started',
};

const AuthContext = createContext();

const isBrowser = () => typeof window !== 'undefined' && !!window.localStorage;

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

const loadUsers = () => readStorage(USERS_KEY, []);
const persistUsers = (users) => writeStorage(USERS_KEY, users);
const persistActiveUser = (user) => writeStorage(ACTIVE_USER_KEY, user);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStorage(ACTIVE_USER_KEY, null));
  const [authError, setAuthError] = useState(null);

  const syncActiveUser = useCallback((nextUser) => {
    setUser(nextUser);
    persistActiveUser(nextUser);
  }, []);

  const register = useCallback(({ fullName, email, password, cohort }) => {
    const trimmedName = fullName?.trim();
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setAuthError('Merci de renseigner votre nom, email et mot de passe.');
      return false;
    }

    const users = loadUsers();
    const userAlreadyExists = users.some((existingUser) => existingUser.email === trimmedEmail);

    if (userAlreadyExists) {
      setAuthError('Un compte existe déjà avec cet email.');
      return false;
    }

    const newUser = {
      fullName: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
      cohort: cohort || 'Débutant',
      role: 'Apprenant·e',
      progress: { ...defaultProgress },
      lastLoginAt: new Date().toISOString(),
    };

    persistUsers([...users, newUser]);
    syncActiveUser(newUser);
    setAuthError(null);
    return true;
  }, [syncActiveUser]);

  const login = useCallback((email, password) => {
    const trimmedEmail = email?.trim().toLowerCase();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setAuthError('Veuillez renseigner votre email et votre mot de passe.');
      return false;
    }

    const users = loadUsers();
    const existingUser = users.find(
      (storedUser) => storedUser.email === trimmedEmail && storedUser.password === trimmedPassword,
    );

    if (!existingUser) {
      setAuthError('Identifiants invalides. Vérifiez votre email ou votre mot de passe.');
      return false;
    }

    const updatedUser = {
      ...existingUser,
      lastLoginAt: new Date().toISOString(),
    };

    const updatedUsers = users.map((storedUser) =>
      storedUser.email === updatedUser.email ? updatedUser : storedUser,
    );

    persistUsers(updatedUsers);
    syncActiveUser(updatedUser);
    setAuthError(null);
    return true;
  }, [syncActiveUser]);

  const logout = useCallback(() => {
    syncActiveUser(null);
    setAuthError(null);
  }, [syncActiveUser]);

  const updateProgress = useCallback((moduleKey, status) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const safeStatus = ['not_started', 'in_progress', 'completed'].includes(status)
        ? status
        : 'not_started';

      const nextUser = {
        ...currentUser,
        progress: {
          ...currentUser.progress,
          [moduleKey]: safeStatus,
        },
      };

      persistActiveUser(nextUser);

      const users = loadUsers();
      const updatedUsers = users.map((storedUser) =>
        storedUser.email === nextUser.email ? { ...nextUser, password: storedUser.password } : storedUser,
      );

      persistUsers(updatedUsers);
      return nextUser;
    });
  }, []);

  const clearError = useCallback(() => setAuthError(null), []);

  const value = useMemo(
    () => ({
      user,
      authError,
      login,
      logout,
      register,
      updateProgress,
      clearError,
    }),
    [authError, login, logout, register, updateProgress, user, clearError],
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

