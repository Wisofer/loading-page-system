/**
 * Hook personalizado para manejar peticiones a la API
 * Proporciona estado de carga, errores y datos
 */

import { useState, useCallback } from 'react';

/**
 * Hook para manejar llamadas a la API con estado
 * @returns {object} - {data, loading, error, execute, reset}
 */
export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Ejecutar una función de API
   * @param {Function} apiFunction - Función de servicio de API a ejecutar
   * @returns {Promise} - Resultado de la petición
   */
  const execute = useCallback(async (apiFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Resetear el estado
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

/**
 * Hook para manejar autenticación
 * @returns {object} - Estado y funciones de autenticación
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Iniciar sesión
   * @param {Function} loginFunction - Función de login del AuthService
   * @returns {Promise}
   */
  const login = useCallback(async (loginFunction) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loginFunction();
      
      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user || null);
      } else {
        setError(result.message || 'Error al iniciar sesión');
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Error de conexión');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cerrar sesión
   * @param {Function} logoutFunction - Función de logout del AuthService
   */
  const logout = useCallback(async (logoutFunction) => {
    setLoading(true);
    
    try {
      await logoutFunction();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  /**
   * Verificar autenticación
   */
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
  };
};

export default useApi;



