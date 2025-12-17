import { useState } from 'react';
import { FiSend, FiUser, FiMail, FiPhone, FiMessageSquare, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { LandingService } from '../services/api.service';
import LocationAutocomplete from './LocationAutocomplete';

const ContactForm = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    ubicacion: '',
    mensaje: ''
  });
  
  // Estado para la ubicación completa (con coordenadas)
  const [locationData, setLocationData] = useState(null);
  
  // Estado de envío
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambio de ubicación
  const handleLocationChange = (location) => {
    setLocationData(location);
    setFormData(prev => ({
      ...prev,
      ubicacion: location ? location.direccion : ''
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setStatus({ loading: true, success: false, error: null });
    
    try {
      // Preparar datos con ubicación
      const dataToSend = {
        ...formData,
        // Si hay datos de ubicación, incluir coordenadas
        ...(locationData && {
          latitud: locationData.latitud,
          longitud: locationData.longitud
        })
      };
      
      await LandingService.enviarContacto(dataToSend);
      
      setStatus({ loading: false, success: true, error: null });
      
      // Limpiar formulario después de éxito
      setFormData({
        nombre: '',
        correo: '',
        telefono: '',
        ubicacion: '',
        mensaje: ''
      });
      setLocationData(null);
      
      // Resetear mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setStatus(prev => ({ ...prev, success: false }));
      }, 5000);
      
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: error.response?.data?.message || 'Error al enviar el mensaje. Por favor, intenta de nuevo.'
      });
    }
  };

  return (
    <section 
      id="contacto"
      ref={ref}
      className={`relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden transition-all duration-500 ${
        isVisible ? 'scroll-visible' : 'scroll-hidden'
      }`}
    >
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950"></div>
      
      {/* Efectos de glow sutiles */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-indigo-400/15 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <FiMessageSquare className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Contáctanos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            ¿Tienes preguntas o necesitas más información? Envíanos un mensaje y te responderemos lo antes posible.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none p-6 sm:p-8 md:p-10 border border-gray-100 dark:border-gray-700">
          
          {/* Mensaje de éxito */}
          {status.success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-start space-x-3 animate-fade-in">
              <FiCheckCircle className="text-green-500 text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-700 dark:text-green-400 font-semibold">¡Mensaje enviado con éxito!</p>
                <p className="text-green-600 dark:text-green-500 text-sm mt-1">Nos pondremos en contacto contigo pronto.</p>
              </div>
            </div>
          )}

          {/* Mensaje de error */}
          {status.error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3 animate-fade-in">
              <FiAlertCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 dark:text-red-400 font-semibold">Error al enviar</p>
                <p className="text-red-600 dark:text-red-500 text-sm mt-1">{status.error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Grid de campos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {/* Nombre */}
              <div className="relative">
                <label 
                  htmlFor="nombre" 
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Nombre completo *
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="relative">
                <label 
                  htmlFor="correo" 
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Correo electrónico *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Teléfono */}
            <div className="relative">
              <label 
                htmlFor="telefono" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Número de teléfono *
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  placeholder="8888-8888"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Ubicación */}
            <div className="relative">
              <label 
                htmlFor="ubicacion" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Ubicación
              </label>
              <LocationAutocomplete
                value={formData.ubicacion}
                onChange={handleLocationChange}
                placeholder="Escribe tu dirección o ubicación..."
                required
              />
            </div>

            {/* Mensaje */}
            <div className="relative">
              <label 
                htmlFor="mensaje" 
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Mensaje *
              </label>
              <div className="relative">
                <FiMessageSquare className="absolute left-4 top-4 text-gray-400 dark:text-gray-500" />
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Botón de envío */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status.loading}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
              >
                {status.loading ? (
                  <>
                    <FiLoader className="text-lg animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <FiSend className="text-lg" />
                    <span>Enviar mensaje</span>
                  </>
                )}
              </button>
            </div>

            {/* Nota de privacidad */}
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center sm:text-left">
              Al enviar este formulario, aceptas que utilicemos tus datos para contactarte sobre nuestros servicios.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

