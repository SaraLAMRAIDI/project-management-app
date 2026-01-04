<template>
  <div class="min-vh-100 bg-light">
    <div class="container py-5">
      <!-- Hero Section -->
      <div class="text-center py-5">
        <h1 class="display-3 fw-bold mb-4">
          Gérez vos projets avec <span class="text-primary">simplicité</span>
        </h1>
        <p class="lead text-muted mb-4">
          Une application moderne pour organiser vos tâches et suivre vos projets en temps réel.
        </p>
        <div class="d-flex gap-3 justify-content-center">
          <router-link to="/auth" class="btn btn-primary btn-lg px-4">
            <i class="bi bi-rocket-takeoff me-2"></i>
            Commencer gratuitement
          </router-link>
          <router-link v-if="user" to="/dashboard" class="btn btn-outline-primary btn-lg px-4">
            Tableau de bord
          </router-link>
        </div>
      </div>

      <!-- Features -->
      <div class="row g-4 mt-5">
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body text-center p-4">
              <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                <i class="bi bi-clipboard-check text-primary" style="font-size: 2rem;"></i>
              </div>
              <h5 class="card-title fw-bold">Organisation simple</h5>
              <p class="card-text text-muted">
                Créez des projets et organisez vos tâches en colonnes Kanban intuitives.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body text-center p-4">
              <div class="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                <i class="bi bi-lightning-charge text-success" style="font-size: 2rem;"></i>
              </div>
              <h5 class="card-title fw-bold">Temps réel</h5>
              <p class="card-text text-muted">
                Synchronisation instantanée de vos modifications sur tous vos appareils.
              </p>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body text-center p-4">
              <div class="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width: 80px; height: 80px;">
                <i class="bi bi-shield-lock text-warning" style="font-size: 2rem;"></i>
              </div>
              <h5 class="card-title fw-bold">Sécurisé</h5>
              <p class="card-text text-muted">
                Vos données sont protégées avec Firebase Authentication et Firestore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
</script>