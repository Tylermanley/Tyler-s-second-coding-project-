// Thin fetch wrapper around the Dollhouse REST API.
const API_BASE = '/api';

async function apiRequest(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

const Api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
    return apiRequest('GET', `/products?${qs.toString()}`);
  },
  getProduct: (id) => apiRequest('GET', `/products/${id}`),
  getRecommendations: (answers) => apiRequest('POST', '/recommendations', answers),

  getBoards: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
    return apiRequest('GET', `/boards?${qs.toString()}`);
  },
  getBoard: (id) => apiRequest('GET', `/boards/${id}`),
  createBoard: (payload) => apiRequest('POST', '/boards', payload),
  addBoardItem: (boardId, productId) => apiRequest('POST', `/boards/${boardId}/items`, { productId }),
  removeBoardItem: (boardId, productId) => apiRequest('DELETE', `/boards/${boardId}/items/${productId}`),
  likeBoard: (boardId, userId) => apiRequest('POST', `/boards/${boardId}/like`, { userId }),
  commentBoard: (boardId, authorName, text) => apiRequest('POST', `/boards/${boardId}/comments`, { authorName, text }),

  getDesigners: () => apiRequest('GET', '/designers'),
  applyDesigner: (payload) => apiRequest('POST', '/designers/apply', payload),

  checkout: (payload) => apiRequest('POST', '/checkout', payload),
  getOrders: (userId) => apiRequest('GET', `/checkout/orders?userId=${encodeURIComponent(userId)}`),

  getVipTiers: () => apiRequest('GET', '/vip/tiers'),
  subscribeVip: (payload) => apiRequest('POST', '/vip/subscribe', payload),
  getVipSubscription: (userId) => apiRequest('GET', `/vip/subscription?userId=${encodeURIComponent(userId)}`),
  cancelVip: (userId) => apiRequest('POST', '/vip/cancel', { userId }),

  getStats: () => apiRequest('GET', '/stats'),

  getProfile: (userId) => apiRequest('GET', `/profile/${encodeURIComponent(userId)}`),
  updateProfile: (userId, displayName) => apiRequest('PUT', `/profile/${encodeURIComponent(userId)}`, { displayName }),
  connectSocial: (userId, platform, handle) =>
    apiRequest('POST', `/profile/${encodeURIComponent(userId)}/social/${platform}`, { handle }),
  disconnectSocial: (userId, platform) => apiRequest('DELETE', `/profile/${encodeURIComponent(userId)}/social/${platform}`),
};
