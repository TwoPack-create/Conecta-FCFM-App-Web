// Conecta FCFM - Main JavaScript File

// App Data
const appData = {
  users: [
    {
      id: 1,
      name: "María González",
      email: "mgonzalez@ing.uchile.cl",
      rating: 4.8,
      verified: true,
      photo: "avatar1.jpg",
      trips_completed: 45
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "crodriguez@fcfm.uchile.cl",
      rating: 4.9,
      verified: true,
      photo: "avatar2.jpg",
      trips_completed: 67
    },
    {
      id: 3,
      name: "Ana Martínez",
      email: "amartinez@ing.uchile.cl",
      rating: 4.7,
      verified: true,
      photo: "avatar3.jpg",
      trips_completed: 23
    }
  ],
  publicTransportTrips: [
    {
      id: 1,
      creator: "María González",
      mode: "Metro",
      line: "Línea 4",
      station: "Universidad de Chile",
      direction: "Puente Alto",
      origin: "Metro U. de Chile",
      destination: "FCFM Beauchef",
      time: "14:30",
      spots: 3,
      date: "2024-09-13"
    },
    {
      id: 2,
      creator: "Carlos Rodríguez",
      mode: "Micro",
      line: "B16",
      station: "Paradero FCFM",
      direction: "Centro",
      origin: "FCFM",
      destination: "Metro Baquedano",
      time: "18:15",
      spots: 2,
      date: "2024-09-13"
    }
  ],
  vehicleTrips: [
    {
      id: 1,
      driver: "Ana Martínez",
      vehicle_type: "Automóvil",
      origin: "Providencia",
      destination: "FCFM",
      departure_time: "08:00",
      seats_available: 2,
      donation: 1500,
      route: "Av. Providencia - Av. Vicuña Mackenna - Av. Beauchef",
      driver_rating: 4.7
    },
    {
      id: 2,
      driver: "Carlos Rodríguez",
      vehicle_type: "Automóvil",
      origin: "FCFM",
      destination: "Maipú",
      departure_time: "16:45",
      seats_available: 3,
      donation: 2000,
      route: "Av. Beauchef - Alameda - Av. Pajaritos",
      driver_rating: 4.9
    }
  ],
  safetyReports: [
    {
      id: 1,
      type: "unsafe_route",
      location: "Estación Universidad de Chile - Salida Norte",
      time: "22:30",
      description: "Zona poco iluminada, presencia de personas sospechosas",
      severity: "medium",
      date: "2024-09-12"
    },
    {
      id: 2,
      type: "incident",
      location: "Paradero B16 frente a FCFM",
      time: "19:45",
      description: "Intento de robo a estudiante esperando micro",
      severity: "high",
      date: "2024-09-11"
    }
  ],
  metroLines: [
    "Línea 1 - Roja",
    "Línea 2 - Amarilla", 
    "Línea 3 - Café",
    "Línea 4 - Azul",
    "Línea 4A - Celeste",
    "Línea 5 - Verde",
    "Línea 6 - Morada"
  ]
};

// Global variables
let currentSection = 'home';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeApp();
});

function initializeApp() {
  try {
    initializeNavigation();
    initializeDarkMode();
    initializeForms();
    initializeStarRating();
    initializeFilters();
    populateMetroLines();
    renderInitialData();
    showSection('home');
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

function initializeNavigation() {
  console.log('Initializing navigation...');
  
  // Menu toggle functionality
  const menuToggle = document.getElementById('menuToggle');
  const sideNav = document.getElementById('sideNav');
  const overlay = document.getElementById('overlay');
  const closeNav = document.getElementById('closeNav');

  if (menuToggle && sideNav && overlay && closeNav) {
    menuToggle.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Menu toggle clicked');
      openMenu();
    });

    closeNav.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Close nav clicked');
      closeMenu();
    });

    overlay.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Overlay clicked');
      closeMenu();
    });
  }

  // Navigation links
  const navLinks = document.querySelectorAll('[data-section]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const section = this.getAttribute('data-section');
      console.log('Navigation to section:', section);
      showSection(section);
      closeMenu();
    });
  });

  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const tabId = this.getAttribute('data-tab');
      console.log('Tab switch to:', tabId);
      switchTab(this, tabId);
    });
  });

  // Panic button
  const panicBtn = document.getElementById('panicBtn');
  if (panicBtn) {
    panicBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Panic button clicked');
      activatePanicMode();
    });
  }

  // Cancel panic button
  const cancelPanic = document.getElementById('cancelPanic');
  if (cancelPanic) {
    cancelPanic.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Cancel panic clicked');
      closePanicModal();
    });
  }

  console.log('Navigation initialized');
}

function openMenu() {
  const sideNav = document.getElementById('sideNav');
  const overlay = document.getElementById('overlay');
  
  if (sideNav && overlay) {
    sideNav.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('Menu opened');
  }
}

function closeMenu() {
  const sideNav = document.getElementById('sideNav');
  const overlay = document.getElementById('overlay');
  
  if (sideNav && overlay) {
    sideNav.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    console.log('Menu closed');
  }
}

function showSection(sectionId) {
  console.log('Showing section:', sectionId);
  
  // Hide all sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

  // Show target section
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.add('active');
    currentSection = sectionId;
    console.log('Section activated:', sectionId);
  } else {
    console.error('Section not found:', sectionId);
  }

  // Update navigation active state
  const navLinks = document.querySelectorAll('[data-section]');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-section') === sectionId) {
      link.classList.add('active');
    }
  });
}

function switchTab(tabBtn, tabId) {
  const tabContainer = tabBtn.closest('.container') || tabBtn.closest('.section');
  
  if (!tabContainer) {
    console.error('Tab container not found');
    return;
  }
  
  // Remove active class from all tab buttons in this container
  const containerTabBtns = tabContainer.querySelectorAll('.tab-btn');
  containerTabBtns.forEach(btn => btn.classList.remove('active'));
  
  // Add active class to clicked tab
  tabBtn.classList.add('active');

  // Hide all tab content in this container
  const tabContents = tabContainer.querySelectorAll('.tab-content');
  tabContents.forEach(content => content.classList.remove('active'));

  // Show target tab content
  const targetContent = document.getElementById(tabId);
  if (targetContent) {
    targetContent.classList.add('active');
    console.log('Tab activated:', tabId);
  } else {
    console.error('Tab content not found:', tabId);
  }
}

function activatePanicMode() {
  const panicModal = document.getElementById('panicModal');
  if (panicModal) {
    panicModal.classList.remove('hidden');
    console.log('🚨 PANIC BUTTON ACTIVATED');
    showNotification('Alerta de emergencia enviada', 'error');
  }
}

function closePanicModal() {
  const panicModal = document.getElementById('panicModal');
  if (panicModal) {
    panicModal.classList.add('hidden');
    showNotification('Alerta cancelada', 'info');
  }
}

function initializeDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (!darkModeToggle) return;

  // Check for saved preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-color-scheme', currentTheme);
  darkModeToggle.checked = currentTheme === 'dark';

  darkModeToggle.addEventListener('change', function() {
    const theme = this.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', theme);
    localStorage.setItem('theme', theme);
    showNotification(`Modo ${theme === 'dark' ? 'oscuro' : 'claro'} activado`, 'info');
  });
}

function populateMetroLines() {
  const metroLineSelect = document.querySelector('[name="line"]');
  if (metroLineSelect) {
    appData.metroLines.forEach(line => {
      const option = document.createElement('option');
      option.value = line;
      option.textContent = line;
      metroLineSelect.appendChild(option);
    });
  }
}

function initializeForms() {
  // Public transport form
  const publicTripForm = document.getElementById('publicTripForm');
  if (publicTripForm) {
    publicTripForm.addEventListener('submit', handlePublicTripSubmit);
    
    // Show/hide metro line field based on transport mode
    const modeSelect = publicTripForm.querySelector('[name="mode"]');
    if (modeSelect) {
      modeSelect.addEventListener('change', function() {
        const metroLineGroup = document.getElementById('metroLineGroup');
        if (this.value === 'Metro') {
          metroLineGroup.style.display = 'block';
          metroLineGroup.querySelector('select').required = true;
        } else {
          metroLineGroup.style.display = 'none';
          metroLineGroup.querySelector('select').required = false;
        }
      });
    }
  }

  // Vehicle trip form
  const vehicleTripForm = document.getElementById('vehicleTripForm');
  if (vehicleTripForm) {
    vehicleTripForm.addEventListener('submit', handleVehicleTripSubmit);
  }

  // Safety report form
  const safetyReportForm = document.getElementById('safetyReportForm');
  if (safetyReportForm) {
    safetyReportForm.addEventListener('submit', handleSafetyReportSubmit);
  }
}

function handlePublicTripSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const tripData = {
    id: Date.now(),
    creator: "Usuario Demo",
    mode: formData.get('mode'),
    line: formData.get('line'),
    station: formData.get('station'),
    origin: formData.get('origin'),
    destination: formData.get('destination'),
    time: formData.get('time'),
    spots: parseInt(formData.get('spots')),
    date: new Date().toISOString().split('T')[0]
  };

  // Add to data
  appData.publicTransportTrips.unshift(tripData);
  
  // Update UI
  renderPublicTrips();
  
  // Reset form and switch to trips view
  e.target.reset();
  const modeSelect = e.target.querySelector('[name="mode"]');
  if (modeSelect) {
    modeSelect.dispatchEvent(new Event('change'));
  }
  
  // Switch to trips tab
  const tripsTab = document.querySelector('[data-tab="viajes-publicos"]');
  if (tripsTab) {
    switchTab(tripsTab, 'viajes-publicos');
  }
  
  showNotification('Viaje publicado exitosamente', 'success');
}

function handleVehicleTripSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const tripData = {
    id: Date.now(),
    driver: "Usuario Demo",
    vehicle_type: formData.get('vehicleType'),
    origin: formData.get('origin'),
    destination: formData.get('destination'),
    departure_time: formData.get('time'),
    seats_available: parseInt(formData.get('seats')),
    donation: parseInt(formData.get('donation')) || 0,
    route: formData.get('route'),
    driver_rating: 4.5
  };

  // Add to data
  appData.vehicleTrips.unshift(tripData);
  
  // Update UI
  renderVehicleTrips();
  
  // Reset form and switch to trips view
  e.target.reset();
  
  // Switch to trips tab
  const tripsTab = document.querySelector('[data-tab="viajes-vehiculo"]');
  if (tripsTab) {
    switchTab(tripsTab, 'viajes-vehiculo');
  }
  
  showNotification('Viaje de vehículo publicado exitosamente', 'success');
}

function handleSafetyReportSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const reportData = {
    id: Date.now(),
    type: formData.get('type'),
    location: formData.get('location'),
    time: formData.get('time'),
    description: formData.get('description'),
    severity: formData.get('severity'),
    date: new Date().toISOString().split('T')[0],
    anonymous: formData.get('anonymous') === 'on'
  };

  // Add to data
  appData.safetyReports.unshift(reportData);
  
  // Update UI
  renderSafetyReports();
  
  // Reset form and switch to reports view
  e.target.reset();
  
  // Switch to reports tab
  const reportsTab = document.querySelector('[data-tab="reportes-seguridad"]');
  if (reportsTab) {
    switchTab(reportsTab, 'reportes-seguridad');
  }
  
  showNotification('Reporte de seguridad enviado', 'success');
}

function renderPublicTrips() {
  const container = document.getElementById('publicTrips');
  if (!container) return;

  container.innerHTML = appData.publicTransportTrips.map(trip => `
    <div class="trip-card card">
      <div class="card__body">
        <div class="trip-header">
          <span class="trip-mode ${trip.mode.toLowerCase()}">${trip.line ? trip.line : trip.mode}</span>
          <span class="trip-time">${trip.time}</span>
        </div>
        <div class="trip-route">
          <p><strong>${trip.origin} → ${trip.destination}</strong></p>
          <p class="trip-creator">Creado por ${trip.creator} ${trip.creator !== 'Usuario Demo' ? '⭐ 4.8' : ''}</p>
        </div>
        <div class="trip-info">
          <span class="spots">${trip.spots} cupos</span>
          <button class="btn btn--primary btn--sm" onclick="joinTrip(${trip.id}, 'public')">Unirse</button>
        </div>
      </div>
    </div>
  `).join('');
}

function renderVehicleTrips() {
  const container = document.getElementById('vehicleTrips');
  if (!container) return;

  container.innerHTML = appData.vehicleTrips.map(trip => `
    <div class="vehicle-trip-card card">
      <div class="card__body">
        <div class="driver-info">
          <div class="driver-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="driver-details">
            <h4>${trip.driver}</h4>
            <div class="rating">
              <span>${'⭐'.repeat(Math.floor(trip.driver_rating))}</span>
              <span>${trip.driver_rating} (${Math.floor(Math.random() * 50) + 10} viajes)</span>
            </div>
            <span class="vehicle-type">${trip.vehicle_type === 'Automóvil' ? '🚗' : '🏍️'} ${trip.vehicle_type}</span>
          </div>
        </div>
        <div class="trip-details">
          <div class="route">
            <p><strong>${trip.origin} → ${trip.destination}</strong></p>
            <p class="route-desc">${trip.route}</p>
          </div>
          <div class="trip-meta">
            <span class="time">${trip.departure_time}</span>
            <span class="seats">${trip.seats_available} asientos</span>
            <span class="donation">$${trip.donation.toLocaleString()} donación</span>
          </div>
        </div>
        <button class="btn btn--primary btn--full-width" onclick="joinTrip(${trip.id}, 'vehicle')">Solicitar Viaje</button>
      </div>
    </div>
  `).join('');
}

function renderSafetyReports() {
  const container = document.querySelector('.safety-reports');
  if (!container) return;

  container.innerHTML = appData.safetyReports.map(report => `
    <div class="safety-report-card card">
      <div class="card__body">
        <div class="report-header">
          <span class="severity-badge ${report.severity}">
            ${report.severity === 'low' ? 'Riesgo Bajo' : 
              report.severity === 'medium' ? 'Riesgo Medio' : 'Riesgo Alto'}
          </span>
          <span class="report-time">${report.time}</span>
        </div>
        <h4>${report.location}</h4>
        <p>${report.description}</p>
        <small>Reportado el ${formatDate(report.date)}</small>
      </div>
    </div>
  `).join('');
}

function renderInitialData() {
  renderPublicTrips();
  renderVehicleTrips();
  renderSafetyReports();
}

function joinTrip(tripId, tripType) {
  showNotification(`Solicitud enviada para unirse al viaje`, 'success');
  console.log(`Joining ${tripType} trip with ID: ${tripId}`);
}

function initializeStarRating() {
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('star')) {
      const rating = parseInt(e.target.getAttribute('data-rating'));
      const starContainer = e.target.closest('.star-rating');
      const stars = starContainer.querySelectorAll('.star');
      
      // Reset all stars
      stars.forEach(star => star.classList.remove('active'));
      
      // Activate stars up to the selected rating
      for (let i = 0; i < rating; i++) {
        stars[i].classList.add('active');
      }
      
      showNotification(`Calificación: ${rating} estrella${rating > 1 ? 's' : ''}`, 'info');
    }
  });
}

function initializeFilters() {
  const filterMode = document.getElementById('filterMode');
  if (filterMode) {
    filterMode.addEventListener('change', function() {
      filterPublicTrips(this.value);
    });
  }
}

function filterPublicTrips(mode) {
  const filteredTrips = mode ? 
    appData.publicTransportTrips.filter(trip => trip.mode === mode) :
    appData.publicTransportTrips;

  const container = document.getElementById('publicTrips');
  if (!container) return;

  container.innerHTML = filteredTrips.map(trip => `
    <div class="trip-card card">
      <div class="card__body">
        <div class="trip-header">
          <span class="trip-mode ${trip.mode.toLowerCase()}">${trip.line ? trip.line : trip.mode}</span>
          <span class="trip-time">${trip.time}</span>
        </div>
        <div class="trip-route">
          <p><strong>${trip.origin} → ${trip.destination}</strong></p>
          <p class="trip-creator">Creado por ${trip.creator} ${trip.creator !== 'Usuario Demo' ? '⭐ 4.8' : ''}</p>
        </div>
        <div class="trip-info">
          <span class="spots">${trip.spots} cupos</span>
          <button class="btn btn--primary btn--sm" onclick="joinTrip(${trip.id}, 'public')">Unirse</button>
        </div>
      </div>
    </div>
  `).join('');
}

function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification status--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 3000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  // Set background color based on type
  switch(type) {
    case 'success':
      notification.style.backgroundColor = 'var(--color-success)';
      break;
    case 'error':
      notification.style.backgroundColor = 'var(--color-error)';
      break;
    case 'warning':
      notification.style.backgroundColor = 'var(--color-warning)';
      break;
    default:
      notification.style.backgroundColor = 'var(--color-info)';
  }
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  // ESC key closes menu or modal
  if (e.key === 'Escape') {
    const sideNav = document.getElementById('sideNav');
    const panicModal = document.getElementById('panicModal');
    
    if (sideNav && sideNav.classList.contains('open')) {
      closeMenu();
    }
    if (panicModal && !panicModal.classList.contains('hidden')) {
      closePanicModal();
    }
  }
});

// Prevent default behavior for demo links
document.addEventListener('click', function(e) {
  const link = e.target.closest('a');
  if (link && link.getAttribute('href') === '#') {
    e.preventDefault();
  }
});

// Export functions for global access
window.joinTrip = joinTrip;
window.switchTab = switchTab;