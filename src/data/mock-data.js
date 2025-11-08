export const ALLOWED_EMAIL_DOMAINS = [
  'ug.uchile.cl',
  'ing.uchile.cl',
  'uchile.cl',
  'idiem.cl'
];

export const metrics = {
  members: 10247,
  tripsToday: 156
};

export const initialUsers = [
  {
    id: 'user-1',
    name: 'Maria Gonzalez',
    email: 'mgonzalez@ing.uchile.cl',
    rating: 4.8,
    verified: true,
    photo: 'avatar1.jpg',
    tripsCompleted: 45,
    phone: '+56 9 5555 1111',
    emergencyContact: 'Hermana - +56 9 5555 0001',
    bio: 'Estudiante de Ing. Industrial, fan de coordinar rutas en metro.',
    bankAccount: 'Banco Estado - CTA 12 345 678-9',
    preferences: {
      theme: 'light',
      language: 'es',
      panic: {
        countdownSeconds: 5,
        alertContacts: {
          carabineros: true,
          guardiaMunicipal: true,
          guardiaCivil: false,
          seguridadFCFM: true,
          contactosEmergencia: true,
          comunidadConecta: true
        },
        soundEnabled: true
      },
      notifyEmail: true,
      notifyPush: false
    }
  },
  {
    id: 'user-2',
    name: 'Carlos Rodriguez',
    email: 'crodriguez@fcfm.uchile.cl',
    rating: 4.9,
    verified: true,
    photo: 'avatar2.jpg',
    tripsCompleted: 67,
    phone: '+56 9 7777 3333',
    emergencyContact: 'Padre - +56 9 5555 2222',
    bio: 'Profesor asistente y conductor habitual hacia Maipu.',
    bankAccount: 'Banco Chile - CTA 22 987 654-3',
    preferences: {
      theme: 'dark',
      language: 'es',
      panic: {
        countdownSeconds: 5,
        alertContacts: {
          carabineros: true,
          guardiaMunicipal: false,
          guardiaCivil: false,
          seguridadFCFM: true,
          contactosEmergencia: true,
          comunidadConecta: true
        },
        soundEnabled: true
      },
      notifyEmail: true,
      notifyPush: true
    }
  },
  {
    id: 'user-3',
    name: 'Ana Martinez',
    email: 'amartinez@ing.uchile.cl',
    rating: 4.7,
    verified: true,
    photo: 'avatar3.jpg',
    tripsCompleted: 23,
    phone: '+56 9 8888 4444',
    emergencyContact: 'Amiga - +56 9 6666 1010',
    bio: 'Ingeniera civil mecánica, organiza caminatas y viajes compartidos.',
    bankAccount: 'Banco Santander - CTA 33 123 456-7',
    preferences: {
      theme: 'light',
      language: 'es',
      panic: {
        countdownSeconds: 5,
        alertContacts: {
          carabineros: true,
          guardiaMunicipal: true,
          guardiaCivil: false,
          seguridadFCFM: true,
          contactosEmergencia: true,
          comunidadConecta: true
        },
        soundEnabled: true
      },
      notifyEmail: true,
      notifyPush: false
    }
  },
  {
    id: 'user-demo',
    name: 'Usuario Demo',
    email: 'demo@ing.uchile.cl',
    rating: 4.6,
    verified: true,
    photo: 'avatar-demo.jpg',
    tripsCompleted: 18,
    phone: '+56 9 9999 0000',
    emergencyContact: 'Seguridad FCFM - +56 2 2978 4000',
    bio: 'Cuenta demo para explorar Conecta FCFM.',
    bankAccount: 'Banco Itau - CTA 44 555 666-8',
    preferences: {
      theme: 'light',
      language: 'es',
      panic: {
        countdownSeconds: 5,
        alertContacts: {
          carabineros: true,
          guardiaMunicipal: true,
          guardiaCivil: false,
          seguridadFCFM: true,
          contactosEmergencia: true,
          comunidadConecta: true
        },
        soundEnabled: true
      },
      notifyEmail: true,
      notifyPush: false
    }
  }
];

export const initialPublicTransportTrips = [
  {
    id: 'pt-1',
    creatorId: 'user-1',
    creatorName: 'Maria Gonzalez',
    mode: 'Metro',
    line: 'Linea 4',
    station: 'Universidad de Chile',
    direction: 'Puente Alto',
    origin: 'Metro Universidad de Chile',
    destination: 'FCFM Beauchef',
    time: '14:30',
    spots: 3,
    date: '2025-02-11'
  },
  {
    id: 'pt-2',
    creatorId: 'user-2',
    creatorName: 'Carlos Rodriguez',
    mode: 'Micro',
    line: 'B16',
    station: 'Paradero Beauchef',
    direction: 'Centro',
    origin: 'FCFM',
    destination: 'Metro Baquedano',
    time: '18:15',
    spots: 2,
    date: '2025-02-11'
  },
  {
    id: 'pt-3',
    creatorId: 'user-3',
    creatorName: 'Ana Martinez',
    mode: 'A pie',
    line: null,
    station: 'Entrada Norte FCFM',
    direction: 'Metro Toesca',
    origin: 'FCFM Beauchef 850',
    destination: 'Metro Toesca',
    time: '21:00',
    spots: 5,
    date: '2025-02-10'
  }
];

export const initialVehicleTrips = [
  {
    id: 'vt-1',
    driverId: 'user-3',
    driver: 'Ana Martinez',
    vehicleType: 'Automovil',
    vehicleModel: 'Hyundai i20',
    vehicleColor: 'Azul',
    plate: 'AB-CD-19',
    origin: 'Providencia',
    destination: 'FCFM',
    departureTime: '08:00',
    arrivalTime: '08:35',
    seatsAvailable: 2,
    donation: 1500,
    routeDescription: 'Av. Providencia -> Av. Vicuna Mackenna -> Av. Beauchef',
    date: '2025-02-12',
    driverRating: 4.7
  },
  {
    id: 'vt-2',
    driverId: 'user-2',
    driver: 'Carlos Rodriguez',
    vehicleType: 'Automovil',
    vehicleModel: 'Toyota Yaris',
    vehicleColor: 'Blanco',
    plate: 'FG-HJ-56',
    origin: 'FCFM',
    destination: 'Maipu',
    departureTime: '16:45',
    arrivalTime: '17:30',
    seatsAvailable: 3,
    donation: 2000,
    routeDescription: 'Av. Beauchef -> Alameda -> Av. Pajaritos',
    date: '2025-02-11',
    driverRating: 4.9
  }
];

export const initialSafetyReports = [
  {
    id: 'sr-1',
    type: 'unsafe_route',
    location: 'Estacion Universidad de Chile - Salida Norte',
    time: '22:30',
    description: 'Zona poco iluminada, presencia de personas sospechosas.',
    severity: 'medium',
    date: '2025-02-10',
    votes: { up: 24, down: 2 }
  },
  {
    id: 'sr-2',
    type: 'incident',
    location: 'Paradero B16 frente a FCFM',
    time: '19:45',
    description: 'Intento de robo a estudiante esperando micro. Guardia intervino.',
    severity: 'high',
    date: '2025-02-09',
    votes: { up: 31, down: 1 }
  },
  {
    id: 'sr-3',
    type: 'safe_route',
    location: 'Plaza Baquedano - Salida poniente',
    time: '07:30',
    description: 'Ruta patrullada por guardia universitaria durante la manana.',
    severity: 'low',
    date: '2025-02-08',
    votes: { up: 12, down: 0 }
  }
];

export const initialRecentActivity = [
  {
    id: 'ra-1',
    icon: 'fa-subway',
    message: 'Maria Gonzalez creo un viaje en Metro L4',
    timeAgo: 'Hace 15 minutos'
  },
  {
    id: 'ra-2',
    icon: 'fa-car',
    message: 'Carlos Rodriguez publico un viaje en automovil a Maipu',
    timeAgo: 'Hace 32 minutos'
  },
  {
    id: 'ra-3',
    icon: 'fa-shield-alt',
    message: 'Ana Martinez reporto ruta segura con patrullaje',
    timeAgo: 'Hace 1 hora'
  }
];

export const initialMyTrips = {
  active: [
    {
      id: 'mt-1',
      label: 'En curso',
      labelVariant: 'info',
      title: 'Metro L4 -> FCFM',
      datetime: 'Hoy 14:30',
      companions: ['Maria Gonzalez', 'Juan Perez'],
      actions: ['chat', 'details']
    },
    {
      id: 'mt-2',
      label: 'Proximo',
      labelVariant: 'warning',
      title: 'Auto Providencia -> FCFM',
      datetime: 'Manana 08:00',
      companions: ['Conductora: Ana Martinez (4.7)'],
      actions: ['contact', 'route']
    }
  ],
  completed: [
    {
      id: 'mt-3',
      label: 'Completado',
      labelVariant: 'success',
      title: 'Micro B16 FCFM -> Centro',
      datetime: 'Ayer 18:15',
      companions: ['Carlos Rodriguez', 'Sofia Lopez'],
      rating: 4
    }
  ]
};

export const metroLines = [
  'Linea 1 - Roja',
  'Linea 2 - Amarilla',
  'Linea 3 - Cafe',
  'Linea 4 - Azul',
  'Linea 4A - Celeste',
  'Linea 5 - Verde',
  'Linea 6 - Morada'
];

export const defaultPanicSettings = {
  countdownSeconds: 5,
  alertContacts: {
    carabineros: true,
    guardiaMunicipal: true,
    guardiaCivil: false,
    seguridadFCFM: true,
    contactosEmergencia: true,
    comunidadConecta: true
  },
  soundEnabled: true
};
