<template>
    <div>
        <h2 :style="{ fontSize: '30px', marginLeft: '30px' }">Пользователи</h2>
        <div className="actions">
            <button className="btn-add" @click="openForm">Добавить</button>
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
                    <th>ФИО</th>
                    <th>Ном. телефона </th>
                </tr>
            </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.fullName }}</td>
                  <td>{{ user.phoneNumber }}</td>
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
                <label>ФИО </label>
                <input 
                  className="obj-input" 
                  type="text"
                  v-model="form.fullName"
                  placeholder="ФИО"
                  >
              </div>

              <div class="field">
                <label>Ном. телефона </label>
                <input 
                  class="obj-input" 
                  type="text" 
                  v-model="form.phoneNumber"
                  placeholder="Номер телефона"
                  >
              </div>

              <div class="actions" style="margin-top: 20px">
                <button class="btn-add" @click="saveUser">Сохранить</button>
                <button class="btn-red" @click="closeForm">Отмена</button>
              </div>
            </div>
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
      showForm: false,
      users: [],
      form: {
        fullName: '',
        phoneNumber: ''
      }
    }
  },

  mounted() {
    this.loadUsers();
  },

  methods: {
    async loadUsers() {
      try {
        const response = await api.get('/users');
        this.users = response.data;
      } catch (e) {
        console.error('Ошибка загрузки пользователей', e);
      }
    },

    openForm() {
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;
    },

    async saveUser() {
      if (!this.form.fullName || !this.form.phoneNumber) {
        alert('Заполните ФИО и телефон');
        return;
      }

      try {
        await api.post('/users', {
          fullName: this.form.fullName,
          phoneNumber: this.form.phoneNumber,
        });

        this.showForm = false;
        await this.loadUsers(); // обновляем таблицу
      } catch (e) {
        console.error('Ошибка сохранения пользователя', e);
        alert('Не удалось сохранить пользователя');
      }
    },
  }
}
</script>

<style scoped>
  .modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.35);
  display: grid; place-items: center; z-index: 1000;
}

.grid {
  display: flex;
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