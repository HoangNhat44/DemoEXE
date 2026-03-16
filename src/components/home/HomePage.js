import ExploreSection from './ExploreSection';
import HeroSection from './HeroSection';

function HomePage({
  activeCategory,
  customer,
  error,
  filteredServices,
  isLoading,
  onCategoryChange,
  onLogout,
  onOpenAuth,
  onOpenService,
}) {
  return (
    <div className="app-shell">
      <HeroSection customer={customer} onLogout={onLogout} onOpenAuth={onOpenAuth} />
      <ExploreSection
        activeCategory={activeCategory}
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
