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

const cloneDefaultTasks = () => defaultTasks.map((task) => ({ ...task }));

const createDefaultDashboard = () => ({
  learningGoal: { ...defaultLearningGoal },
  tasks: cloneDefaultTasks(),
  notes: '',
});

const createNewUserProfile = ({ id, fullName, email, cohort }) => {
  const timestamp = new Date().toISOString();

  return {
    id,
    fullName,
    email,
    cohort: cohort || 'Débutant',
    role: 'Apprenant·e',
    progress: { ...defaultProgress },
    dashboard: createDefaultDashboard(),
    lastLoginAt: timestamp,
    previousLoginAt: null,
    streakCount: 1,
    createdAt: timestamp,
  };
};

const mergeUserProfile = (storedUser, updates) => ({
  ...storedUser,
  progress: {
    ...storedUser.progress,
    ...(updates.progress ?? {}),
  },
  dashboard: {
    ...storedUser.dashboard,
    learningGoal: {
      ...storedUser.dashboard.learningGoal,
      ...(updates.dashboard?.learningGoal ?? {}),
    },
    tasks: updates.dashboard?.tasks
      ? updates.dashboard.tasks.map((task) => ({ ...task }))
      : storedUser.dashboard.tasks.map((task) => ({ ...task })),
    notes: updates.dashboard?.notes ?? storedUser.dashboard.notes,
  },
  streakCount: updates.streakCount ?? storedUser.streakCount,
  lastLoginAt: updates.lastLoginAt ?? storedUser.lastLoginAt,
  previousLoginAt: updates.previousLoginAt ?? storedUser.previousLoginAt,
});

const formatUserForClient = (user) => {
  const { password, ...safeUser } = user;

  return {
    ...safeUser,
    progress: { ...safeUser.progress },
    dashboard: {
      learningGoal: { ...safeUser.dashboard.learningGoal },
      tasks: safeUser.dashboard.tasks.map((task) => ({ ...task })),
      notes: safeUser.dashboard.notes,
    },
  };
};

module.exports = {
  defaultProgress,
  defaultLearningGoal,
  defaultTasks,
  cloneDefaultTasks,
  createDefaultDashboard,
  createNewUserProfile,
  mergeUserProfile,
  formatUserForClient,
};
