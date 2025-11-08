import { setRouteTypeFilter, setRouteRiskFilter, voteSafetyReport, getState } from '../state/app-state.js';
import { showNotification } from './notifications.js';

const typeFilterId = 'routeTypeFilter';
const riskFilterId = 'routeRiskFilter';
const reportsContainerId = 'safetyReports';

export const initializeRoutesModule = () => {
  const typeSelect = document.getElementById(typeFilterId);
  const riskSelect = document.getElementById(riskFilterId);
  const reportsContainer = document.getElementById(reportsContainerId);

  if (typeSelect) {
    typeSelect.addEventListener('change', event => {
      setRouteTypeFilter(event.target.value);
    });
    typeSelect.value = getState().ui?.routeTypeFilter || '';
  }

  if (riskSelect) {
    riskSelect.addEventListener('change', event => {
      setRouteRiskFilter(event.target.value);
    });
    riskSelect.value = getState().ui?.routeRiskFilter || '';
  }

  if (reportsContainer) {
    reportsContainer.addEventListener('click', event => {
      const button = event.target.closest('[data-report-vote]');
      if (!button) return;

      const direction = button.getAttribute('data-report-vote');
      const reportId = button.getAttribute('data-report-id');
      if (!direction || !reportId) return;

      voteSafetyReport(reportId, direction);
      showNotification(
        direction === 'up'
          ? 'Tu voto ayuda a priorizar rutas seguras.'
          : 'Registro de alerta actualizado.',
        'info'
      );
    });
  }
};
