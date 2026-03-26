import ExploreSection from './ExploreSection';
import HeroSection from './HeroSection';

function HomePage({
  activeCategory,
  cartCount,
  categories,
  customer,
  error,
  filteredServices,
  isLoading,
  onCategoryChange,
  onOpenCart,
  onOpenIdeaPage,
  onLogout,
  onOpenAuth,
  onOpenService,
}) {
  return (
    <div className="app-shell">
      <HeroSection
        cartCount={cartCount}
        customer={customer}
        onLogout={onLogout}
        onOpenAuth={onOpenAuth}
        onOpenCart={onOpenCart}
        onOpenIdeaPage={onOpenIdeaPage}
      />
      <ExploreSection
        activeCategory={activeCategory}
        categories={categories}
        error={error}
        filteredServices={filteredServices}
        isLoading={isLoading}
        onCategoryChange={onCategoryChange}
        onOpenService={onOpenService}
      />
    </div>
  );
}

export default HomePage;
