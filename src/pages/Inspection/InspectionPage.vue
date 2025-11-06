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
import inspectionPlanningIcon from "src/assets/icons/inspection-planning.png";
import inspectionIcon from "src/assets/icons/inspection.png";
import adminIcon from "src/assets/icons/admin.png";
import refsIcon from "src/assets/icons/refs.png";

type Section = {
  id: string;
  title: string;
  icon: string;
  route: string;
};

export default defineComponent({
  name: "InspectionPage",
  data() {
    return {
      sections: [
        { id: "main", title: "В главное меню", icon: homeIcon, route: '/' },
        { id: "planning-inspection", title: "Заявки на осмотр", icon: inspectionPlanningIcon, route: '/inspection/planning-inspection' },
        { id: "planning-tech-service", title: "Заявки на техническое обслуживания", icon: inspectionIcon, route: '/inspection/planning-tech-service' },
        { id: "planning-current-repairs", title: "Заявки на текущие ремонты", icon: inspectionPlanningIcon, route: '/inspection/planning-curr-repairs' },
        { id: "other-tasks", title: "Заявки на прочие работы", icon: adminIcon, route: '/inspection/other-works' },
        { id: "autogen-inspections", title: "План ППР", icon: refsIcon, route: '/inspection/plan-ppr' },
      ] as Section[],
    };
  },
});
</script>

<style scoped>
.grid {
  display: grid;
  gap: 20px;
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