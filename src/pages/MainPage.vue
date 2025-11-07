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
import adminIcon from "src/assets/icons/admin.png?url";
import staffIcon from "src/assets/icons/staff.png?url";
import inspectionIcon from "src/assets/icons/inspection.png?url"
import meterIcon from 'src/assets/icons/meter.png?url';
import leadIcon from 'src/assets/icons/admin.png';
import inspectorIcon from 'src/assets/icons/inspector.png?url';
import refsIcon from 'src/assets/icons/refs.png?url';
import inventoryIcon from 'src/assets/icons/inventory.png?url';

type Section = {
  id: string;
  title: string;
  icon: string;
  route: string;
};

export default defineComponent({
  name: "MainPage",
  data() {
    return {
      sections: [
        { id: "admin", title: "Администрирование", icon: adminIcon, route: "/admin" },
        { id: "staff", title: "Технический персонал", icon: staffIcon, route: "/staff" },
        { id: "inspection", title: "ППР", icon: inspectionIcon, route: "/inspection" },
        { id: "measure", title: "Измеритель", icon: meterIcon, route: "/measurement" },
        { id: "lead", title: "Руководитель", icon: leadIcon, route: "/lead" },
        { id: "inspector", title: "Технический инспектор", icon: inspectorIcon, route: "/inspector" },
        { id: "directory", title: "Справочники", icon: refsIcon, route: "/directory" },
        { id: "inventory", title: "Инвентаризация", icon: inventoryIcon, route: "/inventory" }
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
