<template>
  <div class="d-flex flex-column align-items-center justify-content-center" :class="containerClass">
    <div class="spinner-border text-primary" :class="sizeClass" role="status">
      <span class="visually-hidden">Chargement...</span>
    </div>
    <p v-if="message" class="mt-3 text-muted">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  message: {
    type: String,
    default: ''
  },
  fullScreen: {
    type: Boolean,
    default: false
  }
});

const sizeClass = computed(() => {
  const sizes = {
    sm: '',
    md: 'spinner-border-lg',
    lg: 'spinner-border-xl'
  };
  return sizes[props.size];
});

const containerClass = computed(() => {
  return props.fullScreen ? 'min-vh-100' : 'p-5';
});
</script>

<style scoped>
.spinner-border-lg {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}

.spinner-border-xl {
  width: 4rem;
  height: 4rem;
  border-width: 0.4em;
}
</style>