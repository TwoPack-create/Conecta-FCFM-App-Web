import { $, $$, toggleHidden } from '../utils/dom.js';
import { showNotification } from './notifications.js';
import {
  registerUser,
  verifyRegistrationCode,
  loginUser,
  getPersistedSessionUser,
  getDemoCredentials
} from '../state/session.js';

const showStep = step => {
  const cards = $$('.auth-card');
  cards.forEach(card => {
    const shouldShow = card.dataset.authStep === step;
    toggleHidden(card, !shouldShow);
  });
};

export const initializeAuth = ({ onAuthenticated, onUserVerified, onLogout }) => {
  const layout = $('#authLayout');
  const registerForm = $('#registerForm');
  const verificationForm = $('#verificationForm');
  const loginForm = $('#loginForm');
  const demoLoginBtn = $('#demoLoginBtn');

  const verificationEmailInfo = $('#verificationEmailInfo');
  const verificationDevHint = $('#verificationDevHint');

  const stepButtons = document.querySelectorAll('[data-auth-target]');

  const handleAuthenticated = user => {
    toggleHidden(layout, true);
    onAuthenticated?.(user);
  };

  registerForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(registerForm);
    try {
      const code = registerUser({
        method: data.get('method'),
        name: data.get('name'),
        email: data.get('email'),
        password: data.get('password'),
        instructions: data.get('instructions')
      });
      showNotification('Te enviamos un codigo de verificacion a tu correo institucional.', 'success');
      if (verificationEmailInfo) {
        verificationEmailInfo.textContent = data.get('email');
      }
      if (verificationDevHint) {
        verificationDevHint.textContent = `Codigo temporal: ${code}`;
      }
      showStep('verify');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });

  verificationForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(verificationForm);
    try {
      const user = verifyRegistrationCode(data.get('code'));
      showNotification('Cuenta verificada. Ahora puedes iniciar sesion.', 'success');
      onUserVerified?.(user);
      const loginEmail = $('#loginEmail');
      if (loginEmail) {
        loginEmail.value = user.email;
      }
      showStep('login');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });

  loginForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(loginForm);
    try {
      const user = loginUser({
        email: data.get('email'),
        password: data.get('password')
      });
      showNotification('Bienvenido de vuelta a Conecta FCFM.', 'success');
      handleAuthenticated(user);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });

  stepButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      const target = button.getAttribute('data-auth-target');
      if (target) {
        showStep(target);
      }
    });
  });

  demoLoginBtn?.addEventListener('click', () => {
    try {
      const credentials = getDemoCredentials();
      if (loginForm) {
        loginForm.querySelector('[name="email"]').value = credentials.email;
        loginForm.querySelector('[name="password"]').value = credentials.password;
      }
      const user = loginUser(credentials);
      showNotification('Ingresaste con la cuenta demo.', 'success');
      handleAuthenticated(user);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });

  const persistedUser = getPersistedSessionUser();
  if (persistedUser) {
    handleAuthenticated(persistedUser);
    return;
  }

  toggleHidden(layout, false);
  showStep('login');
};
