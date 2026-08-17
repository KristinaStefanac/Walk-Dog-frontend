const base = (import.meta.env.VITE_API_BASE || 'http://localhost:3000').replace(/\/$/, '')

async function request(path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || res.statusText)
    err.status = res.status
    err.payload = data
    throw err
  }
  return data
}

export const httpApi = {
  getSlots: () => request('/api/slots'),
  searchWalkers: (location, page = 1, limit = 5) =>
    request(`/api/walkers?location=${encodeURIComponent(location)}&page=${page}&limit=${limit}`),
  getWalker: (id) => request(`/api/walkers/${id}`),
  createWalker: (body) =>
    request('/api/walkers', { method: 'POST', body: JSON.stringify(body) }),
  createReservation: (body) =>
    request('/api/reservations', { method: 'POST', body: JSON.stringify(body) }),
  listReservations: (email) =>
    request(`/api/reservations?email=${encodeURIComponent(email)}`),
  updateReservationStatus: (walkId, body) =>
    request(`/api/reservations/${walkId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  createReview: (body) =>
    request('/api/reviews', { method: 'POST', body: JSON.stringify(body) }),
}
