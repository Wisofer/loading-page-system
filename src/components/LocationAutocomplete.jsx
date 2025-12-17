import { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiLoader, FiX } from 'react-icons/fi';

const LocationAutocomplete = ({ value, onChange, placeholder = "Buscar ubicación...", required = false }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sincronizar con valor externo
  useEffect(() => {
    if (value && !selectedLocation) {
      setQuery(value);
    }
  }, [value, selectedLocation]);

  // Verificar si está en Nicaragua por coordenadas
  const isInNicaragua = (coords) => {
    // Bounding box de Nicaragua: lat 10.7 - 15.0, lon -87.7 - -83.0
    const lat = coords[1];
    const lon = coords[0];
    return lat >= 10.7 && lat <= 15.0 && lon >= -87.7 && lon <= -83.0;
  };

  // Normalizar texto para búsqueda (tolerante a tildes, mayúsculas, ñ)
  const normalizeText = (text) => {
    if (!text) return '';
    
    // Correcciones comunes de lugares de Nicaragua
    const corrections = {
      // Departamentos
      'leon': 'León',
      'esteli': 'Estelí',
      'masaya': 'Masaya',
      'managua': 'Managua',
      'chinandega': 'Chinandega',
      'matagalpa': 'Matagalpa',
      'jinotega': 'Jinotega',
      'granada': 'Granada',
      'rivas': 'Rivas',
      'carazo': 'Carazo',
      'boaco': 'Boaco',
      'chontales': 'Chontales',
      'rio san juan': 'Río San Juan',
      'nueva segovia': 'Nueva Segovia',
      'madriz': 'Madriz',
      // Municipios comunes
      'nagarote': 'Nagarote',
      'la paz centro': 'La Paz Centro',
      'telica': 'Telica',
      'el sauce': 'El Sauce',
      'diriamba': 'Diriamba',
      'jinotepe': 'Jinotepe',
      'masatepe': 'Masatepe',
      'nandaime': 'Nandaime',
      'juigalpa': 'Juigalpa',
      'san carlos': 'San Carlos',
      'ocotal': 'Ocotal',
      'somoto': 'Somoto',
      'bluefields': 'Bluefields',
      'bilwi': 'Bilwi',
      'puerto cabezas': 'Puerto Cabezas',
      // Barrios/Repartos comunes
      'sutiava': 'Sutiava',
      'subtiava': 'Sutiava',
      'altamira': 'Altamira',
      'bello horizonte': 'Bello Horizonte',
      'ciudad jardin': 'Ciudad Jardín',
      'las colinas': 'Las Colinas',
      'carretera masaya': 'Carretera Masaya',
      'carretera norte': 'Carretera Norte',
      'carretera sur': 'Carretera Sur',
    };

    // Convertir a minúsculas y quitar tildes para comparar
    const normalized = text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Quitar tildes
    
    // Buscar corrección
    for (const [key, value] of Object.entries(corrections)) {
      const keyNormalized = key.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      
      if (normalized.includes(keyNormalized)) {
        // Reemplazar manteniendo el resto del texto
        const regex = new RegExp(keyNormalized, 'gi');
        return text.replace(regex, value);
      }
    }
    
    return text;
  };

  // Buscar ubicaciones con debounce
  const searchLocations = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Normalizar y corregir el texto de búsqueda
      const correctedQuery = normalizeText(searchQuery);
      const originalQuery = searchQuery.trim();
      
      // Función para hacer búsqueda en Nominatim
      const searchNominatim = async (query) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=ni&limit=10&addressdetails=1&accept-language=es`;
        
        const response = await fetch(url, {
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) return [];
        return await response.json();
      };
      
      // Buscar con texto corregido
      let data = await searchNominatim(correctedQuery);
      
      // Si no hay resultados y el texto es diferente, buscar con original
      if ((!data || data.length === 0) && correctedQuery !== originalQuery) {
        data = await searchNominatim(originalQuery);
      }
      
      // Si aún no hay resultados, intentar búsqueda más flexible
      if (!data || data.length === 0) {
        data = await searchNominatim(originalQuery + ' Nicaragua');
      }
      
      if (!data || data.length === 0) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }
      
      // Mapear resultados de Nominatim
      const mappedSuggestions = data
        .filter(item => {
          // Solo Nicaragua
          const inNicaragua = item.display_name?.includes('Nicaragua') || 
                             (item.address?.country === 'Nicaragua');
          return inNicaragua;
        })
        .map((item) => {
          const addr = item.address || {};
          
          // Construir nombre más legible
          let displayParts = [];
          if (addr.amenity || addr.shop || addr.building) {
            displayParts.push(addr.amenity || addr.shop || addr.building);
          }
          if (addr.road) displayParts.push(addr.road);
          if (addr.neighbourhood || addr.suburb) {
            displayParts.push(addr.neighbourhood || addr.suburb);
          }
          if (addr.city || addr.town || addr.village || addr.municipality) {
            displayParts.push(addr.city || addr.town || addr.village || addr.municipality);
          }
          if (addr.state) displayParts.push(addr.state);
          
          const displayName = displayParts.length > 0 
            ? displayParts.join(', ')
            : item.display_name?.split(',').slice(0, 4).join(', ') || 'Ubicación';
          
          return {
            id: item.place_id,
            displayName: displayName,
            fullName: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            type: item.type,
            address: {
              name: addr.amenity || addr.shop || addr.building || item.name,
              street: addr.road,
              housenumber: addr.house_number,
              district: addr.neighbourhood || addr.suburb,
              city: addr.city || addr.town || addr.village || addr.municipality,
              state: addr.state,
              country: addr.country
            }
          };
        })
        .slice(0, 8);
      
      setSuggestions(mappedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambio en el input
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setShowSuggestions(true);
    setSelectedLocation(null);

    // Debounce para no hacer demasiadas peticiones
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchLocations(newValue);
    }, 300);
  };

  // Seleccionar una ubicación
  const handleSelectLocation = (location) => {
    // Usar el nombre completo para mostrar
    const displayText = location.fullName || location.displayName;
    setQuery(displayText);
    setSelectedLocation(location);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Enviar al componente padre
    if (onChange) {
      onChange({
        direccion: displayText,
        latitud: location.lat,
        longitud: location.lon,
        detalles: location.address
      });
    }
  };

  // Limpiar selección
  const handleClear = () => {
    setQuery('');
    setSelectedLocation(null);
    setSuggestions([]);
    if (onChange) {
      onChange(null);
    }
  };

  // Formatear nombre para mostrar más corto
  const formatDisplayName = (name) => {
    // Limitar longitud y mostrar partes importantes
    const parts = name.split(', ');
    if (parts.length > 4) {
      return parts.slice(0, 4).join(', ');
    }
    return name;
  };

  // Obtener icono según tipo de lugar
  const getPlaceIcon = (type) => {
    return '📍';
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          required={required}
          className="w-full pl-11 pr-10 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        
        {/* Indicador de carga o botón limpiar */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <FiLoader className="text-blue-500 animate-spin" />
          ) : query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <FiX className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Lista de sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSelectLocation(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 flex items-start space-x-3"
            >
              <span className="text-lg flex-shrink-0 mt-0.5">
                {getPlaceIcon(suggestion.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {formatDisplayName(suggestion.displayName)}
                </p>
                {suggestion.address && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {suggestion.address.city || suggestion.address.town || suggestion.address.village || ''}{suggestion.address.state ? `, ${suggestion.address.state}` : ''}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {showSuggestions && query.length >= 2 && !isLoading && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No se encontraron ubicaciones para "{query}"
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
            Intenta ser más específico (ej: "Barrio San Felipe, León" o "Juigalpa, Chontales")
          </p>
        </div>
      )}

      {/* Indicador de ubicación seleccionada */}
      {selectedLocation && (
        <div className="mt-2 flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
          <FiMapPin className="flex-shrink-0" />
          <span>Ubicación seleccionada correctamente</span>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;

