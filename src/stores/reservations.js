import { defineStore } from 'pinia'
import { api } from '../api/client.js'

export const useReservationsStore = defineStore('reservations', {
  state: () => ({
    lastCreated: null,
    inbox: [],
    loading: false,
    error: '',
  }),
  actions: {
    async reserve(payload) {
      this.loading = true
      this.error = ''
      try {
        this.lastCreated = await api.createReservation(payload)
        return this.lastCreated
      } catch (e) {
        this.error = e.message
        throw e
      } finally {
        this.loading = false
      }
    },
    async loadInbox(email) {
      this.loading = true
      this.error = ''
      try {
        const data = await api.listReservations(email)
        this.inbox = data.reservations || []
      } catch (e) {
        this.error = e.message
        this.inbox = []
      } finally {
        this.loading = false
      }
    },
    async setStatus(walkId, status, email) {
      const updated = await api.updateReservationStatus(walkId, { status, email })
      this.inbox = this.inbox.map((r) => (r.walkId === walkId ? { ...r, ...updated } : r))
      return updated
    },
  },
})
