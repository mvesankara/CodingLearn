import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const cohorts = ['Débutant', 'Intensif', 'Reconversion', 'Entrepreneuriat'];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, authError, clearError, user } = useAuth();
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    password: '',
    cohort: cohorts[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const success = await register(formValues);
    setIsSubmitting(false);

    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" role="form">
        <h1>Créer votre compte</h1>
        <p className="auth-card__subtitle">
          Définissez votre parcours et recevez un accompagnement adapté à vos objectifs.
        </p>

        {authError ? (
          <div className="auth-card__alert" role="alert">
            {authError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="auth-card__form">
          <label htmlFor="fullName">Nom complet</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Ex. Aïcha Diallo"
            value={formValues.fullName}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="vous@exemple.com"
            autoComplete="email"
            value={formValues.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Au moins 6 caractères"
            autoComplete="new-password"
            minLength={6}
            value={formValues.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="cohort">Programme</label>
          <select id="cohort" name="cohort" value={formValues.cohort} onChange={handleChange}>
            {cohorts.map((cohort) => (
              <option value={cohort} key={cohort}>
                {cohort}
              </option>
            ))}
          </select>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Création du compte…' : "Je m'inscris"}
          </button>
        </form>

        <p className="auth-card__footer">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" onClick={clearError}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
