import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthStore } from './authStore';

export const useProjectStore = defineStore('project', () => {
  const projects = ref([]);
  const currentProject = ref(null);
  const tasks = ref([]);
  const loading = ref(false);
  const error = ref(null);

  let unsubscribeProjects = null;
  let unsubscribeTasks = null;

  // Computed
  const todoTasks = computed(() => tasks.value.filter(t => t.status === 'todo'));
  const doingTasks = computed(() => tasks.value.filter(t => t.status === 'doing'));
  const doneTasks = computed(() => tasks.value.filter(t => t.status === 'done'));

  // ============ PROJECTS ============

  // Listen to projects in real-time
  const subscribeToProjects = (userId) => {
    if (unsubscribeProjects) unsubscribeProjects();

    const q = query(
      collection(db, 'projects'),
      where('userId', '==', userId)
    );

    unsubscribeProjects = onSnapshot(q, (snapshot) => {
      projects.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }, (err) => {
      error.value = err.message;
      console.error('Error subscribing to projects:', err);
    });
  };

  // Create project
  const createProject = async (projectData) => {
    const authStore = useAuthStore();
    try {
      loading.value = true;
      error.value = null;

      const docRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        userId: authStore.user.uid,
        createdAt: serverTimestamp()
      });

      return docRef.id;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update project
  const updateProject = async (projectId, projectData) => {
    try {
      loading.value = true;
      error.value = null;

      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...projectData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    try {
      loading.value = true;
      error.value = null;

      // Delete all tasks first
      const tasksQuery = query(collection(db, 'projects', projectId, 'tasks'));
      const tasksSnapshot = await getDocs(tasksQuery);
      
      const deletePromises = tasksSnapshot.docs.map(taskDoc => 
        deleteDoc(doc(db, 'projects', projectId, 'tasks', taskDoc.id))
      );
      await Promise.all(deletePromises);

      // Then delete the project
      await deleteDoc(doc(db, 'projects', projectId));
      
      if (currentProject.value?.id === projectId) {
        currentProject.value = null;
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // ============ TASKS ============

  // Listen to tasks in real-time
  const subscribeToTasks = (projectId) => {
    if (unsubscribeTasks) unsubscribeTasks();

    const q = collection(db, 'projects', projectId, 'tasks');

    unsubscribeTasks = onSnapshot(q, (snapshot) => {
      tasks.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }, (err) => {
      error.value = err.message;
      console.error('Error subscribing to tasks:', err);
    });
  };

  // Create task
  const createTask = async (projectId, taskData) => {
    try {
      loading.value = true;
      error.value = null;

      await addDoc(collection(db, 'projects', projectId, 'tasks'), {
        ...taskData,
        status: taskData.status || 'todo',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update task
  const updateTask = async (projectId, taskId, taskData) => {
    try {
      loading.value = true;
      error.value = null;

      const taskRef = doc(db, 'projects', projectId, 'tasks', taskId);
      await updateDoc(taskRef, {
        ...taskData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete task
  const deleteTask = async (projectId, taskId) => {
    try {
      loading.value = true;
      error.value = null;

      await deleteDoc(doc(db, 'projects', projectId, 'tasks', taskId));
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Set current project
  const setCurrentProject = (project) => {
    currentProject.value = project;
  };

  // Cleanup
  const cleanup = () => {
    if (unsubscribeProjects) {
      unsubscribeProjects();
      unsubscribeProjects = null;
    }
    if (unsubscribeTasks) {
      unsubscribeTasks();
      unsubscribeTasks = null;
    }
    projects.value = [];
    tasks.value = [];
    currentProject.value = null;
  };

  return {
    projects,
    currentProject,
    tasks,
    todoTasks,
    doingTasks,
    doneTasks,
    loading,
    error,
    subscribeToProjects,
    createProject,
    updateProject,
    deleteProject,
    subscribeToTasks,
    createTask,
    updateTask,
    deleteTask,
    setCurrentProject,
    cleanup
  };
});