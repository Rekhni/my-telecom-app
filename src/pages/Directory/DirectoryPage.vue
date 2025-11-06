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
  name: "DirectoryPage",
  data() {
    return {
      sections: [
        { id: "main", title: "В главное меню", icon: "src/assets/icons/home.png", route: '/' },
        { id: "materials", title: "Материалы", icon: "src/assets/icons/refs.png", route: '/directory/materials' },
        { id: "units-measurement", title: "Единицы измерения", icon: "src/assets/icons/refs.png", route: '/directory/units-measurement' },
        { id: "object-defect-types", title: "Типы дефектов обьектов", icon: "src/assets/icons/refs.png", route: '/directory/object-defect-types' },
        { id: "tech-maps", title: "Tехнологические карты", icon: "src/assets/icons/refs.png", route: 'directory/tech-maps' },
        { id: "defect-destroying-works", title: "Работы устраняющие дефекты", icon: "src/assets/icons/refs.png", route: '/directory/defect-destroying-works' },
        { id: "measure-resources", title: "Средства измерения", icon: "src/assets/icons/refs.png", route: '/directory/measure-resources' },
        { id: "measure-resources-type", title: "Тип средства измерения", icon: "src/assets/icons/refs.png", route: '/directory/measure-resources-type' },
        { id: "other-works-types", title: "Типы Прочих работ", icon: "src/assets/icons/refs.png", route: '/directory/other-works-types' },
        { id: "weekends-holidays", title: "Выходные и праздничные дни", icon: "src/assets/icons/refs.png", route: '/directory/weekends-holidays' },
        { id: "branches", title: "Филиалы", icon: "src/assets/icons/refs.png", route: '/directory/branches' },
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