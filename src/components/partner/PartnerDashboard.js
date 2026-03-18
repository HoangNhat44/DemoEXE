import { useMemo, useState } from 'react';
import { Pencil, PlusCircle, Sparkles, Trash2 } from 'lucide-react';
import AuthActions from '../auth/AuthActions';
import Brand from '../common/Brand';
import ServiceCard from '../services/ServiceCard';

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
};

function mapServiceToForm(service) {
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
  };
}

function PartnerDashboard({
  categories,
  customer,
  onCreateService,
  onDeleteService,
  onLogout,
  onOpenAuth,
  onOpenService,
  onUpdateService,
  services,
}) {
  const [form, setForm] = useState(initialServiceForm);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const partnerCategory =
    categories.find((category) => Number(category.id) === Number(customer?.categoryId)) || null;

  const submitButtonLabel = useMemo(() => {
    if (isSubmitting) {
      return editingServiceId ? 'Đang cập nhật dịch vụ...' : 'Đang đăng dịch vụ...';
    }

    return editingServiceId ? 'Cập nhật dịch vụ' : 'Đăng dịch vụ';
  }, [editingServiceId, isSubmitting]);

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
    };

    try {
      const result = editingServiceId
        ? await onUpdateService(editingServiceId, payload)
        : await onCreateService(payload);

      setForm(initialServiceForm);
      setEditingServiceId(null);
      setStatus({
        type: 'success',
        message:
          result.message ||
          (editingServiceId ? 'Cập nhật dịch vụ thành công.' : 'Đăng dịch vụ thành công.'),
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(serviceId) {
    setStatus({ type: '', message: '' });

    try {
      const result = await onDeleteService(serviceId, { userId: customer.id });

      if (Number(editingServiceId) === Number(serviceId)) {
        setEditingServiceId(null);
        setForm(initialServiceForm);
      }

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

  function handleEdit(service) {
    setEditingServiceId(service.id);
    setForm(mapServiceToForm(service));
    setStatus({ type: '', message: '' });
  }

  function handleCancelEdit() {
    setEditingServiceId(null);
    setForm(initialServiceForm);
    setStatus({ type: '', message: '' });
  }

  return (
    <div className="partner-shell">
      <section className="partner-hero">
        <div className="partner-hero-overlay" />
        <header className="topbar">
          <Brand />
          <nav className="topbar-links">
            <AuthActions customer={customer} onLogout={onLogout} onOpenAuth={onOpenAuth} />
          </nav>
        </header>

        <div className="partner-hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>Không gian quản lý dành cho đối tác</span>
          </div>
          <h1>Đăng dịch vụ mới và theo dõi phần hiển thị của bạn.</h1>
          <p>
            {partnerCategory
              ? `Bạn đang hoạt động trong danh mục ${partnerCategory.label}.`
              : 'Bạn có thể tạo dịch vụ để khách hàng xem trực tiếp trên trang chủ.'}
          </p>
        </div>
      </section>

      <section className="partner-content">
        <div className="partner-layout">
          <div className="partner-panel">
            <div className="partner-panel-header">
              <span className="section-kicker">
                {editingServiceId ? 'Chỉnh sửa dịch vụ' : 'Tạo dịch vụ'}
              </span>
              <h2>{editingServiceId ? 'Cập nhật dịch vụ' : 'Đăng dịch vụ mới'}</h2>
              <p>Dịch vụ sau khi đăng sẽ xuất hiện ở marketplace cho customer xem.</p>
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
              <label className="auth-field">
                <span>Tên dịch vụ</span>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                />
              </label>
              <label className="auth-field">
                <span>Giá hiển thị</span>
                <input
                  required
                  type="text"
                  placeholder="Ví dụ: 1.200.000 đ"
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, price: event.target.value }))
                  }
                />
              </label>
              <label className="auth-field">
                <span>Ảnh cover URL</span>
                <input
                  required
                  type="url"
                  value={form.image}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, image: event.target.value }))
                  }
                />
              </label>
              <label className="auth-field">
                <span>Avatar URL</span>
                <input
                  type="url"
                  placeholder="Có thể để trống để dùng avatar mặc định"
                  value={form.avatar}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, avatar: event.target.value }))
                  }
                />
              </label>
              <label className="auth-field">
                <span>Mô tả dịch vụ</span>
                <textarea
                  required
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                />
              </label>

              <div className="partner-form-grid">
                <label className="auth-field">
                  <span>Tên gói dịch vụ</span>
                  <input
                    required
                    type="text"
                    value={form.packageName}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, packageName: event.target.value }))
                    }
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
                    onChange={(event) =>
                      setForm((current) => ({ ...current, packagePrice: event.target.value }))
                    }
                  />
                </label>
              </div>

              <div className="partner-form-actions">
                <button className="partner-submit-button" disabled={isSubmitting} type="submit">
                  <PlusCircle size={18} />
                  <span>{submitButtonLabel}</span>
                </button>

                {editingServiceId ? (
                  <button className="partner-secondary-button" type="button" onClick={handleCancelEdit}>
                    Hủy chỉnh sửa
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          <div className="partner-panel">
            <div className="partner-panel-header">
              <span className="section-kicker">Dịch vụ của bạn</span>
              <h2>Đang hiển thị cho khách hàng</h2>
              <p>Đây là những dịch vụ customer sẽ nhìn thấy sau khi bạn đăng.</p>
            </div>

            {services.length === 0 ? (
              <p className="partner-empty-state">Bạn chưa có dịch vụ nào. Hãy tạo dịch vụ đầu tiên.</p>
            ) : (
              <div className="partner-service-grid">
                {services.map((service) => (
                  <div className="partner-service-card-wrap" key={service.id}>
                    <ServiceCard service={service} onOpenService={onOpenService} />
                    <div className="partner-card-actions">
                      <button
                        className="partner-card-button"
                        type="button"
                        onClick={() => handleEdit(service)}
                      >
                        <Pencil size={16} />
                        <span>Sửa</span>
                      </button>
                      <button
                        className="partner-card-button danger"
                        type="button"
                        onClick={() => handleDelete(service.id)}
                      >
                        <Trash2 size={16} />
                        <span>Xóa</span>
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
