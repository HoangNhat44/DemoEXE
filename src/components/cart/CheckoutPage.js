import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CreditCard,
  QrCode,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { formatPrice } from '../../utils/serviceRoute';

const FIXED_VOUCHERS = [
  {
    id: 'chao-2026',
    name: 'CHAO2026',
    description: 'Giảm trực tiếp 150.000đ cho đơn mới',
    type: 'fixed',
    amount: 150000,
  },
  {
    id: 'matcha-50',
    name: 'MATCHA50',
    description: 'Giảm 10% tối đa 500.000đ',
    type: 'percent',
    amount: 10,
  },
  {
    id: 'vip-freeship',
    name: 'VIPFREESHIP',
    description: 'Ưu đãi hỗ trợ phí di chuyển 50.000đ',
    type: 'fixed',
    amount: 50000,
  },
];

const PAYMENT_METHODS = [
  { id: 'momo', label: 'MoMo', description: 'Ví điện tử MoMo', icon: Wallet },
  { id: 'vnpay', label: 'VNPay', description: 'Thanh toán qua cổng VNPay', icon: CreditCard },
  { id: 'qr', label: 'QR Code', description: 'Quét mã để chuyển khoản', icon: QrCode },
];

const FIXED_BOOKING_DATES = [
  { id: '2026-03-23', day: '23', label: 'TH 2', fullLabel: 'Thứ Hai, 23/03/2026' },
  { id: '2026-03-24', day: '24', label: 'TH 3', fullLabel: 'Thứ Ba, 24/03/2026' },
  { id: '2026-03-25', day: '25', label: 'TH 4', fullLabel: 'Thứ Tư, 25/03/2026' },
];

const FIXED_BOOKING_SLOTS = [
  { id: '08:00', label: '08:00' },
  { id: '14:00', label: '14:00' },
  { id: '16:30', label: '16:30' },
];

function CheckoutPage({ cartItems, onBack, onCheckout }) {
  const [selectedVoucherId, setSelectedVoucherId] = useState('matcha-50');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(PAYMENT_METHODS[0].id);
  const [selectedBookingDateId, setSelectedBookingDateId] = useState(FIXED_BOOKING_DATES[0].id);
  const [selectedBookingSlotId, setSelectedBookingSlotId] = useState(FIXED_BOOKING_SLOTS[0].id);

  const totalPrice = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const numericPrice = Number(String(item.price || '').replace(/[^\d]/g, '')) || 0;
        return sum + numericPrice;
      }, 0),
    [cartItems]
  );

  const selectedVoucher = FIXED_VOUCHERS.find((voucher) => voucher.id === selectedVoucherId) || null;
  const selectedPaymentMethod =
    PAYMENT_METHODS.find((paymentMethod) => paymentMethod.id === selectedPaymentMethodId) || null;
  const selectedBookingDate =
    FIXED_BOOKING_DATES.find((bookingDate) => bookingDate.id === selectedBookingDateId) || null;
  const selectedBookingSlot =
    FIXED_BOOKING_SLOTS.find((bookingSlot) => bookingSlot.id === selectedBookingSlotId) || null;

  const rawDiscount = selectedVoucher
    ? selectedVoucher.type === 'percent'
      ? Math.round((totalPrice * selectedVoucher.amount) / 100)
      : selectedVoucher.amount
    : 0;
  const discount = Math.min(totalPrice, rawDiscount);
  const platformFee = Math.round(totalPrice * 0.05);
  const orderTotal = Math.max(0, totalPrice + platformFee - discount);
  const depositAmount = Math.round(orderTotal * 0.2);
  const remainingAmount = Math.max(0, orderTotal - depositAmount);

  return (
    <div className="checkout-page">
      <header className="checkout-topbar">
        <button className="checkout-topbar-back" type="button" onClick={onBack} aria-label="Quay lại">
          <ArrowLeft size={18} />
        </button>
        <h1>Hoàn tất Đặt lịch ({cartItems.length})</h1>
        <div className="checkout-topbar-spacer" />
      </header>

      <div className="checkout-mobile-shell">
        <section className="checkout-block checkout-order-block">
          <div className="checkout-step-head">
            <h2>1. Dịch vụ đã chọn</h2>
          </div>
          <div className="checkout-order-list mobile">
            {cartItems.map((item) => (
              <article className="checkout-order-card" key={item.id}>
                <div
                  className="checkout-order-image"
                  style={{ backgroundImage: `url(${item.image})` }}
                  aria-hidden="true"
                />
                <div className="checkout-order-copy">
                  <p>{item.provider}</p>
                  <h3>{item.packageName}</h3>
                  <span>{item.serviceTitle}</span>
                  <strong>{formatPrice(item.price)}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="checkout-block">
          <div className="checkout-step-head">
            <h2>2. Chọn ngày & giờ chụp</h2>
            <p>{cartItems[0]?.provider || 'Đối tác'}</p>
          </div>

          <div className="checkout-chip-row dates">
            {FIXED_BOOKING_DATES.map((bookingDate) => (
              <button
                key={bookingDate.id}
                className={`checkout-date-chip ${selectedBookingDateId === bookingDate.id ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedBookingDateId(bookingDate.id)}
              >
                <strong>{bookingDate.day}</strong>
                <span>{bookingDate.label}</span>
              </button>
            ))}
          </div>

          <div className="checkout-chip-row times">
            {FIXED_BOOKING_SLOTS.map((bookingSlot) => (
              <button
                key={bookingSlot.id}
                className={`checkout-time-chip ${selectedBookingSlotId === bookingSlot.id ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedBookingSlotId(bookingSlot.id)}
              >
                {bookingSlot.label}
              </button>
            ))}
          </div>
        </section>

        <section className="checkout-block">
          <div className="checkout-step-head">
            <h2>3. Mã giảm giá (Vouchers)</h2>
          </div>

          <div className="checkout-voucher-grid">
            {FIXED_VOUCHERS.map((voucher) => (
              <button
                key={voucher.id}
                className={`checkout-voucher-card ${selectedVoucherId === voucher.id ? 'active' : ''}`}
                type="button"
                onClick={() => setSelectedVoucherId(voucher.id)}
              >
                <strong>{voucher.name}</strong>
                <p>{voucher.description}</p>
                <span>{selectedVoucherId === voucher.id ? 'Đang áp dụng' : 'Áp dụng'}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="checkout-block">
          <div className="checkout-step-head">
            <h2>4. Phương thức thanh toán</h2>
          </div>

          <div className="checkout-payment-list">
            {PAYMENT_METHODS.map((paymentMethod) => {
              const Icon = paymentMethod.icon;

              return (
                <button
                  key={paymentMethod.id}
                  className={`checkout-payment-row ${selectedPaymentMethodId === paymentMethod.id ? 'active' : ''}`}
                  type="button"
                  onClick={() => setSelectedPaymentMethodId(paymentMethod.id)}
                >
                  <div className="checkout-payment-copy">
                    <span className="checkout-payment-icon">
                      <Icon size={18} />
                    </span>
                    <div>
                      <strong>{paymentMethod.label}</strong>
                      <p>{paymentMethod.description}</p>
                    </div>
                  </div>
                  {selectedPaymentMethodId === paymentMethod.id ? <Check size={16} /> : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="checkout-block">
          <div className="checkout-step-head">
            <h2>5. Chi tiết đặt cọc</h2>
          </div>

          <div className="checkout-bill">
            <div className="checkout-bill-row">
              <span>Tổng các gói dịch vụ</span>
              <strong>{formatPrice(`${totalPrice.toLocaleString('vi-VN')} đ`)}</strong>
            </div>
            <div className="checkout-bill-row">
              <span>Phí nền tảng (5%)</span>
              <strong>{formatPrice(`${platformFee.toLocaleString('vi-VN')} đ`)}</strong>
            </div>
            <div className="checkout-bill-row discount">
              <span>Voucher ({selectedVoucher?.name || 'Không có'})</span>
              <strong>-{formatPrice(`${discount.toLocaleString('vi-VN')} đ`)}</strong>
            </div>
            <div className="checkout-bill-row divider">
              <span>Tổng giá trị đơn</span>
              <strong>{formatPrice(`${orderTotal.toLocaleString('vi-VN')} đ`)}</strong>
            </div>
            <div className="checkout-bill-row deposit">
              <span>Đặt cọc trước 20%</span>
              <strong>{formatPrice(`${depositAmount.toLocaleString('vi-VN')} đ`)}</strong>
            </div>
            <div className="checkout-bill-row total">
              <span>Còn lại thanh toán sau</span>
              <strong>{formatPrice(`${remainingAmount.toLocaleString('vi-VN')} đ`)}</strong>
            </div>
          </div>

          <div className="checkout-meta-note">
            <ShieldCheck size={16} />
            <span>
              {selectedBookingDate?.fullLabel || 'Chưa chọn ngày'} lúc {selectedBookingSlot?.label || 'Chưa chọn giờ'} qua{' '}
              {selectedPaymentMethod?.label || 'phương thức đã chọn'}. Khoản còn lại sẽ được thanh toán sau khi xác nhận lịch.
            </span>
          </div>
        </section>
      </div>

      <div className="checkout-bottom-bar">
        <button
          className="checkout-bottom-button"
          type="button"
          onClick={() =>
            onCheckout({
              bookingDate: selectedBookingDate,
              bookingSlot: selectedBookingSlot,
              voucher: selectedVoucher,
              paymentMethod: selectedPaymentMethod,
              totalPrice,
              discount,
              orderTotal,
              depositAmount,
              remainingAmount,
              finalPrice: depositAmount,
            })
          }
        >
          <span>Đặt cọc {formatPrice(`${depositAmount.toLocaleString('vi-VN')} đ`)}</span>
          <ShieldCheck size={18} />
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
