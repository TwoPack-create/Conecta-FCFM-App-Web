import { $, $$, toggleHidden } from '../utils/dom.js';
import {
  getState,
  addPublicTransportTrip,
  addVehicleTrip,
  addSafetyReport,
  updatePreferences,
  getMetroLines,
  updateCurrentUser
} from '../state/app-state.js';
import { updateStoredUser } from '../state/session.js';
import { showNotification } from './notifications.js';

const ensureAuthenticated = () => {
  const { session } = getState();
  return session.user ?? null;
};

const resetMetroLineGroup = form => {
  const metroLineGroup = form?.querySelector('#metroLineGroup');
  if (!metroLineGroup) return;
  toggleHidden(metroLineGroup, true);
  const select = metroLineGroup.querySelector('select');
  if (select) {
    select.required = false;
    select.value = '';
  }
};

const setupPublicTripForm = () => {
  const form = $('#publicTripForm');
  if (!form) return;

  const modeSelect = form.querySelector('[name="mode"]');
  const metroLineGroup = form.querySelector('#metroLineGroup');

  if (modeSelect && metroLineGroup) {
    modeSelect.addEventListener('change', () => {
      const shouldShow = modeSelect.value === 'Metro';
      toggleHidden(metroLineGroup, !shouldShow);
      const select = metroLineGroup.querySelector('select');
      if (select) {
        select.required = shouldShow;
        if (!shouldShow) {
          select.value = '';
        }
      }
    });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const user = ensureAuthenticated();
    if (!user) {
      showNotification('Debes iniciar sesion para publicar un viaje.', 'warning');
      return;
    }

    const data = new FormData(form);
    const mode = data.get('mode');
    const line = data.get('line');

    const trip = {
      id: `pt-${Date.now()}`,
      creatorId: user.id || user.email,
      creatorName: user.name || user.email,
      mode,
      line: mode === 'Metro' ? line : null,
      station: data.get('station'),
      origin: data.get('origin'),
      destination: data.get('destination'),
      time: data.get('time'),
      spots: Number(data.get('spots')),
      date: new Date().toISOString().split('T')[0]
    };

    addPublicTransportTrip(trip);
    setPublicTransportFilter('');
    const filterSelect = document.getElementById('filterMode');
    if (filterSelect) {
      filterSelect.value = '';
    }
    showNotification('Viaje publicado exitosamente.', 'success');
    form.reset();
    resetMetroLineGroup(form);
  });
};

const setupVehicleTripForm = () => {
  const form = $('#vehicleTripForm');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const user = ensureAuthenticated();
    if (!user) {
      showNotification('Debes iniciar sesion para publicar un viaje.', 'warning');
      return;
    }

    const data = new FormData(form);
    const trip = {
      id: `vt-${Date.now()}`,
      driverId: user.id || user.email,
      driver: user.name || user.email,
      vehicleType: data.get('vehicleType'),
      vehicleModel: data.get('vehicleModel'),
      vehicleColor: data.get('vehicleColor'),
      plate: data.get('plate'),
      origin: data.get('origin'),
      destination: data.get('destination'),
      date: data.get('date'),
      departureTime: data.get('departureTime'),
      arrivalTime: data.get('arrivalTime'),
      seatsAvailable: Number(data.get('seatsAvailable')),
      donation: Number(data.get('donation')),
      routeDescription: data.get('routeDescription'),
      driverRating: user.rating || 0
    };

    addVehicleTrip(trip);
    setVehicleFilter('');
    const vehicleFilter = document.getElementById('vehicleFilter');
    if (vehicleFilter) {
      vehicleFilter.value = '';
    }
    showNotification('Tu viaje en vehiculo esta publicado.', 'success');
    form.reset();
  });
};

const setupSafetyReportForm = () => {
  const form = $('#safetyReportForm');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const user = ensureAuthenticated();
    if (!user) {
      showNotification('Debes iniciar sesion para reportar una ruta.', 'warning');
      return;
    }

    const data = new FormData(form);
    const report = {
      id: `sr-${Date.now()}`,
      type: data.get('type'),
      location: data.get('location'),
      time: data.get('time'),
      description: data.get('description'),
      severity: data.get('severity'),
      anonymous: Boolean(data.get('anonymous')),
      reporterName: data.get('anonymous') ? null : user.name,
      date: new Date().toISOString().split('T')[0],
      votes: { up: 0, down: 0 }
    };

    addSafetyReport(report);
    showNotification('Reporte enviado a la comunidad.', 'success');
    form.reset();
  });
};

const setupProfileForm = () => {
  const form = $('#profileForm');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const user = ensureAuthenticated();
    if (!user) {
      showNotification('Inicia sesion para actualizar tu perfil.', 'warning');
      return;
    }

    const data = new FormData(form);
    const patch = {
      name: data.get('name').trim(),
      phone: data.get('phone').trim(),
      emergencyContact: data.get('emergencyContact').trim(),
      bio: data.get('bio').trim(),
      bankAccount: data.get('bankAccount').trim()
    };

    updateCurrentUser(patch);
    updateStoredUser({ email: user.email, ...patch });
    showNotification('Perfil actualizado correctamente.', 'success');
  });
};

const setupSettings = () => {
  const darkModeToggle = $('#darkModeToggle');
  const languageToggle = $('#languageToggle');
  const panicSoundToggle = $('#panicSoundToggle');
  const panicAlertToggles = $$('[data-panic-target]');
  const panicCountdownInput = $('#panicCountdownInput');
  const notifyEmailToggle = $('#notifyEmailToggle');
  const notifyPushToggle = $('#notifyPushToggle');

  const { preferences } = getState().session;

  if (darkModeToggle) {
    darkModeToggle.checked = preferences.theme === 'dark';
    darkModeToggle.addEventListener('change', () => {
      const theme = darkModeToggle.checked ? 'dark' : 'light';
      updatePreferences({ theme });
    });
  }

  if (languageToggle) {
    languageToggle.checked = preferences.language === 'en';
    languageToggle.addEventListener('change', () => {
      const language = languageToggle.checked ? 'en' : 'es';
      updatePreferences({ language });
      showNotification(
        `Idioma ${language === 'en' ? 'ingles' : 'espanol'} seleccionado.`,
        'info'
      );
    });
  }

  if (notifyEmailToggle) {
    notifyEmailToggle.checked = preferences.notifyEmail;
    notifyEmailToggle.addEventListener('change', () => {
      updatePreferences({ notifyEmail: notifyEmailToggle.checked });
    });
  }

  if (notifyPushToggle) {
    notifyPushToggle.checked = preferences.notifyPush;
    notifyPushToggle.addEventListener('change', () => {
      updatePreferences({ notifyPush: notifyPushToggle.checked });
    });
  }

  if (panicCountdownInput) {
    panicCountdownInput.value = preferences.panic.countdownSeconds || 5;
    panicCountdownInput.addEventListener('change', () => {
      const value = parseInt(panicCountdownInput.value, 10);
      if (Number.isNaN(value)) return;
      const normalized = Math.min(Math.max(value, 3), 30);
      panicCountdownInput.value = normalized;
      updatePreferences({
        panic: { countdownSeconds: normalized }
      });
    });
  }

  if (panicSoundToggle) {
    panicSoundToggle.checked = preferences.panic.soundEnabled;
    panicSoundToggle.addEventListener('change', () => {
      updatePreferences({
        panic: { soundEnabled: panicSoundToggle.checked }
      });
    });
  }

  panicAlertToggles.forEach(toggle => {
    const key = toggle.dataset.panicTarget;
    toggle.checked = !!preferences.panic.alertContacts[key];
    toggle.addEventListener('change', () => {
      const currentPreferences = getState().session.preferences;
      updatePreferences({
        panic: {
          alertContacts: {
            ...currentPreferences.panic.alertContacts,
            [key]: toggle.checked
          }
        }
      });
    });
  });
};

const populateMetroLineSelects = () => {
  const metroSelects = $$('select[data-metro-lines]');
  const lines = getMetroLines();
  metroSelects.forEach(select => {
    select.innerHTML = '<option value="">Seleccionar linea</option>';
    lines.forEach(line => {
      const option = document.createElement('option');
      option.value = line;
      option.textContent = line;
      select.appendChild(option);
    });
  });
};

export const initializeForms = () => {
  populateMetroLineSelects();
  setupPublicTripForm();
  setupVehicleTripForm();
  setupSafetyReportForm();
  setupProfileForm();
  setupSettings();
};
