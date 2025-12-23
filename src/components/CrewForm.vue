<template>
  <!-- Модальное окно -->
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-card">
      <div class="crew-form">
        <!-- Верхние кнопки -->
        <div class="toolbar">
          <button class="btn-red" @click="$emit('close')">Закрыть</button>
          <button class="btn-green" @click="saveCrew">Сохранить и закрыть</button>
        </div>

        <p>Бригады исполнителей - Добавление записи</p>

        <!-- Основные данные -->
        <fieldset class="block">
          <legend>Основные данные</legend>

          <!-- ДЭСД -->
          <div class="field">
            <label>ДЭСД <span class="req">*</span></label>
            <select v-model="form.desd" class="obj-input">
              <option disabled value="">Выберите ДЭСД</option>
              <option
                v-for="opt in desdOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>

          <!-- Наименование -->
          <div class="field row">
            <div class="col">
              <label>Наименование <span class="req">*</span></label>
              <input
                type="text"
                v-model="form.name"
                class="obj-input"
              />
            </div>
          </div>
        </fieldset>

        <!-- Состав бригады -->
        <fieldset class="block">
          <legend>Состав бригады исполнителей <span class="req">*</span></legend>

          <div class="sub-block">
            <div class="sub-header">
              Формирование бригады из отдельных сотрудников
            </div>

            <!-- Поиск персонала -->
            <div class="field row middle">
              <div class="col">
                <label>Персонал</label>
                <input
                  type="text"
                  v-model="searchQuery"
                  @keyup.enter="searchUsers"
                  class="obj-input"
                />
              </div>
              <div>
                <select v-model="alphabetFilter" class="obj-input">
                  <option value="">*АБВГ*</option>
                  <option value="А">А</option>
                  <option value="Б">Б</option>
                  <option value="В">В</option>
                </select>
              </div>
              <button class="btn-view" @click="searchUsers">Найти</button>
              <button class="btn-red" @click="clearSearch">Очистить</button>
            </div>

            <!-- Результаты поиска -->
            <div v-if="searchResults.length" class="search-results">
              <div
                v-for="u in searchResults"
                :key="u.id"
                class="search-result-row"
                :class="{ selected: selectedSearchUser && selectedSearchUser.id === u.id }"
                @click="selectedSearchUser = u"
              >
                {{ u.fullName }} — {{ u.phoneNumber }}
              </div>
            </div>

            <!-- Кнопки Добавить / Удалить -->
            <div class="field row">
              <button class="btn-add" @click="addSelectedUser">Добавить</button>
              <button class="btn-red" @click="removeSelectedMember">Удалить</button>
            </div>

            <!-- Таб "ФИО / Бригадир" -->
            <div class="tabs">
              <button class="tab active" type="button">
                ФИО
              </button>
              <button class="tab" type="button">
                Бригадир
              </button>
            </div>

            <!-- Таблица участников -->
            <table class="members-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ФИО</th>
                  <th>Телефон</th>
                  <th>Бригадир</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(m, index) in form.members"
                  :key="m.id"
                  :class="{ selected: selectedMember && selectedMember.id === m.id }"
                  @click="selectedMember = m"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ m.fullName }}</td>
                  <td>{{ m.phoneNumber }}</td>
                  <td>
                    <input
                      type="radio"
                      name="leader"
                      :value="m.id"
                      v-model="leaderId"
                    />
                  </td>
                </tr>
                <tr v-if="!form.members.length">
                  <td colspan="4">Сотрудники не выбраны</td>
                </tr>
              </tbody>
            </table>
          </div>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import DESD from '../DESD.json';

const API = import.meta.env.VITE_API_URL;


const api = axios.create({
  baseURL: API || 'http://localhost:8080/api',
});

export default {
  name: 'CrewForm',
  emits: ['close', 'saved'],

  data() {
    return {
      desdOptions: DESD.map(name => ({
        value: name,
        label: name,
      })),

      form: {
        desd: '',
        name: '',
        members: [], // {id, fullName, phoneNumber}
      },

      leaderId: null,

      // поиск персонала
      searchQuery: '',
      alphabetFilter: '',
      searchResults: [],
      selectedSearchUser: null,

      // выбранный член бригады для удаления
      selectedMember: null,

      loading: false,
    };
  },

  methods: {
    async searchUsers() {
      if (!this.searchQuery.trim()) {
        this.searchResults = [];
        this.selectedSearchUser = null;
        return;
      }

      try {
        this.loading = true;
        const params = { search: this.searchQuery.trim() };

        const { data } = await api.get('/users', { params });

        let list = data;
        if (this.alphabetFilter) {
          list = list.filter((u) =>
            u.fullName?.toUpperCase().startsWith(this.alphabetFilter)
          );
        }

        this.searchResults = list;
        this.selectedSearchUser = list[0] || null;
      } catch (e) {
        console.error('Ошибка поиска пользователей', e);
        alert('Не удалось выполнить поиск персонала');
      } finally {
        this.loading = false;
      }
    },

    clearSearch() {
      this.searchQuery = '';
      this.alphabetFilter = '';
      this.searchResults = [];
      this.selectedSearchUser = null;
    },

    addSelectedUser() {
      const u = this.selectedSearchUser;
      if (!u) {
        alert('Выберите сотрудника из результатов поиска');
        return;
      }

      const exists = this.form.members.some((m) => m.id === u.id);
      if (exists) {
        alert('Этот сотрудник уже в бригаде');
        return;
      }

      this.form.members.push({
        id: u.id,
        fullName: u.fullName,
        phoneNumber: u.phoneNumber,
      });

      if (!this.leaderId) {
        this.leaderId = u.id;
      }
    },

    removeSelectedMember() {
      if (!this.selectedMember) {
        alert('Выберите сотрудника в таблице для удаления');
        return;
      }

      this.form.members = this.form.members.filter(
        (m) => m.id !== this.selectedMember.id
      );

      if (this.leaderId === this.selectedMember.id) {
        this.leaderId = this.form.members[0]?.id || null;
      }

      this.selectedMember = null;
    },

    async saveCrew() {
      if (!this.form.desd || !this.form.name) {
        alert('Заполните обязательные поля (ДЭСД, Наименование)');
        return;
      }

      if (!this.form.members.length) {
        alert('Добавьте хотя бы одного участника бригады');
        return;
      }

      if (!this.leaderId) {
        alert('Выберите бригадира');
        return;
      }

      const payload = {
        desd: this.form.desd,
        name: this.form.name,
        leaderId: this.leaderId,
        memberIds: this.form.members.map((m) => m.id),
      };

      try {
        await api.post('/crews', payload);
        this.$emit('saved');
        this.$emit('close');
      } catch (e) {
        console.error('Ошибка сохранения бригады', e);
        alert('Не удалось сохранить бригаду');
      }
    },
  },
};
</script>

<style scoped>
/* модальное окно */
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

/* внутренняя форма */
.crew-form {
  padding: 4px;
}

.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.block {
  margin-top: 16px;
  padding: 12px;
  border: 1px solid #ccc;
}

.sub-block {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 8px;
}

.sub-header {
  font-weight: 600;
  margin-bottom: 8px;
}

.field {
  margin-bottom: 10px;
}

.field.row {
  display: flex;
  gap: 16px;
}

.field.row.middle {
  align-items: flex-end;
}

.col {
  flex: 1;
}

.obj-input {
  width: 100%;
  padding: 4px 6px;
}

.req {
  color: red;
}

.search-results {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin-bottom: 8px;
}

.search-result-row {
  padding: 4px 6px;
  cursor: pointer;
}

.search-result-row.selected {
  background: #e6f2ff;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}

.members-table th,
.members-table td {
  border: 1px solid #ddd;
  padding: 4px 6px;
}

.members-table tr.selected {
  background-color: #e6f2ff;
}

.tabs {
  margin-top: 8px;
  display: flex;
}

.tab {
  padding: 6px 12px;
  border: 1px solid #999;
  background: #f0f0f0;
}

.tab.active {
  background: linear-gradient(to bottom, #bcd3ff, #5a8bff);
  color: #fff;
}
</style>