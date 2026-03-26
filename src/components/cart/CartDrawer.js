import { Package2, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatPrice } from '../../utils/serviceRoute';

function CartDrawer({ cartItems, isOpen, onCheckout, onClose, onRemoveItem }) {
  const totalPrice = cartItems.reduce((sum, item) => {
    const numericPrice = Number(String(item.price || '').replace(/[^\d]/g, '')) || 0;
    return sum + numericPrice;
  }, 0);

  return (
    <div className={`cart-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} role="presentation">
      <aside
        className={`cart-drawer cart-drawer-compact ${isOpen ? 'open' : ''}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cart-header">
          <div>
            <p>Giỏ hàng</p>
            <h2>{cartItems.length} mục đã chọn</h2>
          </div>
          <button className="cart-close-button" type="button" onClick={onClose} aria-label="Đóng giỏ hàng">
            <X size={18} />
          </button>
        </div>

        {cartItems.length ? (
          <div className="cart-drawer-body">
            <div className="cart-panel-head">
              <div className="cart-panel-title">
                <Package2 size={18} />
                <span>Đơn đã chọn</span>
              </div>
              <strong>{cartItems.length} dịch vụ</strong>
            </div>

            <div className="cart-list">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div
                    className="cart-item-image"
                    style={{ backgroundImage: `url(${item.image})` }}
                    aria-hidden="true"
                  />

                  <div className="cart-item-copy">
                    <p>{item.provider}</p>
                    <h3>{item.packageName}</h3>
                    <span>{item.serviceTitle}</span>
                    <strong>{formatPrice(item.price)}</strong>
                  </div>

                  <button
                    className="cart-remove-button"
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Xóa khỏi giỏ hàng"
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Tổng tạm tính</span>
                <strong>{formatPrice(`${totalPrice.toLocaleString('vi-VN')} đ`)}</strong>
              </div>
              <button className="cart-checkout-button" type="button" onClick={onCheckout}>
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-empty-state">
            <ShoppingBag size={28} />
            <h3>Giỏ hàng đang trống</h3>
            <p>Hãy thêm một gói dịch vụ bạn thích để bắt đầu lên concept cho buổi chụp.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default CartDrawer;
