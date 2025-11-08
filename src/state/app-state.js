import {
  metrics as initialMetrics,
  initialUsers,
  initialPublicTransportTrips,
  initialVehicleTrips,
  initialSafetyReports,
  initialRecentActivity,
  initialMyTrips,
  metroLines,
  defaultPanicSettings
} from '../data/mock-data.js';
import { updateStoredUser } from './session.js';

const clone = value => JSON.parse(JSON.stringify(value));

const createDefaultPreferences = () => ({
  theme: 'light',
  language: 'es',
  notifyEmail: true,
  notifyPush: false,
  panic: clone(defaultPanicSettings)
});

const mergePreferences = (overrides = {}) => {
  const base = createDefaultPreferences();
  const panicOverrides = overrides.panic || {};
  return {
    ...base,
    ...overrides,
    panic: {
      ...base.panic,
      ...panicOverrides,
      alertContacts: {
        ...base.panic.alertContacts,
        ...(panicOverrides.alertContacts || {})
      }
    }
  };
};

const state = {
  metrics: { ...initialMetrics },
  users: clone(initialUsers),
  publicTransportTrips: clone(initialPublicTransportTrips),
  vehicleTrips: clone(initialVehicleTrips),
  safetyReports: clone(initialSafetyReports),
  recentActivity: clone(initialRecentActivity),
  myTrips: clone(initialMyTrips),
  metroLines: [...metroLines],
  session: {
    user: null,
    preferences: createDefaultPreferences()
  },
  ui: {
    publicTransportFilter: '',
    vehicleFilter: '',
    routeTypeFilter: '',
    routeRiskFilter: ''
  },
  auditLog: []
};

const listeners = new Set();

export const getState = () => state;

export const subscribe = listener => {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
};

const notify = () => {
  listeners.forEach(listener => listener(state));
};

export const logAuditEvent = (message, meta = {}) => {
  state.auditLog.unshift({
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    message,
    meta
  });
  if (state.auditLog.length > 25) {
    state.auditLog.length = 25;
  }
  notify();
};

const appendActivity = activity => {
  state.recentActivity.unshift(activity);
  const maxActivityLength = 8;
  if (state.recentActivity.length > maxActivityLength) {
    state.recentActivity.length = maxActivityLength;
  }
};

export const setCurrentUser = user => {
  if (!user) {
    state.session.user = null;
    state.session.preferences = createDefaultPreferences();
    logAuditEvent('Sesion cerrada');
    notify();
    return;
  }

  const mergedPreferences = mergePreferences(user.preferences || {});
  state.session.user = { ...user, preferences: mergedPreferences };
  state.session.preferences = mergedPreferences;
  document.documentElement.setAttribute(
    'data-color-scheme',
    mergedPreferences.theme === 'dark' ? 'dark' : 'light'
  );
  window.localStorage.setItem('conecta-fcfm.theme', mergedPreferences.theme);
  logAuditEvent('Sesion iniciada', { email: user.email });
  notify();
};

export const addRegisteredUser = user => {
  const normalizedUser = {
    ...user,
    preferences: mergePreferences(user.preferences || {})
  };
  state.users.push(normalizedUser);
  notify();
};

export const updateCurrentUser = patch => {
  if (!state.session.user) return;
  state.session.user = { ...state.session.user, ...patch };
  const idx = state.users.findIndex(u => u.email === state.session.user.email);
  if (idx >= 0) {
    state.users[idx] = { ...state.users[idx], ...patch };
  }
  notify();
};

export const addPublicTransportTrip = trip => {
  state.publicTransportTrips.unshift(trip);
  appendActivity({
    id: `activity-${Date.now()}`,
    icon: trip.mode === 'Metro' ? 'fa-subway' : trip.mode === 'Micro' ? 'fa-bus' : 'fa-walking',
    message: `${trip.creatorName} publico un viaje ${trip.mode === 'A pie' ? 'a pie' : `en ${trip.mode}`}`,
    timeAgo: 'Hace unos segundos'
  });
  state.metrics.tripsToday = (state.metrics.tripsToday || 0) + 1;
  logAuditEvent('Nuevo viaje en transporte publico', {
    mode: trip.mode,
    origin: trip.origin,
    destination: trip.destination
  });
  notify();
};

export const addVehicleTrip = trip => {
  state.vehicleTrips.unshift(trip);
  appendActivity({
    id: `activity-${Date.now()}`,
    icon: 'fa-car',
    message: `${trip.driver} publico un viaje en vehiculo hacia ${trip.destination}`,
    timeAgo: 'Hace unos segundos'
  });
  state.metrics.tripsToday = (state.metrics.tripsToday || 0) + 1;
  logAuditEvent('Nuevo viaje en vehiculo publicado', {
    driver: trip.driver,
    destination: trip.destination
  });
  notify();
};

export const addSafetyReport = report => {
  state.safetyReports.unshift(report);
  appendActivity({
    id: `activity-${Date.now()}`,
    icon: 'fa-shield-alt',
    message: `${report.reporterName || 'Un miembro'} reporto ${report.type === 'safe_route' ? 'una ruta segura' : 'un incidente'}`,
    timeAgo: 'Hace unos segundos'
  });
  logAuditEvent('Reporte de seguridad creado', {
    type: report.type,
    severity: report.severity,
    location: report.location
  });
  notify();
};

export const voteSafetyReport = (reportId, direction = 'up') => {
  const report = state.safetyReports.find(item => item.id === reportId);
  if (!report) return;

  if (!report.votes) {
    report.votes = { up: 0, down: 0 };
  }

  if (direction === 'down') {
    report.votes.down += 1;
  } else {
    report.votes.up += 1;
  }

  logAuditEvent('Voto registrado en reporte', {
    reportId,
    direction
  });
  notify();
};

export const joinPublicTransportTrip = tripId => {
  const currentUser = state.session.user;
  if (!currentUser) {
    throw new Error('Debes iniciar sesion para unirte a un viaje.');
  }

  const trip = state.publicTransportTrips.find(item => item.id === tripId);
  if (!trip) {
    throw new Error('No encontramos el viaje seleccionado.');
  }

  if (trip.spots <= 0) {
    throw new Error('No hay cupos disponibles en este viaje.');
  }

  trip.spots -= 1;

  const entryId = `public-${trip.id}`;
  const alreadyJoined = state.myTrips.active.some(item => item.id === entryId);
  if (!alreadyJoined) {
    state.myTrips.active.unshift({
      id: entryId,
      label: 'Reservado',
      labelVariant: 'info',
      title: `${trip.mode} ${trip.origin} -> ${trip.destination}`,
      datetime: `${trip.date || 'Hoy'} ${trip.time}`,
      companions: [`Organizador: ${trip.creatorName}`],
      actions: ['chat', 'details']
    });
  }

  appendActivity({
    id: `activity-${Date.now()}`,
    icon: trip.mode === 'Metro' ? 'fa-subway' : trip.mode === 'Micro' ? 'fa-bus' : 'fa-walking',
    message: `${currentUser.name || currentUser.email} se unio a un viaje ${trip.mode}`,
    timeAgo: 'Hace unos segundos'
  });

  logAuditEvent('Solicitud para unirse a viaje publico', {
    user: currentUser.email,
    tripId,
    mode: trip.mode
  });

  notify();
};

export const addMyTrip = trip => {
  state.myTrips.active.unshift(trip);
  notify();
};

export const requestVehicleTrip = tripId => {
  const currentUser = state.session.user;
  if (!currentUser) {
    throw new Error('Debes iniciar sesion para solicitar un viaje.');
  }

  const trip = state.vehicleTrips.find(item => item.id === tripId);
  if (!trip) {
    throw new Error('No encontramos la publicacion seleccionada.');
  }

  if (trip.seatsAvailable <= 0) {
    throw new Error('Este viaje ya no tiene asientos disponibles.');
  }

  trip.seatsAvailable -= 1;

  const entryId = `vehicle-${trip.id}`;
  const alreadyJoined = state.myTrips.active.some(item => item.id === entryId);
  if (!alreadyJoined) {
    state.myTrips.active.unshift({
      id: entryId,
      label: 'Pendiente',
      labelVariant: 'warning',
      title: `${trip.vehicleType} ${trip.origin} -> ${trip.destination}`,
      datetime: `${trip.date || 'Hoy'} ${trip.departureTime}`,
      companions: [`Conductor: ${trip.driver}`],
      actions: ['contact', 'route', 'chat']
    });
  }

  appendActivity({
    id: `activity-${Date.now()}`,
    icon: 'fa-car',
    message: `${currentUser.name || currentUser.email} solicito un viaje en vehiculo`,
    timeAgo: 'Hace unos segundos'
  });
  logAuditEvent('Solicitud de viaje en vehiculo', {
    user: currentUser.email,
    tripId,
    destination: trip.destination
  });

  notify();
};

export const completeMyTrip = tripId => {
  const tripIndex = state.myTrips.active.findIndex(trip => trip.id === tripId);
  if (tripIndex === -1) return;
  const [trip] = state.myTrips.active.splice(tripIndex, 1);
  state.myTrips.completed.unshift({
    ...trip,
    label: 'Completado',
    labelVariant: 'success',
    rating: 0
  });
  notify();
};

export const updateMetrics = patch => {
  state.metrics = { ...state.metrics, ...patch };
  notify();
};

export const updatePreferences = patch => {
  const current = state.session.preferences || createDefaultPreferences();
  const merged = mergePreferences({
    ...current,
    ...patch,
    panic: {
      ...current.panic,
      ...(patch.panic || {}),
      alertContacts: {
        ...current.panic.alertContacts,
        ...(patch.panic?.alertContacts || {})
      }
    }
  });

  state.session.preferences = merged;

  if (state.session.user) {
    state.session.user = { ...state.session.user, preferences: merged };
    const idx = state.users.findIndex(user => user.email === state.session.user.email);
    if (idx >= 0) {
      state.users[idx] = { ...state.users[idx], preferences: merged };
    }
    updateStoredUser({
      email: state.session.user.email,
      preferences: merged
    });
  }

  document.documentElement.setAttribute(
    'data-color-scheme',
    merged.theme === 'dark' ? 'dark' : 'light'
  );
  window.localStorage.setItem('conecta-fcfm.theme', merged.theme);
  logAuditEvent('Preferencias actualizadas', Object.keys(patch));

  notify();
};

export const setTheme = theme => {
  state.session.preferences.theme = theme;
  notify();
};

export const setLanguage = language => {
  state.session.preferences.language = language;
  notify();
};

export const getMetroLines = () => state.metroLines;

export const setPublicTransportFilter = filter => {
  state.ui.publicTransportFilter = filter || '';
  notify();
};

export const setVehicleFilter = filter => {
  state.ui.vehicleFilter = filter || '';
  notify();
};

export const setRouteTypeFilter = filter => {
  state.ui.routeTypeFilter = filter || '';
  notify();
};

export const setRouteRiskFilter = filter => {
  state.ui.routeRiskFilter = filter || '';
  notify();
};

export const completeTrip = tripId => {
  const tripIndex = state.myTrips.active.findIndex(trip => trip.id === tripId);
  if (tripIndex === -1) {
    return;
  }
  const [trip] = state.myTrips.active.splice(tripIndex, 1);
  state.myTrips.completed.unshift({
    ...trip,
    label: 'Completado',
    labelVariant: 'success',
    rating: trip.rating || 0
  });
  logAuditEvent('Viaje marcado como completado', { tripId });
  notify();
};

export const rateCompletedTrip = (tripId, rating) => {
  const parsed = Math.max(1, Math.min(5, rating));
  const trip = state.myTrips.completed.find(item => item.id === tripId);
  if (!trip) return;
  trip.rating = parsed;
  appendActivity({
    id: `activity-${Date.now()}`,
    icon: 'fa-star',
    message: 'Gracias por calificar tu viaje completado.',
    timeAgo: 'Hace unos segundos'
  });
  logAuditEvent('Calificacion registrada para viaje', { tripId, rating: parsed });
  notify();
};

