<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useStubs } from './api/client.js'
</script>

<template>
  <nav class="nav">
    <RouterLink to="/" class="brand">Walk Dog</RouterLink>
    <RouterLink to="/">Find walkers</RouterLink>
    <RouterLink to="/review">Write a review</RouterLink>
    <RouterLink to="/become-walker">Become dog walker</RouterLink>
    <RouterLink to="/walker-inbox">Walker inbox</RouterLink>
    <span class="spacer" />
    <span v-if="useStubs" class="badge">stub mode</span>
  </nav>
  <main class="container">
    <RouterView />
  </main>
</template>
