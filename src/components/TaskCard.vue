<template>
  <div class="card mb-3 shadow-sm border-start border-4" :style="{ borderLeftColor: statusColor }">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h6 class="card-title mb-0 fw-bold">{{ task.title }}</h6>
        <div class="btn-group btn-group-sm">
          <button @click="$emit('edit', task)" class="btn btn-outline-primary btn-sm" title="Modifier">
            <i class="bi bi-pencil"></i>
          </button>
          <button @click="$emit('delete', task.id)" class="btn btn-outline-danger btn-sm" title="Supprimer">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <p class="card-text text-muted small mb-3">{{ task.description }}</p>

      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted" v-if="task.dueDate">
          <i class="bi bi-calendar-event me-1"></i>
          {{ formatDate(task.dueDate) }}
        </small>
        
        <select 
          v-model="taskStatus"
          @change="handleStatusChange"
          class="form-select form-select-sm w-auto"
        >
          <option value="todo">À faire</option>
          <option value="doing">En cours</option>
          <option value="done">Terminé</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete', 'updateStatus']);

const taskStatus = ref(props.task.status);

const statusColor = computed(() => {
  const colors = {
    todo: '#0d6efd',
    doing: '#ffc107',
    done: '#198754'
  };
  return colors[props.task.status] || '#0d6efd';
});

const handleStatusChange = () => {
  emit('updateStatus', props.task.id, taskStatus.value);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};
</script>