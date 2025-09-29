import { render, screen } from '@testing-library/react';
import App from './App';

test("affiche l'accueil par défaut", () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /welcome to my first web app!/i });
  expect(heading).toBeInTheDocument();
});
