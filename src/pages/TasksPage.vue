<template>
  <q-page >
    <q-form @submit.prevent="addTask" class="row items-center q-gutter-sm q-pa-md">
      <q-input type="text" filled dense placeholder="новая задача" v-model="newTask" class="col" />
      <q-btn type="submit" color="primary">Добавить</q-btn>
    </q-form>
    <div class="q-pa-md flex flex-center" v-if="loading">
      <q-spinner color="primary" size="40px" />
    </div>
    <q-list style="margin: 30px;" v-else>
      <task-item v-for="(task, index) in tasks" :key="index" :task="task" :index="index"></task-item>
    </q-list>

    <div class="q-pa-md flex flex-center">
      <q-pagination
        v-model="page"
        :min="0"
        :max="pageCount"
        :max-pages="5"
        boundary-numbers
        color="primary"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue';
  import TaskItem from 'src/components/taskItem.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { api } from 'src/boot/axios'

  const route = useRoute();
  const router = useRouter();
  const tasks = ref<any[]>([]);
  const newTask = ref('');
  const page = ref<number>(Number((route.query.page as string) ?? 0)); 
  const rowsPerPage = 20;
  const total = ref(0);
  const loading = ref(false);

  const pageCount = computed(() => Math.ceil(total.value / rowsPerPage) - 1);

async function fetchTasks() {
  try {
    loading.value = true;

    const { data } = await api.post('/tasks', {
    pageNumber: page.value,
    pageSize: rowsPerPage
    });
    tasks.value = data.data;
    total.value = data.total;
  } catch (error) {
    console.error('Error fetching tasks:', error);
  } finally {
    loading.value = false;
  }
}

  function addTask() {
    tasks.value.push({ name: newTask.value, createdAt: new Date() });
    newTask.value = '';
  }

  watch(page, (newPage) => {
    router.replace({ query: { ...route.query, page: newPage } });
    fetchTasks(); 
  });

  onMounted(fetchTasks);
</script>
