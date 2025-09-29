import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, authError, clearError, user } = useAuth();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
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
    const success = await login(formValues.email, formValues.password);
    setIsSubmitting(false);

    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" role="form">
        <h1>Connexion</h1>
        <p className="auth-card__subtitle">
          Retrouvez vos parcours personnalisés et reprenez votre progression.
        </p>

        {authError ? (
          <div className="auth-card__alert" role="alert">
            {authError}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="auth-card__form">
          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            value={formValues.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            value={formValues.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion en cours…' : 'Se connecter'}
          </button>
        </form>

        <p className="auth-card__footer">
          Pas encore de compte ?{' '}
          <Link to="/register" onClick={clearError}>
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
