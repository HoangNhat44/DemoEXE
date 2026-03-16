import { ShoppingCart, Sparkles } from 'lucide-react';
import AuthActions from '../auth/AuthActions';
import Brand from '../common/Brand';

function HeroSection({ customer, onLogout, onOpenAuth }) {
  return (
    <section className="hero-section">
      <div className="hero-overlay" />

      <header className="topbar">
        <Brand />

        <nav className="topbar-links">
          <button className="icon-button" aria-label="Giỏ hàng" type="button">
            <ShoppingCart size={18} />
          </button>
          <a href="#partner">Dành cho Đối tác</a>
          <AuthActions customer={customer} onLogout={onLogout} onOpenAuth={onOpenAuth} />
        </nav>
      </header>

      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={14} />
          <span>Hệ sinh thái Nhiếp ảnh & Sáng tạo số 1</span>
        </div>

        <h1>Mọi thứ bạn cần cho một buổi chụp.</h1>
        <p>
          Nhiếp ảnh gia, chuyên gia trang điểm, thuê trang phục, người mẫu và studio trong một
          nơi.
        </p>

        <div className="search-card">
          <div className="search-row">
            <div className="input-wrap">
              <Sparkles size={18} />
              <input type="text" placeholder="Mô tả ý tưởng... VD: Nàng thơ ở Hồ Tây" />
            </div>
            <button className="primary-button" type="button">
              Lên ý tưởng
            </button>
          </div>

          <div className="filter-row">
            <select defaultValue="all">
              <option value="all">Tất cả khu vực</option>
              <option value="hn">Hà Nội</option>
              <option value="hcm">TP. Hồ Chí Minh</option>
            </select>

            <select defaultValue="budget">
              <option value="budget">Mọi mức giá</option>
              <option value="1">Dưới 1 triệu</option>
              <option value="2">1 - 3 triệu</option>
              <option value="3">Trên 3 triệu</option>
            </select>

            <select defaultValue="style">
              <option value="style">Mọi phong cách</option>
              <option value="cinematic">Cinematic</option>
              <option value="editorial">Editorial</option>
              <option value="romantic">Romantic</option>
            </select>
          </div>
        </div>

        <label className="ai-toggle">
          <input type="checkbox" defaultChecked />
          <span>Sử dụng AI kết hợp cùng bộ lọc để thiết kế concept</span>
        </label>
      </div>
    </section>
  );
}

export default HeroSection;
