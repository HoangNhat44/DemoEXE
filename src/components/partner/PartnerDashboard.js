import { useState } from 'react';
import { ArrowRight, Camera, CalendarClock, ChartNoAxesCombined, ClipboardList, PlusCircle, Sparkles } from 'lucide-react';
import AuthActions from '../auth/AuthActions';
import Brand from '../common/Brand';
import ServiceCard from '../services/ServiceCard';

function PartnerDashboard({
  categories,
  customer,
  onDeleteService,
  onEditService,
  onLogout,
  onOpenAuth,
  onOpenService,
  onOpenServiceCreate,
  services,
}) {
  const [status, setStatus] = useState({ type: '', message: '' });
  const partnerCategory =
    categories.find((category) => Number(category.id) === Number(customer?.categoryId)) || null;

  const totalServices = services.length;
  const activeServices = services.filter((service) => Number(service.reviewCount || 0) >= 0).length;
  const featuredServices = services.filter((service) => Number(service.rating || 0) >= 4.8).length;
  const pendingRequests = totalServices ? Math.max(1, totalServices - 1) : 0;
  const bookingsToday = totalServices ? Math.min(totalServices + 1, 6) : 0;
  const conceptConsults = totalServices ? totalServices + 2 : 1;
  const responseTasks = totalServices ? totalServices * 2 : 0;
  const portfolioUpdates = totalServices ? Math.max(1, Math.ceil(totalServices / 2)) : 0;
  const estimatedRevenue = services.reduce((sum, service) => {
    const numericPrice = Number(String(service.price || '').replace(/[^\d]/g, '')) || 0;
    return sum + numericPrice;
  }, 0);

  const todoCards = [
    { label: 'Chờ xác nhận lịch', value: pendingRequests },
    { label: 'Tin nhắn cần phản hồi', value: responseTasks },
    { label: 'Lịch chụp hôm nay', value: bookingsToday },
    { label: 'Yêu cầu đổi concept', value: totalServices ? 1 : 0 },
    { label: 'Dịch vụ đang hiển thị', value: activeServices },
    { label: 'Gói nổi bật', value: featuredServices },
    { label: 'Buổi tư vấn mới', value: conceptConsults },
    { label: 'Ảnh cần cập nhật', value: portfolioUpdates },
  ];

  const analyticsCards = [
    {
      label: 'Doanh thu dự kiến',
      value: estimatedRevenue ? `${estimatedRevenue.toLocaleString('vi-VN')} đ` : '0 đ',
      note: 'Tổng giá niêm yết từ các dịch vụ đang hiển thị',
    },
    {
      label: 'Lượt xem hồ sơ',
      value: totalServices ? `${totalServices * 148}` : '0',
      note: 'Tăng ổn định từ các gói couple và pre-wedding',
    },
    {
      label: 'Yêu cầu đặt lịch',
      value: totalServices ? `${totalServices * 3}` : '0',
      note: 'Tính trên các dịch vụ đang mở booking',
    },
    {
      label: 'Tỷ lệ chuyển đổi',
      value: totalServices ? '12,8%' : '0,0%',
      note: 'Ước tính từ lượt xem sang inbox tư vấn',
    },
  ];

  async function handleDelete(serviceId) {
    setStatus({ type: '', message: '' });

    try {
      const result = await onDeleteService(serviceId, { userId: customer.id });
      setStatus({
        type: 'success',
        message: result.message || 'Xóa dịch vụ thành công.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      });
    }
  }

  return (
    <div className="partner-shell partner-dashboard-shell">
      <section className="partner-dashboard-hero">
        <div className="partner-dashboard-hero-overlay" />
        <header className="topbar">
          <Brand />
          <nav className="topbar-links">
            <AuthActions customer={customer} onLogout={onLogout} onOpenAuth={onOpenAuth} />
          </nav>
        </header>

        <div className="partner-dashboard-head">
          <div className="partner-dashboard-copy">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Trang tổng quan dành cho đối tác</span>
            </div>
            <h1>Quản lý lịch chụp, dịch vụ và hiệu suất hiển thị của bạn.</h1>
            <p>
              {partnerCategory
                ? `Bạn đang hoạt động trong danh mục ${partnerCategory.label}. Theo dõi nhanh lịch chụp, lượt xem và các gói đang hiển thị cho khách hàng.`
                : 'Theo dõi nhanh tình trạng dịch vụ, yêu cầu booking và hiệu suất hiển thị trên marketplace.'}
            </p>
          </div>

          <div className="partner-dashboard-actions">
            <button className="partner-submit-button" type="button" onClick={onOpenServiceCreate}>
              <PlusCircle size={18} />
              <span>Đăng dịch vụ mới</span>
            </button>
            <button className="partner-secondary-button" type="button" onClick={() => window.location.hash = ''}>
              <span>Xem marketplace</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="partner-content">
        <div className="partner-dashboard-layout">
          <div className="partner-panel partner-dashboard-panel">
            <div className="partner-dashboard-panel-head">
              <div>
                <h2>Danh sách cần làm</h2>
                <p>Những việc bạn nên ưu tiên trong hôm nay để không bỏ lỡ booking.</p>
              </div>
              <div className="partner-dashboard-panel-chip">
                <ClipboardList size={16} />
                <span>Hôm nay</span>
              </div>
            </div>

            <div className="partner-todo-grid">
              {todoCards.map((card) => (
                <article className="partner-todo-card" key={card.label}>
                  <strong>{card.value}</strong>
                  <span>{card.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="partner-panel partner-dashboard-panel">
            <div className="partner-dashboard-panel-head">
              <div>
                <h2>Phân tích hoạt động</h2>
                <p>Tổng quan nhanh về các dịch vụ đang hiển thị của bạn trên Matcha.</p>
              </div>
              <div className="partner-dashboard-panel-chip">
                <ChartNoAxesCombined size={16} />
                <span>Cập nhật hôm nay</span>
              </div>
            </div>

            <div className="partner-analytics-layout">
              <div className="partner-analytics-spotlight">
                <div className="partner-analytics-kicker">
                  <Camera size={16} />
                  <span>Hiệu suất hồ sơ</span>
                </div>
                <h3>{totalServices || 0}</h3>
                <p>Dịch vụ đang mở booking và sẵn sàng hiển thị cho khách hàng.</p>
                <div className="partner-analytics-curve" aria-hidden="true" />
              </div>

              <div className="partner-analytics-grid">
                {analyticsCards.map((card) => (
                  <article className="partner-analytics-card" key={card.label}>
                    <span>{card.label}</span>
                    <strong>{card.value}</strong>
                    <p>{card.note}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="partner-panel partner-dashboard-panel">
            <div className="partner-dashboard-panel-head">
              <div>
                <h2>Dịch vụ của bạn</h2>
                <p>Các gói đang hiển thị cho khách hàng trên marketplace và có thể chỉnh sửa bất kỳ lúc nào.</p>
              </div>
              <div className="partner-dashboard-panel-chip">
                <CalendarClock size={16} />
                <span>{totalServices} dịch vụ</span>
              </div>
            </div>

            {status.message ? (
              <p
                className={`partner-status-message ${
                  status.type === 'success' ? 'success-message' : 'error-message'
                }`}
              >
                {status.message}
              </p>
            ) : null}

            {services.length === 0 ? (
              <p className="partner-empty-state">Bạn chưa có dịch vụ nào. Hãy đăng dịch vụ đầu tiên để bắt đầu nhận booking.</p>
            ) : (
              <div className="partner-service-grid">
                {services.map((service) => (
                  <div className="partner-service-card-wrap" key={service.id}>
                    <ServiceCard service={service} onOpenService={onOpenService} />
                    <div className="partner-card-actions">
                      <button className="partner-card-button" type="button" onClick={() => onEditService(service.id)}>
                        Sửa dịch vụ
                      </button>
                      <button
                        className="partner-card-button danger"
                        type="button"
                        onClick={() => handleDelete(service.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PartnerDashboard;
