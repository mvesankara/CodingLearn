import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import brandLogo from '../assets/codinglearn-logo.svg';

import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const LinkComponent = NavLink ?? Link;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">

      <a className="navbar__brand" href="#accueil" aria-label="Revenir à l'accueil CodingLearn">
        <img className="navbar__brand-mark" src={brandLogo} alt="Logo CodingLearn" />
        <span className="navbar__brand-text">CodingLearn</span>
      </a>

      <Link className="navbar__logo" to="/">
        CodingLearn
      </Link>

      <ul className="navbar__links">
        <li>
          <LinkComponent to="/" {...(NavLink ? { end: true } : {})}>
            Accueil
          </LinkComponent>
        </li>
        <li>
          <Link to="/#parcours">Parcours</Link>
        </li>
        <li>
          <Link to="/#tarifs">Tarifs</Link>
        </li>
        <li>
          <Link to="/#contact">Contact</Link>
        </li>
        <li>
          <LinkComponent to="/about">À propos</LinkComponent>
        </li>
      </ul>
      <div className="navbar__actions">
        {user ? (
          <>
            <LinkComponent className="navbar__link" to="/dashboard">
              Tableau de bord
            </LinkComponent>
            <button type="button" className="navbar__logout" onClick={handleLogout}>
              Se déconnecter
            </button>
          </>
        ) : (
          <>
            <LinkComponent className="navbar__link" to="/login">
              Se connecter
            </LinkComponent>
            <LinkComponent className="navbar__cta" to="/register">
              Commencer gratuitement
            </LinkComponent>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
