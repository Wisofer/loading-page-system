/**
 * Configuración central de la API
 * Base URL: https://app.emsinetsolut.com/
 */

export const API_CONFIG = {
  // URL base de la API
  BASE_URL: 'https://app.emsinetsolut.com',
  
  // Endpoints de la API
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh',
      VERIFY: '/api/auth/verify',
    },
    
    // Usuarios
    USERS: {
      GET_ALL: '/api/users',
      GET_BY_ID: (id) => `/api/users/${id}`,
      CREATE: '/api/users',
      UPDATE: (id) => `/api/users/${id}`,
      DELETE: (id) => `/api/users/${id}`,
    },
    
    // Landing Page - Endpoints públicos
    LANDING: {
      SERVICIOS: '/api/landing/servicios',           // GET - Servicios de internet
      METODOS_PAGO: '/api/landing/metodos-pago',     // GET - Métodos de pago
      INFO: '/api/landing/info',                     // GET - Todo en una llamada
    },
  },
  
  // Timeouts
  TIMEOUT: 30000, // 30 segundos
  
  // Headers por defecto
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default API_CONFIG;

