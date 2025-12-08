/**
 * Utilidades y helpers para trabajar con la API
 */

/**
 * Construir query string a partir de un objeto
 * @param {object} params - Parámetros a convertir
 * @returns {string} - Query string
 */
export const buildQueryString = (params) => {
  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return filteredParams ? `?${filteredParams}` : '';
};

/**
 * Formatear respuesta de error
 * @param {object} error - Objeto de error
 * @returns {string} - Mensaje de error formateado
 */
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.errors && Array.isArray(error.errors)) {
    return error.errors.join(', ');
  }
  
  return 'Error desconocido';
};

/**
 * Validar token JWT
 * @param {string} token - Token a validar
 * @returns {boolean} - True si el token es válido
 */
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000; // Convertir a milisegundos
    
    return Date.now() < expiration;
  } catch {
    return false;
  }
};

/**
 * Obtener token del localStorage
 * @returns {string|null} - Token o null
 */
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Guardar token en localStorage
 * @param {string} token - Token a guardar
 */
export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

/**
 * Eliminar token del localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
};

/**
 * Obtener datos de usuario del localStorage
 * @returns {object|null} - Datos de usuario o null
 */
export const getUserData = () => {
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

/**
 * Guardar datos de usuario en localStorage
 * @param {object} userData - Datos de usuario
 */
export const setUserData = (userData) => {
  localStorage.setItem('user_data', JSON.stringify(userData));
};

/**
 * Verificar si el usuario está autenticado
 * @returns {boolean} - True si está autenticado
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return token && isTokenValid(token);
};

/**
 * Formatear fecha de respuesta de API
 * @param {string} dateString - Fecha en formato string
 * @returns {string} - Fecha formateada
 */
export const formatApiDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

/**
 * Retry de petición con backoff exponencial
 * @param {Function} apiFunction - Función de API a ejecutar
 * @param {number} maxRetries - Máximo número de reintentos
 * @returns {Promise} - Resultado de la petición
 */
export const retryRequest = async (apiFunction, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiFunction();
    } catch (error) {
      lastError = error;
      
      // No reintentar en errores 4xx (excepto 429 - Too Many Requests)
      if (error.status >= 400 && error.status < 500 && error.status !== 429) {
        throw error;
      }
      
      // Esperar con backoff exponencial
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s, etc.
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

/**
 * Descargar archivo desde la API
 * @param {string} url - URL del archivo
 * @param {string} filename - Nombre del archivo
 */
export const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al descargar archivo');
    }
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    throw error;
  }
};

/**
 * Subir archivo a la API
 * @param {string} endpoint - Endpoint de subida
 * @param {File} file - Archivo a subir
 * @param {object} additionalData - Datos adicionales
 * @returns {Promise} - Resultado de la subida
 */
export const uploadFile = async (endpoint, file, additionalData = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Agregar datos adicionales
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: formData
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error al subir archivo:', error);
    throw error;
  }
};

export default {
  buildQueryString,
  formatErrorMessage,
  isTokenValid,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getUserData,
  setUserData,
  isAuthenticated,
  formatApiDate,
  retryRequest,
  downloadFile,
  uploadFile,
};

