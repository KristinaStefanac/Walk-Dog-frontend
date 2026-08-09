<script setup>
defineProps ({
    stars: { type: Number, default: null},
    count: { type: Number, default: 0}

})

function render(stars) {
    if (stars == null) return "No reviwes yet"
    const full = Math.round(stars)
    return `${'★'.repeat(full)}${'☆'.repeat(5 - full)} (${stars})`
}
</script>

<template>
    <div class="stars">
        <span>{{ render(stars) }}</span>
        <span v-if="count" class="muted"> · {{ count }} review{{ count === 1 ? '' : 's' }}</span>
    </div>
</template>