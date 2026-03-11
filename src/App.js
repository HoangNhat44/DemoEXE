import './App.css';
import {
  Camera,
  Home,
  MapPin,
  Scissors,
  Search,
  Shirt,
  ShoppingCart,
  Sparkles,
  Star,
  UserCheck,
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'Tất cả', icon: Sparkles },
  { id: 'photographer', label: 'Nhiếp ảnh gia', icon: Camera },
  { id: 'makeup', label: 'Makeup Artist', icon: Scissors },
  { id: 'wardrobe', label: 'Thuê Trang phục', icon: Shirt },
  { id: 'model', label: 'Người mẫu', icon: UserCheck },
  { id: 'studio', label: 'Studio & Concept', icon: Home },
];

const services = [
  {
    id: 1,
    category: 'PHOTOGRAPHER',
    title: 'Chụp ảnh Couple & Cưới',
    provider: 'Minh Tran',
    price: '1.200.000 đ',
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    category: 'MAKEUP',
    title: 'Chuyên gia Trang điểm',
    provider: 'Hoa Nguyen MUA',
    price: '600.000 đ',
    rating: 5.0,
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3,
    category: 'WARDROBE',
    title: 'Cho thuê Trang phục',
    provider: 'The Retro Muse',
    price: '150.000 đ',
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 4,
    category: 'PHOTOGRAPHER',
    title: 'Chụp ảnh Sản phẩm',
    provider: 'Hoang Le',
    price: '1.500.000 đ',
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
];

function App() {
  return (
    <div className="app-shell">
      <section className="hero-section">
        <div className="hero-overlay" />

        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">
              <Camera size={16} />
            </span>
            <span>MATCHA</span>
          </div>

          <nav className="topbar-links">
            <button className="icon-button" aria-label="Giỏ hàng">
              <ShoppingCart size={18} />
            </button>
            <a href="#partner">Dành cho Đối tác</a>
            <a href="#login">Đăng nhập</a>
          </nav>
        </header>

        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Hệ sinh thái Nhiếp ảnh & Sáng tạo số 1</span>
          </div>

          <h1>Mọi thứ bạn cần cho một buổi chụp.</h1>
          <p>
            Nhiếp ảnh gia, chuyên gia trang điểm, thuê trang phục, người mẫu và studio
            trong một nơi.
          </p>

          <div className="search-card">
            <div className="search-row">
              <div className="input-wrap">
                <Sparkles size={18} />
                <input
                  type="text"
                  placeholder="Mô tả ý tưởng... VD: Nàng thơ ở Hồ Tây"
                />
              </div>
              <button className="primary-button">Lên ý tưởng</button>
            </div>

            <div className="filter-row">
              <select defaultValue="all">
                <option value="all">📍 Tất cả khu vực</option>
                <option value="hn">📍 Hà Nội</option>
                <option value="hcm">📍 TP. Hồ Chí Minh</option>
              </select>

              <select defaultValue="budget">
                <option value="budget">💰 Mọi mức giá</option>
                <option value="1">💰 Dưới 1 triệu</option>
                <option value="2">💰 1 - 3 triệu</option>
                <option value="3">💰 Trên 3 triệu</option>
              </select>

              <select defaultValue="style">
                <option value="style">✨ Mọi phong cách</option>
                <option value="cinematic">✨ Cinematic</option>
                <option value="editorial">✨ Editorial</option>
                <option value="romantic">✨ Romantic</option>
              </select>
            </div>
          </div>

          <label className="ai-toggle">
            <input type="checkbox" defaultChecked />
            <span>Sử dụng AI kết hợp cùng bộ lọc để thiết kế concept</span>
          </label>
        </div>
      </section>

      <section className="explore-section">
        <div className="section-header">
          <span className="section-kicker">Khám phá dịch vụ</span>
          <h2>Khám phá Dịch vụ</h2>
          <p>Tìm kiếm đối tác hoàn hảo cho concept của bạn.</p>
        </div>

        <div className="category-row">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                className={`category-pill ${index === 0 ? 'active' : ''}`}
                type="button"
              >
                <Icon size={18} />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.id}>
              <div
                className="service-cover"
                style={{ backgroundImage: `url(${service.image})` }}
              >
                <span className="service-tag">{service.category}</span>
                <div className="service-rating">
                  <Star size={14} fill="currentColor" />
                  <span>{service.rating}</span>
                </div>
              </div>

              <div className="service-body">
                <div className="provider-row">
                  <img src={service.avatar} alt={service.provider} />
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.provider}</p>
                  </div>
                </div>

                <div className="service-footer">
                  <strong>{service.price}</strong>
                  <button className="ghost-button" type="button" aria-label="Xem chi tiết">
                    <Search size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="feature-strip">
          <div className="feature-item">
            <MapPin size={18} />
            <span>Đối tác tại Hà Nội và TP. Hồ Chí Minh</span>
          </div>
          <div className="feature-item">
            <Sparkles size={18} />
            <span>Gợi ý concept bằng AI theo mood và ngân sách</span>
          </div>
          <div className="feature-item">
            <Camera size={18} />
            <span>Tìm đủ ekip cho buổi chụp chỉ trong vài phút</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
