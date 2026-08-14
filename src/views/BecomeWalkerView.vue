<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWalkersStore } from '../stores/walkers.js'

const store = useWalkersStore()
const router = useRouter()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  location: '',
  services: ['dog walk'],
  availableSlots: [],
})
const error = ref('')
const ok = ref('')

onMounted(() => store.loadSlots())

function toggleService(name) {
  const set = new Set(form.value.services)
  if (set.has(name)) set.delete(name)
  else set.add(name)
  form.value.services = [...set]
}

function toggleSlot(slot) {
  const set = new Set(form.value.availableSlots)
  if (set.has(slot)) set.delete(slot)
  else set.add(slot)
  form.value.availableSlots = [...set]
}

async function submit() {
  error.value = ''
  ok.value = ''
  try {
    const created = await store.becomeWalker({ ...form.value })
    ok.value = `Welcome, ${created.firstName}! Your profile is live.`
    setTimeout(() => router.push(`/walkers/${created.id}`), 800)
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <h1>Become dog walker</h1>
  <p class="muted">No full auth — just register with email, location and predefined slots.</p>

  <form class="form-panel" @submit.prevent="submit">
    <div class="field">
      <label>First name</label>
      <input v-model="form.firstName" required />
    </div>
    <div class="field">
      <label>Last name</label>
      <input v-model="form.lastName" required />
    </div>
    <div class="field">
      <label>Email</label>
      <input v-model="form.email" type="email" required />
    </div>
    <div class="field">
      <label>Location (city / area)</label>
      <input v-model="form.location" required />
    </div>

    <div class="field">
      <label>Services</label>
      <div class="checks">
        <label>
          <input
            type="checkbox"
            :checked="form.services.includes('dog walk')"
            @change="toggleService('dog walk')"
          />
          dog walk
        </label>
        <label>
          <input
            type="checkbox"
            :checked="form.services.includes('dog bath')"
            @change="toggleService('dog bath')"
          />
          dog bath
        </label>
      </div>
    </div>

    <div class="field">
      <label>Availability (predefined slots)</label>
      <div class="checks">
        <label v-for="slot in store.slots" :key="slot">
          <input
            type="checkbox"
            :checked="form.availableSlots.includes(slot)"
            @change="toggleSlot(slot)"
          />
          {{ slot }}
        </label>
      </div>
    </div>

    <div v-if="error" class="notice error">{{ error }}</div>
    <div v-if="ok" class="notice ok">{{ ok }}</div>

    <button type="submit" :disabled="!form.availableSlots.length || !form.services.length">
      Register as walker
    </button>
  </form>
</template>
