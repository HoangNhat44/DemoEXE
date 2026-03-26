const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'public', 'db.json');
const ENV_PATH = path.join(__dirname, '.env.local');

async function loadLocalEnv() {
  try {
    const raw = await fs.readFile(ENV_PATH, 'utf8');
    raw.split(/\r?\n/).forEach((line) => {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return;
      }

      const separatorIndex = trimmedLine.indexOf('=');

      if (separatorIndex === -1) {
        return;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const value = trimmedLine.slice(separatorIndex + 1).trim();

      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    });
  } catch (error) {
    // Ignore missing local env file in development.
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

async function readDatabase() {
  const raw = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

async function writeDatabase(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    role: user.role || 'customer',
    categoryId: user.categoryId ?? null,
    createdAt: user.createdAt,
  };
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function getNextUserId(users) {
  return (
    users.reduce((currentMax, user) => {
      const numericId = Number(user.id);
      return Number.isFinite(numericId) ? Math.max(currentMax, numericId) : currentMax;
    }, 0) + 1
  );
}

function getNextServiceId(services) {
  return (
    services.reduce((currentMax, service) => {
      const numericId = Number(service.id);
      return Number.isFinite(numericId) ? Math.max(currentMax, numericId) : currentMax;
    }, 0) + 1
  );
}

function getNextPackageId(services) {
  const maxPackageNumber = services.reduce((currentMax, service) => {
    const packageMax = (service.packages || []).reduce((innerMax, pkg) => {
      const numericValue = Number(String(pkg.id).replace(/\D/g, ''));
      return Number.isFinite(numericValue) ? Math.max(innerMax, numericValue) : innerMax;
    }, 0);

    return Math.max(currentMax, packageMax);
  }, 0);

  return `pkg-${maxPackageNumber + 1}`;
}

function buildAvatarUrl(name) {
  const encodedName = encodeURIComponent(name || 'Partner');
  return `https://ui-avatars.com/api/?name=${encodedName}&background=173723&color=ffffff`;
}

function validateServicePayload(payload) {
  return (
    String(payload.title || '').trim() &&
    String(payload.price || '').trim() &&
    String(payload.image || '').trim() &&
    String(payload.description || '').trim() &&
    String(payload.packageName || '').trim() &&
    String(payload.packageDuration || '').trim() &&
    String(payload.packageLocation || '').trim() &&
    String(payload.packagePrice || '').trim()
  );
}

function buildServicePayload(partner, services, payload, existingService) {
  return {
    id: existingService ? existingService.id : getNextServiceId(services),
    ownerId: partner.id,
    categoryId: Number(partner.categoryId),
    title: String(payload.title || '').trim(),
    provider: partner.fullName,
    price: String(payload.price || '').trim(),
    rating: existingService?.rating ?? 5,
    reviewCount: existingService?.reviewCount ?? 0,
    description: String(payload.description || '').trim(),
    availableTimeSlots:
      String(payload.availableTimeSlots || '').trim() || existingService?.availableTimeSlots || '',
    availableDates:
      String(payload.availableDates || '').trim() || existingService?.availableDates || '',
    image: String(payload.image || '').trim(),
    avatar:
      String(payload.avatar || '').trim() ||
      existingService?.avatar ||
      buildAvatarUrl(partner.fullName),
    packages: [
      {
        id: existingService?.packages?.[0]?.id || getNextPackageId(services),
        name: String(payload.packageName || '').trim(),
        duration: String(payload.packageDuration || '').trim(),
        location: String(payload.packageLocation || '').trim(),
        price: String(payload.packagePrice || '').trim(),
      },
    ],
  };
}

async function readBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function buildConceptPrompt(payload) {
  return [
    'Bạn là creative director cho nền tảng booking chụp ảnh.',
    'Hãy tạo concept chụp ảnh bằng tiếng Việt, rõ ràng, giàu hình ảnh và dễ triển khai.',
    `Ý tưởng người dùng: ${String(payload.idea || '').trim() || 'Chưa mô tả cụ thể'}`,
    `Khu vực: ${String(payload.locationLabel || 'Tất cả khu vực').trim()}`,
    `Ngân sách: ${String(payload.budgetLabel || 'Mọi mức giá').trim()}`,
    `Phong cách: ${String(payload.styleLabel || 'Mọi phong cách').trim()}`,
    `Dùng AI hỗ trợ: ${payload.useAi ? 'Có' : 'Không'}`,
    'Trả lời đúng format sau:',
    '1. Tên concept',
    '2. Mood & cảm xúc',
    '3. Bối cảnh gợi ý',
    '4. Trang phục & makeup',
    '5. Shot list 5 ý',
    '6. Gợi ý ekip phù hợp',
    '7. Mẹo triển khai nhanh',
  ].join('\n');
}

function extractGeminiText(data) {
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('\n')
    .trim();

  return text || '';
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const serviceRouteMatch = url.pathname.match(/^\/api\/partner\/services\/(\d+)$/);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    response.end();
    return;
  }

  try {
    if (request.method === 'GET' && url.pathname === '/api/services') {
      const database = await readDatabase();
      sendJson(response, 200, { services: database.services || [] });
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/categories') {
      const database = await readDatabase();
      sendJson(response, 200, { categories: database.categories || [] });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/users/register') {
      const database = await readDatabase();
      const payload = await readBody(request);
      const fullName = String(payload.fullName || '').trim();
      const email = normalizeEmail(payload.email);
      const password = String(payload.password || '');
      const phone = String(payload.phone || '').trim();
      const role = String(payload.role || 'customer').trim() || 'customer';
      const categoryId = payload.categoryId ?? null;
      const categories = Array.isArray(database.categories) ? database.categories : [];
      const matchedCategory =
        categoryId == null
          ? null
          : categories.find((category) => Number(category.id) === Number(categoryId));

      if (!fullName || !email || !password) {
        sendJson(response, 400, { message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.' });
        return;
      }

      if (password.length < 6) {
        sendJson(response, 400, { message: 'Mật khẩu cần có ít nhất 6 ký tự.' });
        return;
      }

      if (role === 'partner' && !matchedCategory) {
        sendJson(response, 400, { message: 'Vui lòng chọn danh mục hợp lệ cho đối tác.' });
        return;
      }

      const users = Array.isArray(database.users) ? database.users : [];
      const existingUser = users.find((user) => normalizeEmail(user.email) === email);

      if (existingUser) {
        sendJson(response, 409, { message: 'Email này đã được đăng ký.' });
        return;
      }

      const newUser = {
        id: getNextUserId(users),
        fullName,
        email,
        phone,
        password,
        role,
        categoryId: role === 'partner' ? Number(categoryId) : null,
        createdAt: new Date().toISOString(),
      };

      database.users = [...users, newUser];
      await writeDatabase(database);

      sendJson(response, 201, {
        user: sanitizeUser(newUser),
        message: 'Đăng ký thành công.',
      });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/users/login') {
      const database = await readDatabase();
      const payload = await readBody(request);
      const email = normalizeEmail(payload.email);
      const password = String(payload.password || '');
      const users = Array.isArray(database.users) ? database.users : [];
      const user = users.find((item) => normalizeEmail(item.email) === email);

      if (!user || user.password !== password) {
        sendJson(response, 401, { message: 'Email hoặc mật khẩu không đúng.' });
        return;
      }

      sendJson(response, 200, {
        user: sanitizeUser(user),
        message: 'Đăng nhập thành công.',
      });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/ai/concept') {
      const payload = await readBody(request);
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        sendJson(response, 500, {
          message: 'Thiếu GEMINI_API_KEY trong .env.local. Hãy thêm key rồi chạy lại server.',
        });
        return;
      }

      const idea = String(payload.idea || '').trim();

      if (!idea) {
        sendJson(response, 400, { message: 'Vui lòng nhập mô tả ý tưởng trước khi tạo concept.' });
        return;
      }

      const geminiResponse = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: buildConceptPrompt(payload),
                  },
                ],
              },
            ],
          }),
        }
      );

      const geminiData = await geminiResponse.json().catch(() => ({}));

      if (!geminiResponse.ok) {
        sendJson(response, geminiResponse.status, {
          message:
            geminiData?.error?.message ||
            'Không thể tạo concept từ Gemini lúc này. Vui lòng thử lại.',
        });
        return;
      }

      const concept = extractGeminiText(geminiData);

      if (!concept) {
        sendJson(response, 502, {
          message: 'Gemini đã phản hồi nhưng không có nội dung concept hợp lệ.',
        });
        return;
      }

      sendJson(response, 200, { concept });
      return;
    }

    if (request.method === 'POST' && url.pathname === '/api/partner/services') {
      const database = await readDatabase();
      const payload = await readBody(request);
      const users = Array.isArray(database.users) ? database.users : [];
      const services = Array.isArray(database.services) ? database.services : [];
      const partner = users.find((user) => Number(user.id) === Number(payload.userId));

      if (!partner || partner.role !== 'partner') {
        sendJson(response, 403, { message: 'Chỉ đối tác mới có thể đăng dịch vụ.' });
        return;
      }

      if (!validateServicePayload(payload)) {
        sendJson(response, 400, { message: 'Vui lòng nhập đầy đủ thông tin dịch vụ.' });
        return;
      }

      const newService = buildServicePayload(partner, services, payload);

      database.services = [...services, newService];
      await writeDatabase(database);

      sendJson(response, 201, {
        service: newService,
        message: 'Đăng dịch vụ thành công.',
      });
      return;
    }

    if (request.method === 'PUT' && serviceRouteMatch) {
      const database = await readDatabase();
      const payload = await readBody(request);
      const serviceId = Number(serviceRouteMatch[1]);
      const users = Array.isArray(database.users) ? database.users : [];
      const services = Array.isArray(database.services) ? database.services : [];
      const partner = users.find((user) => Number(user.id) === Number(payload.userId));
      const existingService = services.find((service) => Number(service.id) === serviceId);

      if (!partner || partner.role !== 'partner') {
        sendJson(response, 403, { message: 'Chỉ đối tác mới có thể cập nhật dịch vụ.' });
        return;
      }

      if (!existingService || Number(existingService.ownerId) !== Number(partner.id)) {
        sendJson(response, 404, { message: 'Không tìm thấy dịch vụ cần cập nhật.' });
        return;
      }

      if (!validateServicePayload(payload)) {
        sendJson(response, 400, { message: 'Vui lòng nhập đầy đủ thông tin dịch vụ.' });
        return;
      }

      const updatedService = buildServicePayload(partner, services, payload, existingService);

      database.services = services.map((service) =>
        Number(service.id) === serviceId ? updatedService : service
      );
      await writeDatabase(database);

      sendJson(response, 200, {
        service: updatedService,
        message: 'Cập nhật dịch vụ thành công.',
      });
      return;
    }

    if (request.method === 'DELETE' && serviceRouteMatch) {
      const database = await readDatabase();
      const payload = await readBody(request);
      const serviceId = Number(serviceRouteMatch[1]);
      const users = Array.isArray(database.users) ? database.users : [];
      const services = Array.isArray(database.services) ? database.services : [];
      const partner = users.find((user) => Number(user.id) === Number(payload.userId));
      const existingService = services.find((service) => Number(service.id) === serviceId);

      if (!partner || partner.role !== 'partner') {
        sendJson(response, 403, { message: 'Chỉ đối tác mới có thể xóa dịch vụ.' });
        return;
      }

      if (!existingService || Number(existingService.ownerId) !== Number(partner.id)) {
        sendJson(response, 404, { message: 'Không tìm thấy dịch vụ cần xóa.' });
        return;
      }

      database.services = services.filter((service) => Number(service.id) !== serviceId);
      await writeDatabase(database);

      sendJson(response, 200, {
        message: 'Xóa dịch vụ thành công.',
      });
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, { ok: true });
      return;
    }

    sendJson(response, 404, { message: 'Không tìm thấy API phù hợp.' });
  } catch (error) {
    sendJson(response, 500, { message: 'Có lỗi xảy ra khi xử lý yêu cầu.' });
  }
});

loadLocalEnv().finally(() => {
  server.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}`);
  });
});
