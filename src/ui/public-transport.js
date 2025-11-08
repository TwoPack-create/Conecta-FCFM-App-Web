import { $ } from '../utils/dom.js';
import { setPublicTransportFilter, joinPublicTransportTrip, getState } from '../state/app-state.js';
import { showNotification } from './notifications.js';

const filterSelectId = 'filterMode';
const tripsContainerId = 'publicTrips';

export const initializePublicTransport = () => {
  const filterSelect = document.getElementById(filterSelectId);
  const tripsContainer = document.getElementById(tripsContainerId);

  if (filterSelect) {
    filterSelect.addEventListener('change', event => {
      const value = event.target.value;
      setPublicTransportFilter(value);
    });
  }

  if (tripsContainer) {
    tripsContainer.addEventListener('click', event => {
      const button = event.target.closest('[data-trip-join]');
      if (!button) return;
      const tripId = button.getAttribute('data-trip-join');
      if (!tripId) return;
      try {
        joinPublicTransportTrip(tripId);
        showNotification('Tu solicitud para unirte al viaje fue enviada.', 'success');
      } catch (error) {
        showNotification(error.message, 'error');
      }
    });
  }

  const currentFilter = getState().ui?.publicTransportFilter || '';
  if (filterSelect) {
    filterSelect.value = currentFilter;
  }
};
