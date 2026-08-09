<script setup>
defineProps({
  page: { type: Number, required: true },
  pageCount: { type: Number, required: true },
})
defineEmits(['change'])
</script>

<template>
  <div v-if="pageCount > 1" class="pagination">
    <button class="secondary" :disabled="page <= 1" @click="$emit('change', page - 1)">Prev</button>
    <span class="muted">Page {{ page }} / {{ pageCount }}</span>
    <button class="secondary" :disabled="page >= pageCount" @click="$emit('change', page + 1)">Next</button>
  </div>
</template>
