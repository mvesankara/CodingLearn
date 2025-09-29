import React from 'react';
import { Link } from 'react-router-dom';
import FeatureCard from './components/FeatureCard';
import Testimonial from './components/Testimonial';
import PricingTier from './components/PricingTier';

const HomePage = () => {
  const features = [
    {
      icon: '🚀',
      title: 'Apprentissage progressif',
      description:
        'Des modules courts et concrets pour monter en compétences à votre rythme.',
    },
    {
      icon: '🧠',
      title: 'Projets pratiques',
      description:
        'Mettez immédiatement en œuvre ce que vous découvrez grâce à des exercices guidés.',
    },
    {
      icon: '🤝',
      title: 'Communauté engagée',
      description:
        'Échangez avec d’autres apprenant·e·s et recevez des retours personnalisés.',
    },
  ];

  const curriculum = [
    'Comprendre les bases du JavaScript moderne',
    'Créer vos premières interfaces React',
    'Structurer vos projets avec les meilleures pratiques',
    'Déployer une application prête pour la production',
  ];

  const testimonials = [
    {
      quote:
        'CodingLearn m’a permis de changer de carrière en quelques mois seulement.',
      author: 'Amélie D.',
      role: 'Développeuse front-end',
    },
    {
      quote: 'Des explications claires et une équipe toujours disponible pour aider.',
      author: 'Karim L.',
      role: 'Étudiant en informatique',
    },
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '19 € / mois',
      description: 'Idéal pour découvrir le code et progresser en autonomie.',
      features: [
        'Accès aux cours essentiels',
        'Forums communautaires',
        'Suivi de progression automatique',
      ],
    },
    {
      name: 'Pro',
      price: '39 € / mois',
      description: 'Pour accélérer vos projets avec du mentorat personnalisé.',
      features: [
        'Tout le contenu Starter',
        'Sessions live hebdomadaires',
        'Corrections de projets détaillées',
      ],
      highlight: true,
    },
    {
      name: 'Équipe',
      price: 'Sur devis',
      description: 'Conçu pour former vos collaborateur·rice·s au numérique.',
      features: [
        'Tableau de bord manager',
        'Parcours sur mesure',
        'Support prioritaire',
      ],
    },
  ];

  return (
    <main className="homepage">
      <section className="hero">
        <h1>Bienvenue sur CodingLearn</h1>
        <p>
          La plateforme francophone qui transforme votre curiosité du code en
          compétences concrètes.
        </p>
        <Link to="/about" className="hero__cta">
          En savoir plus
        </Link>
      </section>

      <section className="section" aria-labelledby="why-heading">
        <div className="section__header">
          <h2 id="why-heading">Pourquoi CodingLearn&nbsp;?</h2>
          <p>Une méthode pensée pour vous guider vers l’autonomie.</p>
        </div>
        <div className="section__grid">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="section section--accent" aria-labelledby="learn-heading">
        <div className="section__header">
          <h2 id="learn-heading">Ce que vous apprendrez</h2>
          <p>
            Un parcours progressif alliant fondamentaux solides et pratiques
            professionnelles.
          </p>
        </div>
        <ul className="curriculum-list">
          {curriculum.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="testimonials-heading">
        <div className="section__header">
          <h2 id="testimonials-heading">Ils et elles en parlent</h2>
          <p>Découvrez les retours de la communauté CodingLearn.</p>
        </div>
        <div className="section__grid section__grid--testimonials">
          {testimonials.map((testimonial) => (
            <Testimonial key={testimonial.author} {...testimonial} />
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="pricing-heading">
        <div className="section__header">
          <h2 id="pricing-heading">Nos packs tarifaires</h2>
          <p>Choisissez l’accompagnement qui correspond à votre objectif.</p>
        </div>
        <div className="section__grid section__grid--pricing">
          {pricingTiers.map((tier) => (
            <PricingTier key={tier.name} {...tier} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
