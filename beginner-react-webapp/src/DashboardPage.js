import React, { useMemo } from 'react';
import { useAuth } from './context/AuthContext';

const moduleDefinitions = [
  {
    id: 'onboarding',
    title: 'Découverte & objectifs',
    description:
      'Comprendre la plateforme, définir vos objectifs et planifier vos premières semaines.',
    estimatedTime: '45 minutes',
  },
  {
    id: 'javascriptBasics',
    title: 'Fondamentaux JavaScript',
    description:
      'Variables, fonctions, tableaux, objets et logique pour être à l’aise avec le langage.',
    estimatedTime: '6 heures',
  },
  {
    id: 'firstReactApp',
    title: 'Votre première application React',
    description:
      'Créer des composants, gérer l’état et connecter vos interfaces à des données réelles.',
    estimatedTime: '8 heures',
  },
  {
    id: 'productionDeployment',
    title: 'Mise en production & bonnes pratiques',
    description: 'Optimiser, tester et déployer une application fiable en production.',
    estimatedTime: '4 heures',
  },
];

const statusLabels = {
  not_started: 'Non commencé',
  in_progress: 'En cours',
  completed: 'Terminé',
};

const DashboardPage = () => {
  const { user, updateProgress } = useAuth();

  const statistics = useMemo(() => {
    const totalModules = moduleDefinitions.length;
    const statusList = moduleDefinitions.map((module) => user?.progress?.[module.id] ?? 'not_started');
    const completed = statusList.filter((status) => status === 'completed').length;
    const inProgress = statusList.filter((status) => status === 'in_progress').length;

    return {
      totalModules,
      completed,
      inProgress,
      completionRate: Math.round((completed / totalModules) * 100),
    };
  }, [user?.progress]);

  const handleStatusChange = (moduleId, event) => {
    updateProgress(moduleId, event.target.value);
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

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <h1>Bonjour {user?.fullName ?? 'apprenant·e'}</h1>
        <p>
          Programme <strong>{user?.cohort}</strong> · Dernière connexion : {formattedLastLogin}
        </p>
      </header>

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
          <span className="dashboard__card-label">Progression globale</span>
          <strong className="dashboard__card-value">{statistics.completionRate}%</strong>
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
        </div>
      </section>

      <section className="dashboard__modules" aria-label="Modules du parcours">
        {moduleDefinitions.map((module) => {
          const currentStatus = user?.progress?.[module.id] ?? 'not_started';
          return (
            <article key={module.id} className="dashboard-module">
              <div className="dashboard-module__content">
                <h2>{module.title}</h2>
                <p>{module.description}</p>
                <p className="dashboard-module__time">⏱ {module.estimatedTime}</p>
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
      </section>

      <section className="dashboard__resources" aria-label="Ressources complémentaires">
        <h2>Prochaines actions</h2>
        <ul>
          <li>Participez à la session live de coaching ce jeudi à 18h (UTC+1).</li>
          <li>Déposez votre premier mini-projet pour recevoir un feedback personnalisé.</li>
          <li>Rejoignez le salon Discord de votre cohorte pour échanger avec la communauté.</li>
        </ul>
      </section>
    </div>
  );
};

export default DashboardPage;
