import { defineStore } from 'pinia'
import { api } from '../api/client.js'

export const useReviewsStore = defineStore('reviews', {
  state: () => ({
    loading: false,
    error: '',
    success: '',
  }),
  actions: {
    async submit(payload) {
      this.loading = true
      this.error = ''
      this.success = ''
      try {
        await api.createReview(payload)
        this.success = 'Thanks! Your review was posted.'
      } catch (e) {
        this.error = e.message
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})
