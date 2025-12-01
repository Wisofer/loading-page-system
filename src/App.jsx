import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import PaymentMethods from './components/PaymentMethods';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    // Detectar si viene de un PDF o tiene parámetro para ir directo a pagos
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    
    // Si hay parámetro ?from=pdf o #payments, ir directo a métodos de pago
    if (urlParams.get('from') === 'pdf' || hash === '#payments' || hash === '#pagos') {
      setTimeout(() => {
        const paymentsSection = document.getElementById('payments');
        if (paymentsSection) {
          paymentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500); // Pequeño delay para asegurar que la página cargó
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <Hero />
      <Services />
      <PaymentMethods />
      <Footer />
    </div>
  );
}

export default App;
