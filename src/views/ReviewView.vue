<script setup>
import { ref } from 'vue'
import { useReviewsStore } from '../stores/reviews.js'

const store = useReviewsStore()
const walkId = ref('')
const stars = ref(5)
const comment = ref('')

async function submit() {
  try {
    await store.submit({
      walkId: walkId.value.trim(),
      stars: Number(stars.value),
      comment: comment.value,
    })
    walkId.value = ''
    comment.value = ''
    stars.value = 5
  } catch {
    /* shown via store */
  }
}
</script>

<template>
  <h1>Write a review</h1>
  <p class="muted">
    Use the unique walk ID from your reservation. Reviews are only accepted within 24 hours.
  </p>

  <form class="form-panel" @submit.prevent="submit">
    <div class="field">
      <label>Walk ID</label>
      <input v-model="walkId" required placeholder="paste your walk ID" />
    </div>
    <div class="field">
      <label>Stars (1–5)</label>
      <select v-model.number="stars">
        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>
    <div class="field">
      <label>Feedback (max 150 chars)</label>
      <textarea v-model="comment" rows="3" maxlength="150" required />
      <div class="muted">{{ comment.length }}/150</div>
    </div>

    <div v-if="store.error" class="notice error">{{ store.error }}</div>
    <div v-if="store.success" class="notice ok">{{ store.success }}</div>

    <button type="submit" :disabled="store.loading">
      {{ store.loading ? 'Posting…' : 'Post review' }}
    </button>
  </form>
</template>
