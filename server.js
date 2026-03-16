const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'public', 'db.json');

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
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
  const maxId = users.reduce((currentMax, user) => {
    const numericId = Number(user.id);
    return Number.isFinite(numericId) ? Math.max(currentMax, numericId) : currentMax;
  }, 0);

  return maxId + 1;
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

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
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

    if (request.method === 'POST' && url.pathname === '/api/users/register') {
      const database = await readDatabase();
      const payload = await readBody(request);
      const fullName = String(payload.fullName || '').trim();
      const email = normalizeEmail(payload.email);
      const password = String(payload.password || '');
      const phone = String(payload.phone || '').trim();
      const role = String(payload.role || 'customer').trim() || 'customer';
      const categoryId = payload.categoryId ?? null;

      if (!fullName || !email || !password) {
        sendJson(response, 400, { message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.' });
        return;
      }

      if (password.length < 6) {
        sendJson(response, 400, { message: 'Mật khẩu cần có ít nhất 6 ký tự.' });
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
        categoryId,
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

    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, { ok: true });
      return;
    }

    sendJson(response, 404, { message: 'Không tìm thấy API phù hợp.' });
  } catch (error) {
    sendJson(response, 500, { message: 'Có lỗi xảy ra khi xử lý yêu cầu.' });
  }
});

server.listen(PORT, () => {
  console.log(`API server is running on http://localhost:${PORT}`);
});
