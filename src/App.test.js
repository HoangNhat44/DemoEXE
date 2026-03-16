import { fireEvent, render, screen, within } from '@testing-library/react';
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
                categoryId: 'makeup',
                categoryLabel: 'MAKEUP',
                title: 'Chuyên gia Trang điểm',
                provider: 'Hoa Nguyễn MUA',
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

    if (url === '/api/users/login' && options?.method === 'POST') {
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

    if (url === '/api/users/register' && options?.method === 'POST') {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              id: 4,
              fullName: 'Khách Mới',
              email: 'moi@example.com',
              phone: '0911002200',
              role: 'customer',
              categoryId: null,
              createdAt: '2026-03-16T10:00:00.000Z',
            },
            message: 'Đăng ký thành công.',
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

test('renders service data loaded from db json', async () => {
  render(<App />);

  expect(await screen.findByText('Chuyên gia Trang điểm')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Khám phá dịch vụ' })).toBeInTheDocument();
});

test('opens service detail page when clicking a service', async () => {
  render(<App />);

  fireEvent.click(await screen.findByText('Chuyên gia Trang điểm'));

  expect(await screen.findByRole('heading', { name: 'Hoa Nguyễn MUA' })).toBeInTheDocument();
  expect(screen.getByText('Các gói dịch vụ')).toBeInTheDocument();
  expect(screen.getAllByText('Makeup Kỷ yếu / Cá nhân').length).toBeGreaterThan(0);
});

test('allows customer to log in and log out', async () => {
  render(<App />);

  fireEvent.click(await screen.findByRole('button', { name: 'Đăng nhập' }));
  const dialog = screen.getByRole('dialog');

  fireEvent.change(within(dialog).getByLabelText('Email'), {
    target: { value: 'khach@example.com' },
  });
  fireEvent.change(within(dialog).getByLabelText('Mật khẩu'), {
    target: { value: '123456' },
  });
  fireEvent.submit(dialog.querySelector('form'));

  expect(await screen.findByText('Nguyễn Khách')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Đăng xuất' }));

  expect(await screen.findByRole('button', { name: 'Đăng nhập' })).toBeInTheDocument();
});
