<template>
    <div>
        <h2 :style="{ fontSize: '30px', marginLeft: '30px' }">Бригады исполнителей</h2>
        <div className="actions">
            <button className="btn-add" @click="onAdd">Добавить</button>
            <button className="btn-green">Редактировать</button>
            <button className="btn-red">Удалить</button>
            <button className="btn-view">Просмотр</button>
            <button className="btn-filter">Фильтр</button>
            <button className="btn-export">Экспорт</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Идентификатор</th>
                    <th>ДЭСД</th>
                    <th>Наименование</th>
                    <th>Бригадир</th>
                </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="4">Загрузка...</td>
              </tr>
              <tr v-else-if="error">
                <td colspan="4">Ошибка: {{ error }}</td>
              </tr>
              <tr v-else-if="crews.length === 0">
                <td colspan="4">Нет данных</td>
              </tr>
              <tr v-for="crew in crews" :key="crew.id">
                <td>{{ crew.id }}</td>
                <td>{{ crew.desd }}</td>
                <td>{{ crew.name }}</td>
                <td>{{ crew.leaderFullName || '—' }}</td>
              </tr>
            </tbody>
        </table>
          <div
            v-if="showCrewForm"
            class="modal-backdrop"
            @click.self="closeCrewForm"
          >
            <div class="modal-card">
              <CrewForm
                @close="closeCrewForm"
                @saved="onCrewSaved"
              />
            </div>
          </div>
    </div>
</template>

<script>
  import axios from 'axios';
  import CrewForm from 'src/components/CrewForm.vue';

  const API = import.meta.env.VITE_API_URL;

  const api = axios.create({
    baseURL: API || 'http://localhost:8080/api', // наш Spring Boot
  });
  export default {
    components: {
      CrewForm,
    },
    data() {
      return {
        crews: [],
        loading: false,
        error: null,
        showCrewForm: false,
      };
    },

    mounted() {
      this.loadCrews();
    },

    methods: {
      async loadCrews() {
        this.loading = true;
        this.error = null;
        try {
          const { data } = await api.get('/crews');
          // data — это список CrewResponse из бэка
          this.crews = data;
        } catch (e) {
          console.error(e);
          this.error = 'Не удалось загрузить бригады';
        } finally {
          this.loading = false;
        }
      },

      onAdd() {
        this.showCrewForm = true;
      },

      closeCrewForm() {
        this.showCrewForm = false;
      },
      async onCrewSaved() {
        await this.loadCrews();
      },
    }
  }
</script>

<style scoped>
.actions {
  margin-bottom: 10px;
  margin-left: 10px;
}
.actions button {
  padding: 8px 15px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
}
.btn-add { background-color: #3a87ad; }
.btn-green { background-color: #5cb85c; }
.btn-red { background-color: #d9534f; }
.btn-view { background-color: #999; }
.btn-filter { background-color: #5bc0de; }
.btn-export { background-color: #f0ad4e; }

table {
  border-collapse: collapse;
  margin-left: 10px;
  width: 80%;
}
th, td {
  padding: 8px;
  text-align: left;
}
th {
  background: linear-gradient(#56a0d3, #2e6da4);
  color: #fff;
}
tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>