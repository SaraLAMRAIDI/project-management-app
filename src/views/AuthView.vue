<template>
  <div class="min-vh-100 bg-light d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <!-- Header -->
              <div class="text-center mb-4">
                <h2 class="fw-bold mb-2">{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>
                <p class="text-muted">
                  {{ isLogin ? 'Bienvenue ! Connectez-vous à votre compte' : 'Créez votre compte gratuitement' }}
                </p>
              </div>

              <!-- Error Alert -->
              <div v-if="error" class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ error }}
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="mb-3">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input 
                    v-model="email"
                    type="email"
                    required
                    class="form-control"
                    placeholder="votre@email.com"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Mot de passe</label>
                  <input 
                    v-model="password"
                    type="password"
                    required
                    minlength="6"
                    class="form-control"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit"
                  :disabled="loading"
                  class="btn btn-primary w-100 py-2"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire") }}
                </button>
              </form>

              <!-- Divider -->
              <div class="position-relative my-4">
                <hr>
                <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                  Ou continuer avec
                </span>
              </div>

              <!-- Google Sign In -->
              <button 
                @click="handleGoogleSignIn"
                :disabled="loading"
                class="btn btn-outline-secondary w-100 py-2 d-flex align-items-center justify-content-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" class="me-2">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              <!-- Toggle -->
              <div class="text-center mt-4">
                <small class="text-muted">
                  {{ isLogin ? "Vous n'avez pas de compte ?" : 'Vous avez déjà un compte ?' }}
                  <button @click="toggleMode" class="btn btn-link btn-sm p-0 ms-1 text-decoration-none">
                    {{ isLogin ? "S'inscrire" : 'Se connecter' }}
                  </button>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  error.value = '';
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';

    if (isLogin.value) {
      await authStore.login(email.value, password.value);
    } else {
      await authStore.register(email.value, password.value);
    }

    router.push('/dashboard');
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue. Veuillez réessayer.';
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  try {
    loading.value = true;
    error.value = '';
    await authStore.loginWithGoogle();
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue avec Google. Veuillez réessayer.';
  } finally {
    loading.value = false;
  }
};
</script>