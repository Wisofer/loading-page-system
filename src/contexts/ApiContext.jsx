/**
 * Contexto de API para manejar estado global de peticiones
 */

import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const ApiContext = createContext(null);

/**
 * Provider del contexto de API
 */
export const ApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestCount, setRequestCount] = useState(0);

  /**
   * Ejecutar una petición y actualizar estado global
   */
  const executeRequest = useCallback(async (apiFunction, options = {}) => {
    const { showGlobalLoading = true } = options;
    
    if (showGlobalLoading) {
      setLoading(true);
    }
    
    setError(null);
    setRequestCount(prev => prev + 1);

    try {
      const result = await apiFunction();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      if (showGlobalLoading) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Resetear estado
   */
  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setRequestCount(0);
  }, []);

  const value = {
    loading,
    error,
    requestCount,
    executeRequest,
    clearError,
    reset,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

ApiProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook para usar el contexto de API
 */
export const useApiContext = () => {
  const context = useContext(ApiContext);
  
  if (!context) {
    throw new Error('useApiContext debe usarse dentro de un ApiProvider');
  }
  
  return context;
};

export default ApiContext;

