import { useState } from 'react';
import {
  ArrowLeft,
  Clock3,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingCart,
  Star,
} from 'lucide-react';
import AuthActions from '../auth/AuthActions';
import Brand from '../common/Brand';
import { formatPrice } from '../../utils/serviceRoute';

const FIXED_INTRO_POINTS = [
  {
    title: 'Phong cách làm việc',
    body: 'Tập trung vào cảm xúc thật, hướng dẫn dáng tự nhiên và ưu tiên trải nghiệm thoải mái trong suốt buổi chụp.',
  },
  {
    title: 'Phù hợp với',
    body: 'Couple, ảnh cưới, ảnh kỷ niệm, lookbook nhẹ nhàng và các concept ngoài trời cần ánh sáng mềm.',
  },
  {
    title: 'Cam kết',
    body: 'Đúng giờ, giao ảnh đúng hẹn, hỗ trợ chọn concept cơ bản và luôn trao đổi rõ ràng trước ngày chụp.',
  },
];

const FIXED_PROFILE_HIGHLIGHTS = [
  {
    label: 'Kinh nghiệm',
    value: '6+ năm chụp ngoài trời.',
  },
  {
    label: 'Chuyên môn',
    value: 'Thành thạo ánh sáng tự nhiên, hướng dẫn tạo dáng và xử lý màu theo tone cảm xúc.',
  },
  {
    label: 'Trình độ',
    value: 'Từng đồng hành cùng nhiều ekip cưới, local brand và các concept cá nhân cao cấp.',
  },
  {
    label: 'Phong cách',
    value: 'Nhẹ nhàng, tinh tế, tập trung vào khoảnh khắc thật và biểu cảm tự nhiên của cặp đôi.',
  },
];

const FIXED_REVIEWS = [
  {
    id: 'r1',
    name: 'Lan Anh',
    rating: '5.0',
    time: '2 tuần trước',
    content:
      'Ekip làm việc rất nhẹ nhàng, hỗ trợ tạo dáng kỹ nên dù không quen chụp ảnh mình vẫn có bộ ảnh rất ưng ý.',
  },
  {
    id: 'r2',
    name: 'Tuấn Khang',
    rating: '4.9',
    time: '1 tháng trước',
    content:
      'Ảnh lên màu đẹp, giao file đúng hẹn và đúng tinh thần couple tự nhiên như mình mong muốn.',
  },
  {
    id: 'r3',
    name: 'Mỹ Duyên',
    rating: '5.0',
    time: '1 tháng trước',
    content:
      'Phần tư vấn concept rất có tâm, anh photographer thân thiện và biết bắt khoảnh khắc rất tốt.',
  },
];

const FIXED_COUPLE_GALLERY = [
  'https://i.pinimg.com/1200x/7d/13/b9/7d13b9b1fe891b8195fff59454e0a539.jpg',
  'https://i.pinimg.com/736x/6c/26/41/6c2641243612beaecc8a7619730e521d.jpg',
  'https://i.pinimg.com/1200x/01/2c/c8/012cc82a0b83dd2e47033f743bd81903.jpg',
  'https://i.pinimg.com/736x/e5/52/49/e552497f263bb736d13d862821e651ca.jpg',
];

function DetailPage({
  cartCount,
  customer,
  onAddToCart,
  selectedPackage,
  selectedPackageId,
  service,
  onBack,
  onLogout,
  onOpenAuth,
  onOpenCart,
  onSelectPackage,
}) {
  const [activeTab, setActiveTab] = useState('service');

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
            <button
              className="detail-icon-button cart-trigger-button"
              type="button"
              aria-label="Giỏ hàng"
              onClick={onOpenCart}
            >
              <ShoppingCart size={18} />
              {cartCount ? <span className="cart-count-badge">{cartCount}</span> : null}
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
            <button
              className={`detail-tab ${activeTab === 'service' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('service')}
            >
              Dịch vụ & Portfolio
            </button>
            <button
              className={`detail-tab ${activeTab === 'intro' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('intro')}
            >
              Giới thiệu
            </button>
            <button
              className={`detail-tab ${activeTab === 'reviews' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá khách hàng
            </button>
          </div>

          {activeTab === 'service' ? (
            <>
              <div className="detail-description">
                <p>
                  Gói dịch vụ được thiết kế theo phong cách chụp tự nhiên, ưu tiên cảm xúc thật và
                  các khoảnh khắc có chiều sâu.
                </p>
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
            </>
          ) : activeTab === 'intro' ? (
            <>
              <div className="detail-section">
                <h2>Giới thiệu</h2>

                <div className="detail-intro-grid">
                  {FIXED_INTRO_POINTS.map((item) => (
                    <article className="detail-intro-card" key={item.title}>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-section-heading">
                  <h2>Giới thiệu bản thân</h2>
                </div>

                <div className="detail-profile-card">
                  <p className="detail-profile-summary">
                    Mình theo đuổi phong cách chụp ảnh thiên về cảm xúc, ưu tiên sự
                    thoải mái, tự nhiên và trải nghiệm dễ chịu cho khách hàng trong suốt buổi chụp.
                  </p>

                  <div className="detail-profile-grid">
                    {FIXED_PROFILE_HIGHLIGHTS.map((item) => (
                      <article className="detail-profile-item" key={item.label}>
                        <span>{item.label}</span>
                        <p>{item.value}</p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <div className="detail-section-heading">
                  <h2>Ảnh đã chụp</h2>
                </div>

                <div className="detail-gallery-grid">
                  {FIXED_COUPLE_GALLERY.map((image, index) => (
                    <div
                      key={image}
                      className={`detail-gallery-item ${index === 0 ? 'feature' : ''}`}
                      style={{ backgroundImage: `url(${image})` }}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="detail-section">
              <div className="detail-section-heading">
                <h2>Đánh giá khách hàng</h2>
              </div>

              <div className="detail-reviews">
                {FIXED_REVIEWS.map((review) => (
                  <article className="review-card" key={review.id}>
                    <div className="review-card-head">
                      <div>
                        <h3>{review.name}</h3>
                        <p>{review.time}</p>
                      </div>
                      <strong>
                        <Star size={15} fill="currentColor" />
                        {review.rating}
                      </strong>
                    </div>
                    <p>{review.content}</p>
                    {review.name === 'Lan Anh' ? (
                      <div className="review-card-image-wrap">
                        <img
                          className="review-card-image"
                          src="https://i.pinimg.com/1200x/62/79/18/62791841f74b42e3ed9e74feeb22e207.jpg"
                          alt="Anh feedback cua Lan Anh"
                        />
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          )}
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

          <button
            className="detail-cart-button"
            type="button"
            onClick={() => onAddToCart(service, selectedPackage)}
            disabled={!selectedPackage}
          >
            <ShoppingCart size={20} />
            <span>Thêm vào giỏ hàng</span>
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
