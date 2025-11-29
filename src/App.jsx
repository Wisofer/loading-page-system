import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import PaymentMethods from './components/PaymentMethods';
import Footer from './components/Footer';

function App() {
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
