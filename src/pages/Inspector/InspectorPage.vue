<template>
  <section class="grid">
    <router-link
      v-for="s in sections"
      :key="s.id"
      :to="s.route"
      class="section"
      role="button"
      tabindex="0"
    >
      <img :src="s.icon" height="50" width="50"  alt="admin icon" />
      <div class="section__label">{{ s.title }}</div>
    </router-link>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

type Section = {
  id: string;
  title: string;
  icon: string;
  route: string;
};

export default defineComponent({
  name: "InspectorPage",
  data() {
    return {
      sections: [
        { id: "main", title: "В главное меню", icon: "src/assets/icons/home.png", route: '/' },
        { id: "inspector-planning", title: "Планирование работ технического инспектора", icon: "src/assets/icons/inventory.png", route: 'inspector/inspector-planning' },
        { id: "controller-planning", title: "Планирование работ технического контроллера", icon: "src/assets/icons/inventory.png", route: 'inspector/controller-planning' },
        { id: "rescheduling-controller-planning", title: "Перенос сроков планов работ технического контроллера", icon: "src/assets/icons/calendar.png", route: 'inspector/rescheduling-controller-planning' },
      ] as Section[],
    };
  },
});
</script>

<style scoped>
.grid {
  display: grid;
  gap: 60px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  padding: 30px;
}
.section {
  padding: 20px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none;
  color: black;
  transition: background 0.2s;
}
.section:hover {
  background: #f5f5f5;
}
.section__label {
  font-size: 16px;
  font-weight: 500;
}
</style>