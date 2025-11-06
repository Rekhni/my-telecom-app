<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          KAZAKHTELECOM
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
          style="width: 100%; display: flex; justify-content: center; align-items: center;"
        >
          <router-link to="/">
            <img
              alt="telecom logo"
              src="~assets/telecom.png"
              style="width: 150px; height: 150px;"
            />
</router-link>
        </q-item-label>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <q-btn 
            label="Главная"
            style="background-color: #4982f2; color: white; font-size: 18px; padding: 12px 24px; width: 80%; margin: 0 auto;"
            unelevated
            to="/"   
          />
          <q-btn 
            label="Задачи"
            style="background-color: #4982f2; color: white; font-size: 18px; padding: 12px 24px; width: 80%; margin: 0 auto;"
            unelevated
            to="/tasks"   
          />
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
