import { defineStore } from 'pinia'
import { api } from '../api/client.js'

export const useWalkersStore = defineStore('walkers', {
  state: () => ({
    walkers: [],
    page: 1,
    pageCount: 1,
    total: 0,
    location: '',
    loading: false,
    error: '',
    current: null,
    slots: [],
  }),
  actions: {
    async loadSlots() {
      const data = await api.getSlots()
      this.slots = data.slots
    },
    async search(location, page = 1) {
      this.loading = true
      this.error = ''
      this.location = location
      try {
        const data = await api.searchWalkers(location, page, 5)
        this.walkers = data.walkers
        this.page = data.page
        this.pageCount = data.pageCount
        this.total = data.total
      } catch (e) {
        this.error = e.message
        this.walkers = []
      } finally {
        this.loading = false
      }
    },
    async fetchOne(id) {
      this.loading = true
      this.error = ''
      try {
        this.current = await api.getWalker(id)
      } catch (e) {
        this.error = e.message
        this.current = null
      } finally {
        this.loading = false
      }
    },
    async becomeWalker(payload) {
      return api.createWalker(payload)
    },
  },
})
