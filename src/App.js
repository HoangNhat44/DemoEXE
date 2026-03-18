import { useEffect, useMemo, useState } from 'react';
import AuthModal from './components/auth/AuthModal';
import HomePage from './components/home/HomePage';
import PartnerDashboard from './components/partner/PartnerDashboard';
import DetailPage from './components/services/DetailPage';
import { useAuth } from './hooks/useAuth';
import { useCategories } from './hooks/useCategories';
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
  const {
    services,
    isLoading,
    error,
    createPartnerService,
    updatePartnerService,
    deletePartnerService,
  } = useServices();
  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategories();
  const { customer, login, logout, register } = useAuth();

  useEffect(() => {
    function handleHashChange() {
      setSelectedServiceId(getServiceIdFromHash(window.location.hash));
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const displayCategories = useMemo(
    () => [{ id: 'all', label: 'Tất cả', iconKey: 'sparkles' }, ...categories],
    [categories]
  );

  const servicesWithCategory = useMemo(
    () =>
      services.map((service) => {
        const matchedCategory = categories.find((category) => category.id === service.categoryId);

        return {
          ...service,
          categoryLabel: matchedCategory?.badgeLabel || matchedCategory?.label || 'Dịch vụ',
        };
      }),
    [categories, services]
  );

  const filteredServices =
    activeCategory === 'all'
      ? servicesWithCategory
      : servicesWithCategory.filter((service) => service.categoryId === activeCategory);

  const selectedService = useMemo(
    () =>
      servicesWithCategory.find((service) => String(service.id) === String(selectedServiceId)) ||
      null,
    [selectedServiceId, servicesWithCategory]
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
          categories={categories}
          isOpen={isAuthModalOpen}
          mode={authMode}
          onClose={closeAuthModal}
          onLogin={login}
          onRegister={register}
        />
      </>
    );
  }

  if (customer?.role === 'partner') {
    const partnerServices = servicesWithCategory.filter(
      (service) => Number(service.ownerId) === Number(customer.id)
    );

    return (
      <>
        <PartnerDashboard
          categories={categories}
          customer={customer}
          onCreateService={createPartnerService}
          onDeleteService={deletePartnerService}
          onLogout={logout}
          onOpenAuth={openAuthModal}
          onOpenService={openServiceDetail}
          onUpdateService={updatePartnerService}
          services={partnerServices}
        />
        <AuthModal
          categories={categories}
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
        categories={displayCategories}
        customer={customer}
        error={error || categoriesError}
        filteredServices={filteredServices}
        isLoading={isLoading || isCategoriesLoading}
        onCategoryChange={setActiveCategory}
        onLogout={logout}
        onOpenAuth={openAuthModal}
        onOpenService={openServiceDetail}
      />
      <AuthModal
        categories={categories}
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
