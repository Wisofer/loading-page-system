/**
 * Servicio principal para interactuar con la API
 * Contiene métodos genéricos y específicos para consumir endpoints
 */

import axiosInstance from './axios.instance';
import API_CONFIG from '../config/api.config';

/**
 * Servicio de API - Métodos genéricos
 */
class ApiService {
  /**
   * Petición GET genérica
   * @param {string} endpoint - Endpoint a consultar
   * @param {object} params - Parámetros de query
   * @returns {Promise} - Promesa con la respuesta
   */
  async get(endpoint, params = {}) {
    try {
      const response = await axiosInstance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Petición POST genérica
   * @param {string} endpoint - Endpoint a consultar
   * @param {object} data - Datos a enviar
   * @returns {Promise} - Promesa con la respuesta
   */
  async post(endpoint, data = {}) {
    try {
      const response = await axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Petición PUT genérica
   * @param {string} endpoint - Endpoint a consultar
   * @param {object} data - Datos a actualizar
   * @returns {Promise} - Promesa con la respuesta
   */
  async put(endpoint, data = {}) {
    try {
      const response = await axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Petición PATCH genérica
   * @param {string} endpoint - Endpoint a consultar
   * @param {object} data - Datos a actualizar parcialmente
   * @returns {Promise} - Promesa con la respuesta
   */
  async patch(endpoint, data = {}) {
    try {
      const response = await axiosInstance.patch(endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Petición DELETE genérica
   * @param {string} endpoint - Endpoint a consultar
   * @returns {Promise} - Promesa con la respuesta
   */
  async delete(endpoint) {
    try {
      const response = await axiosInstance.delete(endpoint);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Manejo centralizado de errores
   * @param {object} error - Error capturado
   * @returns {object} - Objeto de error formateado
   */
  handleError(error) {
    if (error.response) {
      // Error de respuesta del servidor
      return {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || 'Error en la petición',
        errors: error.response.data?.errors || null,
        data: null,
      };
    } else if (error.request) {
      // Error de red
      return {
        success: false,
        status: 0,
        message: 'No se pudo conectar con el servidor',
        errors: null,
        data: null,
      };
    } else {
      // Error de configuración
      return {
        success: false,
        status: 0,
        message: error.message || 'Error desconocido',
        errors: null,
        data: null,
      };
    }
  }
}

/**
 * Servicios específicos para cada módulo de la API
 */

// Servicio de Autenticación
export const AuthService = {
  /**
   * Iniciar sesión
   * @param {object} credentials - {usuario, contraseña}
   * @returns {Promise}
   */
  login: async (credentials) => {
    const apiService = new ApiService();
    const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    
    // Si el login es exitoso, guardar token
    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user || {}));
    }
    
    return response;
  },

  /**
   * Cerrar sesión
   * @returns {Promise}
   */
  logout: async () => {
    const apiService = new ApiService();
    try {
      await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Limpiar datos locales independientemente de la respuesta
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  /**
   * Verificar si el token es válido
   * @returns {Promise}
   */
  verify: async () => {
    const apiService = new ApiService();
    return await apiService.get(API_CONFIG.ENDPOINTS.AUTH.VERIFY);
  },

  /**
   * Refrescar token
   * @returns {Promise}
   */
  refresh: async () => {
    const apiService = new ApiService();
    const response = await apiService.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH);
    
    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },
};

// Servicio de Usuarios (ejemplo)
export const UserService = {
  /**
   * Obtener todos los usuarios
   * @param {object} filters - Filtros de búsqueda
   * @returns {Promise}
   */
  getAll: async (filters = {}) => {
    const apiService = new ApiService();
    return await apiService.get(API_CONFIG.ENDPOINTS.USERS.GET_ALL, filters);
  },

  /**
   * Obtener usuario por ID
   * @param {string|number} id - ID del usuario
   * @returns {Promise}
   */
  getById: async (id) => {
    const apiService = new ApiService();
    return await apiService.get(API_CONFIG.ENDPOINTS.USERS.GET_BY_ID(id));
  },

  /**
   * Crear nuevo usuario
   * @param {object} userData - Datos del usuario
   * @returns {Promise}
   */
  create: async (userData) => {
    const apiService = new ApiService();
    return await apiService.post(API_CONFIG.ENDPOINTS.USERS.CREATE, userData);
  },

  /**
   * Actualizar usuario
   * @param {string|number} id - ID del usuario
   * @param {object} userData - Datos a actualizar
   * @returns {Promise}
   */
  update: async (id, userData) => {
    const apiService = new ApiService();
    return await apiService.put(API_CONFIG.ENDPOINTS.USERS.UPDATE(id), userData);
  },

  /**
   * Eliminar usuario
   * @param {string|number} id - ID del usuario
   * @returns {Promise}
   */
  delete: async (id) => {
    const apiService = new ApiService();
    return await apiService.delete(API_CONFIG.ENDPOINTS.USERS.DELETE(id));
  },
};

// Servicio de Landing Page (públicos, no requieren autenticación)
export const LandingService = {
  /**
   * Obtener servicios de internet
   * @returns {Promise}
   */
  getServicios: async () => {
    const apiService = new ApiService();
    return await apiService.get(API_CONFIG.ENDPOINTS.LANDING.SERVICIOS);
  },

  /**
   * Obtener métodos de pago
   * @returns {Promise}
   */
  getMetodosPago: async () => {
    const apiService = new ApiService();
    return await apiService.get(API_CONFIG.ENDPOINTS.LANDING.METODOS_PAGO);
  },

  /**
   * Obtener toda la información de la landing (servicios + métodos de pago)
   * @returns {Promise}
   */
  getInfo: async () => {
    const apiService = new ApiService();
    return await apiService.get(API_CONFIG.ENDPOINTS.LANDING.INFO);
  },
};

// Exportar instancia de ApiService para uso genérico
export default new ApiService();

