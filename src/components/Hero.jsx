import { FiWifi, FiArrowDown } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Hero = () => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 pt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div 
          ref={ref}
          className={`space-y-6 sm:space-y-8 ${
            isVisible ? 'scroll-visible' : 'scroll-hidden'
          }`}
        >
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-blue-600 dark:bg-blue-500 p-6 sm:p-8 rounded-2xl shadow-lg">
              <FiWifi className="text-white text-4xl sm:text-5xl lg:text-6xl" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
            <span className="block">EMSINET</span>
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-gray-600 dark:text-gray-400 mt-2 sm:mt-4 block">
              Internet
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Conectamos tu mundo digital con los mejores servicios de internet
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            de alta velocidad para tu hogar
          </p>

          {/* Scroll Indicator */}
          <div className="mt-12 sm:mt-16">
            <button
              onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FiArrowDown className="text-2xl sm:text-3xl mx-auto animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
