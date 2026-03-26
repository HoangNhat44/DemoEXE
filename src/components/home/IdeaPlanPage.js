import {
  ArrowLeft,
  Camera,
  CreditCard,
  MapPin,
  ShoppingCart,
  Sparkles,
  Star,
  WandSparkles,
} from 'lucide-react';
import Brand from '../common/Brand';

const MOODBOARD_IMAGES = [
  'https://i.pinimg.com/736x/3d/be/bc/3dbebcf4c3697917d436f7e1938dfcea.jpg',
  'https://i.pinimg.com/736x/e2/ec/97/e2ec972668bbb28b62de72e261d79dd7.jpg',
  'https://i.pinimg.com/736x/fb/61/0e/fb610e5a9da05cee74f24f942c866863.jpg',
];

const STYLE_TAGS = ['NÀNG THƠ', 'HỒ TÂY', 'VINTAGE', 'LÃNG MẠN', 'HOÀNG HÔN', 'HÀ NỘI'];

const CONCEPT_FEATURES = [
  {
    label: 'Vibe & cảm hứng',
    value: 'Thơ mộng, nhẹ nhàng, hoài niệm và đậm chất điện ảnh Pháp',
  },
  {
    label: 'Makeup & trang phục',
    value: 'Váy maxi trắng nhẹ nhàng, chất liệu lụa hoặc voan, kết hợp cùng mũ cói và sandal quai mảnh.',
  },
];

const POSING_GUIDES = [
  {
    title: 'Bước chậm dọc bờ hồ',
    body: 'Thả lỏng vai, mắt nhìn xa và để tà váy hoặc tóc chuyển động theo gió để khung hình tự nhiên hơn.',
  },
  {
    title: 'Ngồi nghiêng nhẹ trên ghế đá',
    body: 'Giữ lưng thẳng, tay đặt hờ trên váy hoặc bó hoa, gương mặt nghiêng 30 độ để lên nét mềm mại.',
  },
  {
    title: 'Chạm tay vào nón hoặc hoa',
    body: 'Dùng đạo cụ như bó cúc nhỏ, mũ cói hoặc khăn lụa để tạo điểm nhấn và giúp tay không bị cứng.',
  },
];

function IdeaPlanPage({ ideaPrompt, onBack, onOpenCart, onOpenService, services }) {
  const primaryPhotographyService =
    services.find((service) => Number(service.id) === 1) ||
    services.find((service) => String(service.provider || '').toLowerCase().includes('minh tr')) ||
    services.find((service) => Number(service.categoryId) === 1) ||
    null;
  const secondaryPhotographyService = services.find((service) => Number(service.id) === 7) || null;
  const makeupService =
    services.find((service) => String(service.provider || '').toLowerCase().includes('hoa nguy')) ||
    services.find((service) => Number(service.categoryId) === 2) ||
    null;

  const suggestedPartners = [
    primaryPhotographyService
      ? {
          serviceId: primaryPhotographyService.id,
          serviceCode: `ID #${primaryPhotographyService.id}`,
          badge: 'NHIẾP ẢNH',
          title: primaryPhotographyService.title,
          provider: primaryPhotographyService.provider,
          price: primaryPhotographyService.price,
          rating: primaryPhotographyService.rating,
          image: primaryPhotographyService.image,
          avatar: primaryPhotographyService.avatar,
        }
      : null,
    secondaryPhotographyService
      ? {
          serviceId: secondaryPhotographyService.id,
          serviceCode: `ID #${secondaryPhotographyService.id}`,
          badge: 'NHIẾP ẢNH',
          title: secondaryPhotographyService.title,
          provider: secondaryPhotographyService.provider,
          price: secondaryPhotographyService.price,
          rating: secondaryPhotographyService.rating,
          image: secondaryPhotographyService.image,
          avatar: secondaryPhotographyService.avatar,
        }
      : null,
    makeupService
      ? {
          serviceId: makeupService.id,
          serviceCode: `ID #${makeupService.id}`,
          badge: 'MAKEUP',
          title: 'Chuyên gia Trang điểm',
          provider: makeupService.provider,
          price: makeupService.price,
          rating: makeupService.rating,
          image: makeupService.image,
          avatar: makeupService.avatar,
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="idea-page">
      <header className="idea-topbar">
        <div className="idea-topbar-inner">
          <Brand className="idea-brand" />
          <button className="idea-topbar-back" type="button" onClick={onBack} aria-label="Quay lại">
            <ArrowLeft size={18} />
          </button>
          <h1>"{ideaPrompt || 'nàng thơ ở hồ tây'}"</h1>
          <button className="idea-cart-button" type="button" onClick={onOpenCart} aria-label="Mở giỏ hàng">
            <ShoppingCart size={18} />
          </button>
        </div>
      </header>

      <main className="idea-shell">
        <section className="idea-hero-card">
          <div className="idea-tag-row">
            {STYLE_TAGS.map((tag) => (
              <span className="idea-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className="idea-hero-copy">
            <div>
              <h2>Nàng Thơ Bên Bờ Hồ Tây</h2>
              <p>
                "Câu chuyện về một cô gái mang tâm hồn thi sĩ, tìm đến vẻ đẹp tĩnh lặng của Hồ Tây vào
                buổi chiều tà để trốn khỏi sự ồn ào của phố thị, hòa mình vào ánh hoàng hôn nhuộm đỏ mặt hồ."
              </p>
            </div>
            <div className="idea-star-mark" aria-hidden="true">
              <WandSparkles size={92} />
            </div>
          </div>

          <div className="idea-feature-grid">
            {CONCEPT_FEATURES.map((feature) => (
              <article className="idea-feature-card" key={feature.label}>
                <span className="idea-feature-icon">
                  <Sparkles size={16} />
                </span>
                <div>
                  <strong>{feature.label}</strong>
                  <p>{feature.value}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="idea-section">
          <div className="idea-section-title">
            <Camera size={18} />
            <h3>Moodboard Trực Quan</h3>
          </div>
          <div className="idea-moodboard-grid">
            {MOODBOARD_IMAGES.map((image) => (
              <div key={image} className="idea-moodboard-item" style={{ backgroundImage: `url(${image})` }} />
            ))}
          </div>
        </section>

        <section className="idea-section">
          <div className="idea-meta-grid">
            <div className="idea-meta-chip">
              <MapPin size={16} />
              <span>Đề xuất: Bến Hàn Quốc và các cung đường ven Hồ Tây, Hà Nội</span>
            </div>
            <div className="idea-meta-chip">
              <Sparkles size={16} />
              <span>Ánh sáng tốt nhất: 16:00 - 18:30 (khung giờ vàng hoàng hôn)</span>
            </div>
            <div className="idea-meta-chip">
              <CreditCard size={16} />
              <span>Budget tổng: 2.500.000 - 4.500.000 VND</span>
            </div>
          </div>
        </section>

        <section className="idea-section">
          <div className="idea-section-title">
            <Sparkles size={18} />
            <h3>Posing Gợi Ý</h3>
          </div>
          <div className="idea-posing-grid">
            {POSING_GUIDES.map((posing) => (
              <article className="idea-posing-card" key={posing.title}>
                <strong>{posing.title}</strong>
                <p>{posing.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="idea-section">
          <div className="idea-dream-head">
            <div className="idea-section-title">
              <Sparkles size={18} />
              <h3>"Dream Team" Đề Xuất</h3>
            </div>
            <p>AI đã chọn lọc những đối tác phù hợp nhất với phong cách và ngân sách của bạn.</p>
          </div>

          <div className="idea-recommend-grid">
            {suggestedPartners.map((partner) => (
              <article
                className="idea-recommend-card"
                key={`${partner.serviceId}-${partner.title}`}
                onClick={() => onOpenService(partner.serviceId)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpenService(partner.serviceId);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="idea-recommend-media" style={{ backgroundImage: `url(${partner.image})` }}>
                  <span className="idea-recommend-badge">{partner.badge}</span>
                  <div className="idea-recommend-rating">
                    <Star size={14} fill="currentColor" />
                    <span>{partner.rating}</span>
                  </div>
                </div>

                <div className="idea-recommend-body">
                  <div className="idea-recommend-provider">
                    <img src={partner.avatar} alt={partner.provider} />
                    <div>
                      <h4>{partner.title}</h4>
                      <p>{partner.provider}</p>
                      <span className="idea-recommend-id">{partner.serviceCode}</span>
                    </div>
                  </div>
                  <div className="idea-recommend-footer">
                    <strong>{partner.price}</strong>
                    <span>Xem chi tiết</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default IdeaPlanPage;
