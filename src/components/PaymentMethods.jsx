import { useState, useEffect } from 'react';
// ❌ DATOS ESTÁTICOS DESHABILITADOS - SOLO USA LA API
// import { paymentMethods } from '../data/paymentMethods';
import { LandingService } from '../services/api.service';
import { FiCreditCard, FiCopy, FiCheck, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const PaymentMethodCard = ({ method, delay = 0 }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 });

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div 
      ref={ref}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 ${
        isVisible ? 'scroll-visible' : 'scroll-hidden'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 dark:bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl sm:text-2xl shadow-md flex-shrink-0">
              {method.logo}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{method.name}</h3>
              {method.comingSoon && (
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Próximamente</span>
              )}
            </div>
          </div>
        </div>

        {method.comingSoon ? (
          <div className="text-center py-6 sm:py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-3 sm:mb-4">
              <FiCreditCard className="text-yellow-600 dark:text-yellow-400 text-2xl sm:text-3xl" />
            </div>
            <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-full">
              {method.mensaje || "Próximamente Disponible"}
            </span>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {method.accounts.map((account, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div className="p-1 sm:p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                      <FiDollarSign className="text-blue-600 dark:text-blue-400 text-sm sm:text-base" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
                      {account.type}
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-2 py-1 rounded flex-shrink-0 ml-2">
                    {account.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm sm:text-base font-mono font-bold text-gray-900 dark:text-white break-all block bg-white dark:bg-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded border border-gray-200 dark:border-gray-600 text-xs sm:text-sm">
                      {account.number}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(account.number, index)}
                    className={`flex-shrink-0 p-2 sm:p-2.5 rounded-lg transition-all ${
                      copiedIndex === index
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800'
                    }`}
                    title="Copiar número"
                  >
                    {copiedIndex === index ? (
                      <FiCheck className="text-base sm:text-lg" />
                    ) : (
                      <FiCopy className="text-base sm:text-lg" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentMethods = () => {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.2 });
  const [infoRef, infoVisible] = useScrollAnimation({ threshold: 0.2 });
  
  // Estado para los métodos de pago de la API
  const [methods, setMethods] = useState([]); // ❌ SIN datos estáticos - SOLO API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar métodos de pago desde la API
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const response = await LandingService.getMetodosPago();
        
        // Mapear la respuesta de la API al formato esperado por el componente
        if (response && Array.isArray(response)) {
          const mappedMethods = mapPaymentMethods(response);
          setMethods(mappedMethods);
          setError(null);
        } else if (response && response.data && Array.isArray(response.data)) {
          const mappedMethods = mapPaymentMethods(response.data);
          setMethods(mappedMethods);
          setError(null);
        }
      } catch (err) {
        console.error('Error al cargar métodos de pago:', err);
        setError('No se pudieron cargar los métodos de pago desde la API. Por favor, verifica tu conexión.');
        setMethods([]); // ❌ NO usar datos estáticos - dejar vacío
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // Función auxiliar para mapear los métodos de pago
  const mapPaymentMethods = (apiMethods) => {
    // Filtrar solo los activos y ordenar por "orden"
    const activeMethods = apiMethods
      .filter(method => method.activo === true || method.activo === undefined) // Solo activos
      .sort((a, b) => (a.orden || a.id || 0) - (b.orden || b.id || 0)); // Ordenar por "orden"
    
    // Agrupar por banco
    const grouped = {};
    
    activeMethods.forEach((method) => {
      // Usar los campos exactos del backend
      const bankName = method.nombreBanco || method.banco || method.bank || method.name;
      const accountType = method.tipoCuenta || method.tipo || method.type;
      const accountNumber = method.numeroCuenta || method.cuenta || method.account || method.number;
      const mensaje = method.mensaje || method.message;
      const icono = method.icono || method.icon;
      const moneda = method.moneda;
      const orden = method.orden || method.id;
      
      if (!grouped[bankName]) {
        grouped[bankName] = {
          name: bankName,
          logo: icono || "🏦",  // Usar el icono de la API (🏦🏛️💳), fallback solo si no viene
          accounts: [],
          comingSoon: false,
          mensaje: null, // Mensaje para "Próximamente"
          orden: orden // Guardar orden para ordenar después
        };
      }
      
      // Verificar si es "Próximamente"
      if (accountType?.toLowerCase().includes('próximamente') || 
          accountType?.toLowerCase().includes('proximamente') ||
          mensaje?.toLowerCase().includes('próximamente') ||
          mensaje?.toLowerCase().includes('proximamente')) {
        grouped[bankName].comingSoon = true;
        grouped[bankName].mensaje = mensaje || "Próximamente Disponible"; // Guardar mensaje del backend
      } else if (accountNumber && accountNumber !== null && accountNumber !== '-') {
        grouped[bankName].accounts.push({
          type: accountType,
          symbol: moneda || getAccountSymbol(accountType, accountNumber),  // Usar moneda exacta del backend
          number: accountNumber,
          orden: orden // Guardar orden para ordenar cuentas
        });
      }
    });
    
    // Ordenar cuentas dentro de cada banco por "orden"
    Object.keys(grouped).forEach(bankName => {
      if (grouped[bankName].accounts.length > 0) {
        grouped[bankName].accounts.sort((a, b) => (a.orden || 0) - (b.orden || 0));
      }
    });
    
    // Convertir a array y ordenar por "orden" del banco
    return Object.values(grouped)
      .sort((a, b) => (a.orden || 0) - (b.orden || 0))
      .map((method, index) => ({
        id: index + 1,
        ...method
      }));
  };

  // Función auxiliar para obtener el logo del banco (DEPRECADA - El backend siempre trae icono)
  // Se mantiene solo como fallback de emergencia
  const getBankLogo = (bankName) => {
    const name = bankName?.toLowerCase() || '';
    if (name.includes('banpro')) return '🏦';
    if (name.includes('lafise')) return '🏛️';
    if (name.includes('bac')) return '💳';
    return '🏦'; // Por defecto
  };

  // Función auxiliar para obtener el símbolo de la cuenta
  const getAccountSymbol = (type, number) => {
    const typeStr = type?.toLowerCase() || '';
    if (typeStr.includes('córdoba')) return 'C$';
    if (typeStr.includes('dólar') || typeStr.includes('dolar')) return '$';
    if (typeStr.includes('móvil') || typeStr.includes('movil') || typeStr.includes('billetera')) return '📱';
    // Detectar por el número si empieza con $ o C$
    if (number?.startsWith('$')) return '$';
    if (number?.startsWith('C$')) return 'C$';
    return 'C$'; // Por defecto
  };

  return (
    <section id="payments" className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 overflow-hidden transition-colors duration-300">
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-tl from-white via-gray-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950"></div>
      
      {/* Efectos de glow sutiles */}
      <div className="absolute top-0 left-1/3 w-[350px] h-[350px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-[250px] h-[250px] bg-indigo-400/10 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto">
        <div 
          ref={headerRef}
          className={`text-center mb-10 sm:mb-12 lg:mb-16 ${
            headerVisible ? 'scroll-visible' : 'scroll-hidden'
          }`}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 dark:bg-blue-500 rounded-xl mb-3 sm:mb-4 shadow-md">
            <FiCreditCard className="text-white text-2xl sm:text-3xl" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
            Métodos de Pago
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Estas son las cuentas donde puedes realizar tus pagos de forma segura y rápida
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
        {loading && methods.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
            {methods.map((method, index) => (
            <PaymentMethodCard key={method.id} method={method} delay={index * 150} />
          ))}
        </div>
        )}

        {/* Info Box */}
        <div 
          ref={infoRef}
          className={`max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-500 rounded-lg p-4 sm:p-6 shadow-sm ${
            infoVisible ? 'scroll-visible' : 'scroll-hidden'
          }`}
        >
          <div className="flex items-start space-x-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                <FiCheck className="text-white text-lg sm:text-xl" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-2">Importante</h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Después de realizar tu pago, por favor envía el comprobante (recibo del pago) a nuestro equipo 
                para procesar tu pago de manera inmediata. Puedes enviarlo a través de{' '}
                <a 
                  href="https://wa.me/50589308058"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 underline"
                >
                  WhatsApp: 89308058
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;

