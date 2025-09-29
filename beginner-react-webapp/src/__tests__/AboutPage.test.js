import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from '../AboutPage';
import * as leadsService from '../services/leads';

describe('AboutPage', () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('envoie le formulaire et affiche un message de succès', async () => {
    jest.spyOn(leadsService, 'submitLead').mockResolvedValueOnce({ status: 'ok' });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Ada Lovelace' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText(/objectifs/i), { target: { value: 'Découvrir React' } });

    fireEvent.click(screen.getByRole('button', { name: /recevoir le programme/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/merci/i);
    });

    expect(leadsService.submitLead).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      goals: 'Découvrir React',
    });
  });

  it('affiche un message d\'erreur si la soumission échoue', async () => {
    jest.spyOn(leadsService, 'submitLead').mockRejectedValueOnce(new Error('Erreur réseau'));

    renderComponent();

    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'Grace Hopper' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'grace@example.com' } });
    fireEvent.change(screen.getByLabelText(/objectifs/i), {
      target: { value: 'Approfondir JavaScript' },
    });

    fireEvent.click(screen.getByRole('button', { name: /recevoir le programme/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/erreur est survenue/i);
    });
  });
});
