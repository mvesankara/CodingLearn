import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const getInitials = (fullName = '') => {
  const [first = '', second = ''] = fullName.split(' ');
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase() || 'CL';
};

const ProfilePage = () => {
  const { user } = useAuth();

  const progressOverview = useMemo(() => {
    const progress = user?.progress ?? {};
    const total = Object.keys(progress).length || 0;
    const completed = Object.values(progress).filter((status) => status === 'completed').length;
    const inProgress = Object.values(progress).filter((status) => status === 'in_progress').length;

    return {
      total,
      completed,
      inProgress,
    };
  }, [user?.progress]);

  const lastActivities = useMemo(() => {
    const tasks = user?.dashboard?.tasks ?? [];
    return tasks
      .slice(-4)
      .reverse()
      .map((task) => ({
        id: task.id,
        label: task.label,
        completed: task.completed,
        category: task.category,
      }));
  }, [user?.dashboard?.tasks]);

  return (
    <div className="profile" aria-labelledby="profile-heading">
      <header className="profile__header">
        <div className="profile__identity">
          <div className="profile__avatar" aria-hidden="true">
            {getInitials(user?.fullName)}
          </div>
          <div>
            <h1 id="profile-heading">{user?.fullName}</h1>
            <p className="profile__role">{user?.role ?? 'Apprenant·e CodingLearn'}</p>
            <p className="profile__meta">Promotion {user?.cohort}</p>
          </div>
        </div>
        <div className="profile__actions">
          <Link className="profile__button" to="/settings">
            Modifier mon profil
          </Link>
          <a className="profile__button profile__button--secondary" href="mailto:support@codinglearn.io">
            Contacter le support
          </a>
        </div>
      </header>

      <section className="profile__section" aria-labelledby="profile-infos">
        <div>
          <h2 id="profile-infos">Informations personnelles</h2>
          <dl className="profile__details">
            <div>
              <dt>Nom complet</dt>
              <dd>{user?.fullName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${user?.email}`}>{user?.email}</a>
              </dd>
            </div>
            <div>
              <dt>Date d'inscription</dt>
              <dd>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                    })
                  : '—'}
              </dd>
            </div>
            <div>
              <dt>Progression</dt>
              <dd>
                {progressOverview.completed} modules terminés · {progressOverview.inProgress} en cours ·{' '}
                {Math.max(progressOverview.total - progressOverview.completed - progressOverview.inProgress, 0)} restant(s)
              </dd>
            </div>
          </dl>
        </div>
        <aside className="profile__summary" aria-labelledby="profile-highlight">
          <h2 id="profile-highlight">Résumé express</h2>
          <ul>
            <li>
              Dernière connexion :{' '}
              {user?.lastLoginAt
                ? new Date(user.lastLoginAt).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '—'}
            </li>
            <li>Série actuelle : {user?.streakCount ?? 1} jour(s)</li>
            <li>Objectif de la semaine : {user?.dashboard?.learningGoal?.focus ?? 'Non défini'}</li>
          </ul>
        </aside>
      </section>

      <section className="profile__section" aria-labelledby="profile-activity">
        <h2 id="profile-activity">Historique récent</h2>
        <ul className="profile__activity">
          {lastActivities.length === 0 ? (
            <li>Aucune activité enregistrée pour le moment.</li>
          ) : (
            lastActivities.map((activity) => (
              <li key={activity.id}>
                <span className={`profile__activity-badge ${activity.completed ? 'is-complete' : ''}`}>
                  {activity.completed ? 'Terminé' : 'À faire'}
                </span>
                <div>
                  <p>{activity.label}</p>
                  <small>{activity.category}</small>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="profile__section" aria-labelledby="profile-support">
        <h2 id="profile-support">Contacts utiles</h2>
        <div className="profile__support-grid">
          <article>
            <h3>Mentor pédagogique</h3>
            <p>Nina Martin</p>
            <a className="profile__button profile__button--ghost" href="mailto:mentor@codinglearn.io">
              Écrire à Nina
            </a>
          </article>
          <article>
            <h3>Coach carrière</h3>
            <p>Alex Dupont</p>
            <a className="profile__button profile__button--ghost" href="mailto:career@codinglearn.io">
              Planifier un rendez-vous
            </a>
          </article>
          <article>
            <h3>Support technique</h3>
            <p>Équipe CodingLearn</p>
            <a className="profile__button profile__button--ghost" href="mailto:support@codinglearn.io">
              Ouvrir un ticket
            </a>
          </article>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
