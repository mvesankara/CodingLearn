import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <article className="feature-card">
    <div className="feature-card__icon" aria-hidden="true">{icon}</div>
    <h3 className="feature-card__title">{title}</h3>
    <p className="feature-card__description">{description}</p>
  </article>
);

export default FeatureCard;
