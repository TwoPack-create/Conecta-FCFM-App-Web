import { ALLOWED_EMAIL_DOMAINS, defaultPanicSettings } from '../data/mock-data.js';

const cloneValue = value => JSON.parse(JSON.stringify(value));

const createDefaultPreferences = () => ({
  theme: 'light',
  language: 'es',
  notifyEmail: true,
  notifyPush: false,
  panic: cloneValue(defaultPanicSettings)
});

const USERS_KEY = 'conecta-fcfm.users';
const SESSION_KEY = 'conecta-fcfm.session';
const REGISTRATION_TIMEOUT_MINUTES = 30;

let pendingRegistration = null;

const DEMO_USER = {
  id: 'user-demo',
  method: 'correo',
  name: 'Usuario Demo',
  email: 'demo@ing.uchile.cl',
  password: 'demo1234',
  instructions: 'Acceso de demostracion',
  verificationCode: null,
  registrationTimestamp: Date.now(),
  verified: true,
  rating: 4.6,
  tripsCompleted: 18,
  phone: '+56 9 1111 1111',
  emergencyContact: 'Seguridad FCFM - +56 2 2978 4000',
  bio: 'Cuenta demo para explorar Conecta FCFM.',
  bankAccount: 'Banco Itau - CTA 44 555 666-8',
  preferences: createDefaultPreferences()
};

const loadFromStorage = key => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error(`No se pudo leer ${key} desde localStorage`, error);
    return null;
  }
};

const saveToStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`No se pudo guardar ${key} en localStorage`, error);
  }
};

const getUsers = () => loadFromStorage(USERS_KEY) || [];

const saveUsers = users => saveToStorage(USERS_KEY, users);

const sanitizeUser = user => {
  if (!user) return null;
  const { password, verificationCode, registrationTimestamp, ...safeUser } = user;
  return safeUser;
};

const isInstitutionalDomain = email => {
  const [, domain] = email.split('@');
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
};

const generateVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const seedDemoUser = () => {
  const users = getUsers();
  const exists = users.some(user => user.email === DEMO_USER.email);
  if (!exists) {
    users.push({
      ...DEMO_USER,
      preferences: createDefaultPreferences()
    });
    saveUsers(users);
  }
};

seedDemoUser();

export const registerUser = ({ method, name, email, password, instructions }) => {
  if (!email || !password || !name) {
    throw new Error('Todos los campos son obligatorios.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isInstitutionalDomain(normalizedEmail)) {
    throw new Error('Debes utilizar un correo institucional valido.');
  }

  const users = getUsers();
  const exists = users.some(user => user.email === normalizedEmail);
  if (exists) {
    throw new Error('Ya existe una cuenta registrada con este correo.');
  }

  const verificationCode = generateVerificationCode();
  pendingRegistration = {
    id: `user-${Date.now()}`,
    method,
    name: name.trim(),
    email: normalizedEmail,
    password,
    instructions: instructions?.trim() || '',
    verificationCode,
    registrationTimestamp: Date.now(),
    verified: false,
    rating: 0,
    tripsCompleted: 0,
    phone: '',
    emergencyContact: '',
    bio: '',
    bankAccount: '',
    preferences: createDefaultPreferences()
  };

  return verificationCode;
};

export const verifyRegistrationCode = code => {
  if (!pendingRegistration) {
    throw new Error('No hay un registro pendiente.');
  }

  const now = Date.now();
  const expired =
    now - pendingRegistration.registrationTimestamp >
    REGISTRATION_TIMEOUT_MINUTES * 60 * 1000;

  if (expired) {
    pendingRegistration = null;
    throw new Error('El codigo de verificacion ha expirado. Intenta registrarte nuevamente.');
  }

  if (pendingRegistration.verificationCode !== code.trim()) {
    throw new Error('El codigo ingresado no es correcto.');
  }

  const userRecord = {
    ...pendingRegistration,
    verified: true,
    verificationCode: null
  };

  const users = getUsers();
  users.push(userRecord);
  saveUsers(users);

  const verifiedUser = sanitizeUser(userRecord);
  pendingRegistration = null;
  return verifiedUser;
};

export const loginUser = ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Ingresa tus credenciales.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const userRecord = users.find(
    user => user.email === normalizedEmail && user.password === password
  );

  if (!userRecord) {
    throw new Error('Credenciales invalidas o usuario no registrado.');
  }

  if (!userRecord.verified) {
    throw new Error('Debes completar la verificacion antes de iniciar sesion.');
  }

  const sessionUser = sanitizeUser(userRecord);
  saveToStorage(SESSION_KEY, { email: sessionUser.email });
  return sessionUser;
};

export const logoutUser = () => {
  window.localStorage.removeItem(SESSION_KEY);
};

export const getPersistedSessionUser = () => {
  const session = loadFromStorage(SESSION_KEY);
  if (!session?.email) {
    return null;
  }
  const users = getUsers();
  const user = users.find(storedUser => storedUser.email === session.email);
  return sanitizeUser(user);
};

export const updateStoredUser = patch => {
  if (!patch?.email) return;
  const users = getUsers();
  const index = users.findIndex(user => user.email === patch.email);
  if (index === -1) return;
  users[index] = { ...users[index], ...patch };
  saveUsers(users);
};

export const hasPendingRegistration = () => Boolean(pendingRegistration);

export const getPendingRegistrationEmail = () => pendingRegistration?.email ?? null;

export const getDemoCredentials = () => ({
  email: DEMO_USER.email,
  password: DEMO_USER.password
});
