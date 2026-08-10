<script setup>
defineProps ({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'City or area...'}  
})
defineEmits('update:modelValue', 'submit')
</script>

<template>
    <from class="search.row" @submit.prevent="$emit('submit')">
        <input
            :value="modelValue"
            :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)"        />
        <button type="submit">Search</button>
    </from>
</template>