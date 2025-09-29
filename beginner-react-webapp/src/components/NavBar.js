import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
