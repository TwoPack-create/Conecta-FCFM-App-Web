import { $, toggleHidden } from '../utils/dom.js';
import { getState, logAuditEvent } from '../state/app-state.js';
import { showNotification } from './notifications.js';

let countdownTimer = null;
let secondsRemaining = 0;
let lastKnownLocation = 'Sin datos';

const getPreferences = () => getState().session.preferences.panic;
const getEnabledRecipients = () => {
  const { alertContacts } = getPreferences();
  return Object.keys(alertContacts).filter(key => alertContacts[key]);
};

const updateLocationLabel = () => {
  const locationElement = document.getElementById('panicLocation');
  if (locationElement) {
    locationElement.textContent = Ubicacion estimada: ;
  }
};

const renderRecipientsList = () => {
  const targetList = document.getElementById('panicAlertList');
  if (!targetList) return;

  const labels = {
    carabineros: 'Carabineros',
    guardiaMunicipal: 'Guardia Municipal',
    guardiaCivil: 'Guardia Civil',
    seguridadFCFM: 'Seguridad FCFM',
    contactosEmergencia: 'Contactos de emergencia',
    comunidadConecta: 'Comunidad Conecta'
  };

  const recipients = getEnabledRecipients()
    .map(key => <li></li>)
    .join('');
  targetList.innerHTML = recipients || '<li>Sin destinatarios configurados</li>';
};

const renderCountdownState = () => {
  const title = #panicModalTitle;
  const message = #panicModalMessage;
  const countdown = #panicCountdown;
  const countdownActions = #panicCountdownActions;
  const activeActions = #panicActiveActions;

  if (title) title.textContent = 'Boton de panico';
  if (message) message.textContent = 'El boton de panico se activara en:';
  if (countdown) countdown.textContent = ${secondsRemaining}s;
  updateLocationLabel();
  renderRecipientsList();

  toggleHidden(countdownActions, false);
  toggleHidden(activeActions, true);
};

const renderActiveState = () => {
  const title = #panicModalTitle;
  const message = #panicModalMessage;
  const countdown = #panicCountdown;
  const countdownActions = #panicCountdownActions;
  const activeActions = #panicActiveActions;

  renderRecipientsList();
  updateLocationLabel();

  if (title) title.textContent = 'Boton de panico activado';
  if (message)
    message.textContent =
      'Se envio una alerta a los siguientes contactos y autoridades:';
  if (countdown) countdown.textContent = '';

  toggleHidden(countdownActions, true);
  toggleHidden(activeActions, false);
};

const closeModal = () => {
  const modal = #panicModal;
  toggleHidden(modal, true);
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
};

const activatePanic = immediate => {
  if (!immediate && countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  renderActiveState();
  showNotification('Alerta de emergencia enviada.', 'error');
  logAuditEvent('Boton de panico activado', {
    recipients: getEnabledRecipients(),
    location: lastKnownLocation
  });
};

const startCountdown = () => {
  const preferences = getPreferences();
  secondsRemaining = preferences.countdownSeconds || 5;
  renderCountdownState();
  countdownTimer = setInterval(() => {
    secondsRemaining -= 1;
    const countdown = #panicCountdown;
    if (countdown) countdown.textContent = ${secondsRemaining}s;
    if (secondsRemaining <= 0) {
      activatePanic(false);
    }
  }, 1000);
};

const captureLocation = () => {
  if (!navigator.geolocation) {
    lastKnownLocation = 'Geolocalizacion no soportada';
    updateLocationLabel();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      lastKnownLocation = Lat , Lon ;
      updateLocationLabel();
    },
    () => {
      lastKnownLocation = 'Permiso denegado';
      updateLocationLabel();
    },
    { enableHighAccuracy: false, timeout: 5000 }
  );
};

export const initializePanicControls = () => {
  const panicButton = #panicBtn;
  const cancelCountdown = #cancelCountdownBtn;
  const activateNow = #activateNowBtn;
  const cancelActive = #cancelActiveBtn;

  panicButton?.addEventListener('click', event => {
    event.preventDefault();
    const modal = #panicModal;
    toggleHidden(modal, false);
    captureLocation();
    startCountdown();
    logAuditEvent('Cuenta regresiva de panico iniciada', {
      countdown: getPreferences().countdownSeconds
    });
  });

  cancelCountdown?.addEventListener('click', () => {
    closeModal();
    showNotification('Alerta cancelada.', 'info');
    logAuditEvent('Cuenta regresiva de panico cancelada');
  });

  activateNow?.addEventListener('click', () => {
    activatePanic(true);
  });

  cancelActive?.addEventListener('click', () => {
    closeModal();
    showNotification('La alerta fue desactivada correctamente.', 'success');
    logAuditEvent('Alerta de panico desactivada');
  });
};
