import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import brandLogo from '../assets/codinglearn-logo.svg';

import './NavBar.css';

const navLinks = [
  { to: '/', label: 'Accueil', end: true },
  { to: '/dashboard', label: 'Tableau de bord', protected: true },
  { to: '/profile', label: 'Profil', protected: true },
  { to: '/settings', label: 'Paramètres', protected: true },
  { to: '/help', label: 'Aide' },
  { to: '/about', label: 'À propos' },
];

const NavBar = ({ onToggleTheme = () => {}, theme = 'light' }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isNavLinkAvailable = typeof NavLink === 'function' || (typeof NavLink === 'object' && NavLink !== null);
  const LinkComponent = isNavLinkAvailable ? NavLink : Link;
  const navLinkClassName = isNavLinkAvailable ? ({ isActive }) => (isActive ? 'active' : undefined) : undefined;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar" aria-label="Navigation principale">
      <LinkComponent
        className="navbar__brand"
        to="/"
        aria-label="Revenir à l'accueil CodingLearn"
        {...(isNavLinkAvailable ? { end: true } : {})}
      >
        <img className="navbar__brand-mark" src={brandLogo} alt="Logo CodingLearn" />
        <span className="navbar__brand-text">CodingLearn</span>
      </LinkComponent>

      <ul className="navbar__links">
        {navLinks
          .filter((item) => !item.protected || user)
          .map(({ to, label, end }) => (
            <li key={to}>
              <LinkComponent to={to} {...(isNavLinkAvailable && end ? { end: true } : {})} className={navLinkClassName}>
                {label}
              </LinkComponent>
            </li>
          ))}
      </ul>
      <div className="navbar__actions">
        <button
          type="button"
          className="navbar__theme-toggle"
          onClick={onToggleTheme}
          aria-pressed={theme === 'dark'}
        >
          {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
        </button>
        {user ? (
          <button type="button" className="navbar__logout" onClick={handleLogout}>
            Se déconnecter
          </button>
        ) : (
          <>
            <LinkComponent className="navbar__link" to="/login" {...(isNavLinkAvailable ? { end: true } : {})}>
              Se connecter
            </LinkComponent>
            <LinkComponent className="navbar__cta" to="/register" {...(isNavLinkAvailable ? { end: true } : {})}>
              Commencer gratuitement
            </LinkComponent>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
