<template>
  <!-- Модальное окно -->
      <div class="crew-form">
        <!-- Верхние кнопки -->
        <div class="toolbar">
          <button class="btn-red" @click="$emit('close')">Закрыть</button>
          <button class="btn-green" @click="saveCrew">Сохранить и закрыть</button>
        </div>

        <p>
          Бригады исполнителей - {{ isEdit ? "Редактирование записи" : "Добавление записи" }}
        </p>

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
  props: {
    crewId: { type: [Number, String], default: null },
    isEdit: { type: Boolean, default: false }
  },

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

  watch: {
    isEdit(newVal) {
      if (!newVal) this.resetForm();
    }
  },

  mounted() {
    if (this.isEdit && this.crewId) {
      this.loadCrew();
    }
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

    async loadCrew() {
      try {
        this.loading = true;
        const { data } = await api.get(`/crews/${this.crewId}`);

        this.form.desd = data.desd ?? "";
        this.form.name = data.name ?? "";
        this.form.members = (data.members ?? []).map(m => ({
          id: m.id,
          fullName: m.fullName,
          phoneNumber: m.phoneNumber
        }));
        this.leaderId = data.leaderId ?? null;
      } catch(e) {
        console.error('Ошибка загрузки бригады', e);
        alert('Не удалось загрузить бригаду для редактирования');
      } finally {
        this.loading = false;
      }
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
        if (this.isEdit && this.crewId) {
          await api.put(`/crews/${this.crewId}`, payload);
        } else {
          await api.post('/crews', payload);
        }
        this.$emit('saved');
        this.$emit('close');
      } catch (e) {
        console.error('Ошибка сохранения бригады', e);
        alert('Не удалось сохранить бригаду');
      }
    },

    resetForm() {
      this.form.desd = '';
      this.form.name = '';
      this.form.members = [];
      this.leaderId = null;
      this.selectedMember = null;
      this.clearSearch();
    }
  },
};
</script>

<style scoped>
/* модальное окно */


/* внутренняя форма */
.crew-form {
  background: #ffffff;
  border-radius: 18px;
  padding: 24px 28px 32px;
  max-width: 1100px;
  margin: 0 auto;
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.08);
  animation: fadeUp 0.25s ease;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.toolbar button {
  min-width: 160px;
}

.crew-form > p {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 12px 0 22px;
}

fieldset.block {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px 20px 22px;
  margin-bottom: 24px;
}

fieldset.block legend {
  padding: 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.sub-block {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px 18px 20px;
}

.sub-header {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 14px;
}

.field {
  margin-bottom: 14px;
}

.field.row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}


.field.row.middle {
  align-items: center;
}

.field .col {
  flex: 1;
}

.field label {
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 6px;
  display: block;
}

.req {
  color: #ef4444;
  margin-left: 4px;
}

.obj-input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 14px;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

.obj-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.search-results {
  margin: 10px 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
}

.search-result-row {
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.15s ease;
}

.search-result-row:hover {
  background: #f1f5f9;
}

.search-result-row.selected {
  background: #dbeafe;
  font-weight: 500;
}

button {
  border-radius: 10px;
  height: 40px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-add {
  background: #2563eb;
  color: #fff;
  padding: 0 18px;
}

.btn-add:hover {
  background: #1e40af;
}

.btn-green {
  background: #16a34a;
  color: #fff;
  padding: 0 18px;
}

.btn-green:hover {
  background: #15803d;
}

.btn-red {
  background: #ef4444;
  color: #fff;
  padding: 0 18px;
}


.btn-red:hover {
  background: #dc2626;
}


.btn-view {
  background: #e5e7eb;
  color: #0f172a;
  padding: 0 18px;
}

.btn-view:hover {
  background: #cbd5e1;
}

.tabs {
  display: flex;
  gap: 6px;
  margin: 14px 0;
}

.tab {
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
}

.tab.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}

.members-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}


.members-table th,
.members-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.members-table th {
  background: #f1f5f9;
  font-weight: 600;
  text-align: left;
}

.members-table tbody tr {
  cursor: pointer;
  transition: background 0.15s ease;
}

.members-table tbody tr:hover {
  background: #f8fafc;
}

.members-table tbody tr.selected {
  background: #dbeafe;
  font-weight: 500;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 900px) {
  .field.row {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar {
    flex-direction: column;
    gap: 10px;
  }

  .toolbar button {
    width: 100%;
  }
}


</style>