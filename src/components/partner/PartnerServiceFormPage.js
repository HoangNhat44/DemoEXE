import { useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, Clock3, PlusCircle } from 'lucide-react';
import AuthActions from '../auth/AuthActions';
import Brand from '../common/Brand';

const initialServiceForm = {
  title: '',
  price: '',
  image: '',
  avatar: '',
  description: '',
  packageName: '',
  packageDuration: '',
  packageLocation: '',
  packagePrice: '',
  availableTimeSlots: '',
  availableDates: '',
};

function mapServiceToForm(service) {
  if (!service) {
    return initialServiceForm;
  }

  return {
    title: service.title || '',
    price: service.price || '',
    image: service.image || '',
    avatar: service.avatar || '',
    description: service.description || '',
    packageName: service.packages?.[0]?.name || '',
    packageDuration: service.packages?.[0]?.duration || '',
    packageLocation: service.packages?.[0]?.location || '',
    packagePrice: service.packages?.[0]?.price || '',
    availableTimeSlots: service.availableTimeSlots || '',
    availableDates: service.availableDates || '',
  };
}

function PartnerServiceFormPage({
  customer,
  editingService,
  onBack,
  onCreateService,
  onLogout,
  onOpenAuth,
  onUpdateService,
}) {
  const [form, setForm] = useState(() => mapServiceToForm(editingService));
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(editingService);
  const submitButtonLabel = useMemo(() => {
    if (isSubmitting) {
      return isEditing ? 'Đang cập nhật dịch vụ...' : 'Đang đăng dịch vụ...';
    }

    return isEditing ? 'Cập nhật dịch vụ' : 'Đăng dịch vụ';
  }, [isEditing, isSubmitting]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    const payload = {
      userId: customer.id,
      title: form.title,
      price: form.price,
      image: form.image,
      avatar: form.avatar,
      description: form.description,
      packageName: form.packageName,
      packageDuration: form.packageDuration,
      packageLocation: form.packageLocation,
      packagePrice: form.packagePrice,
      availableTimeSlots: form.availableTimeSlots,
      availableDates: form.availableDates,
    };

    try {
      const result = isEditing
        ? await onUpdateService(editingService.id, payload)
        : await onCreateService(payload);

      setStatus({
        type: 'success',
        message:
          result.message || (isEditing ? 'Cập nhật dịch vụ thành công.' : 'Đăng dịch vụ thành công.'),
      });

      if (!isEditing) {
        setForm(initialServiceForm);
      }

      setTimeout(() => {
        onBack();
      }, 500);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="partner-shell partner-dashboard-shell">
      <section className="partner-dashboard-hero partner-form-hero">
        <div className="partner-dashboard-hero-overlay" />
        <header className="topbar">
          <Brand />
          <nav className="topbar-links">
            <AuthActions customer={customer} onLogout={onLogout} onOpenAuth={onOpenAuth} />
          </nav>
        </header>

        <div className="partner-dashboard-head">
          <div className="partner-dashboard-copy">
            <button className="checkout-back-button partner-back-button" type="button" onClick={onBack}>
              <ArrowLeft size={18} />
              <span>Quay lại dashboard</span>
            </button>
            <h1>{isEditing ? 'Cập nhật dịch vụ của bạn' : 'Đăng dịch vụ mới cho marketplace'}</h1>
            <p>Điền đầy đủ thông tin gói chụp, lịch khả dụng và hình ảnh để khách hàng dễ đặt lịch hơn.</p>
          </div>
        </div>
      </section>

      <section className="partner-content">
        <div className="partner-form-page-layout">
          <div className="partner-panel partner-dashboard-panel">
            <div className="partner-panel-header">
              <span className="section-kicker">{isEditing ? 'Chỉnh sửa dịch vụ' : 'Tạo dịch vụ mới'}</span>
              <h2>{isEditing ? 'Cập nhật thông tin dịch vụ' : 'Chi tiết dịch vụ hiển thị'}</h2>
              <p>Dịch vụ sau khi lưu sẽ xuất hiện trực tiếp trên marketplace cho khách hàng xem và đặt lịch.</p>
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

            <form className="partner-form" onSubmit={handleSubmit}>
              <div className="partner-form-grid">
                <label className="auth-field">
                  <span>Tên dịch vụ</span>
                  <input
                    required
                    type="text"
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  />
                </label>
                <label className="auth-field">
                  <span>Giá hiển thị</span>
                  <input
                    required
                    type="text"
                    placeholder="Ví dụ: 1.200.000 đ"
                    value={form.price}
                    onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                  />
                </label>
              </div>

              <div className="partner-form-grid">
                <label className="auth-field">
                  <span>Ảnh cover URL</span>
                  <input
                    required
                    type="url"
                    value={form.image}
                    onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
                  />
                </label>
                <label className="auth-field">
                  <span>Avatar URL</span>
                  <input
                    type="url"
                    placeholder="Có thể để trống để dùng avatar mặc định"
                    value={form.avatar}
                    onChange={(event) => setForm((current) => ({ ...current, avatar: event.target.value }))}
                  />
                </label>
              </div>

              <label className="auth-field">
                <span>Mô tả dịch vụ</span>
                <textarea
                  required
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                />
              </label>

              <div className="partner-form-grid">
                <label className="auth-field">
                  <span>Tên gói dịch vụ</span>
                  <input
                    required
                    type="text"
                    value={form.packageName}
                    onChange={(event) => setForm((current) => ({ ...current, packageName: event.target.value }))}
                  />
                </label>
                <label className="auth-field">
                  <span>Thời lượng</span>
                  <input
                    required
                    type="text"
                    placeholder="Ví dụ: 2 giờ"
                    value={form.packageDuration}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, packageDuration: event.target.value }))
                    }
                  />
                </label>
              </div>

              <div className="partner-form-grid">
                <label className="auth-field">
                  <span>Địa điểm</span>
                  <input
                    required
                    type="text"
                    value={form.packageLocation}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, packageLocation: event.target.value }))
                    }
                  />
                </label>
                <label className="auth-field">
                  <span>Giá gói</span>
                  <input
                    required
                    type="text"
                    value={form.packagePrice}
                    onChange={(event) => setForm((current) => ({ ...current, packagePrice: event.target.value }))}
                  />
                </label>
              </div>

              <div className="partner-form-grid">
                <label className="auth-field">
                  <span>Thời gian chụp được</span>
                  <div className="partner-input-with-icon">
                    <Clock3 size={16} />
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: 08:00 - 11:00, 14:00 - 18:00"
                      value={form.availableTimeSlots}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, availableTimeSlots: event.target.value }))
                      }
                    />
                  </div>
                </label>
                <label className="auth-field">
                  <span>Các ngày chụp được</span>
                  <div className="partner-input-with-icon">
                    <CalendarDays size={16} />
                    <input
                      required
                      type="text"
                      placeholder="Ví dụ: Thứ 7, Chủ nhật hoặc 28/03, 29/03"
                      value={form.availableDates}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, availableDates: event.target.value }))
                      }
                    />
                  </div>
                </label>
              </div>

              <div className="partner-form-actions">
                <button className="partner-submit-button" disabled={isSubmitting} type="submit">
                  <PlusCircle size={18} />
                  <span>{submitButtonLabel}</span>
                </button>
                <button className="partner-secondary-button" type="button" onClick={onBack}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PartnerServiceFormPage;
