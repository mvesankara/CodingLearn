const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

export async function submitLead(lead) {
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || "Impossible d'envoyer votre demande pour le moment.";
    throw new Error(message);
  }

  return response.json();
}

export default submitLead;
