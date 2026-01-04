import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(true);
  const error = ref(null);


  const initAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          };
        } else {
          user.value = null;
        }
        loading.value = false;
        resolve();
      });
    });
  };


  const register = async (email, password) => {
    try {
      error.value = null;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };


  const login = async (email, password) => {
    try {
      error.value = null;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };


  const loginWithGoogle = async () => {
    try {
      error.value = null;
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };


  const logout = async () => {
    try {
      error.value = null;
      await signOut(auth);
      user.value = null;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    initAuth,
    register,
    login,
    loginWithGoogle,
    logout
  };
});