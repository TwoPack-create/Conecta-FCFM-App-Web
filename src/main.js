import { getState, subscribe, setCurrentUser } from './state/app-state.js';
import { initializeNavigation, showSection } from './ui/navigation.js';
import { initializeTabs } from './ui/tabs.js';
import { initializeForms } from './ui/forms.js';
import { initializePublicTransport } from './ui/public-transport.js';
import { initializeVehicleModule } from './ui/vehicle.js';
import { initializeMyTripsModule } from './ui/my-trips.js';
import { initializeRoutesModule } from './ui/routes.js';
import { initializeOpsModule } from './ui/ops.js';
import { initializeRatings } from './ui/ratings.js';
import { initializePanicControls } from './ui/panic.js';
import { renderAll } from './ui/renderers.js';

let appInitialized = false;

const applySavedPreferences = () => {
  const theme = window.localStorage.getItem('conecta-fcfm.theme');
  if (theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
  }
};

const bootstrapApp = () => {
  if (appInitialized) {
    renderAll(getState());
    return;
  }
  appInitialized = true;
  subscribe(renderAll);
  renderAll(getState());
  initializeNavigation();
  initializeTabs();
  initializeForms();
  initializePublicTransport();
  initializeRoutesModule();
  initializeVehicleModule();
  initializeMyTripsModule();
  initializeRatings();
  initializeOpsModule();
  initializePanicControls();
  showSection('home');
};

document.addEventListener('DOMContentLoaded', () => {
  applySavedPreferences();
  const defaultUser = getState().users[0];
  if (defaultUser) {
    setCurrentUser(defaultUser);
  }
  bootstrapApp();
});
