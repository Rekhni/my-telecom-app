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
import refsIcon from "src/assets/icons/refs.png";

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
        { id: "main", title: "В главное меню", icon: homeIcon, route: '/' },
        { id: "materials", title: "Материалы", icon: refsIcon, route: '/directory/materials' },
        { id: "units-measurement", title: "Единицы измерения", icon: refsIcon, route: '/directory/units-measurement' },
        { id: "object-defect-types", title: "Типы дефектов обьектов", icon: refsIcon, route: '/directory/object-defect-types' },
        { id: "tech-maps", title: "Tехнологические карты", icon: refsIcon, route: 'directory/tech-maps' },
        { id: "defect-destroying-works", title: "Работы устраняющие дефекты", icon: refsIcon, route: '/directory/defect-destroying-works' },
        { id: "measure-resources", title: "Средства измерения", icon: refsIcon, route: '/directory/measure-resources' },
        { id: "measure-resources-type", title: "Тип средства измерения", icon: refsIcon, route: '/directory/measure-resources-type' },
        { id: "other-works-types", title: "Типы Прочих работ", icon: refsIcon, route: '/directory/other-works-types' },
        { id: "weekends-holidays", title: "Выходные и праздничные дни", icon: refsIcon, route: '/directory/weekends-holidays' },
        { id: "branches", title: "Филиалы", icon: refsIcon, route: '/directory/branches' },
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