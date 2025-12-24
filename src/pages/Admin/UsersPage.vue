<template>
    <div>
        <h2 :style="{ fontSize: '30px', marginLeft: '30px' }">Пользователи</h2>
        <div className="actions">
            <button className="btn-add" @click="openCreateForm">Добавить</button>
            <button className="btn-green" :disabled="!selectedUserId" @click="opedEditForm">Редактировать</button>
            <button className="btn-red" :disabled="!selectedUserId" @click="deleteUser(selectedUserId)">Удалить</button>
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
                <tr 
                  v-for="user in sortedUsers" 
                  :key="user.id"
                  @click="selectUser(user)"
                  :class="{ selected: user.id === this.selectedUserId }"
                  style="cursor: pointer"
                >
                  <td>{{ user.id }}</td>
                  <td>{{ user.fullName }}</td>
                  <td>{{ user.phoneNumber }}</td>
                </tr>
              </tbody>
        </table>
        <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
          <div class="modal-card">
            <div class="modal-header">
              <div>
                {{ isEdit ? "Редактирование пользователя" : "Добавление пользователя" }}
              </div>
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
                <button class="btn-add" @click="saveOrUpdateUser">Сохранить</button>
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
      isEdit: false,
      selectedUserId: null,
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

  computed: {
    sortedUsers() {
      return [...this.users].sort((a, b) => a.id - b.id);
    }
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

    openCreateForm() {
      this.isEdit = false;
      this.selectedUserId = null;
      this.form = { fullName: "", phoneNumber: "" };
      this.showForm = true;
    },

    selectUser(user) {
      this.selectedUserId = user.id;
    },

    opedEditForm() {
      if (!this.selectedUserId) return;

      const u = this.users.find((x) => x.id === this.selectedUserId);

      this.isEdit = true;

      this.form = {
        fullName: u.fullName ?? "",
        phoneNumber: u.phoneNumber ?? ""
      };

      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;
    },

    async saveOrUpdateUser() {
      if (!this.form.fullName || !this.form.phoneNumber) {
        alert('Заполните ФИО и телефон');
        return;
      }

      try {
        if (this.isEdit) {
          await api.put(`/users/${this.selectedUserId}`, {
            fullName: this.form.fullName,
            phoneNumber: this.form.phoneNumber
          });
        } else {
          await api.post('/users', {
            fullName: this.form.fullName,
            phoneNumber: this.form.phoneNumber,
          });
        }
        this.showForm = false;
        await this.loadUsers(); // обновляем таблицу
      } catch (e) {
        console.error('Ошибка сохранения пользователя', e);
        alert('Не удалось сохранить пользователя');
      }
    },
    async deleteUser(id) {
        if (!id) return;
    
        const confirmed = confirm("Вы уверены, что хотите удалить пользователя?");
        if (!confirmed) return;

        try {
          await api.delete(`/users/${id}`);
          this.selectedUserId = null;
          await this.loadUsers();
        } catch(e) {
          console.error('Ошибка удаления пользователя', e);
          alert('Не удалось удалить пользователя');
        }
      }
  }
}
</script>

<style scoped>
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