<template>
  <q-item clickable v-ripple>
    <q-item-section>
      <q-item-label style="font-size: 20px;">{{ task.name }}</q-item-label>
      <q-item-label style="font-size: 15px;" caption>{{ formatted }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { computed, toRefs } from 'vue'
  import { date } from 'quasar'

  interface Task {
    name: string
    createdAt: Date | string | number
    [key: string]: unknown
  }

  const props = defineProps<{
    index: number
    task: Task
  }>()

  const { task } = toRefs(props)

  const formatted = computed(() =>
    date.formatDate(task.value.createdAt, 'DD.MM.YYYY HH:mm')
  )
</script>
