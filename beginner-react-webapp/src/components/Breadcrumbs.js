import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Breadcrumbs.css';

const breadcrumbLabels = {
  '/': 'Accueil',
  '/about': 'À propos',
  '/dashboard': 'Tableau de bord',
  '/profile': 'Profil',
  '/settings': 'Paramètres',
  '/help': 'Aide',
  '/login': 'Connexion',
  '/register': 'Inscription',
};

const normalisePath = (path) => (path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path);

const Breadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canGoBack = typeof window !== 'undefined' ? window.history.length > 1 : false;

  const crumbs = useMemo(() => {
    const pathname = normalisePath(location.pathname);
    if (pathname === '/') {
      return [
        {
          path: '/',
          label: breadcrumbLabels['/'],
          isCurrent: true,
        },
      ];
    }

    const segments = pathname.split('/').filter(Boolean);
    const mappedSegments = segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        path,
        label: breadcrumbLabels[path] || segment.replace(/-/g, ' '),
        isCurrent: index === segments.length - 1,
      };
    });

    return [
      {
        path: '/',
        label: breadcrumbLabels['/'],
        isCurrent: false,
      },
      ...mappedSegments,
    ];
  }, [location.pathname]);

  return (
    <div className="breadcrumbs-wrapper" role="presentation">
      <div className="breadcrumbs">
        <button
          type="button"
          className="breadcrumbs__back"
          onClick={() => navigate(-1)}
          disabled={!canGoBack || location.pathname === '/'}
        >
          ← Retour
        </button>
        <nav aria-label="Fil d'Ariane" className="breadcrumbs__nav">
          <ol>
            {crumbs.map((crumb, index) => (
              <li key={crumb.path}>
                {crumb.isCurrent ? (
                  <span aria-current="page">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path}>{crumb.label}</Link>
                )}
                {index < crumbs.length - 1 && <span className="breadcrumbs__separator">/</span>}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
