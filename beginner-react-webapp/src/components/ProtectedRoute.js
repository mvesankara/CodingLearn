import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const NavigateComponent = Navigate ?? (() => null);

  if (!user) {
    return <NavigateComponent to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
