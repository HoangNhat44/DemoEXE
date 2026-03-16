import {
  ArrowLeft,
  Clock3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';
import AuthActions from '../auth/AuthActions';
import Brand from '../common/Brand';
import { formatPrice } from '../../utils/serviceRoute';

function DetailPage({
  customer,
  service,
  selectedPackage,
  selectedPackageId,
  onBack,
  onLogout,
  onOpenAuth,
  onSelectPackage,
}) {
  return (
    <div className="detail-page">
      <section
        className="detail-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(17, 13, 11, 0.35), rgba(17, 13, 11, 0.6)), url(${service.image})`,
        }}
      >
        <header className="detail-topbar">
          <button className="detail-icon-button" type="button" aria-label="Quay lại" onClick={onBack}>
            <ArrowLeft size={18} />
          </button>

          <Brand className="detail-brand" />

          <div className="detail-topbar-actions">
            <button className="detail-icon-button" type="button" aria-label="Giỏ hàng">
              <ShoppingCart size={18} />
            </button>
            <AuthActions customer={customer} onLogout={onLogout} onOpenAuth={onOpenAuth} />
          </div>
        </header>

        <div className="detail-provider">
          <img className="detail-provider-avatar" src={service.avatar} alt={service.provider} />
          <div className="detail-provider-copy">
            <span className="detail-category-pill">{service.categoryLabel}</span>
            <h1>{service.provider}</h1>
            <div className="detail-provider-meta">
              <ShieldCheck size={18} />
              <span>{service.title}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="detail-content">
        <div className="detail-main">
          <div className="detail-tabs">
            <button className="detail-tab active" type="button">
              Dịch vụ & Portfolio
            </button>
            <button className="detail-tab" type="button">
              Đánh giá từ khách hàng ({service.reviewCount || 0})
            </button>
          </div>

          <div className="detail-description">
            <p>{service.description}</p>
          </div>

          <div className="detail-section">
            <h2>Các gói dịch vụ</h2>

            <div className="detail-packages">
              {(service.packages || []).map((pkg) => (
                <button
                  key={pkg.id}
                  className={`package-card ${pkg.id === selectedPackageId ? 'active' : ''}`}
                  type="button"
                  onClick={() => onSelectPackage(pkg.id)}
                >
                  <div className="package-head">
                    <h3>{pkg.name}</h3>
                    <strong>{formatPrice(pkg.price)}</strong>
                  </div>
                  <div className="package-meta">
                    <span>
                      <Clock3 size={16} />
                      {pkg.duration}
                    </span>
                    <span>
                      <MapPin size={16} />
                      {pkg.location}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="detail-sidebar">
          <button
            className="detail-contact-button"
            type="button"
            onClick={() => {
              if (!customer) {
                onOpenAuth('login');
              }
            }}
          >
            <MessageCircle size={20} />
            <span>{customer ? 'Trao đổi với Đối tác' : 'Đăng nhập để trao đổi'}</span>
          </button>

          <div className="detail-summary-card">
            <h3>Tổng quan</h3>
            {selectedPackage ? (
              <div className="summary-body">
                <div className="summary-row">
                  <span>Gói đã chọn</span>
                  <strong>{selectedPackage.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Giá</span>
                  <strong>{formatPrice(selectedPackage.price)}</strong>
                </div>
                <div className="summary-row">
                  <span>Thời lượng</span>
                  <strong>{selectedPackage.duration}</strong>
                </div>
                <div className="summary-row">
                  <span>Địa điểm</span>
                  <strong>{selectedPackage.location}</strong>
                </div>
              </div>
            ) : (
              <p>Vui lòng chọn 1 gói dịch vụ</p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

export default DetailPage;
