import { useState, useEffect, useRef } from 'react';
// ❌ DATOS ESTÁTICOS DESHABILITADOS - SOLO USA LA API
// import { internetServices } from '../data/services';
import { LandingService } from '../services/api.service';
// import { streamingServices } from '../data/services'; // Comentado - Streaming oculto por solicitud del cliente
import { FiWifi, FiCheck, FiTag, FiAlertCircle, FiTv, FiX, FiInfo, FiArrowRight } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Modal Component
const ServiceModal = ({ service, isOpen, onClose }) => {
  const originalOverflowRef = useRef(null);
  const originalPaddingRightRef = useRef(null);

  // Efecto para manejar el scroll del body - DEBE estar antes del return
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen && service) {
      // Guardar el estado actual ANTES de cambiarlo
      originalOverflowRef.current = window.getComputedStyle(document.body).overflow;
      originalPaddingRightRef.current = window.getComputedStyle(document.body).paddingRight;
      
      // Bloquear scroll
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
      
      // Agregar listener para ESC
      document.addEventListener('keydown', handleEscape);
    }

    // Cleanup: siempre se ejecuta cuando isOpen cambia o el componente se desmonta
    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restaurar el overflow original
      if (originalOverflowRef.current !== null) {
        document.body.style.overflow = originalOverflowRef.current;
      } else {
        document.body.style.overflow = '';
      }
      if (originalPaddingRightRef.current !== null) {
        document.body.style.paddingRight = originalPaddingRightRef.current;
      } else {
        document.body.style.paddingRight = '';
      }
    };
  }, [isOpen, onClose, service]);

  // Return null DESPUÉS de los hooks
  if (!isOpen || !service) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 p-6 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-3xl backdrop-blur-sm">
              {service.icono || "📡"}
            </div>
            <div>
              <h3 id="modal-title" className="text-xl font-bold text-white">
                {service.name}
              </h3>
              {service.speed && (
                <p className="text-blue-100 text-sm">⚡ {service.speed}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Cerrar modal"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <FiInfo className="text-blue-600 dark:text-blue-400 text-xl" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Información Importante
              </h4>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {service.mensaje || 'No hay información adicional disponible.'}
              </p>
            </div>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Precio</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {service.currency} {service.price.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Estado</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {service.status}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Descripción</p>
            <p className="text-gray-700 dark:text-gray-300">
              {service.description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-b-2xl border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ service, isStreaming = false, delay = 0, onCardClick }) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });

  const handleMoreInfoClick = (e) => {
    e.stopPropagation(); // Evitar que se propague el click
    if (service.mensaje && onCardClick) {
      onCardClick(service);
    }
  };

  return (
    <div 
      ref={ref}
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
        service.isDecemberOffer 
          ? 'border-2 border-orange-400 dark:border-orange-500 hover:border-orange-500 dark:hover:border-orange-400' 
          : 'border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
      } ${
        isVisible ? 'scroll-visible' : 'scroll-hidden'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="p-4 sm:p-6">
        {/* Status Badge and Etiqueta Badge */}
        <div className="flex justify-end mb-4 gap-1.5 sm:gap-2 flex-wrap">
          {service.etiqueta && (
            <span 
              className={`${service.colorEtiqueta || 'bg-orange-100 dark:bg-orange-900/30'} ${service.colorEtiqueta ? 'text-white' : 'text-orange-700 dark:text-orange-400'} text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center space-x-0.5 sm:space-x-1 animate-pulse max-w-full`}
              title={service.etiqueta}
            >
              <FiTag className="text-[10px] sm:text-xs flex-shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-[150px]">{service.etiqueta}</span>
            </span>
          )}
          {service.destacado && (
            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
              <span className="text-[10px] sm:text-xs">⭐</span>
              <span>Destacado</span>
            </span>
          )}
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center space-x-0.5 sm:space-x-1 flex-shrink-0">
            <FiCheck className="text-[10px] sm:text-xs" />
            <span>{service.status}</span>
          </span>
        </div>

        {/* Icon - Usar el icono del backend */}
        <div className="mb-4">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-md ${
            isStreaming ? 'bg-blue-600 dark:bg-blue-500' : 'bg-blue-600 dark:bg-blue-500'
          }`}>
            {isStreaming ? (
              <FiTv className="text-white" />
            ) : (
              <span className="text-2xl sm:text-3xl">{service.icono || "📡"}</span>
            )}
            {/* Icono viene del backend: service.icono (📡🌐🚀🎄) */}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {service.name}
        </h3>
        {service.speed && (
          <div className="mb-2">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
              ⚡ {service.speed}
            </span>
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Desde</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                {service.currency}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {service.price.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Botón Más Información - Solo si tiene mensaje */}
        {service.mensaje && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleMoreInfoClick}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Ver más información sobre ${service.name}`}
            >
              <FiInfo className="text-base" />
              <span>Más Información</span>
              <FiArrowRight className="text-base" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Services = () => {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });
  // const [streamingHeaderRef, streamingHeaderVisible] = useScrollAnimation({ threshold: 0.2 }); // Comentado - Streaming oculto
  
  // Estado para los servicios de la API
  const [services, setServices] = useState([]); // ❌ SIN datos estáticos - SOLO API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    // Asegurar que el scroll se restaure
    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 100);
  };

  // Cargar servicios desde la API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await LandingService.getServicios();
        
        // Mapear la respuesta de la API al formato esperado por el componente
        if (response && Array.isArray(response)) {
          const mappedServices = response.map((service) => ({
            id: service.id || service.orden,
            name: service.titulo || service.nombreServicio || service.servicio || service.nombre || service.name,
            category: "Internet",
            description: service.descripcion || service.description || "",
            price: parseFloat(service.precio || service.price || 0),
            currency: "C$", // La API no trae moneda, usar C$ por defecto
            status: service.activo ? "Activo" : "Inactivo", // Convertir boolean a string
            speed: service.velocidad || service.speed || "",
            icono: service.icono || "📡", // Icono del backend
            etiqueta: service.etiqueta || null,
            colorEtiqueta: service.colorEtiqueta || null, // Color de la etiqueta del backend
            destacado: service.destacado || false,
            caracteristicas: service.caracteristicas || null,
            mensaje: service.mensaje || null, // Mensaje del backend
            orden: service.orden || service.id
          }));
          
          setServices(mappedServices);
          setError(null);
        } else if (response && response.data && Array.isArray(response.data)) {
          // Si la respuesta viene envuelta en un objeto con propiedad data
          const mappedServices = response.data.map((service) => ({
            id: service.id || service.orden,
            name: service.titulo || service.nombreServicio || service.servicio || service.nombre || service.name,
            category: "Internet",
            description: service.descripcion || service.description || "",
            price: parseFloat(service.precio || service.price || 0),
            currency: "C$", // La API no trae moneda, usar C$ por defecto
            status: service.activo ? "Activo" : "Inactivo", // Convertir boolean a string
            speed: service.velocidad || service.speed || "",
            icono: service.icono || "📡", // Icono del backend
            etiqueta: service.etiqueta || null,
            colorEtiqueta: service.colorEtiqueta || null, // Color de la etiqueta del backend
            destacado: service.destacado || false,
            caracteristicas: service.caracteristicas || null,
            mensaje: service.mensaje || null, // Mensaje del backend
            orden: service.orden || service.id
          }));
          
          setServices(mappedServices);
          setError(null);
        }
      } catch (err) {
        console.error('Error al cargar servicios:', err);
        setError('No se pudieron cargar los servicios desde la API. Por favor, verifica tu conexión.');
        setServices([]); // ❌ NO usar datos estáticos - dejar vacío
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Internet Services */}
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div 
            ref={headerRef}
            className={`text-center mb-8 sm:mb-12 ${
              headerVisible ? 'scroll-visible' : 'scroll-hidden'
            }`}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 dark:bg-blue-500 rounded-xl mb-3 sm:mb-4 shadow-md">
              <FiWifi className="text-white text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
              Servicios de Internet
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              Planes de internet residencial de alta velocidad para tu hogar
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="max-w-2xl mx-auto mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex items-center">
                <FiAlertCircle className="text-yellow-400 mr-2" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">{error}</p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && services.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-sm"
                >
                  <ServiceCard 
                    service={service} 
                    delay={index * 100}
                    onCardClick={handleCardClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Streaming Services - COMENTADO: Oculto por solicitud del cliente */}
        {/* 
        <div>
          <div 
            ref={streamingHeaderRef}
            className={`text-center mb-8 sm:mb-12 ${
              streamingHeaderVisible ? 'scroll-visible' : 'scroll-hidden'
            }`}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 dark:bg-blue-500 rounded-xl mb-3 sm:mb-4 shadow-md">
              <FiTv className="text-white text-2xl sm:text-3xl" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
              Servicios de Streaming
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              Las mejores plataformas de entretenimiento al alcance de un clic
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {streamingServices.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                isStreaming={true}
                delay={index * 50}
              />
            ))}
          </div>
        </div>
        */}
      </div>

      {/* Modal para mostrar mensaje */}
      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default Services;
