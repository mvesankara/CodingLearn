import React from 'react';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">CodingLearn</div>
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
