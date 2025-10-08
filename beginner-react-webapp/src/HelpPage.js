import React from 'react';
import { Link } from 'react-router-dom';

const HelpPage = () => (
  <div className="help" aria-labelledby="help-heading">
    <header className="help__header">
      <h1 id="help-heading">Centre d’aide CodingLearn</h1>
      <p>Retrouvez les réponses aux questions fréquentes et contactez notre équipe en quelques clics.</p>
    </header>

    <section className="help__section" aria-labelledby="help-faq">
      <h2 id="help-faq">Questions fréquentes</h2>
      <details>
        <summary>Comment accéder à mon tableau de bord ?</summary>
        <p>Connectez-vous, puis cliquez sur « Tableau de bord » dans la navigation principale.</p>
      </details>
      <details>
        <summary>Où modifier mes informations personnelles ?</summary>
        <p>
          Rendez-vous sur la page <Link to="/settings">Paramètres</Link> pour mettre à jour vos coordonnées, préférences et
          confidentialité.
        </p>
      </details>
      <details>
        <summary>Comment contacter mon mentor ?</summary>
        <p>
          Les coordonnées de votre mentor sont disponibles dans votre <Link to="/dashboard">tableau de bord</Link> et dans la
          page <Link to="/profile">Profil</Link>.
        </p>
      </details>
    </section>

    <section className="help__section" aria-labelledby="help-contact">
      <h2 id="help-contact">Nous contacter</h2>
      <div className="help__cards">
        <article>
          <h3>Support pédagogique</h3>
          <p>Email : <a href="mailto:mentor@codinglearn.io">mentor@codinglearn.io</a></p>
          <p>Disponibilité : du lundi au vendredi, 9h-17h</p>
        </article>
        <article>
          <h3>Support technique</h3>
          <p>Email : <a href="mailto:support@codinglearn.io">support@codinglearn.io</a></p>
          <p>Temps de réponse moyen : 24h ouvrées</p>
        </article>
        <article>
          <h3>Communauté</h3>
          <p>Rejoignez le Discord dans la section « Communauté » de votre tableau de bord.</p>
        </article>
      </div>
    </section>

    <section className="help__section" aria-labelledby="help-shortcuts">
      <h2 id="help-shortcuts">Raccourcis utiles</h2>
      <ul className="help__links">
        <li>
          <Link to="/dashboard">Ouvrir le tableau de bord</Link>
        </li>
        <li>
          <Link to="/profile">Voir mon profil</Link>
        </li>
        <li>
          <Link to="/settings">Mettre à jour mes paramètres</Link>
        </li>
      </ul>
    </section>
  </div>
);

export default HelpPage;
