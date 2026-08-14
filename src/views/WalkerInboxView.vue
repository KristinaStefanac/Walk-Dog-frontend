<script setup>
import { ref } from 'vue'
import { useReservationsStore } from '../stores/reservations.js'

const store = useReservationsStore()
const email = ref('')
const loaded = ref(false)
const actionError = ref('')

async function load() {
  loaded.value = true
  actionError.value = ''
  await store.loadInbox(email.value.trim())
}

async function setStatus(walkId, status) {
  actionError.value = ''
  try {
    await store.setStatus(walkId, status, email.value.trim())
  } catch (e) {
    actionError.value = e.message
  }
}
</script>

<template>
  <h1>Walker inbox</h1>
  <p class="muted">
    Enter the walker email used at registration to see requests and accept or reject them.
  </p>

  <form class="search-row" @submit.prevent="load">
    <input v-model="email" type="email" placeholder="walker@example.com" required />
    <button type="submit">Load requests</button>
  </form>

  <div v-if="store.loading" class="muted">Loading…</div>
  <div v-else-if="store.error" class="notice error">{{ store.error }}</div>
  <div v-else-if="actionError" class="notice error">{{ actionError }}</div>
  <div v-else-if="loaded && !store.inbox.length" class="notice">No reservations for this email.</div>

  <div v-for="r in store.inbox" :key="r.walkId" class="card" style="margin-bottom: 12px">
    <div>
      <span class="status" :class="r.status">{{ r.status }}</span>
      · slot <strong>{{ r.timeSlot }}</strong>
    </div>
    <div class="muted">Walk ID: {{ r.walkId }}</div>
    <div>
      Dog: {{ r.dog.breed }}, {{ r.dog.age }}y, {{ r.dog.weight }}kg
    </div>
    <div>
      Owner: {{ r.contact.email }} · {{ r.contact.phone }}
    </div>
    <div v-if="r.status === 'pending'" class="row-actions" style="margin-top: 8px">
      <button class="ok" @click="setStatus(r.walkId, 'accepted')">Accept</button>
      <button class="danger" @click="setStatus(r.walkId, 'rejected')">Reject</button>
    </div>
  </div>
</template>
