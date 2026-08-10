<script setup>
import { RouterLink } from 'vue-router'
import StarRating from './StarRating.vue'

defineProps({
  walker: { type: Object, required: true },
})
</script>

<template>
  <article class="card">
    <h3>
      <RouterLink :to="`/walkers/${walker.id}`">
        {{ walker.firstName }} {{ walker.lastName }}
      </RouterLink>
    </h3>
    <div class="muted">{{ walker.location }}</div>
    <div>{{ (walker.services || []).join(' · ') }}</div>
    <StarRating :stars="walker.averageRating" :count="walker.reviewCount" />
    <div class="actions">
      <RouterLink :to="`/walkers/${walker.id}`">
        <button class="secondary">View profile</button>
      </RouterLink>
    </div>
  </article>
</template>
