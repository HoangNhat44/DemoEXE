import { useEffect, useMemo, useState } from 'react';
import AuthModal from './components/auth/AuthModal';
import HomePage from './components/home/HomePage';
import DetailPage from './components/services/DetailPage';
import { useAuth } from './hooks/useAuth';
import { useServices } from './hooks/useServices';
import { getServiceIdFromHash } from './utils/serviceRoute';
import './App.css';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedServiceId, setSelectedServiceId] = useState(() =>
    getServiceIdFromHash(window.location.hash)
  );
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { services, isLoading, error } = useServices();
  const { customer, login, logout, register } = useAuth();

  useEffect(() => {
    function handleHashChange() {
      setSelectedServiceId(getServiceIdFromHash(window.location.hash));
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const filteredServices =
    activeCategory === 'all'
      ? services
      : services.filter((service) => service.categoryId === activeCategory);

  const selectedService = useMemo(
    () => services.find((service) => String(service.id) === String(selectedServiceId)) || null,
    [selectedServiceId, services]
  );

  useEffect(() => {
    if (selectedService?.packages?.length) {
      setSelectedPackageId(selectedService.packages[0].id);
      return;
    }

    setSelectedPackageId(null);
  }, [selectedService]);

  const selectedPackage =
    selectedService?.packages?.find((pkg) => pkg.id === selectedPackageId) || null;

  function openServiceDetail(serviceId) {
    window.location.hash = `/service/${serviceId}`;
  }

  function closeServiceDetail() {
    window.location.hash = '';
  }

  function openAuthModal(mode = 'login') {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }

  function closeAuthModal() {
    setIsAuthModalOpen(false);
  }

  if (selectedService) {
    return (
      <>
        <DetailPage
          customer={customer}
          selectedPackage={selectedPackage}
          selectedPackageId={selectedPackageId}
          service={selectedService}
          onBack={closeServiceDetail}
          onLogout={logout}
          onOpenAuth={openAuthModal}
          onSelectPackage={setSelectedPackageId}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          mode={authMode}
          onClose={closeAuthModal}
          onLogin={login}
          onRegister={register}
        />
      </>
    );
  }

  return (
    <>
      <HomePage
        activeCategory={activeCategory}
        customer={customer}
        error={error}
        filteredServices={filteredServices}
        isLoading={isLoading}
        onCategoryChange={setActiveCategory}
        onLogout={logout}
        onOpenAuth={openAuthModal}
        onOpenService={openServiceDetail}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={closeAuthModal}
        onLogin={login}
        onRegister={register}
      />
    </>
  );
}

export default App;
