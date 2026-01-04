<template>
  <div id="app">
    <AppNavbar />
    <router-view v-if="!authLoading" />
    <LoadingSpinner v-else fullScreen message="Initialisation..." />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import AppNavbar from './components/AppNavbar.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';

const authStore = useAuthStore();
const authLoading = computed(() => authStore.loading);

onMounted(async () => {
  await authStore.initAuth();
});
</script>