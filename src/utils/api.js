function createServerConnectionError() {
  return new Error(
    'Không kết nối được máy chủ dữ liệu. Hãy chạy `npm run server` rồi thử lại.'
  );
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Có lỗi xảy ra khi kết nối máy chủ.');
  }

  return data;
}

export async function apiGet(path) {
  try {
    const response = await fetch(path);
    return parseResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw createServerConnectionError();
    }

    throw error;
  }
}

export async function apiPost(path, payload) {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return parseResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw createServerConnectionError();
    }

    throw error;
  }
}
