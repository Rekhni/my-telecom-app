<template>
  <div class="p-4">
    <!-- your grid of links -->
    <section class="grid">
      <router-link
        v-for="s in sections"
        :key="s.id"
        :to="s.route"
        class="section"
        role="button"
        tabindex="0"
      >
        <img :src="s.icon" height="50" width="50" alt="" />
        <div class="section__label">{{ s.title }}</div>
      </router-link>
    </section>
  </div>
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
  name: "AdminPage",
  data() {
    return {
      sections: [
        { id: "main", title: "В главное меню", icon: "src/assets/icons/home.png", route: '/' },
        { id: "roles", title: "Роли", icon: "src/assets/icons/roles.png", route: '/admin/roles' },
        { id: "users", title: "Пользователи", icon: "src/assets/icons/users.png", route: '/admin/users' },
        { id: "settlements", title: "Группы населенных пунктов", icon: "src/assets/icons/settlements.png", route: '/admin/settlements' },
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