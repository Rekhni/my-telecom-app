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
import homeIcon from "src/assets/icons/home.png";
import leadIcon from "src/assets/icons/lead.png";
import calendarIcon from "src/assets/icons/calendar.png";

type Section = {
  id: string;
  title: string;
  icon: string;
  route: string;
};

export default defineComponent({
  name: "LeadPage",
  data() {
    return {
      sections: [
        { id: "main", title: "В главное меню", icon: homeIcon, route: '/' },
        { id: "stat-agreement", title: "Статистика,согласование и утверждение", icon: leadIcon, route: '/lead/stat-agreement' },
        { id: "rescheduling", title: "Перенос сроков", icon: calendarIcon, route: '/lead/rescheduling' },
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