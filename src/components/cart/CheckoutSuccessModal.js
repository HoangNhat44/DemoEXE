import { CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../../utils/serviceRoute';

function CheckoutSuccessModal({ checkoutSummary, isOpen, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  const depositPriceLabel = formatPrice(
    `${(checkoutSummary?.depositAmount || checkoutSummary?.finalPrice || 0).toLocaleString('vi-VN')} đ`
  );
  const orderTotalLabel = formatPrice(`${(checkoutSummary?.orderTotal || 0).toLocaleString('vi-VN')} đ`);
  const remainingLabel = formatPrice(`${(checkoutSummary?.remainingAmount || 0).toLocaleString('vi-VN')} đ`);

  return (
    <div className="checkout-success-backdrop" role="presentation">
      <div
        className="checkout-success-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-success-title"
      >
        <div className="checkout-success-icon">
          <CheckCircle2 size={34} />
        </div>
        <h2 id="checkout-success-title">Đặt cọc thành công</h2>
        <p>Khoản đặt cọc của bạn đã được ghi nhận. Chúng mình sẽ sớm liên hệ để xác nhận lịch chụp và phần thanh toán còn lại.</p>
        {checkoutSummary ? (
          <div className="checkout-success-summary">
            <div className="checkout-success-row">
              <span>Ngày chụp</span>
              <strong>{checkoutSummary.bookingDate?.label || 'Chưa chọn'}</strong>
            </div>
            <div className="checkout-success-row">
              <span>Khung giờ</span>
              <strong>{checkoutSummary.bookingSlot?.label || 'Chưa chọn'}</strong>
            </div>
            <div className="checkout-success-row">
              <span>Voucher</span>
              <strong>{checkoutSummary.voucher?.name || 'Không có'}</strong>
            </div>
            <div className="checkout-success-row">
              <span>Thanh toán</span>
              <strong>{checkoutSummary.paymentMethod?.label || 'Chưa chọn'}</strong>
            </div>
            <div className="checkout-success-row">
              <span>Tổng giá trị đơn</span>
              <strong>{orderTotalLabel}</strong>
            </div>
            <div className="checkout-success-row">
              <span>Đặt cọc 20%</span>
              <strong>{depositPriceLabel}</strong>
            </div>
            <div className="checkout-success-row">
              <span>Còn lại thanh toán sau</span>
              <strong>{remainingLabel}</strong>
            </div>
          </div>
        ) : null}
        <button className="checkout-success-button" type="button" onClick={onConfirm}>
          OK
        </button>
      </div>
    </div>
  );
}

export default CheckoutSuccessModal;
