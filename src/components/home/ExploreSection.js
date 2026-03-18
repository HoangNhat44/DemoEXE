import { features } from '../../data/features';
import CategoryFilter from './CategoryFilter';
import ServiceCard from '../services/ServiceCard';

function ExploreSection({
  activeCategory,
  categories,
  error,
  filteredServices,
  isLoading,
  onCategoryChange,
  onOpenService,
}) {
  return (
    <section className="explore-section">
      <div className="section-header">
        <span className="section-kicker">Khám phá dịch vụ</span>
        <h2>Khám phá dịch vụ</h2>
        <p>Tìm kiếm đối tác hoàn hảo cho concept của bạn.</p>
      </div>

      <CategoryFilter
        activeCategory={activeCategory}
        categories={categories}
        onCategoryChange={onCategoryChange}
      />

      {isLoading ? <p className="status-message">Đang tải dữ liệu...</p> : null}
      {!isLoading && error ? <p className="status-message error-message">{error}</p> : null}
      {!isLoading && !error && filteredServices.length === 0 ? (
        <p className="status-message">Chưa có dịch vụ phù hợp.</p>
      ) : null}

      {!isLoading && !error ? (
        <div className="service-grid">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} onOpenService={onOpenService} />
          ))}
        </div>
      ) : null}

      <div className="feature-strip">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div className="feature-item" key={feature.id}>
              <Icon size={18} />
              <span>{feature.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ExploreSection;
