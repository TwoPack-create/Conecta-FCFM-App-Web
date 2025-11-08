import { requestVehicleTrip, setVehicleFilter, getState } from '../state/app-state.js';
import { showNotification } from './notifications.js';

const vehicleTripsContainerId = 'vehicleTrips';
const vehicleFilterId = 'vehicleFilter';

export const initializeVehicleModule = () => {
  const container = document.getElementById(vehicleTripsContainerId);
  const filterSelect = document.getElementById(vehicleFilterId);

  if (container) {
    container.addEventListener('click', event => {
      const button = event.target.closest('[data-trip-request]');
      if (!button) return;

      const tripId = button.getAttribute('data-trip-request');
      if (!tripId) return;

      try {
        requestVehicleTrip(tripId);
        showNotification('Solicitud enviada al conductor. Espera la confirmacion.', 'success');
      } catch (error) {
        showNotification(error.message, 'error');
      }
    });
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', event => {
      const value = event.target.value;
      setVehicleFilter(value);
    });

    const currentFilter = getState().ui?.vehicleFilter || '';
    filterSelect.value = currentFilter;
  }
};
