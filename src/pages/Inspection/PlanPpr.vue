<template>
    <div>
        <h2 :style="{ fontSize: '30px', marginLeft: '30px' }">План ППР</h2>
        <div class="actions">
            <button class="btn-add" @click="openForm">Создать</button>
            <button class="btn-green">Редактировать</button>
            <button class="btn-red">Удалить</button>
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
                <tr v-for="ppr in pprs" :key="ppr.id">
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

  methods: {
    openForm() {
      this.showForm = true;
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
      try {
        await api.post('/pprs', {
          type: this.form.type,
          location: this.form.location,
          crewId: this.form.crewId,
          q1Date: this.form.q1Date || null,
          q2Date: this.form.q2Date || null,
          q3Date: this.form.q3Date || null,
          q4Date: this.form.q4Date || null
        });
      
        await this.getPprPlan();
        this.closeForm();

        this.form = { type:"", location:"", crewId:"", q1Date:"", q2Date:"", q3Date:"", q4Date:"" };

      } catch (e) {
        console.error('Ошибка сохранения ппр плана', e);
        alert('Не удалось сохранить ппр плана');
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
  position: fixed; inset: 0; background: rgba(0,0,0,.35);
  display: grid; place-items: center; z-index: 1000;
}

.grid {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.modal-card {
  width: min(900px, 92vw); background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,.25);
}

.modal-header {
  display: flex; align-items: center; justify-content: flex-end;
  padding: 14px 18px; border-bottom: 1px solid #eee;
}

.modal-body { padding: 16px 18px; display: flex; flex-direction: row; gap: 20px }


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
</style>