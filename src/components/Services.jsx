import { useState, useEffect } from 'react';
// ❌ DATOS ESTÁTICOS DESHABILITADOS - SOLO USA LA API
// import { internetServices } from '../data/services';
import { LandingService } from '../services/api.service';
// import { streamingServices } from '../data/services'; // Comentado - Streaming oculto por solicitud del cliente
import { FiWifi, FiCheck, FiTag, FiAlertCircle, FiTv } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const ServiceCard = ({ service, isStreaming = false, delay = 0 }) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });

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
        {/* Status Badge and December Offer Badge */}
        <div className="flex justify-end mb-4 gap-2">
          {service.isDecemberOffer && (
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-bold px-2 sm:px-3 py-1 rounded-full flex items-center space-x-1 animate-pulse">
              <FiTag className="text-xs" />
              <span>OFERTA DICIEMBRE</span>
            </span>
          )}
          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full flex items-center space-x-1">
            <FiCheck className="text-xs" />
            <span>{service.status}</span>
          </span>
        </div>

        {/* Icon */}
        <div className="mb-4">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-md ${
            isStreaming ? 'bg-blue-600 dark:bg-blue-500' : 'bg-blue-600 dark:bg-blue-500'
          }`}>
            {isStreaming ? <FiTv /> : <FiWifi />}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {service.name}
        </h3>
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
            name: service.nombreServicio || service.servicio || service.nombre || service.name,
            category: "Internet",
            description: service.descripcion || service.description || "",
            price: parseFloat(service.precio || service.price || 0),
            currency: service.moneda || service.currency || "C$",
            status: service.estado || service.status || "Activo",
            speed: service.velocidad || service.speed || "",
            isDecemberOffer: service.etiqueta?.toUpperCase().includes('DICIEMBRE') || 
                             service.etiqueta?.toUpperCase().includes('OFERTA') ||
                             service.label?.toUpperCase().includes('DICIEMBRE') ||
                             service.label?.toUpperCase().includes('OFERTA') ||
                             false,
            label: service.etiqueta || service.label || ""
          }));
          
          setServices(mappedServices);
          setError(null);
        } else if (response && response.data && Array.isArray(response.data)) {
          // Si la respuesta viene envuelta en un objeto con propiedad data
          const mappedServices = response.data.map((service) => ({
            id: service.id || service.orden,
            name: service.nombreServicio || service.servicio || service.nombre || service.name,
            category: "Internet",
            description: service.descripcion || service.description || "",
            price: parseFloat(service.precio || service.price || 0),
            currency: service.moneda || service.currency || "C$",
            status: service.estado || service.status || "Activo",
            speed: service.velocidad || service.speed || "",
            isDecemberOffer: service.etiqueta?.toUpperCase().includes('DICIEMBRE') || 
                             service.etiqueta?.toUpperCase().includes('OFERTA') ||
                             service.label?.toUpperCase().includes('DICIEMBRE') ||
                             service.label?.toUpperCase().includes('OFERTA') ||
                             false,
            label: service.etiqueta || service.label || ""
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
    </section>
  );
};

export default Services;
