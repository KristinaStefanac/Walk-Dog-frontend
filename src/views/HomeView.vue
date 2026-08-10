<script setup>
import { ref } from 'vue'
import { useWalkersStore } from '../stores/walkers.js'
import SearchPanel from '../components/SearchPanel.vue'
import WalkerCard from '../components/WalkerCard.vue'
import Pagination from '../components/Pagination.vue'

const store = useWalkersStore()
const query = ref('')
const searched = ref(false)

async function runSearch(page = 1) {
  const term = query.value.trim()
  if (!term) return
  searched.value = true
  await store.search(term, page)
}

function onPage(n) {
  runSearch(n)
}
</script>

<template>
  <h1>Find a dog walker nearby</h1>
  <p class="muted">Search by city or area. Matching is a simple case-insensitive text match.</p>

  <SearchPanel v-model="query" @submit="runSearch(1)" />

  <div v-if="store.loading" class="muted">Loading…</div>
  <div v-else-if="store.error" class="notice error">{{ store.error }}</div>
  <div v-else-if="searched && store.walkers.length === 0" class="notice">
    No walkers found for “{{ store.location }}”. Try another area, or
    <RouterLink to="/become-walker">become a dog walker</RouterLink>.
  </div>

  <template v-else-if="store.walkers.length">
    <p class="muted">{{ store.total }} walker{{ store.total === 1 ? '' : 's' }} found</p>
    <div class="grid">
      <WalkerCard v-for="w in store.walkers" :key="w.id" :walker="w" />
    </div>
    <Pagination :page="store.page" :page-count="store.pageCount" @change="onPage" />
  </template>
</template>
