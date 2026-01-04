<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <i class="bi bi-kanban fs-4 me-2"></i>
        <span class="fw-bold">ProjectManager</span>
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item" v-if="!user">
            <router-link to="/" class="nav-link">Accueil</router-link>
          </li>
          
          <li class="nav-item" v-if="user">
            <router-link to="/dashboard" class="nav-link">Tableau de bord</router-link>
          </li>

          <li class="nav-item" v-if="user">
            <span class="nav-link text-white-50">{{ user.email }}</span>
          </li>

          <li class="nav-item" v-if="user">
            <button @click="handleLogout" class="btn btn-light btn-sm ms-2">
              <i class="bi bi-box-arrow-right me-1"></i>
              Déconnexion
            </button>
          </li>

          <li class="nav-item" v-if="!user">
            <router-link to="/auth" class="btn btn-light btn-sm">
              Connexion
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
</script>