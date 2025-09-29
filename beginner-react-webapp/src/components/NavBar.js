import React from 'react';
import brandLogo from '../assets/codinglearn-logo.svg';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <a className="navbar__brand" href="#accueil" aria-label="Revenir à l'accueil CodingLearn">
        <img className="navbar__brand-mark" src={brandLogo} alt="Logo CodingLearn" />
        <span className="navbar__brand-text">CodingLearn</span>
      </a>
      <ul className="navbar__links">
        <li><a href="#accueil">Accueil</a></li>
        <li><a href="#parcours">Parcours</a></li>
        <li><a href="#tarifs">Tarifs</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <a className="navbar__cta" href="#signup">Commencer gratuitement</a>
    </nav>
  );
};

export default NavBar;
