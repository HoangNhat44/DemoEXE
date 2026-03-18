import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const initialRegisterForm = {
  accountType: 'customer',
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  categoryId: '',
};

const initialLoginForm = {
  email: '',
  password: '',
};

function AuthModal({ categories, isOpen, mode, onClose, onLogin, onRegister }) {
  const [activeTab, setActiveTab] = useState(mode);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(mode);
      setError('');
      setSuccessMessage('');
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const result = await onLogin(loginForm);
      setSuccessMessage(result.message || 'Đăng nhập thành công.');
      setLoginForm(initialLoginForm);
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (registerForm.accountType === 'partner' && !registerForm.categoryId) {
      setError('Vui lòng chọn danh mục đối tác.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await onRegister({
        fullName: registerForm.fullName,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
        role: registerForm.accountType === 'partner' ? 'partner' : 'customer',
        categoryId:
          registerForm.accountType === 'partner' ? Number(registerForm.categoryId) : null,
      });
      setSuccessMessage(result.message || 'Đăng ký thành công.');
      setRegisterForm(initialRegisterForm);
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="auth-modal-header">
          <div>
            <p className="auth-modal-kicker">Tài khoản người dùng</p>
            <h2 id="auth-modal-title">{activeTab === 'login' ? 'Đăng nhập' : 'Đăng ký'}</h2>
          </div>
          <button className="auth-close-button" type="button" aria-label="Đóng" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="auth-tab-row">
          <button
            className={`auth-tab-button ${activeTab === 'login' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('login')}
          >
            Đăng nhập
          </button>
          <button
            className={`auth-tab-button ${activeTab === 'register' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('register')}
          >
            Đăng ký
          </button>
        </div>

        {error ? <p className="auth-feedback error-message">{error}</p> : null}
        {successMessage ? <p className="auth-feedback success-message">{successMessage}</p> : null}

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label className="auth-field">
              <span>Email</span>
              <input
                required
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </label>
            <label className="auth-field">
              <span>Mật khẩu</span>
              <input
                required
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((current) => ({ ...current, password: event.target.value }))
                }
              />
            </label>
            <button className="auth-submit-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="auth-field">
              <span>Bạn đăng ký với vai trò</span>
              <div className="auth-role-row">
                <button
                  className={`auth-role-button ${
                    registerForm.accountType === 'customer' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() =>
                    setRegisterForm((current) => ({
                      ...current,
                      accountType: 'customer',
                      categoryId: '',
                    }))
                  }
                >
                  Customer
                </button>
                <button
                  className={`auth-role-button ${
                    registerForm.accountType === 'partner' ? 'active' : ''
                  }`}
                  type="button"
                  onClick={() =>
                    setRegisterForm((current) => ({
                      ...current,
                      accountType: 'partner',
                    }))
                  }
                >
                  Đối tác
                </button>
              </div>
            </div>

            <label className="auth-field">
              <span>Họ và tên</span>
              <input
                required
                type="text"
                value={registerForm.fullName}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, fullName: event.target.value }))
                }
              />
            </label>
            <label className="auth-field">
              <span>Email</span>
              <input
                required
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </label>
            <label className="auth-field">
              <span>Số điện thoại</span>
              <input
                type="tel"
                value={registerForm.phone}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, phone: event.target.value }))
                }
              />
            </label>

            {registerForm.accountType === 'partner' ? (
              <label className="auth-field">
                <span>Danh mục đối tác</span>
                <select
                  required
                  value={registerForm.categoryId}
                  onChange={(event) =>
                    setRegisterForm((current) => ({
                      ...current,
                      categoryId: event.target.value,
                    }))
                  }
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label className="auth-field">
              <span>Mật khẩu</span>
              <input
                required
                minLength={6}
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((current) => ({ ...current, password: event.target.value }))
                }
              />
            </label>
            <label className="auth-field">
              <span>Xác nhận mật khẩu</span>
              <input
                required
                minLength={6}
                type="password"
                value={registerForm.confirmPassword}
                onChange={(event) =>
                  setRegisterForm((current) => ({
                    ...current,
                    confirmPassword: event.target.value,
                  }))
                }
              />
            </label>
            <button className="auth-submit-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
