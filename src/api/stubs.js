const PREDEFINED_SLOTS = [
    '09:00-10:00',
    '10:00-11:00',
    '14:00-15:00',
    '16:00-17:00',
    '17:00-18:00',
  ]
  
  function uid() {
    return crypto.randomUUID?.() || `walk-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
  
  function nowPlusHours(h) {
    return new Date(Date.now() + h * 60 * 60 * 1000).toISOString()
  }
  
  let walkers = [
    {
      id: 'w1',
      firstName: 'Ana',
      lastName: 'Horvat',
      email: 'ana.horvat@example.com',
      location: 'Zagreb',
      services: ['dog walk', 'dog bath'],
      availableSlots: ['09:00-10:00', '16:00-17:00', '17:00-18:00'],
      createdAt: '2026-07-01T10:00:00.000Z',
    },
    {
      id: 'w2',
      firstName: 'Marko',
      lastName: 'Kovac',
      email: 'marko.kovac@example.com',
      location: 'Zagreb Centar',
      services: ['dog walk'],
      availableSlots: ['10:00-11:00', '14:00-15:00'],
      createdAt: '2026-07-02T10:00:00.000Z',
    },
    {
      id: 'w3',
      firstName: 'Ivana',
      lastName: 'Novak',
      email: 'ivana.novak@example.com',
      location: 'Split',
      services: ['dog walk', 'dog bath'],
      availableSlots: ['09:00-10:00', '10:00-11:00', '16:00-17:00'],
      createdAt: '2026-07-03T10:00:00.000Z',
    },
    {
      id: 'w4',
      firstName: 'Petar',
      lastName: 'Babic',
      email: 'petar.babic@example.com',
      location: 'Zagreb',
      services: ['dog walk'],
      availableSlots: ['14:00-15:00', '16:00-17:00'],
      createdAt: '2026-07-04T10:00:00.000Z',
    },
    {
      id: 'w5',
      firstName: 'Lana',
      lastName: 'Juric',
      email: 'lana.juric@example.com',
      location: 'Rijeka',
      services: ['dog bath'],
      availableSlots: ['10:00-11:00', '17:00-18:00'],
      createdAt: '2026-07-05T10:00:00.000Z',
    },
    {
      id: 'w6',
      firstName: 'Tomislav',
      lastName: 'Matic',
      email: 'tomislav.matic@example.com',
      location: 'Zagreb Tresnjevka',
      services: ['dog walk', 'dog bath'],
      availableSlots: ['09:00-10:00', '14:00-15:00', '17:00-18:00'],
      createdAt: '2026-07-06T10:00:00.000Z',
    },
  ]
  
  let reviews = [
    {
      id: 'r1',
      walkId: 'seed-old',
      walkerId: 'w1',
      stars: 5,
      comment: 'Ana was wonderful with our Labrador!',
      createdAt: '2026-07-10T12:00:00.000Z',
    },
    {
      id: 'r2',
      walkId: 'seed-old-2',
      walkerId: 'w1',
      stars: 4,
      comment: 'On time and friendly.',
      createdAt: '2026-07-11T12:00:00.000Z',
    },
  ]
  
  let reservations = []
  
  function ratingFor(walkerId) {
    const list = reviews.filter((r) => r.walkerId === walkerId)
    if (!list.length) return { averageRating: null, reviewCount: 0 }
    const avg = Math.round((list.reduce((s, r) => s + r.stars, 0) / list.length) * 10) / 10
    return { averageRating: avg, reviewCount: list.length }
  }
  
  function delay(data, ms = 200) {
    return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms))
  }
  
  function fail(status, error) {
    const err = new Error(error)
    err.status = status
    err.payload = { error }
    throw err
  }
  
  export const stubApi = {
    async getSlots() {
      return delay({ slots: PREDEFINED_SLOTS })
    },
  
    async searchWalkers(location, page = 1, limit = 5) {
      if (!location?.trim()) fail(400, 'Query parameter "location" is required')
      const term = location.trim().toLowerCase()
      const matched = walkers
        .filter((w) => w.location.toLowerCase().includes(term))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .map((w) => ({ ...w, ...ratingFor(w.id) }))
  
      const total = matched.length
      const pageCount = Math.max(1, Math.ceil(total / limit))
      const start = (page - 1) * limit
      return delay({
        page,
        limit,
        total,
        pageCount,
        walkers: matched.slice(start, start + limit),
      })
    },
  
    async getWalker(id) {
      const walker = walkers.find((w) => w.id === id)
      if (!walker) fail(404, 'Walker not found')
      const list = reviews
        .filter((r) => r.walkerId === id)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      return delay({
        ...walker,
        ...ratingFor(id),
        reviews: list,
      })
    },
  
    async createWalker(body) {
      const { firstName, lastName, email, location, services, availableSlots } = body
      if (!firstName || !lastName || !email || !location) {
        fail(400, 'firstName, lastName, email and location are required')
      }
      if (!availableSlots?.length) fail(400, 'At least one availableSlots value is required')
      if (walkers.some((w) => w.email === email.toLowerCase())) {
        fail(400, 'A walker with this email already exists')
      }
      const walker = {
        id: `w${Date.now()}`,
        firstName,
        lastName,
        email: email.toLowerCase(),
        location,
        services: services?.length ? [...services] : ['dog walk'],
        availableSlots: [...new Set(availableSlots)],
        createdAt: new Date().toISOString(),
      }
      walkers = [walker, ...walkers]
      return delay({ ...walker, ...ratingFor(walker.id) }, 250)
    },
  
    async createReservation(body) {
      const { walkerId, timeSlot, dog, contact } = body
      const walker = walkers.find((w) => w.id === walkerId)
      if (!walker) fail(404, 'Walker not found')
      if (!walker.availableSlots.includes(timeSlot)) fail(409, 'Time slot is no longer available')
  
      walker.availableSlots = walker.availableSlots.filter((s) => s !== timeSlot)
      const walkId = uid()
      const reservation = {
        id: `res-${Date.now()}`,
        walkId,
        walkerId,
        timeSlot,
        dog,
        contact: { ...contact, email: contact.email.toLowerCase() },
        status: 'pending',
        reviewExpiresAt: nowPlusHours(24),
        reviewed: false,
        createdAt: new Date().toISOString(),
        message:
          'Reservation created as pending. Contact the walker by email/phone to agree on handover and compensation. Use walkId to leave a review within 24 hours.',
      }
      reservations = [reservation, ...reservations]
      return delay(reservation, 250)
    },
  
    async listReservations(email) {
      if (!email?.trim()) fail(400, 'Query parameter "email" is required')
      const walker = walkers.find((w) => w.email === email.trim().toLowerCase())
      if (!walker) return delay({ reservations: [] })
      return delay({
        walkerId: walker.id,
        reservations: reservations.filter((r) => r.walkerId === walker.id),
      })
    },
  
    async updateReservationStatus(walkId, { status, email }) {
      if (!['accepted', 'rejected'].includes(status)) {
        fail(400, 'status must be accepted or rejected')
      }
      const reservation = reservations.find((r) => r.walkId === walkId)
      if (!reservation) fail(404, 'Reservation not found')
      if (email) {
        const walker = walkers.find((w) => w.id === reservation.walkerId)
        if (!walker || walker.email !== email.trim().toLowerCase()) {
          fail(403, 'email does not match this reservation walker')
        }
      }
      reservation.status = status
      return delay(reservation)
    },
  
    async createReview({ walkId, stars, comment }) {
      const reservation = reservations.find((r) => r.walkId === walkId)
      if (!reservation) fail(404, 'Walk not found')
      if (reservation.reviewed) fail(400, 'This walk was already reviewed')
      if (new Date() > new Date(reservation.reviewExpiresAt)) {
        fail(400, 'Review window expired. Feedback is only allowed within 24 hours of the reservation.')
      }
      const starsNum = Number(stars)
      if (!Number.isInteger(starsNum) || starsNum < 1 || starsNum > 5) {
        fail(400, 'stars must be an integer from 1 to 5')
      }
      const text = String(comment || '').trim()
      if (!text || text.length > 150) fail(400, 'comment must be 1–150 characters')
  
      const review = {
        id: `rev-${Date.now()}`,
        walkId,
        walkerId: reservation.walkerId,
        stars: starsNum,
        comment: text,
        createdAt: new Date().toISOString(),
      }
      reviews = [review, ...reviews]
      reservation.reviewed = true
      return delay(review, 250)
    },
  }
  