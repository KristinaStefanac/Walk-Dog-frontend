<script setup>
import { onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useWalkersStore } from '../stores/walkers.js'
import StarRating from '../components/StarRating.vue'

const route = useRoute()
const store = useWalkersStore()

onMounted(() => store.fetchOne(route.params.id))
</script>

<template>
  <div v-if="store.loading" class="muted">Loading…</div>
  <div v-else-if="store.error" class="notice error">{{ store.error }}</div>
  <template v-else-if="store.current">
    <p><RouterLink to="/">← Back to search</RouterLink></p>
    <h1>{{ store.current.firstName }} {{ store.current.lastName }}</h1>
    <p class="muted">{{ store.current.location }} · {{ store.current.email }}</p>
    <p>Services: {{ (store.current.services || []).join(', ') }}</p>
    <StarRating :stars="store.current.averageRating" :count="store.current.reviewCount" />

    <p class="muted" style="margin-top: 16px">
      Available slots: {{ (store.current.availableSlots || []).join(', ') || 'none right now' }}
    </p>

    <p style="margin: 20px 0">
      <RouterLink :to="`/walkers/${store.current.id}/reserve`">
        <button>Reserve time for your dog</button>
      </RouterLink>
    </p>

    <h2>Reviews</h2>
    <div v-if="!(store.current.reviews || []).length" class="muted">No reviews yet.</div>
    <div v-for="r in store.current.reviews" :key="r.id" class="card" style="margin-bottom: 10px">
      <StarRating :stars="r.stars" />
      <p style="margin: 0">{{ r.comment }}</p>
    </div>
  </template>
</template>
