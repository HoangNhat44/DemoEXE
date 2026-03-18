import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.location.hash = '';
  window.localStorage.clear();
  global.fetch = jest.fn((url, options) => {
    if (url === '/api/services') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            services: [
              {
                id: 2,
                ownerId: 10,
                categoryId: 2,
                title: 'Chuyên gia Trang điểm',
                provider: 'Đối Tác Demo',
                price: '600.000 đ',
                rating: 5,
                reviewCount: 342,
                description: 'Mô tả dịch vụ test',
                image: 'https://example.com/cover.jpg',
                avatar: 'https://example.com/avatar.jpg',
                packages: [
                  {
                    id: 'pkg-1',
                    name: 'Makeup Kỷ yếu / Cá nhân',
                    duration: '1.5 giờ',
                    location: 'Tại tiệm / Tận nơi',
                    price: '600.000 đ',
                  },
                ],
              },
            ],
          }),
      });
    }

    if (url === '/api/categories') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            categories: [
              {
                id: 1,
                label: 'Nhiếp ảnh gia',
                badgeLabel: 'NHIẾP ẢNH',
                iconKey: 'camera',
              },
              {
                id: 2,
                label: 'Makeup Artist',
                badgeLabel: 'MAKEUP',
                iconKey: 'scissors',
              },
            ],
          }),
      });
    }

    if (url === '/api/users/login' && options?.method === 'POST') {
      const payload = JSON.parse(options.body);

      if (payload.email === 'partner@example.com') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              user: {
                id: 10,
                fullName: 'Đối Tác Demo',
                email: 'partner@example.com',
                phone: '0909009009',
                role: 'partner',
                categoryId: 2,
                createdAt: '2026-03-16T09:00:00.000Z',
              },
              message: 'Đăng nhập thành công.',
            }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              id: 3,
              fullName: 'Nguyễn Khách',
              email: 'khach@example.com',
              phone: '0909009009',
              role: 'customer',
              categoryId: null,
              createdAt: '2026-03-16T09:00:00.000Z',
            },
            message: 'Đăng nhập thành công.',
          }),
      });
    }

    if (url === '/api/partner/services' && options?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            service: {
              id: 7,
              ownerId: 10,
              categoryId: 2,
              title: 'Dịch vụ mới',
              provider: 'Đối Tác Demo',
              price: '900.000 đ',
              rating: 5,
              reviewCount: 0,
              description: 'Mô tả mới',
              image: 'https://example.com/new-cover.jpg',
              avatar: 'https://example.com/new-avatar.jpg',
              packages: [
                {
                  id: 'pkg-99',
                  name: 'Gói cơ bản',
                  duration: '2 giờ',
                  location: 'TP. Hồ Chí Minh',
                  price: '900.000 đ',
                },
              ],
            },
            message: 'Đăng dịch vụ thành công.',
          }),
      });
    }

    if (url === '/api/partner/services/2' && options?.method === 'PUT') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            service: {
              id: 2,
              ownerId: 10,
              categoryId: 2,
              title: 'Chuyên gia Trang điểm VIP',
              provider: 'Đối Tác Demo',
              price: '800.000 đ',
              rating: 5,
              reviewCount: 342,
              description: 'Mô tả đã cập nhật',
              image: 'https://example.com/cover.jpg',
              avatar: 'https://example.com/avatar.jpg',
              packages: [
                {
                  id: 'pkg-1',
                  name: 'Gói VIP',
                  duration: '2 giờ',
                  location: 'Tại studio',
                  price: '800.000 đ',
                },
              ],
            },
            message: 'Cập nhật dịch vụ thành công.',
          }),
      });
    }

    if (url === '/api/partner/services/2' && options?.method === 'DELETE') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            message: 'Xóa dịch vụ thành công.',
          }),
      });
    }

    return Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ message: 'Unknown endpoint' }),
    });
  });
});

afterEach(() => {
  jest.resetAllMocks();
});

async function loginAsPartner() {
  fireEvent.click(await screen.findByRole('button', { name: 'Đăng nhập' }));
  const dialog = screen.getByRole('dialog');

  fireEvent.change(within(dialog).getByLabelText('Email'), {
    target: { value: 'partner@example.com' },
  });
  fireEvent.change(within(dialog).getByLabelText('Mật khẩu'), {
    target: { value: '123456' },
  });
  fireEvent.submit(dialog.querySelector('form'));

  expect(await screen.findByRole('heading', { name: 'Đang hiển thị cho khách hàng' })).toBeInTheDocument();
}

test('renders service data loaded from db json', async () => {
  render(<App />);

  expect(await screen.findByText('Chuyên gia Trang điểm')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Khám phá dịch vụ' })).toBeInTheDocument();
  expect(screen.getByText('MAKEUP')).toBeInTheDocument();
});

test('shows partner dashboard after partner login and allows service posting', async () => {
  render(<App />);
  await loginAsPartner();

  fireEvent.change(screen.getByLabelText('Tên dịch vụ'), {
    target: { value: 'Dịch vụ mới' },
  });
  fireEvent.change(screen.getByLabelText('Giá hiển thị'), {
    target: { value: '900.000 đ' },
  });
  fireEvent.change(screen.getByLabelText('Ảnh cover URL'), {
    target: { value: 'https://example.com/new-cover.jpg' },
  });
  fireEvent.change(screen.getByLabelText('Avatar URL'), {
    target: { value: 'https://example.com/new-avatar.jpg' },
  });
  fireEvent.change(screen.getByLabelText('Mô tả dịch vụ'), {
    target: { value: 'Mô tả mới' },
  });
  fireEvent.change(screen.getByLabelText('Tên gói dịch vụ'), {
    target: { value: 'Gói cơ bản' },
  });
  fireEvent.change(screen.getByLabelText('Thời lượng'), {
    target: { value: '2 giờ' },
  });
  fireEvent.change(screen.getByLabelText('Địa điểm'), {
    target: { value: 'TP. Hồ Chí Minh' },
  });
  fireEvent.change(screen.getByLabelText('Giá gói'), {
    target: { value: '900.000 đ' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Đăng dịch vụ' }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/partner/services',
      expect.objectContaining({ method: 'POST' })
    );
  });
});

test('allows partner to edit an existing service', async () => {
  render(<App />);
  await loginAsPartner();

  fireEvent.click(screen.getByRole('button', { name: 'Sửa' }));

  fireEvent.change(screen.getByLabelText('Tên dịch vụ'), {
    target: { value: 'Chuyên gia Trang điểm VIP' },
  });
  fireEvent.change(screen.getByLabelText('Giá hiển thị'), {
    target: { value: '800.000 đ' },
  });
  fireEvent.change(screen.getByLabelText('Mô tả dịch vụ'), {
    target: { value: 'Mô tả đã cập nhật' },
  });
  fireEvent.change(screen.getByLabelText('Tên gói dịch vụ'), {
    target: { value: 'Gói VIP' },
  });
  fireEvent.change(screen.getByLabelText('Thời lượng'), {
    target: { value: '2 giờ' },
  });
  fireEvent.change(screen.getByLabelText('Địa điểm'), {
    target: { value: 'Tại studio' },
  });
  fireEvent.change(screen.getByLabelText('Giá gói'), {
    target: { value: '800.000 đ' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Cập nhật dịch vụ' }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/partner/services/2',
      expect.objectContaining({ method: 'PUT' })
    );
  });
});

test('allows partner to delete an existing service', async () => {
  render(<App />);
  await loginAsPartner();

  fireEvent.click(screen.getByRole('button', { name: 'Xóa' }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/partner/services/2',
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
