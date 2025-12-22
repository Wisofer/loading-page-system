import { useState, useEffect } from 'react';
import { FiMapPin, FiLoader, FiX, FiNavigation } from 'react-icons/fi';

const LocationAutocomplete = ({ value, onChange, placeholder = "Obtener mi ubicación...", required = false }) => {
  const [location, setLocation] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationData, setLocationData] = useState(null);

  // Sincronizar con el valor del padre cuando cambia
  useEffect(() => {
    if (!value || value === '') {
      setLocation('');
      setLocationData(null);
      setError(null);
    } else if (value !== location) {
      setLocation(value);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Obtener ubicación actual del navegador
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Hacer reverse geocoding para obtener la dirección
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=es`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'EMSInetSolut Contact Form'
              }
            }
          );
          
          if (!response.ok) {
            throw new Error('Error al obtener la dirección');
          }

          const data = await response.json();
          
          // Construir dirección legible
          const addr = data.address || {};
          const addressParts = [];
          
          if (addr.road) addressParts.push(addr.road);
          if (addr.house_number) addressParts.push(addr.house_number);
          if (addr.neighbourhood || addr.suburb) {
            addressParts.push(addr.neighbourhood || addr.suburb);
          }
          if (addr.city || addr.town || addr.village || addr.municipality) {
            addressParts.push(addr.city || addr.town || addr.village || addr.municipality);
          }
          if (addr.state) addressParts.push(addr.state);
          if (addr.country) addressParts.push(addr.country);
          
          const fullAddress = addressParts.length > 0 
            ? addressParts.join(', ')
            : data.display_name || `${latitude}, ${longitude}`;

          // Guardar datos (asegurar que las coordenadas sean números)
          const locationInfo = {
            direccion: fullAddress,
            latitud: Number(latitude),  // Convertir explícitamente a número
            longitud: Number(longitude), // Convertir explícitamente a número
            detalles: {
              name: addr.amenity || addr.shop || addr.building || data.name,
              street: addr.road,
              housenumber: addr.house_number,
              district: addr.neighbourhood || addr.suburb,
              city: addr.city || addr.town || addr.village || addr.municipality,
              state: addr.state,
              country: addr.country
            }
          };

          setLocation(fullAddress);
          setLocationData(locationInfo);
          
          // Enviar al componente padre
          if (onChange) {
            onChange(locationInfo);
          }
        } catch (err) {
          // Si falla el reverse geocoding, usar coordenadas
          const fallbackAddress = `${latitude}, ${longitude}`;
          const locationInfo = {
            direccion: fallbackAddress,
            latitud: Number(latitude),  // Convertir explícitamente a número
            longitud: Number(longitude), // Convertir explícitamente a número
            detalles: null
          };
          
          setLocation(fallbackAddress);
          setLocationData(locationInfo);
          
          if (onChange) {
            onChange(locationInfo);
          }
          
          setError('Ubicación obtenida, pero no se pudo obtener la dirección completa');
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Permiso de ubicación denegado. Por favor, permite el acceso a tu ubicación en la configuración del navegador.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Ubicación no disponible. Verifica que tu GPS esté activado.');
            break;
          case err.TIMEOUT:
            setError('Tiempo de espera agotado. Verifica que tu GPS esté activado y que tengas buena señal. Intenta de nuevo.');
            break;
          default:
            setError('Error al obtener la ubicación. Intenta de nuevo.');
            break;
        }
      },
      {
        enableHighAccuracy: false, // false para evitar timeouts, true puede tardar mucho
        timeout: 30000, // 30 segundos en lugar de 10
        maximumAge: 60000 // Permitir usar ubicación en caché de hasta 1 minuto
      }
    );
  };

  // Limpiar ubicación
  const handleClear = () => {
    setLocation('');
    setLocationData(null);
    setError(null);
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 pointer-events-none" />
        <input
          type="text"
          value={location}
          readOnly
          placeholder={placeholder}
          required={required}
          className={`w-full pl-11 ${location && !isLoading ? 'pr-20' : 'pr-12'} py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
        />
        
        {/* Botón para obtener ubicación (redondo, dentro del input) */}
        <button
          type="button"
          onClick={(e) => {
            try {
              e.preventDefault();
              e.stopPropagation();
              getCurrentLocation();
            } catch (error) {
              setError('Error al iniciar la geolocalización. Intenta de nuevo.');
            }
          }}
          disabled={isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md hover:shadow-lg overflow-hidden"
          title="Obtener mi ubicación actual"
        >
          {isLoading ? (
            <FiLoader className="text-sm animate-spin flex-shrink-0" />
          ) : (
            <FiMapPin className="text-sm flex-shrink-0" />
          )}
        </button>
        
        {/* Botón limpiar */}
        {location && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <FiX className="text-sm" />
          </button>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Indicador de ubicación obtenida */}
      {locationData && !error && (
        <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
          <FiMapPin className="flex-shrink-0" />
          <span>✓ Ubicación obtenida correctamente</span>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
