<template>
  <div class="min-vh-100 bg-light">
    <div class="container py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="fw-bold mb-1">Mes Projets</h1>
          <p class="text-muted mb-0">Gérez et organisez tous vos projets</p>
        </div>
        <button @click="openModal()" class="btn btn-primary">
          <i class="bi bi-plus-lg me-2"></i>
          Nouveau projet
        </button>
      </div>

      <!-- Loading -->
      <LoadingSpinner v-if="loading && projects.length === 0" message="Chargement des projets..." />

      <!-- Empty State -->
      <div v-else-if="projects.length === 0" class="text-center py-5">
        <div class="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style="width: 100px; height: 100px;">
          <i class="bi bi-folder-plus text-primary" style="font-size: 3rem;"></i>
        </div>
        <h3 class="fw-bold mb-2">Aucun projet</h3>
        <p class="text-muted mb-4">Créez votre premier projet pour commencer !</p>
        <button @click="openModal()" class="btn btn-primary">
          Créer un projet
        </button>
      </div>

      <!-- Projects Grid -->
      <div v-else class="row g-4">
        <div v-for="project in projects" :key="project.id" class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm border-top border-4 border-0" :style="{ borderTopColor: project.color + ' !important' }">
            <div class="card-body" style="cursor: pointer;" @click="goToProject(project)">
              <h5 class="card-title fw-bold mb-2">{{ project.name }}</h5>
              <p class="card-text text-muted small mb-3" style="min-height: 40px;">
                {{ project.description || 'Aucune description' }}
              </p>
              <small class="text-muted">
                <i class="bi bi-calendar3 me-1"></i>
                {{ formatDate(project.createdAt) }}
              </small>
            </div>
            <div class="card-footer bg-light d-flex justify-content-end gap-2 border-0">
              <button 
                @click.stop="openModal(project)" 
                class="btn btn-sm btn-outline-primary"
                title="Modifier"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button 
                @click.stop="handleDeleteProject(project.id, project.name)" 
                class="btn btn-sm btn-outline-danger"
                title="Supprimer"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <ProjectModal 
        :isOpen="isModalOpen"
        :project="selectedProject"
        @close="closeModal"
        @submit="handleProjectSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useProjectStore } from '../stores/projectStore';
import ProjectModal from '../components/ProjectModal.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

const router = useRouter();
const authStore = useAuthStore();
const projectStore = useProjectStore();

const isModalOpen = ref(false);
const selectedProject = ref(null);

const projects = computed(() => projectStore.projects);
const loading = computed(() => projectStore.loading);

onMounted(() => {
  if (authStore.user) {
    projectStore.subscribeToProjects(authStore.user.uid);
  }
});

onUnmounted(() => {
  projectStore.cleanup();
});

const openModal = (project = null) => {
  selectedProject.value = project;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedProject.value = null;
};

const handleProjectSubmit = async (projectData) => {
  try {
    if (selectedProject.value) {
      await projectStore.updateProject(selectedProject.value.id, projectData);
    } else {
      await projectStore.createProject(projectData);
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du projet:', error);
    alert('Une erreur est survenue. Veuillez réessayer.');
  }
};

const handleDeleteProject = async (projectId, projectName) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le projet "${projectName}" ? Cette action est irréversible.`)) {
    try {
      await projectStore.deleteProject(projectId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }
};

const goToProject = (project) => {
  projectStore.setCurrentProject(project);
  router.push(`/project/${project.id}`);
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Date inconnue';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};
</script>