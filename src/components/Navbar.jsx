import { useState, useEffect } from 'react';
import { FiWifi, FiTv, FiCreditCard, FiMenu, FiX, FiLayers, FiMail, FiHome, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white dark:bg-gray-800 shadow-md'
          : 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="bg-blue-600 dark:bg-blue-500 p-2 sm:p-2.5 rounded-lg">
              <FiWifi className="text-white text-lg sm:text-xl" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              EMSINET
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1.5 sm:space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm lg:text-base"
            >
              <FiHome className="text-base lg:text-lg" />
              <span>Inicio</span>
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="flex items-center space-x-1.5 sm:space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm lg:text-base"
            >
              <FiLayers className="text-base lg:text-lg" />
              <span>Servicios</span>
            </button>
            <button
              onClick={() => scrollToSection('payments')}
              className="flex items-center space-x-1.5 sm:space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium text-sm lg:text-base"
            >
              <FiCreditCard className="text-base lg:text-lg" />
              <span>Pagos</span>
            </button>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title={isDark ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDark ? <FiSun className="text-base lg:text-lg" /> : <FiMoon className="text-base lg:text-lg" />}
            </button>
            <a
              href="mailto:atencion.al.cliente@emsinetsolut.com"
              className="flex items-center space-x-1.5 sm:space-x-2 px-4 lg:px-6 py-1.5 lg:py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium text-sm lg:text-base"
            >
              <FiMail className="text-base lg:text-lg" />
              <span>Contacto</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {isDark ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isMobileMenuOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <FiMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 w-full text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2 font-medium"
            >
              <FiHome className="text-lg" />
              <span>Inicio</span>
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="flex items-center space-x-2 w-full text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2 font-medium"
            >
              <FiLayers className="text-lg" />
              <span>Servicios</span>
            </button>
            <button
              onClick={() => scrollToSection('payments')}
              className="flex items-center space-x-2 w-full text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2 font-medium"
            >
              <FiCreditCard className="text-lg" />
              <span>Pagos</span>
            </button>
            <a
              href="mailto:atencion.al.cliente@emsinetsolut.com"
              className="flex items-center justify-center space-x-2 w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiMail className="text-lg" />
              <span>Contacto</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
