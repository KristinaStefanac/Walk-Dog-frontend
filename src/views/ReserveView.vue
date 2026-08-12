<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useWalkersStore } from '../stores/walkers.js'
import { useReservationsStore } from '../stores/reservations.js'

const route = useRoute()
const walkers = useWalkersStore()
const reservations = useReservationsStore()

const timeSlot = ref('')
const dog = ref({ breed: '', age: '', weight: '' })
const contact = ref({ phone: '', email: '' })
const done = ref(null)

onMounted(() => walkers.fetchOne(route.params.id))

async function submit() {
  done.value = null
  try {
    const result = await reservations.reserve({
      walkerId: route.params.id,
      timeSlot: timeSlot.value,
      dog: {
        breed: dog.value.breed,
        age: Number(dog.value.age),
        weight: Number(dog.value.weight),
      },
      contact: { ...contact.value },
    })
    done.value = result
    await walkers.fetchOne(route.params.id)
  } catch {
    /* error on store */
  }
}
</script>

<template>
  <div v-if="walkers.loading && !walkers.current" class="muted">Loading…</div>
  <div v-else-if="!walkers.current" class="notice error">{{ walkers.error || 'Walker not found' }}</div>

  <template v-else>
    <p>
      <RouterLink :to="`/walkers/${walkers.current.id}`">← Back to profile</RouterLink>
    </p>
    <h1>Reserve with {{ walkers.current.firstName }} {{ walkers.current.lastName }}</h1>
    <p class="muted">Location: {{ walkers.current.location }}</p>

    <div v-if="done" class="notice ok">
      <p><strong>Walk reserved</strong> (status: pending).</p>
      <p>
        Your walk ID (valid for reviews for 24 hours):
        <code>{{ done.walkId }}</code>
      </p>
      <p class="muted">
        Further details (handover point, compensation) are agreed directly with the walker via
        email/phone.
      </p>
      <p>
        <RouterLink to="/review">Write a review</RouterLink>
        ·
        <RouterLink to="/">Back home</RouterLink>
      </p>
    </div>

    <form v-else class="form-panel" @submit.prevent="submit">
      <h2 style="margin-top: 0">Pick a time slot</h2>
      <div v-if="!(walkers.current.availableSlots || []).length" class="notice">
        No slots left for this walker.
      </div>
      <div v-else class="slot-list">
        <button
          v-for="slot in walkers.current.availableSlots"
          :key="slot"
          type="button"
          class="slot"
          :class="{ active: timeSlot === slot }"
          @click="timeSlot = slot"
        >
          {{ slot }}
        </button>
      </div>

      <h2>Your dog</h2>
      <div class="field">
        <label>Breed</label>
        <input v-model="dog.breed" required />
      </div>
      <div class="field">
        <label>Age (years)</label>
        <input v-model="dog.age" type="number" min="0" step="1" required />
      </div>
      <div class="field">
        <label>Weight (kg)</label>
        <input v-model="dog.weight" type="number" min="0" step="0.1" required />
      </div>

      <h2>Contact</h2>
      <div class="field">
        <label>Phone</label>
        <input v-model="contact.phone" required />
      </div>
      <div class="field">
        <label>Email</label>
        <input v-model="contact.email" type="email" required />
      </div>

      <div v-if="reservations.error" class="notice error">{{ reservations.error }}</div>

      <button type="submit" :disabled="!timeSlot || reservations.loading">
        {{ reservations.loading ? 'Reserving…' : 'Reserve a walk' }}
      </button>
    </form>
  </template>
</template>
