<template>
  <div v-if="isOpen" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? 'Modifier le projet' : 'Nouveau projet' }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nom du projet *</label>
              <input 
                v-model="formData.name"
                type="text"
                required
                class="form-control"
                placeholder="Ex: Site web e-commerce"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea 
                v-model="formData.description"
                rows="3"
                class="form-control"
                placeholder="Décrivez votre projet..."
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Couleur distinctive</label>
              <div class="d-flex gap-2">
                <button
                  v-for="color in colors"
                  :key="color"
                  type="button"
                  @click="formData.color = color"
                  class="btn rounded-circle p-3"
                  :class="formData.color === color ? 'border border-dark border-3' : 'border'"
                  :style="{ backgroundColor: color, width: '50px', height: '50px' }"
                ></button>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="close">
              Annuler
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEditMode ? 'Modifier' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  project: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'submit']);

const colors = ['#0d6efd', '#6610f2', '#d63384', '#fd7e14', '#198754', '#20c997', '#dc3545', '#0dcaf0'];

const formData = ref({
  name: '',
  description: '',
  color: colors[0]
});

const isEditMode = ref(false);

watch(() => props.project, (newProject) => {
  if (newProject) {
    isEditMode.value = true;
    formData.value = {
      name: newProject.name,
      description: newProject.description || '',
      color: newProject.color || colors[0]
    };
  } else {
    isEditMode.value = false;
    formData.value = {
      name: '',
      description: '',
      color: colors[0]
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', { ...formData.value });
  close();
};

const close = () => {
  formData.value = {
    name: '',
    description: '',
    color: colors[0]
  };
  emit('close');
};
</script>