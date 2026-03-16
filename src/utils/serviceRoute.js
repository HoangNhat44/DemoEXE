export function getServiceIdFromHash(hash) {
  const match = hash.match(/^#\/service\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function formatPrice(value) {
  return value || 'Liên hệ';
}
