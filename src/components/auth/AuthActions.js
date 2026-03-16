function AuthActions({ customer, onLogout, onOpenAuth }) {
  if (customer) {
    return (
      <div className="auth-actions auth-actions-logged-in">
        <div className="auth-user-chip">
          <span className="auth-user-label">Xin chào</span>
          <strong>{customer.fullName}</strong>
        </div>
        <button className="auth-outline-button" type="button" onClick={onLogout}>
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className="auth-actions">
      <button className="auth-link-button" type="button" onClick={() => onOpenAuth('login')}>
        Đăng nhập
      </button>
      <button className="auth-solid-button" type="button" onClick={() => onOpenAuth('register')}>
        Đăng ký
      </button>
    </div>
  );
}

export default AuthActions;
