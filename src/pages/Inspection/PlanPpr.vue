<template>
    <div>
        <h2 :style="{ fontSize: '30px', marginLeft: '30px' }">План ППР</h2>
        <div class="actions">
            <button class="btn-add" @click="openCreateForm">Создать</button>
            <button class="btn-green" :disabled="!selectedPprId" @click="openEditForm">Редактировать</button>
            <button class="btn-red" :disabled="!selectedPprId" @click="deletePpr(selectedPprId)">Удалить</button>
            <button class="btn-filter">Фильтр</button>
            <button class="btn-export">Экспорт</button>
            <button class="btn-green">Согласовать</button>
        </div>

        <table class="inspection-table">
            <thead>
                <tr>
                    <th>N</th>
                    <th>Тип обьекта</th>
                    <th>Местонахождение</th>
                    <th>Отвественный</th>
                    <th>Кол-во обьектов</th>
                    <th>Дата 1 кв</th>
                    <th>Дата 2 кв</th>
                    <th>Дата 3 кв</th>
                    <th>Дата 4 кв</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="loading">
                  <td colspan="4">Загрузка...</td>
                </tr>
                <tr v-else-if="error">
                  <td colspan="4">Ошибка: {{ error }}</td>
                </tr>
                <tr v-else-if="pprs.length === 0">
                  <td colspan="4">Нет данных</td>
                </tr>
                <tr 
                  v-for="ppr in sortedPprs" 
                  :key="ppr.id"
                  @click="selectPpr(ppr)"
                  :class="{ selected: ppr.id === selectedPprId }"
                  style=" cursor: pointer "
                >
                  <td>{{ ppr.id }}</td>
                  <td>{{ ppr.type }}</td>
                  <td>{{ ppr.location }}</td>
                  <td>{{ ppr.leaderFullName }}</td>
                  <td>100</td>
                  <td>{{ ppr.q1Date }}</td>
                  <td>{{ ppr.q2Date }}</td>
                  <td>{{ ppr.q3Date }}</td>
                  <td>{{ ppr.q4Date }}</td>
                </tr>
            </tbody>
        </table>
        <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
          <div class="modal-card">
            <div class="modal-header">
               <div>
                {{ isEdit ? "Редактирование плана" : "Создание плана" }}
              </div>
              <button class="close" @click="closeForm">x</button>
            </div>

            <div class="modal-body grid">
              <div class="field">
                <label>Тип обьекта </label>
                <input class="obj-input" v-model="form.type" type="text" width="400px">
              </div>

              <div class="field">
                <label>Местонахождение </label>
                <input class="obj-input" v-model="form.location" type="text" width="400px">
              </div>

              <div class="field">
                <label>Дата 1 кв </label>
                <input class="obj-input" v-model="form.q1Date" type="date" width="400px">
              </div>

              <div class="field">
                <label>Дата 2 кв </label>
                <input class="obj-input" v-model="form.q2Date" type="date" width="400px">
              </div>

              <div class="field">
                <label>Дата 3 кв </label>
                <input class="obj-input" v-model="form.q3Date" type="date" width="400px">
              </div>
              <div class="field">
                <label>Дата 4 кв </label>
                <input class="obj-input" v-model="form.q4Date" type="date" width="400px">
              </div>
              <div class="field">
                <label for="crewId">Бригада исполнителей</label>
                <select id="crewId" class="obj-input" v-model="form.crewId">
                  <option disabled value="">Выберите бригаду</option>
                  <option v-for="c in crews" :key="c.id" :value="c.id">
                    {{ c.name }} — {{ c.desd }} (бригадир: {{ c.leaderFullName }})
                  </option>
                </select>
              </div>
            </div>
            <button @click="savePprPlan">Сохранить</button>
          </div>
        </div>
    </div>
</template>

<script>
  import axios from 'axios';

  const API = import.meta.env.VITE_API_URL;

  const api = axios.create({
    baseURL: API || 'http://localhost:8080/api', // наш Spring Boot
  });



export default {
    data() {
      return {
        crews: [],
        pprs: [],
        isEdit: false,
        selectedPprId: null,
        loading: false,
        error: null,
        showForm: false,
        form: {
          type: "",
          location: "",
          crewId: "",
          q1Date: "",
          q2Date: "",
          q3Date: "",
          q4Date: ""
        }
      };
    },
  
  mounted() {
      this.loadCrews();
      this.getPprPlan();
  },

  computed: {
    sortedPprs() {
      return [...this.pprs].sort((a, b) => a.id - b.id);
    }
  },

  methods: {
    openCreateForm() {
      this.showForm = true;
      this.selectedPprId = null;
      this.isEdit = false;

      this.form = { type:"", location:"", crewId:"", q1Date:"", q2Date:"", q3Date:"", q4Date:"" };
    },

    openEditForm() {
      if (!this.selectedPprId) return;

      const ppr = this.pprs.find((x) => x.id === this.selectedPprId);

      this.isEdit = true;

      this.form = {
          type: ppr.type,
          location: ppr.location,
          crewId: ppr.crewId,
          q1Date: ppr.q1Date,
          q2Date: ppr.q2Date,
          q3Date: ppr.q3Date,
          q4Date: ppr.q4Date

      }

      this.showForm = true;
    },

    selectPpr(ppr) {
      this.selectedPprId = ppr.id;
    },

    closeForm() {
      this.showForm = false;
    },
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

    async getPprPlan() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get("/pprs");
        this.pprs = data;
      } catch(e) {
          console.error(e);
          this.error = 'Не удалось загрузить ППР планы';
      } finally {
        this.loading = false;
      }
    }, 

    async savePprPlan() {
      if (!this.form.type || !this.form.location || !this.form.crewId) {
        alert("Заполните тип, местонахождение и выберите бригаду");
        return;
      }

      const payload = {
        type: this.form.type,
        location: this.form.location,
        crewId: this.form.crewId,
        q1Date: this.form.q1Date || null,
        q2Date: this.form.q2Date || null,
        q3Date: this.form.q3Date || null,
        q4Date: this.form.q4Date || null,
      };

      try {
        if (this.isEdit && this.selectedPprId) {
          // ✅ UPDATE
          await api.put(`/pprs/${this.selectedPprId}`, payload);
        } else {
          // ✅ CREATE
          await api.post("/pprs", payload);
        }
      
        await this.getPprPlan();
        this.closeForm();

        this.form = { type:"", location:"", crewId:"", q1Date:"", q2Date:"", q3Date:"", q4Date:"" };
        this.isEdit = false;
        this.selectedPprId = null;

      } catch (e) {
        console.error('Ошибка сохранения ппр плана', e);
        alert('Не удалось сохранить ппр плана');
      }
    },

    async deletePpr(id) {
        if (!id) return;
    
        const confirmed = confirm("Вы уверены, что хотите удалить план?");
        if (!confirmed) return;

        try {
          await api.delete(`/pprs/${id}`);
          this.selectedUserId = null;
          await this.getPprPlan();
        } catch(e) {
          console.error('Ошибка удаления план', e);
          alert('Не удалось удалить план');
        }
    }
  }
}

</script>

<style scoped>
.actions {
  margin-bottom: 10px;
  margin-left: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.actions button {
  padding: 8px 15px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55); /* slate-900 */
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #ffffff;
  width: 720px;
  max-width: calc(100vw - 32px);
  border-radius: 16px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: modalScale 0.25s ease;
}

.modal-header {
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  background: linear-gradient(135deg, #f8fafc, #eef2f7);
  border-bottom: 1px solid #e5e7eb;
}

.modal-header .close {
  border: none;
  background: transparent;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  color: #475569;
  transition: color 0.2s ease, transform 0.2s ease;
}

.modal-header .close:hover {
  color: #ef4444;
  transform: scale(1.15);
}

.modal-body {
  padding: 24px;
}

.modal-body.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px 20px;
}

.modal-body .field:last-child {
  grid-column: 1 / -1;
}

.field label {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 6px;
  display: block;
}

.obj-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  transition: border 0.2s ease, box-shadow 0.2s ease;
  background: #fff;
}

.obj-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.modal-card > button {
  margin: 0 24px 24px auto;
  display: block;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}


.modal-card > button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.45);
}

.modal-card > button:active {
  transform: translateY(0);
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
  width: 100%;
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

@keyframes modalScale {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 640px) {
  .modal-body.grid {
    grid-template-columns: 1fr;
  }
}

</style>