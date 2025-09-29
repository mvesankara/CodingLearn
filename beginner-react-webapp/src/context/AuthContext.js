import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const USERS_KEY = 'codinglearn:users';
const ACTIVE_USER_KEY = 'codinglearn:active-user';

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

const loadUsers = () => readStorage(USERS_KEY, []);
const persistUsers = (users) => writeStorage(USERS_KEY, users);
const persistActiveUser = (user) => writeStorage(ACTIVE_USER_KEY, user);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => hydrateUser(readStorage(ACTIVE_USER_KEY, null)));
  const [authError, setAuthError] = useState(null);

  const syncActiveUser = useCallback((nextUser) => {
    const hydratedUser = hydrateUser(nextUser);
    setUser(hydratedUser);
    persistActiveUser(hydratedUser);
  }, []);

  const updateCurrentUser = useCallback((project) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const nextUser = hydrateUser(project(currentUser));
      persistActiveUser(nextUser);

      const users = loadUsers();
      const updatedUsers = users.map((storedUser) =>
        storedUser.email === nextUser.email ? { ...nextUser, password: storedUser.password } : storedUser,
      );

      persistUsers(updatedUsers);
      return nextUser;
    });
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

    const newUser = hydrateUser({
      fullName: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
      cohort: cohort || 'Débutant',
      role: 'Apprenant·e',
      progress: { ...defaultProgress },
      dashboard: {
        learningGoal: { ...defaultLearningGoal },
        tasks: cloneDefaultTasks(),
        notes: '',
      },
      lastLoginAt: new Date().toISOString(),
      previousLoginAt: null,
      streakCount: 1,
      createdAt: new Date().toISOString(),
    });

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

    const now = new Date();
    const lastLoginDate = existingUser.lastLoginAt ? new Date(existingUser.lastLoginAt) : null;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    let nextStreak = existingUser.streakCount ?? 1;

    if (lastLoginDate) {
      const diffInDays = Math.floor((now - lastLoginDate) / millisecondsPerDay);

      if (diffInDays === 1) {
        nextStreak += 1;
      } else if (diffInDays > 1) {
        nextStreak = 1;
      }
    } else {
      nextStreak = 1;
    }

    const updatedUser = hydrateUser({
      ...existingUser,
      lastLoginAt: now.toISOString(),
      previousLoginAt: existingUser.lastLoginAt ?? null,
      streakCount: nextStreak,
    });

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
  }, [updateCurrentUser]);

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

