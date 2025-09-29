import React from 'react';


import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
          <NavLink to="/" end>
            Accueil
          </NavLink>
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
          <NavLink to="/about">À propos</NavLink>
        </li>
      </ul>
      <div className="navbar__actions">
        {user ? (
          <>
            <NavLink className="navbar__link" to="/dashboard">
              Tableau de bord
            </NavLink>
            <button type="button" className="navbar__logout" onClick={handleLogout}>
              Se déconnecter
            </button>
          </>
        ) : (
          <>
            <NavLink className="navbar__link" to="/login">
              Se connecter
            </NavLink>
            <NavLink className="navbar__cta" to="/register">
              Commencer gratuitement
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
