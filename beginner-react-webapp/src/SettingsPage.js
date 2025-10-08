import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';

const initialSettings = {
  weeklySummary: true,
  reminders: true,
  visibility: 'private',
  language: 'fr',
};

const SettingsPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(initialSettings);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const browserLanguage = typeof navigator !== 'undefined' ? navigator.language : 'fr';
    setSettings((previous) => ({
      ...previous,
      language: browserLanguage?.startsWith('en') ? 'en' : 'fr',
    }));
  }, []);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFeedback('Vos préférences ont été enregistrées avec succès.');
    setTimeout(() => setFeedback(null), 4500);
  };

  return (
    <div className="settings" aria-labelledby="settings-heading">
      <header className="settings__header">
        <div>
          <h1 id="settings-heading">Paramètres du compte</h1>
          <p>Mettez à jour vos préférences de communication et de confidentialité.</p>
        </div>
        <div className="settings__meta">
          <span>Connecté en tant que</span>
          <strong>{user?.email}</strong>
        </div>
      </header>

      {feedback && (
        <div className="settings__feedback" role="status" aria-live="polite">
          {feedback}
        </div>
      )}

      <form className="settings__form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Notifications</legend>
          <label className="settings__toggle">
            <input
              type="checkbox"
              name="weeklySummary"
              checked={settings.weeklySummary}
              onChange={handleChange}
            />
            <span>Recevoir le récapitulatif hebdomadaire</span>
          </label>
          <label className="settings__toggle">
            <input type="checkbox" name="reminders" checked={settings.reminders} onChange={handleChange} />
            <span>Activer les rappels de coaching et d’échéance</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Confidentialité</legend>
          <label className="settings__option">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={settings.visibility === 'private'}
              onChange={handleChange}
            />
            <span>Profil visible uniquement par l’équipe pédagogique</span>
          </label>
          <label className="settings__option">
            <input
              type="radio"
              name="visibility"
              value="cohort"
              checked={settings.visibility === 'cohort'}
              onChange={handleChange}
            />
            <span>Partager mes avancées avec ma promotion</span>
          </label>
        </fieldset>

        <fieldset>
          <legend>Préférences d’affichage</legend>
          <label className="settings__select" htmlFor="language">
            Langue de l’interface
          </label>
          <select id="language" name="language" value={settings.language} onChange={handleChange}>
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
        </fieldset>

        <button type="submit" className="settings__submit">
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
