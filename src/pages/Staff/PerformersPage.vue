<template>
    <div>
        <h2 :style="{ fontSize: '30px', marginLeft: '30px' }">Бригады исполнителей</h2>
        <div className="actions">
            <button className="btn-add" @click="onAdd">Добавить</button>
            <button className="btn-green" :disabled="!selectedCrewId" @click="onEdit">Редактировать</button>
            <button className="btn-red" :disabled="!selectedCrewId" @click="deleteCrew(selectedCrewId)">Удалить</button>
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
              <tr 
                v-for="crew in sortedCrews" 
                :key="crew.id"
                @click="selectCrew(crew)"
                :class="{ selected: crew.id === selectedCrewId }"
                style="cursor: pointer"
              >
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
                :key="isEdit ? `edit-${selectedCrewId}` : 'create'"
                :crewId="selectedCrewId"
                :isEdit="isEdit"
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
        isEdit: false,
        selectedCrewId: null
      };
    },

    computed: {
      sortedCrews() {
        return [...this.crews].sort((a, b) => a.id - b.id);
      }
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
        this.isEdit = false;
        this.selectedCrewId = null;
      },

      onEdit() {
        if (!this.selectedCrewId) return;
        this.showCrewForm = true;
        this.isEdit = true;
      },

      selectCrew(crew) {
        this.selectedCrewId = crew.id;
      },

      closeCrewForm() {
        this.showCrewForm = false;
      },
      async onCrewSaved() {
        this.showCrewForm = false;
        await this.loadCrews();
      },

      async deleteCrew(id) {
        if (!id) return;
    
        const confirmed = confirm("Вы уверены, что хотите удалить бригаду?");
        if (!confirmed) return;

        try {
          await api.delete(`/crews/${id}`);
          this.selectedCrewId = null;
          await this.loadCrews();
        } catch(e) {
          console.error('Ошибка удаления бригады', e);
          alert('Не удалось удалить бригаду');
        }
      }
    }
  }
</script>

<style scoped>
  .modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 70px;
  z-index: 1000;
}

.modal-card {
  background: #fff;
  padding: 16px;
  min-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 4px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}
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

.selected {
  background: rgba(36, 103, 196, 0.38) !important;
}
</style>