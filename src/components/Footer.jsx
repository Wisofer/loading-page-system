import { FiWifi, FiPhone, FiMapPin, FiMail } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Footer = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <footer 
      id="contact" 
      ref={ref}
      className={`bg-gray-900 dark:bg-gray-950 text-white py-12 sm:py-16 px-4 sm:px-6 transition-colors duration-300 ${
        isVisible ? 'scroll-visible' : 'scroll-hidden'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-3 mb-3 sm:mb-4">
              <div className="bg-blue-600 dark:bg-blue-500 p-2 sm:p-2.5 rounded-lg">
                <FiWifi className="text-white text-lg sm:text-xl" />
              </div>
              <span className="text-xl sm:text-2xl font-bold">EMSINET</span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 leading-relaxed">
              Conectamos tu mundo digital con los mejores servicios de internet. 
              Tu satisfacción es nuestra prioridad.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Nuestros Servicios</h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-400 dark:text-gray-500">
              <li className="hover:text-white dark:hover:text-gray-300 transition-colors cursor-pointer">
                Internet Residencial
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Contacto</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400 dark:text-gray-500">
              <li className="flex items-start space-x-2">
                <FiMail className="text-blue-400 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                <a 
                  href="mailto:atencion.al.cliente@emsinetsolut.com"
                  className="hover:text-white dark:hover:text-gray-300 transition-colors break-all"
                >
                  atencion.al.cliente@emsinetsolut.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <FiPhone className="text-blue-400 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-1">
                  <a 
                    href="tel:+50589308058"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors"
                  >
                    89308058
                  </a>
                  <a 
                    href="tel:+50582771485"
                    className="hover:text-white dark:hover:text-gray-300 transition-colors"
                  >
                    82771485
                  </a>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <FiMapPin className="text-blue-400 dark:text-blue-500 flex-shrink-0" />
                <span>Nicaragua</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 dark:border-gray-800 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
            © 2025 EMSINET - Todos los derechos reservados
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-600 mt-1 sm:mt-2">
            Internet de calidad para tu hogar
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-500 mt-3 sm:mt-4 font-semibold">
            DESARROLLADO POR{' '}
            <a
              href="https://www.cowib.es/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 dark:text-blue-500 hover:text-blue-300 dark:hover:text-blue-400 transition-colors"
            >
              COWIB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
