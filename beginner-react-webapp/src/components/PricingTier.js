import React from 'react';

const PricingTier = ({ name, price, description, features, highlight }) => (
  <article className={`pricing-tier${highlight ? ' pricing-tier--highlight' : ''}`}>
    <h3 className="pricing-tier__name">{name}</h3>
    <p className="pricing-tier__price">{price}</p>
    <p className="pricing-tier__description">{description}</p>
    <ul className="pricing-tier__features">
      {features.map((feature) => (
        <li key={feature}>{feature}</li>
      ))}
    </ul>
    <button type="button" className="pricing-tier__cta">
      Choisir ce pack
    </button>
  </article>
);

export default PricingTier;
