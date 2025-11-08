import { completeTrip } from '../state/app-state.js';
import { showNotification } from './notifications.js';

const activeTripsContainerId = 'activeTrips';

const actionMessages = {
  chat: 'Abriremos pronto el chat grupal. Por ahora, coordina por tu canal favorito.',
  route: 'La integracion de rutas se habilitara en la siguiente iteracion.',
  contact: 'Enviaremos la informacion del conductor a tu correo institucional.',
  details: 'Muy pronto podras ver los detalles completos del viaje.'
};

export const initializeMyTripsModule = () => {
  const container = document.getElementById(activeTripsContainerId);
  if (!container) return;

  container.addEventListener('click', event => {
    const actionButton = event.target.closest('[data-trip-action]');
    if (actionButton) {
      handleAction(actionButton);
      return;
    }

    const completeButton = event.target.closest('[data-trip-complete]');
    if (completeButton) {
      handleComplete(completeButton);
    }
  });
};

const handleAction = button => {
  const action = button.getAttribute('data-trip-action');
  if (!action) return;
  const message = actionMessages[action] || 'Accion disponible proximamente.';
  showNotification(message, 'info');
};

const handleComplete = button => {
  const tripId = button.getAttribute('data-trip-complete');
  if (!tripId) return;
  completeTrip(tripId);
  showNotification('El viaje se marco como completado.', 'success');
};
