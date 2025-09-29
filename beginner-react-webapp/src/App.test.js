import { render, screen } from '@testing-library/react';
import App from './App';

test("affiche l'accueil par défaut", () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /bienvenue sur codinglearn/i });
  expect(heading).toBeInTheDocument();
});
