import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from './context/AuthContext';

const moduleDefinitions = [
  {
    id: 'onboarding',
    title: 'Découverte & objectifs',
    description:
      'Comprendre la plateforme, définir vos objectifs et planifier vos premières semaines.',
    estimatedTime: '45 minutes',
    estimatedHours: 0.75,
    skills: ['Organisation', 'Navigation plateforme', 'Planification'],
    deliverable: 'Plan de progression personnalisé',
  },
  {
    id: 'javascriptBasics',
    title: 'Fondamentaux JavaScript',
    description:
      'Variables, fonctions, tableaux, objets et logique pour être à l’aise avec le langage.',
    estimatedTime: '6 heures',
    estimatedHours: 6,
    skills: ['Variables & types', 'Boucles', 'Gestion des erreurs'],
    deliverable: 'Quiz de validation + mini-exercices',
  },
  {
    id: 'firstReactApp',
    title: 'Votre première application React',
    description:
      'Créer des composants, gérer l’état et connecter vos interfaces à des données réelles.',
    estimatedTime: '8 heures',
    estimatedHours: 8,
    skills: ['Composants', 'Hooks', 'Appels API'],
    deliverable: 'Application To-Do connectée à une API',
  },
  {
    id: 'productionDeployment',
    title: 'Mise en production & bonnes pratiques',
    description: 'Optimiser, tester et déployer une application fiable en production.',
    estimatedTime: '4 heures',
    estimatedHours: 4,
    skills: ['Tests', 'Optimisation', 'CI/CD'],
    deliverable: 'Checklist de mise en production',
  },
  {
    id: 'projectPlanning',
    title: 'Planification de projet',
    description: 'Structurer votre projet final, découper les fonctionnalités et organiser le suivi.',
    estimatedTime: '3 heures',
    estimatedHours: 3,
    skills: ['User stories', 'Roadmap', 'Gestion de backlog'],
    deliverable: 'Plan projet validé par le mentor',
  },
  {
    id: 'careerPreparation',
    title: 'Préparation carrière',
    description: 'Optimiser votre CV, portfolio et préparer les entretiens techniques.',
    estimatedTime: '5 heures',
    estimatedHours: 5,
    skills: ['Portfolio', 'Entretiens', 'Personal branding'],
    deliverable: 'Portfolio et pitch prêt à partager',
  },
];

const statusLabels = {
  not_started: 'Non commencé',
  in_progress: 'En cours',
  completed: 'Terminé',
};

const upcomingEvents = [
  {
    id: 'coaching-1',
    title: 'Coaching live : Structurer son état React',
    date: 'Jeudi 21 mars · 18h00',
    location: 'En ligne (Zoom)',
    action: 'S’inscrire',
  },
  {
    id: 'atelier-portfolio',
    title: 'Atelier Portfolio & storytelling',
    date: 'Samedi 23 mars · 10h30',
    location: 'Campus Paris ou replay',
    action: 'Réserver ma place',
  },
  {
    id: 'discord-session',
    title: 'Session Q&A Discord avec la promotion',
    date: 'Tous les mardis · 19h00',
    location: 'Salon #entraide-react',
    action: 'Rejoindre la discussion',
  },
];

const resourceLibrary = [
  {
    id: 'react-hooks-guide',
    title: 'Comprendre les Hooks React en profondeur',
    type: 'Article',
    url: '#',
    duration: '15 min',
  },
  {
    id: 'testing-workshop',
    title: 'Atelier vidéo : tester son application front',
    type: 'Vidéo',
    url: '#',
    duration: '35 min',
  },
  {
    id: 'career-checklist',
    title: 'Checklist : préparer ses entretiens techniques',
    type: 'Document',
    url: '#',
    duration: '10 min',
  },
  {
    id: 'community-stories',
    title: 'Retours d’expérience des alumni CodingLearn',
    type: 'Podcast',
    url: '#',
    duration: '25 min',
  },
];

const supportContacts = [
  {
    id: 'mentor',
    role: 'Mentor pédagogique',
    name: 'Nina Martin',
    availability: 'Disponible du lundi au vendredi · 9h - 17h',
    contact: 'mentor@codinglearn.io',
  },
  {
    id: 'coach',
    role: 'Coach carrière',
    name: 'Alex Dupont',
    availability: 'Sessions individuelles sur rendez-vous',
    contact: 'career@codinglearn.io',
  },
  {
    id: 'support',
    role: 'Support technique',
    name: 'Équipe support',
    availability: 'Réponse sous 24h ouvrées',
    contact: 'support@codinglearn.io',
  },
];

const quickActions = [
  {
    id: 'notes',
    label: 'Ajouter une note rapide',
    description: 'Capturez une idée ou une question à aborder avec votre mentor.',
  },
  {
    id: 'coaching',
    label: 'Planifier un coaching',
    description: 'Réservez une session live pour lever un blocage ou valider un livrable.',
  },
  {
    id: 'share',
    label: 'Partager mon avancement',
    description: 'Publiez votre progression dans la communauté CodingLearn.',
  },
];

const sidebarNavigation = [
  { href: '#vue-d-ensemble', label: 'Vue d’ensemble' },
  { href: '#organisation', label: 'Organisation' },
  { href: '#modules', label: 'Parcours' },
  { href: '#ressources', label: 'Ressources' },
  { href: '#support', label: 'Support' },
];

const getInitials = (fullName = '') => {
  const [first = '', second = ''] = fullName.split(' ');
  const initials = `${first.charAt(0)}${second.charAt(0)}`.trim();
  return initials.toUpperCase() || 'CL';
};

const DashboardPage = () => {
  const {
    user,
    updateProgress,
    updateLearningGoal,
    toggleTaskCompletion,
    addTask,
    removeTask,
    updateNotes,
  } = useAuth();

  const [customTaskLabel, setCustomTaskLabel] = useState('');
  const [customTaskCategory, setCustomTaskCategory] = useState('Personnel');
  const [moduleQuery, setModuleQuery] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [goalForm, setGoalForm] = useState(() => ({
    focus: user?.dashboard?.learningGoal?.focus ?? '',
    hoursPerWeek: user?.dashboard?.learningGoal?.hoursPerWeek ?? 0,
    nextCheckpoint: user?.dashboard?.learningGoal?.nextCheckpoint ?? '',
  }));
  const [notesDraft, setNotesDraft] = useState(user?.dashboard?.notes ?? '');

  const initials = useMemo(() => getInitials(user?.fullName), [user?.fullName]);

  useEffect(() => {
    setGoalForm({
      focus: user?.dashboard?.learningGoal?.focus ?? '',
      hoursPerWeek: user?.dashboard?.learningGoal?.hoursPerWeek ?? 0,
      nextCheckpoint: user?.dashboard?.learningGoal?.nextCheckpoint ?? '',
    });
  }, [user?.dashboard?.learningGoal]);

  useEffect(() => {
    setNotesDraft(user?.dashboard?.notes ?? '');
  }, [user?.dashboard?.notes]);

  useEffect(() => {
    if (!feedback || typeof window === 'undefined') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const statistics = useMemo(() => {
    const totalModules = moduleDefinitions.length;
    const statusList = moduleDefinitions.map((module) => user?.progress?.[module.id] ?? 'not_started');
    const completed = statusList.filter((status) => status === 'completed').length;
    const inProgress = statusList.filter((status) => status === 'in_progress').length;
    const notStarted = totalModules - completed - inProgress;
    const completionRate = Math.round((completed / totalModules) * 100);

    const totalEstimatedHours = moduleDefinitions.reduce(
      (acc, module) => acc + (module.estimatedHours ?? 0),
      0,
    );
    const completedHours = moduleDefinitions.reduce((acc, module) => {
      const status = user?.progress?.[module.id] ?? 'not_started';
      if (status === 'completed') {
        return acc + (module.estimatedHours ?? 0);
      }
      if (status === 'in_progress') {
        return acc + (module.estimatedHours ?? 0) * 0.4;
      }
      return acc;
    }, 0);

    return {
      totalModules,
      completed,
      inProgress,
      notStarted,
      completionRate,
      totalEstimatedHours: Math.round(totalEstimatedHours * 10) / 10,
      completedHours: Math.round(completedHours * 10) / 10,
    };
  }, [user?.progress]);

  const filteredModules = useMemo(() => {
    if (!moduleQuery) {
      return moduleDefinitions;
    }

    const normalisedQuery = moduleQuery.trim().toLowerCase();
    return moduleDefinitions.filter((module) =>
      [module.title, module.description, ...(module.skills ?? [])].some((field) =>
        field.toLowerCase().includes(normalisedQuery),
      ),
    );
  }, [moduleQuery]);

  const handleStatusChange = (moduleId, event) => {
    updateProgress(moduleId, event.target.value);
    const label = moduleDefinitions.find((module) => module.id === moduleId)?.title ?? 'Module';
    setFeedback(`Statut mis à jour pour « ${label} ». ✅`);
  };

  const handleGoalChange = (event) => {
    const { name, value } = event.target;
    setGoalForm((previous) => ({
      ...previous,
      [name]: name === 'hoursPerWeek' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleGoalSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...goalForm,
      hoursPerWeek:
        goalForm.hoursPerWeek === '' ? 0 : Number.isNaN(goalForm.hoursPerWeek) ? 0 : goalForm.hoursPerWeek,
    };
    updateLearningGoal(payload);
    setFeedback('Votre objectif hebdomadaire a bien été mis à jour. 🚀');
  };

  const handleTaskSubmit = (event) => {
    event.preventDefault();
    const created = addTask(customTaskLabel, customTaskCategory);
    if (created) {
      setCustomTaskLabel('');
      setFeedback('Nouvelle action ajoutée à votre liste.');
    } else {
      setFeedback('Ajoutez un intitulé avant d’enregistrer une action.');
    }
  };

  const handleNotesBlur = () => {
    updateNotes(notesDraft);
    setFeedback('Vos notes ont été enregistrées.');
  };

  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'notes':
        document.getElementById('dashboard-notes')?.focus();
        setFeedback('Vous pouvez écrire votre note et elle sera sauvegardée automatiquement.');
        break;
      case 'coaching':
        setFeedback('Un mentor vous contactera pour planifier une session de coaching.');
        break;
      case 'share':
        setFeedback('Partagez votre progression sur Discord dans #entraide-react.');
        break;
      default:
        setFeedback("Action rapide effectuée.");
    }
  };

  const formattedLastLogin = user?.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  const formattedPreviousLogin = user?.previousLoginAt
    ? new Date(user.previousLoginAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  const streakCount = user?.streakCount ?? 1;

  return (
    <div className="dashboard">
      <aside className="dashboard__sidebar" aria-label="Navigation du tableau de bord">
        <div className="dashboard__sidebar-profile">
          <div className="dashboard__sidebar-avatar" aria-hidden="true">
            {initials}
          </div>
          <div>
            <p className="dashboard__sidebar-name">{user?.fullName}</p>
            <p className="dashboard__sidebar-cohort">Promotion {user?.cohort}</p>
          </div>
        </div>
        <nav>
          <h2 className="sr-only">Navigation rapide</h2>
          <ul>
            {sidebarNavigation.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="dashboard__sidebar-actions">
          {quickActions.map((action) => (
            <button
              type="button"
              key={action.id}
              onClick={() => handleQuickAction(action.id)}
              className="dashboard__sidebar-button"
            >
              <span>{action.label}</span>
              <small>{action.description}</small>
            </button>
          ))}
        </div>
      </aside>

      <div className="dashboard__content">
        <header className="dashboard__header" id="vue-d-ensemble">
          <div>
            <h1>Bonjour {user?.fullName ?? 'apprenant·e'}</h1>
            <p>
              Programme <strong>{user?.cohort}</strong> · Dernière connexion : {formattedLastLogin}
            </p>
          </div>
          <div className="dashboard__header-meta">
            <div>
              <span className="dashboard__header-label">Connexion précédente</span>
              <strong>{formattedPreviousLogin}</strong>
            </div>
            <div>
              <span className="dashboard__header-label">Série d’apprentissage</span>
              <strong>{streakCount} jour{streakCount > 1 ? 's' : ''}</strong>
            </div>
          </div>
        </header>

        {feedback && (
          <div className="dashboard__feedback" role="status" aria-live="polite">
            {feedback}
          </div>
        )}

        <section className="dashboard__summary" aria-label="Statistiques de progression">
        <div className="dashboard__card">
          <span className="dashboard__card-label">Modules complétés</span>
          <strong className="dashboard__card-value">{statistics.completed}</strong>
        </div>
        <div className="dashboard__card">
          <span className="dashboard__card-label">Modules en cours</span>
          <strong className="dashboard__card-value">{statistics.inProgress}</strong>
        </div>
        <div className="dashboard__card">
          <span className="dashboard__card-label">Restants à démarrer</span>
          <strong className="dashboard__card-value">{statistics.notStarted}</strong>
        </div>
        <div className="dashboard__card dashboard__card--wide">
          <div className="dashboard__card-header">
            <span className="dashboard__card-label">Progression globale</span>
            <strong className="dashboard__card-value">{statistics.completionRate}%</strong>
          </div>
          <div
            className="dashboard__progress-bar"
            role="progressbar"
            aria-valuenow={statistics.completionRate}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="dashboard__progress-bar-fill"
              style={{ width: `${statistics.completionRate}%` }}
            />
          </div>
          <p className="dashboard__card-footnote">
            {statistics.completedHours} h / {statistics.totalEstimatedHours} h estimées
          </p>
        </div>
        </section>

        <section className="dashboard__grid" aria-label="Organisation de la semaine" id="organisation">
          <article className="dashboard__panel">
            <header className="dashboard__panel-header">
              <h2>Objectif de la semaine</h2>
              <span className="dashboard__panel-tag">Planifier</span>
            </header>
          <form className="dashboard-goal" onSubmit={handleGoalSubmit}>
            <label htmlFor="goal-focus">Priorité</label>
            <input
              id="goal-focus"
              name="focus"
              type="text"
              value={goalForm.focus}
              onChange={handleGoalChange}
              placeholder="Ex : Consolider les hooks et les tests"
            />
            <div className="dashboard-goal__inline">
              <div>
                <label htmlFor="goal-hours">Heures prévues</label>
                <input
                  id="goal-hours"
                  name="hoursPerWeek"
                  type="number"
                  min="0"
                  value={goalForm.hoursPerWeek}
                  onChange={handleGoalChange}
                />
              </div>
              <div>
                <label htmlFor="goal-checkpoint">Checkpoint</label>
                <input
                  id="goal-checkpoint"
                  name="nextCheckpoint"
                  type="text"
                  value={goalForm.nextCheckpoint}
                  onChange={handleGoalChange}
                  placeholder="Livrable ou jalon"
                />
              </div>
            </div>
            <button type="submit" className="dashboard__button">
              Mettre à jour mon objectif
            </button>
          </form>
        </article>

        <article className="dashboard__panel">
          <header className="dashboard__panel-header">
            <h2>Liste d’actions</h2>
            <span className="dashboard__panel-tag">Suivi</span>
          </header>
          <ul className="dashboard-task-list">
            {user?.dashboard?.tasks?.map((task) => (
              <li key={task.id} className={task.completed ? 'dashboard-task--completed' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  <span>
                    <strong>{task.label}</strong>
                    <small>{task.category}</small>
                  </span>
                </label>
                {!task.locked && (
                  <button
                    type="button"
                    className="dashboard-task__remove"
                    onClick={() => removeTask(task.id)}
                    aria-label={`Supprimer la tâche ${task.label}`}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
          <form className="dashboard-task-form" onSubmit={handleTaskSubmit}>
            <label htmlFor="task-label" className="sr-only">
              Nouvelle tâche
            </label>
            <input
              id="task-label"
              type="text"
              value={customTaskLabel}
              onChange={(event) => setCustomTaskLabel(event.target.value)}
              placeholder="Ajouter une action personnalisée"
            />
            <label htmlFor="task-category" className="sr-only">
              Catégorie
            </label>
            <input
              id="task-category"
              type="text"
              value={customTaskCategory}
              onChange={(event) => setCustomTaskCategory(event.target.value)}
              placeholder="Catégorie"
            />
            <button type="submit" className="dashboard__button dashboard__button--secondary">
              Ajouter
            </button>
          </form>
        </article>

        <article className="dashboard__panel">
          <header className="dashboard__panel-header">
            <h2>Événements & communauté</h2>
            <span className="dashboard__panel-tag">À venir</span>
          </header>
          <ul className="dashboard-event-list">
            {upcomingEvents.map((event) => (
              <li key={event.id}>
                <h3>{event.title}</h3>
                <p>{event.date}</p>
                <p className="dashboard-event__location">{event.location}</p>
                <button type="button" className="dashboard__button dashboard__button--ghost">
                  {event.action}
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="dashboard__panel">
          <header className="dashboard__panel-header">
            <h2>Notes & feedback</h2>
            <span className="dashboard__panel-tag">Journal</span>
          </header>
          <label htmlFor="dashboard-notes" className="sr-only">
            Notes personnelles
          </label>
          <textarea
            id="dashboard-notes"
            value={notesDraft}
            onChange={(event) => setNotesDraft(event.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Consignez vos apprentissages, questions ou points à aborder avec votre mentor."
          />
          <p className="dashboard-notes__hint">Astuce : vos notes sont enregistrées automatiquement.</p>
        </article>
      </section>

        <section className="dashboard__modules" aria-label="Modules du parcours" id="modules">
          <header className="dashboard__section-header">
            <h2>Suivi du parcours</h2>
            <p>
              Ajustez votre progression module par module et consultez les livrables attendus pour
              valider chaque étape.
            </p>
            <div className="dashboard__module-filter">
              <label htmlFor="module-filter">Filtrer les modules</label>
              <input
                id="module-filter"
                type="search"
                value={moduleQuery}
                onChange={(event) => setModuleQuery(event.target.value)}
                placeholder="Rechercher un module, une compétence ou un livrable"
              />
            </div>
          </header>
        {filteredModules.map((module) => {
          const currentStatus = user?.progress?.[module.id] ?? 'not_started';
          return (
            <article key={module.id} className="dashboard-module">
              <div className="dashboard-module__content">
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <ul className="dashboard-module__skills">
                  {module.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
                <p className="dashboard-module__time">⏱ {module.estimatedTime}</p>
                <p className="dashboard-module__deliverable">
                  Livrable : <strong>{module.deliverable}</strong>
                </p>
              </div>
              <div className="dashboard-module__actions">
                <label htmlFor={`status-${module.id}`}>Statut</label>
                <select
                  id={`status-${module.id}`}
                  value={currentStatus}
                  onChange={(event) => handleStatusChange(module.id, event)}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <span className={`dashboard-module__badge dashboard-module__badge--${currentStatus}`}>
                  {statusLabels[currentStatus]}
                </span>
              </div>
            </article>
          );
        })}
        {filteredModules.length === 0 && (
          <p className="dashboard__empty">Aucun module ne correspond à votre recherche pour le moment.</p>
        )}
      </section>

        <section className="dashboard__resources" aria-label="Ressources complémentaires" id="ressources">
          <header className="dashboard__section-header">
            <h2>Ressources recommandées</h2>
            <p>Renforcez vos compétences avec une sélection de contenus pertinents et actionnables.</p>
          </header>
          <div className="dashboard-resource__grid">
          {resourceLibrary.map((resource) => (
            <article key={resource.id} className="dashboard-resource">
              <header>
                <span className="dashboard-resource__type">{resource.type}</span>
                <h3>{resource.title}</h3>
              </header>
              <p>Durée : {resource.duration}</p>
              <a href={resource.url} className="dashboard__button dashboard__button--ghost">
                Consulter
              </a>
            </article>
          ))}
          </div>
      </section>

        <section className="dashboard__support" aria-label="Support & accompagnement" id="support">
          <header className="dashboard__section-header">
            <h2>Votre équipe d’accompagnement</h2>
            <p>Contactez rapidement la bonne personne selon votre besoin.</p>
          </header>
          <div className="dashboard-support__grid">
          {supportContacts.map((contact) => (
            <article key={contact.id} className="dashboard-support">
              <h3>{contact.role}</h3>
              <p>{contact.name}</p>
              <p>{contact.availability}</p>
              <a href={`mailto:${contact.contact}`} className="dashboard__button dashboard__button--ghost">
                Écrire à {contact.name.split(' ')[0]}
              </a>
            </article>
          ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
