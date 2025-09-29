import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitLead } from './services/leads';

function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    goals: '',
  });
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'loading', message: '' });

    try {
      await submitLead(formData);
      setStatus({
        type: 'success',
        message: 'Merci ! Nous vous enverrons votre programme personnalisé très bientôt.',
      });
      setFormData({ name: '', email: '', goals: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          "Oups, une erreur est survenue. Merci de réessayer plus tard ou de nous contacter directement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>À propos de CodingLearn</h1>
      <p>
        Cette page présente notre accompagnement. Partagez vos objectifs pour recevoir un programme
        d'apprentissage adapté directement dans votre boîte mail.
      </p>

      <form onSubmit={handleSubmit} aria-label="Formulaire de contact">
        <div>
          <label htmlFor="name">Nom</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="goals">Objectifs</label>
          <textarea
            id="goals"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Envoi en cours…' : 'Recevoir le programme'}
        </button>
      </form>

      {status.type === 'success' && <p role="status">{status.message}</p>}
      {status.type === 'error' && (
        <p role="alert" style={{ color: 'red' }}>
          {status.message}
        </p>
      )}

      <Link to="/">
        <button type="button">Retour à l'accueil</button>
      </Link>
    </div>
  );
}

export default AboutPage;
