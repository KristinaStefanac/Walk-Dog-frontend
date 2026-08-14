<script setup>
defineProps ({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'City or area...'}  
})
defineEmits('update:modelValue', 'submit')
</script>

<template>
    <form class="search.row" @submit.prevent="$emit('submit')">
        <input
            :value="modelValue"
            :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)"        />
        <button type="submit">Search</button>
    </form>
</template>