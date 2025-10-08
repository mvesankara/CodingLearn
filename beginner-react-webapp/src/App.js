import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import DashboardPage from './DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Breadcrumbs from './components/Breadcrumbs';
import { AuthProvider } from './context/AuthContext';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import HelpPage from './HelpPage';
import './App.css';

const THEME_STORAGE_KEY = 'codinglearn:theme-preference';

const AppShell = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) || 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="App" data-theme={theme}>
      <NavBar onToggleTheme={toggleTheme} theme={theme} />
      <Breadcrumbs />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/profile"
            element={(
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/settings"
            element={(
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </Router>
  );
}

export default App;
