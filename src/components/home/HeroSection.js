import { useState } from 'react';
import { ImagePlus, LoaderCircle, ShoppingCart, Sparkles } from 'lucide-react';
import AuthActions from '../auth/AuthActions';
import Brand from '../common/Brand';

const HERO_POSTER =
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80';
const HERO_VIDEO =
  'https://www.pexels.com/download/video/29539460/';

const LOCATION_OPTIONS = [
  { value: 'all', label: 'Tất cả khu vực' },
  { value: 'hn', label: 'Hà Nội' },
  { value: 'hcm', label: 'TP. Hồ Chí Minh' },
];

const BUDGET_OPTIONS = [
  { value: 'budget', label: 'Mọi mức giá' },
  { value: '1', label: 'Dưới 1 triệu' },
  { value: '2', label: '1 - 3 triệu' },
  { value: '3', label: 'Trên 3 triệu' },
];

const STYLE_OPTIONS = [
  { value: 'style', label: 'Mọi phong cách' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'romantic', label: 'Romantic' },
];

function HeroSection({ cartCount, customer, onLogout, onOpenAuth, onOpenCart, onOpenIdeaPage }) {
  const [idea, setIdea] = useState('');
  const [location, setLocation] = useState('all');
  const [budget, setBudget] = useState('budget');
  const [style, setStyle] = useState('style');
  const [selectedImageName, setSelectedImageName] = useState('');
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);

  function handleIdeaImageChange(event) {
    const file = event.target.files?.[0];
    setSelectedImageName(file ? file.name : '');
  }

  function handleOpenIdeaPage() {
    if (isGeneratingIdea) {
      return;
    }

    const trimmedIdea = idea.trim();
    setIsGeneratingIdea(true);

    window.setTimeout(() => {
      onOpenIdeaPage(trimmedIdea || 'nàng thơ ở hồ tây');
      setIsGeneratingIdea(false);
    }, 5000);
  }

  return (
    <section className="hero-section">
      <div className="hero-media" aria-hidden="true">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={HERO_POSTER}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      </div>

      <div className="hero-overlay" />

      <header className="topbar">
        <Brand />

        <nav className="topbar-links">
          <button
            className="icon-button cart-trigger-button"
            aria-label="Giỏ hàng"
            type="button"
            onClick={onOpenCart}
          >
            <ShoppingCart size={18} />
            {cartCount ? <span className="cart-count-badge">{cartCount}</span> : null}
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
          Nhiếp ảnh gia, chuyên gia trang điểm, thuê trang phục, người mẫu và studio trong một nơi.
        </p>

        <div className="search-card">
          <div className="search-row">
            <div className="input-wrap">
              <Sparkles size={18} />
              <input
                type="text"
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder="Mô tả ý tưởng... VD: Nàng thơ ở Hồ Tây"
              />
              <label className="idea-upload-button" htmlFor="idea-image-upload">
                <ImagePlus size={16} />
                <span>Tải ảnh</span>
              </label>
              <input
                id="idea-image-upload"
                className="idea-upload-input"
                type="file"
                accept="image/*"
                onChange={handleIdeaImageChange}
              />
            </div>
            <button className="primary-button" type="button" onClick={handleOpenIdeaPage} disabled={isGeneratingIdea}>
              {isGeneratingIdea ? <LoaderCircle className="spin-icon" size={18} /> : null}
              <span>{isGeneratingIdea ? 'Đang tạo concept...' : 'Lên ý tưởng'}</span>
            </button>
          </div>

          {selectedImageName ? <p className="idea-upload-file">Ảnh đã chọn: {selectedImageName}</p> : null}

          <div className="filter-row">
            <select value={location} onChange={(event) => setLocation(event.target.value)}>
              {LOCATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select value={budget} onChange={(event) => setBudget(event.target.value)}>
              {BUDGET_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select value={style} onChange={(event) => setStyle(event.target.value)}>
              {STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
