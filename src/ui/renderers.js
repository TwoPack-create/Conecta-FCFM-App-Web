import { $, setText, setHTML, clearElement, toggleHidden } from '../utils/dom.js';

const starIcons = rating => {
  const maxStars = 5;
  const activeStars = Math.round(rating);
  return Array.from({ length: maxStars }, (_, index) => {
    const isActive = index < activeStars;
    return `<i class="${isActive ? 'fas fa-star' : 'far fa-star'}"></i>`;
  }).join('');
};

const updateBadge = (element, value) => {
  if (!element) return;
  element.textContent = value;
  toggleHidden(element, value === 0);
};

const renderDashboard = state => {
  const membersCount = state.users.length;
  const publicTripsCount = state.publicTransportTrips.length;
  const vehicleTripsCount = state.vehicleTrips.length;
  const myTripsCount = state.myTrips.active.length;
  const safetyReportsCount = state.safetyReports.length;
  const today = new Date().toISOString().split('T')[0];
  const publicTripsToday = state.publicTransportTrips.filter(trip => trip.date === today).length;
  const tripsToday = publicTripsToday + state.vehicleTrips.length;

  setText($('#memberCount'), membersCount.toLocaleString('es-CL'));
  setText($('#tripCount'), tripsToday.toLocaleString('es-CL'));

  updateBadge($('#badgePublicTrips'), publicTripsCount);
  updateBadge($('#badgeVehicleTrips'), vehicleTripsCount);
  updateBadge($('#badgeMyTrips'), myTripsCount);
  updateBadge($('#badgeSafetyReports'), safetyReportsCount);

  const activityContainer = $('#recentActivityList');
  if (!activityContainer) return;

  if (!state.recentActivity.length) {
    setHTML(
      activityContainer,
      '<p class="empty-state">Sin actividad reciente. Publica un viaje o comparte un reporte para comenzar.</p>'
    );
    return;
  }

  setHTML(
    activityContainer,
    state.recentActivity
      .map(
        activity => `
        <div class="activity-item">
          <i class="fas ${activity.icon}"></i>
          <div>
            <p><strong>${activity.message}</strong></p>
            <small>${activity.timeAgo}</small>
          </div>
        </div>
      `
      )
      .join('')
  );
};

const renderPublicTransportTrips = state => {
  const container = $('#publicTrips');
  if (!container) return;

  const filterMode = state.ui?.publicTransportFilter || '';
  const filteredTrips = filterMode
    ? state.publicTransportTrips.filter(trip => trip.mode === filterMode)
    : state.publicTransportTrips;

  if (!filteredTrips.length) {
    setHTML(
      container,
      '<p class="empty-state">No encontramos viajes con ese criterio. Ajusta el filtro o crea uno nuevo.</p>'
    );
    return;
  }

  setHTML(
    container,
    filteredTrips
      .map(
        trip => `
      <article class="trip-card card">
        <div class="card__body">
          <header class="trip-header">
            <span class="trip-mode ${trip.mode.toLowerCase()}">
              ${trip.line ? trip.line : trip.mode}
            </span>
            <span class="trip-time">${trip.time}</span>
          </header>
          <div class="trip-route">
            <p><strong>${trip.origin} -> ${trip.destination}</strong></p>
            <p class="trip-creator">
              Creado por ${trip.creatorName}
            </p>
          </div>
          <footer class="trip-info">
            <span class="spots">${trip.spots} cupos</span>
            <button class="btn btn--primary btn--sm" type="button" data-trip-join="${trip.id}" data-trip-type="public">
              Unirse
            </button>
          </footer>
        </div>
      </article>
    `
      )
      .join('')
  );
};

const renderVehicleTrips = state => {
  const container = $('#vehicleTrips');
  if (!container) return;

  const filter = state.ui?.vehicleFilter || '';
  const filteredTrips = filter
    ? state.vehicleTrips.filter(trip => trip.vehicleType === filter)
    : state.vehicleTrips;

  if (!filteredTrips.length) {
    setHTML(
      container,
      '<p class="empty-state">No hay viajes disponibles en vehiculo. Publica el tuyo para compartir.</p>'
    );
    return;
  }

  setHTML(
    container,
    filteredTrips
      .map(
        trip => `
      <article class="vehicle-trip-card card">
        <div class="card__body">
          <div class="driver-info">
            <div class="driver-avatar">
              <i class="fas fa-user"></i>
            </div>
            <div class="driver-details">
              <h4>${trip.driver}</h4>
              <div class="rating">
                ${starIcons(trip.driverRating)}
                <span>${trip.driverRating.toFixed(1)}</span>
              </div>
              <span class="vehicle-type">${trip.vehicleType}</span>
            </div>
          </div>
          <div class="trip-details">
            <div class="route">
              <p><strong>${trip.origin} -> ${trip.destination}</strong></p>
              <p class="route-desc">${trip.routeDescription}</p>
            </div>
            <div class="trip-meta">
              <span class="time">${trip.departureTime}</span>
              <span class="seats">${trip.seatsAvailable} asientos disponibles</span>
              <span class="donation">$${trip.donation.toLocaleString('es-CL')} donacion</span>
              <span class="date">${trip.date || 'Por coordinar'}</span>
            </div>
          </div>
          <button class="btn btn--primary btn--full-width" type="button" data-trip-request="${trip.id}" ${trip.seatsAvailable <= 0 ? 'disabled' : ''}>
            ${trip.seatsAvailable <= 0 ? 'Sin cupos' : 'Solicitar viaje'}
          </button>
        </div>
      </article>
    `
      )
      .join('')
  );
};

const renderMyTrips = state => {
  const activeContainer = $('#activeTrips');
  const completedContainer = $('#completedTrips');

  if (activeContainer) {
    if (!state.myTrips.active.length) {
      setHTML(activeContainer, '<p class="empty-state">No tienes viajes activos en este momento.</p>');
    } else {
      setHTML(
        activeContainer,
        state.myTrips.active
          .map(
            trip => `
          <article class="my-trip-card card">
            <div class="card__body">
              <div class="trip-status status--${trip.labelVariant}">${trip.label}</div>
              <h4>${trip.title}</h4>
              <p class="trip-time">${trip.datetime}</p>
              ${renderCompanions(trip.companions, 'Compania')}
              <div class="trip-actions">
                ${renderTripActions(trip)}
                <button class="btn btn--primary btn--sm" type="button" data-trip-complete="${trip.id}">Marcar completado</button>
              </div>
            </div>
          </article>
        `
          )
          .join('')
      );
    }
  }

  if (completedContainer) {
    if (!state.myTrips.completed.length) {
      setHTML(
        completedContainer,
        '<p class="empty-state">Aun no registras viajes terminados.</p>'
      );
    } else {
      setHTML(
        completedContainer,
        state.myTrips.completed
          .map(
            trip => `
          <article class="completed-trip-card card">
            <div class="card__body">
              <div class="trip-status status--${trip.labelVariant}">${trip.label}</div>
              <h4>${trip.title}</h4>
              <p class="trip-time">${trip.datetime}</p>
              ${renderCompanions(trip.companions, 'Companeros')}
              <div class="rating-section">
                <p>Califica tu experiencia:</p>
                <div class="star-rating" data-trip-id="${trip.id}">
                  ${Array.from({ length: 5 }, (_, index) => {
                    const value = index + 1;
                    const active = value <= (trip.rating || 0);
                    return `<span class="star${active ? ' active' : ''}" data-rating="${value}"><i class="fas fa-star"></i></span>`;
                  }).join('')}
                </div>
              </div>
            </div>
          </article>
        `
          )
          .join('')
      );
    }
  }
};

const severityLabel = severity => {
  if (severity === 'low') return 'Riesgo Bajo';
  if (severity === 'medium') return 'Riesgo Medio';
  return 'Riesgo Alto';
};

const reportTypeLabel = type => {
  switch (type) {
    case 'incident':
      return 'Incidente';
    case 'safe_route':
      return 'Ruta segura';
    default:
      return 'Ruta insegura';
  }
};

const renderSafetyReports = state => {
  const container = $('#safetyReports');
  if (!container) return;

  const typeFilter = state.ui?.routeTypeFilter || '';
  const riskFilter = state.ui?.routeRiskFilter || '';

  const filteredReports = state.safetyReports.filter(report => {
    const matchesType = typeFilter ? report.type === typeFilter : true;
    const matchesRisk = riskFilter ? report.severity === riskFilter : true;
    return matchesType && matchesRisk;
  });

  if (!filteredReports.length) {
    const message =
      typeFilter || riskFilter
        ? 'No se encontraron reportes con estos filtros.'
        : 'No se han reportado incidentes recientemente.';
    setHTML(container, `<p class="empty-state">${message}</p>`);
    return;
  }

  setHTML(
    container,
    filteredReports
      .map(report => {
        const votes = report.votes || { up: 0, down: 0 };
        return `
      <article class="safety-report-card card">
        <div class="card__body">
          <header class="report-header">
            <div class="report-tags">
              <span class="severity-badge ${report.severity}">${severityLabel(report.severity)}</span>
              <span class="report-type-badge ${report.type}">${reportTypeLabel(report.type)}</span>
            </div>
            <div class="report-meta">
              <span class="report-time">${report.time}</span>
              <span class="report-date">${new Date(report.date).toLocaleDateString('es-CL')}</span>
            </div>
          </header>
          <h4>${report.location}</h4>
          <p>${report.description}</p>
          <ul class="report-details">
            ${
              report.reporterName
                ? `<li><i class="fas fa-user-shield"></i> ${report.reporterName}</li>`
                : '<li><i class="fas fa-user-secret"></i> Reporte anonimo</li>'
            }
          </ul>
          <footer class="report-actions">
            <div class="report-votes">
              <button class="btn btn--vote" type="button" data-report-vote="up" data-report-id="${report.id}">
                <i class="fas fa-thumbs-up"></i> ${votes.up}
              </button>
              <button class="btn btn--vote" type="button" data-report-vote="down" data-report-id="${report.id}">
                <i class="fas fa-thumbs-down"></i> ${votes.down}
              </button>
            </div>
          </footer>
        </div>
      </article>
    `;
      })
      .join('')
  );
};

const renderProfile = state => {
  const { user } = state.session;
  setText($('#profileName'), user?.name || 'Usuario Demo');
  setText($('#profileEmail'), user?.email || 'estudiante@fcfm.uchile.cl');
  setText($('#profileTripsCount'), String(user?.tripsCompleted ?? 0));
  setText($('#profileRating'), user?.rating ? user.rating.toFixed(1) : 'N/A');
  setText($('#profileVerification'), user?.verified ? 'Verificado' : 'Pendiente');
  setText($('#profilePhone'), user?.phone || 'Sin registrar');
  setText($('#profileEmergencyContact'), user?.emergencyContact || 'Sin registrar');
  setText($('#profileBank'), user?.bankAccount || 'No registrada');
  const bioElement = $('#profileBio');
  if (bioElement) {
    bioElement.textContent =
      user?.bio?.trim() || 'Agrega una descripcion para que la comunidad te conozca mejor.';
  }

  const form = $('#profileForm');
  if (form && user) {
    form.querySelector('[name="name"]').value = user.name || '';
    form.querySelector('[name="phone"]').value = user.phone || '';
    form.querySelector('[name="emergencyContact"]').value = user.emergencyContact || '';
    form.querySelector('[name="bio"]').value = user.bio || '';
    const bankField = form.querySelector('[name="bankAccount"]');
    if (bankField) {
      bankField.value = user.bankAccount || '';
    }
  }
};

const renderOpsLog = state => {
  const container = $('#opsLogList');
  if (!container) return;

  const entries = state.auditLog.slice(0, 5);
  if (!entries.length) {
    container.innerHTML = '<p class="empty-state">Sin eventos registrados.</p>';
    return;
  }

  container.innerHTML = entries
    .map(
      entry => `
      <div class="ops-log__item">
        <strong>${entry.message}</strong>
        ${
          entry.meta && Object.keys(entry.meta).length
            ? `<small>Meta: ${JSON.stringify(entry.meta)}</small>`
            : ''
        }
        <small>${new Date(entry.timestamp).toLocaleString('es-CL')}</small>
      </div>
    `
    )
    .join('');
};

export const renderAll = state => {
  renderDashboard(state);
  renderPublicTransportTrips(state);
  renderVehicleTrips(state);
  renderMyTrips(state);
  renderSafetyReports(state);
  renderProfile(state);
  renderOpsLog(state);
};

const renderCompanions = (list, label) => {
  if (!list || !list.length) return '<span class="trip-companions-empty">Sin registros asociados</span>';
  return `<div class="trip-companions">
    <p><strong>${label}:</strong> ${list.join(', ')}</p>
  </div>`;
};

const renderTripActions = trip => {
  const actions = trip.actions || [];
  const actionTemplates = {
    chat: '<button class="btn btn--secondary btn--sm" type="button" data-trip-action="chat">Chat</button>',
    route: '<button class="btn btn--outline btn--sm" type="button" data-trip-action="route">Ver ruta</button>',
    contact: '<button class="btn btn--outline btn--sm" type="button" data-trip-action="contact">Contactar</button>',
    details: '<button class="btn btn--outline btn--sm" type="button" data-trip-action="details">Detalles</button>'
  };

  if (!actions.length) {
    return '<button class="btn btn--outline btn--sm" type="button" data-trip-action="details">Detalles</button>';
  }

  return actions
    .map(action => actionTemplates[action] || '')
    .filter(Boolean)
    .join('');
};
