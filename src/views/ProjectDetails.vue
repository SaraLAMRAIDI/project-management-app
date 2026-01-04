<template>
  <div class="min-vh-100 bg-light">
    <div class="container py-4">
      <!-- Header -->
      <div class="mb-4">
        <button @click="$router.push('/dashboard')" class="btn btn-link text-decoration-none mb-3">
          <i class="bi bi-arrow-left me-2"></i>
          Retour aux projets
        </button>
        
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="fw-bold mb-1">{{ currentProject?.name || 'Chargement...' }}</h1>
            <p class="text-muted mb-0">{{ currentProject?.description || '' }}</p>
          </div>
          <button @click="openTaskModal()" class="btn btn-primary">
            <i class="bi bi-plus-lg me-2"></i>
            Nouvelle tâche
          </button>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="row g-4">
        <!-- To Do Column -->
        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0 d-flex align-items-center">
                <span class="badge bg-white text-primary rounded-circle me-2" style="width: 12px; height: 12px;"></span>
                À faire
              </h5>
              <span class="badge bg-white text-primary">{{ todoTasks.length }}</span>
            </div>
            <div class="card-body" style="min-height: 400px; max-height: 70vh; overflow-y: auto;">
              <TaskCard 
                v-for="task in todoTasks"
                :key="task.id"
                :task="task"
                @edit="openTaskModal"
                @delete="handleDeleteTask"
                @updateStatus="handleUpdateStatus"
              />
              <div v-if="todoTasks.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-inbox fs-1 mb-2"></i>
                <p class="small">Aucune tâche</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Doing Column -->
        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
              <h5 class="mb-0 d-flex align-items-center">
                <span class="badge bg-white text-warning rounded-circle me-2" style="width: 12px; height: 12px;"></span>
                En cours
              </h5>
              <span class="badge bg-white text-warning">{{ doingTasks.length }}</span>
            </div>
            <div class="card-body" style="min-height: 400px; max-height: 70vh; overflow-y: auto;">
              <TaskCard 
                v-for="task in doingTasks"
                :key="task.id"
                :task="task"
                @edit="openTaskModal"
                @delete="handleDeleteTask"
                @updateStatus="handleUpdateStatus"
              />
              <div v-if="doingTasks.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-inbox fs-1 mb-2"></i>
                <p class="small">Aucune tâche</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Done Column -->
        <div class="col-lg-4">
          <div class="card shadow-sm">
            <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0 d-flex align-items-center">
                <span class="badge bg-white text-success rounded-circle me-2" style="width: 12px; height: 12px;"></span>
                Terminé
              </h5>
              <span class="badge bg-white text-success">{{ doneTasks.length }}</span>
            </div>
            <div class="card-body" style="min-height: 400px; max-height: 70vh; overflow-y: auto;">
              <TaskCard 
                v-for="task in doneTasks"
                :key="task.id"
                :task="task"
                @edit="openTaskModal"
                @delete="handleDeleteTask"
                @updateStatus="handleUpdateStatus"
              />
              <div v-if="doneTasks.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-inbox fs-1 mb-2"></i>
                <p class="small">Aucune tâche</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Modal -->
      <div v-if="isTaskModalOpen" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ selectedTask ? 'Modifier la tâche' : 'Nouvelle tâche' }}
              </h5>
              <button type="button" class="btn-close" @click="closeTaskModal"></button>
            </div>

            <form @submit.prevent="handleTaskSubmit">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Titre *</label>
                  <input 
                    v-model="taskForm.title"
                    type="text"
                    required
                    class="form-control"
                    placeholder="Ex: Créer la maquette"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea 
                    v-model="taskForm.description"
                    rows="3"
                    class="form-control"
                    placeholder="Décrivez la tâche..."
                  ></textarea>
                </div>

                <div class="mb-3">
                  <label class="form-label">Date limite</label>
                  <input 
                    v-model="taskForm.dueDate"
                    type="date"
                    class="form-control"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Statut</label>
                  <select v-model="taskForm.status" class="form-select">
                    <option value="todo">À faire</option>
                    <option value="doing">En cours</option>
                    <option value="done">Terminé</option>
                  </select>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeTaskModal">
                  Annuler
                </button>
                <button type="submit" class="btn btn-primary">
                  {{ selectedTask ? 'Modifier' : 'Créer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '../stores/projectStore';
import TaskCard from '../components/TaskCard.vue';

const route = useRoute();
const projectStore = useProjectStore();

const isTaskModalOpen = ref(false);
const selectedTask = ref(null);
const taskForm = ref({
  title: '',
  description: '',
  dueDate: '',
  status: 'todo'
});

const currentProject = computed(() => projectStore.currentProject);
const todoTasks = computed(() => projectStore.todoTasks);
const doingTasks = computed(() => projectStore.doingTasks);
const doneTasks = computed(() => projectStore.doneTasks);

const projectId = computed(() => route.params.id);

onMounted(() => {
  if (projectId.value) {
    projectStore.subscribeToTasks(projectId.value);
  }
});

onUnmounted(() => {
  projectStore.cleanup();
});

const openTaskModal = (task = null) => {
  if (task) {
    selectedTask.value = task;
    taskForm.value = {
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      status: task.status
    };
  } else {
    selectedTask.value = null;
    taskForm.value = {
      title: '',
      description: '',
      dueDate: '',
      status: 'todo'
    };
  }
  isTaskModalOpen.value = true;
};

const closeTaskModal = () => {
  isTaskModalOpen.value = false;
  selectedTask.value = null;
  taskForm.value = {
    title: '',
    description: '',
    dueDate: '',
    status: 'todo'
  };
};

const handleTaskSubmit = async () => {
  try {
    if (selectedTask.value) {
      await projectStore.updateTask(projectId.value, selectedTask.value.id, taskForm.value);
    } else {
      await projectStore.createTask(projectId.value, taskForm.value);
    }
    closeTaskModal();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la tâche:', error);
    alert('Une erreur est survenue. Veuillez réessayer.');
  }
};

const handleDeleteTask = async (taskId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    try {
      await projectStore.deleteTask(projectId.value, taskId);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }
};

const handleUpdateStatus = async (taskId, newStatus) => {
  try {
    await projectStore.updateTask(projectId.value, taskId, { status: newStatus });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    alert('Une erreur est survenue. Veuillez réessayer.');
  }
};
</script>