import { useEffect, useMemo, useState } from 'react';
import AuthModal from './components/auth/AuthModal';
import CartDrawer from './components/cart/CartDrawer';
import CheckoutPage from './components/cart/CheckoutPage';
import CheckoutSuccessModal from './components/cart/CheckoutSuccessModal';
import HomePage from './components/home/HomePage';
import IdeaPlanPage from './components/home/IdeaPlanPage';
import PartnerDashboard from './components/partner/PartnerDashboard';
import PartnerServiceFormPage from './components/partner/PartnerServiceFormPage';
import DetailPage from './components/services/DetailPage';
import { useAuth } from './hooks/useAuth';
import { useCategories } from './hooks/useCategories';
import { useServices } from './hooks/useServices';
import { getServiceIdFromHash } from './utils/serviceRoute';
import './App.css';

function getPartnerEditorServiceId(hash) {
  const match = hash.match(/^#\/partner\/services\/(\d+)\/edit$/);
  return match ? Number(match[1]) : null;
}

function getIsIdeaPage(hash) {
  return hash === '#/idea';
}

function App() {
  const initialHash = window.location.hash;
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = window.localStorage.getItem('matcha-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState(false);
  const [checkoutSummary, setCheckoutSummary] = useState(null);
  const [isCheckoutPageOpen, setIsCheckoutPageOpen] = useState(initialHash === '#/checkout');
  const [isIdeaPageOpen, setIsIdeaPageOpen] = useState(getIsIdeaPage(initialHash));
  const [checkoutReturnHash, setCheckoutReturnHash] = useState('');
  const [isPartnerCreatePageOpen, setIsPartnerCreatePageOpen] = useState(initialHash === '#/partner/new');
  const [partnerEditingServiceId, setPartnerEditingServiceId] = useState(
    getPartnerEditorServiceId(initialHash)
  );
  const [ideaPrompt, setIdeaPrompt] = useState(() => window.localStorage.getItem('matcha-idea-prompt') || '');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedServiceId, setSelectedServiceId] = useState(() =>
    getServiceIdFromHash(initialHash)
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
    window.localStorage.setItem('matcha-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    window.localStorage.setItem('matcha-idea-prompt', ideaPrompt);
  }, [ideaPrompt]);

  useEffect(() => {
    function handleHashChange() {
      const { hash } = window.location;
      setSelectedServiceId(getServiceIdFromHash(hash));
      setIsCheckoutPageOpen(hash === '#/checkout');
      setIsIdeaPageOpen(getIsIdeaPage(hash));
      setIsPartnerCreatePageOpen(hash === '#/partner/new');
      setPartnerEditingServiceId(getPartnerEditorServiceId(hash));
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

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  function openCheckoutPage() {
    if (!cartItems.length) {
      return;
    }

    setCheckoutReturnHash(window.location.hash === '#/checkout' ? '' : window.location.hash);
    setIsCartOpen(false);
    window.location.hash = '/checkout';
  }

  function closeCheckoutPage() {
    window.location.hash = checkoutReturnHash || '';
  }

  function openIdeaPage(nextIdeaPrompt) {
    setIdeaPrompt(nextIdeaPrompt || ideaPrompt || 'nàng thơ ở hồ tây');
    window.location.hash = '/idea';
  }

  function closeIdeaPage() {
    window.location.hash = '';
  }

  function openPartnerCreatePage() {
    window.location.hash = '/partner/new';
  }

  function openPartnerEditPage(serviceId) {
    window.location.hash = `/partner/services/${serviceId}/edit`;
  }

  function closePartnerFormPage() {
    window.location.hash = '';
  }

  function addToCart(service, pkg) {
    if (!service || !pkg) {
      return;
    }

    const cartItem = {
      id: `${service.id}-${pkg.id}`,
      serviceId: service.id,
      packageId: pkg.id,
      provider: service.provider,
      serviceTitle: service.title,
      packageName: pkg.name,
      price: pkg.price,
      image: service.image,
    };

    setCartItems((currentItems) => {
      const withoutDuplicate = currentItems.filter((item) => item.id !== cartItem.id);
      return [...withoutDuplicate, cartItem];
    });
    setIsCartOpen(true);
  }

  function removeCartItem(cartItemId) {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== cartItemId));
  }

  function checkoutCart(summary) {
    if (!cartItems.length) {
      return;
    }

    setCheckoutSummary(summary || null);
    setCartItems([]);
    setIsCartOpen(false);
    setIsCheckoutPageOpen(false);
    setIsCheckoutSuccessOpen(true);
    window.location.hash = '';
  }

  function handleCheckoutSuccessConfirm() {
    setIsCheckoutSuccessOpen(false);
    setCheckoutSummary(null);
    window.location.hash = '';
  }

  if (isIdeaPageOpen) {
    return (
      <>
        <IdeaPlanPage
          ideaPrompt={ideaPrompt}
          onBack={closeIdeaPage}
          onOpenCart={openCart}
          onOpenService={openServiceDetail}
          services={servicesWithCategory}
        />
        <CartDrawer
          cartItems={cartItems}
          isOpen={isCartOpen}
          onCheckout={openCheckoutPage}
          onClose={closeCart}
          onRemoveItem={removeCartItem}
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

  if (isCheckoutPageOpen) {
    return (
      <>
        <CheckoutPage cartItems={cartItems} onBack={closeCheckoutPage} onCheckout={checkoutCart} />
        <AuthModal
          categories={categories}
          isOpen={isAuthModalOpen}
          mode={authMode}
          onClose={closeAuthModal}
          onLogin={login}
          onRegister={register}
        />
        <CheckoutSuccessModal
          isOpen={isCheckoutSuccessOpen}
          checkoutSummary={checkoutSummary}
          onConfirm={handleCheckoutSuccessConfirm}
        />
      </>
    );
  }

  if (selectedService) {
    return (
      <>
        <DetailPage
          cartCount={cartItems.length}
          customer={customer}
          onAddToCart={addToCart}
          selectedPackage={selectedPackage}
          selectedPackageId={selectedPackageId}
          service={selectedService}
          onBack={closeServiceDetail}
          onOpenCart={openCart}
          onLogout={logout}
          onOpenAuth={openAuthModal}
          onSelectPackage={setSelectedPackageId}
        />
        <CartDrawer
          cartItems={cartItems}
          isOpen={isCartOpen}
          onCheckout={openCheckoutPage}
          onClose={closeCart}
          onRemoveItem={removeCartItem}
        />
        <AuthModal
          categories={categories}
          isOpen={isAuthModalOpen}
          mode={authMode}
          onClose={closeAuthModal}
          onLogin={login}
          onRegister={register}
        />
        <CheckoutSuccessModal
          isOpen={isCheckoutSuccessOpen}
          checkoutSummary={checkoutSummary}
          onConfirm={handleCheckoutSuccessConfirm}
        />
      </>
    );
  }

  if (customer?.role === 'partner') {
    const partnerServices = servicesWithCategory.filter(
      (service) => Number(service.ownerId) === Number(customer.id)
    );
    const editingService =
      partnerServices.find((service) => Number(service.id) === Number(partnerEditingServiceId)) || null;

    if (isPartnerCreatePageOpen || editingService) {
      return (
        <>
          <PartnerServiceFormPage
            customer={customer}
            editingService={editingService}
            onBack={closePartnerFormPage}
            onCreateService={createPartnerService}
            onLogout={logout}
            onOpenAuth={openAuthModal}
            onUpdateService={updatePartnerService}
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
        <PartnerDashboard
          categories={categories}
          customer={customer}
          onDeleteService={deletePartnerService}
          onEditService={openPartnerEditPage}
          onLogout={logout}
          onOpenAuth={openAuthModal}
          onOpenServiceCreate={openPartnerCreatePage}
          onOpenService={openServiceDetail}
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
        <CheckoutSuccessModal
          isOpen={isCheckoutSuccessOpen}
          checkoutSummary={checkoutSummary}
          onConfirm={handleCheckoutSuccessConfirm}
        />
      </>
    );
  }

  return (
    <>
      <HomePage
        activeCategory={activeCategory}
        cartCount={cartItems.length}
        categories={displayCategories}
        customer={customer}
        error={error || categoriesError}
        filteredServices={filteredServices}
        isLoading={isLoading || isCategoriesLoading}
        onCategoryChange={setActiveCategory}
        onOpenCart={openCart}
        onOpenIdeaPage={openIdeaPage}
        onLogout={logout}
        onOpenAuth={openAuthModal}
        onOpenService={openServiceDetail}
      />
      <CartDrawer
        cartItems={cartItems}
        isOpen={isCartOpen}
        onCheckout={openCheckoutPage}
        onClose={closeCart}
        onRemoveItem={removeCartItem}
      />
      <AuthModal
        categories={categories}
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={closeAuthModal}
        onLogin={login}
        onRegister={register}
      />
      <CheckoutSuccessModal
        isOpen={isCheckoutSuccessOpen}
        checkoutSummary={checkoutSummary}
        onConfirm={handleCheckoutSuccessConfirm}
      />
    </>
  );
}

export default App;
