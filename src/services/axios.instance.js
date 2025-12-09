/**
 * Instancia configurada de Axios para la API
 */

import axios from 'axios';
import API_CONFIG from '../config/api.config';

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Interceptor para peticiones - Agregar token si existe
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas - Manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores comunes
    if (error.response) {
      // El servidor respondió con un código de error
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // No autorizado - Limpiar token y redirigir a login
          console.error('❌ No autorizado - Token inválido o expirado');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          // Aquí puedes agregar lógica para redirigir al login
          break;
          
        case 403:
          console.error('❌ Acceso prohibido');
          break;
          
        case 404:
          console.error('❌ Recurso no encontrado');
          break;
          
        case 500:
          console.error('❌ Error del servidor');
          break;
          
        default:
          console.error(`❌ Error ${status}:`, data?.message || 'Error desconocido');
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('❌ Sin respuesta del servidor:', error.message);
    } else {
      // Algo pasó al configurar la petición
      console.error('❌ Error al configurar petición:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

