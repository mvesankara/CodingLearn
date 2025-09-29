const DELAY_MS = 400;

/**
 * Envoie les informations de lead vers notre CRM.
 * @param {{name: string, email: string, goals: string}} lead
 * @returns {Promise<{status: 'ok'}>}
 */
export function submitLead(lead) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!lead || !lead.email) {
        reject(new Error('Email manquant'));
        return;
      }

      // Mock : on simule la persistance locale en journalisant dans la console.
      // Dans une vraie application, on ferait un appel fetch/axios ici.
      // eslint-disable-next-line no-console
      console.info('Lead enregistré', lead);
      resolve({ status: 'ok' });
    }, DELAY_MS);
  });
}

export default submitLead;
