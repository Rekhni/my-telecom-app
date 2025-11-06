<template>
    <div>
        <h2 :style="{ fontSize: '30px', marginLeft: '30px' }">Заявки на осмотр</h2>
        <div className="actions">
            <button className="btn-add" @click="openForm">Создать</button>
            <button className="btn-green">Редактировать</button>
            <button className="btn-red">Удалить</button>
            <button className="btn-filter">Фильтр</button>
            <button className="btn-export">Экспорт</button>
            <button className="btn-green">Согласовать</button>
        </div>

        <table class="inspection-table">
            <thead>
                <tr>
                    <th>Согл.</th>
                    <th>Утв.</th>
                    <th>Завершен</th>
                    <th>Идентификатор</th>
                    <th>Населенный пункт</th>
                    <th>Дата начала осмотра</th>
                    <th>Дата окончания осмотра</th>
                    <th>Дата окончания осмотра(перенос сроков)</th>
                    <th>Осмотр проводил</th>
                    <th>Тип обьекта</th>
                    <th>Количество обьектов</th>
                    <th>РУСД</th>
                    <th>ДЭСД</th>
                    <th>Дата последнего изменения</th>
                    <th>Внеплановый осмотр</th>
                </tr>
            </thead>
        </table>
        <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
          <div class="modal-card">
            <div class="modal-header">
              <button class="close" @click="closeForm">x</button>
            </div>

            <div class="modal-body grid">
              <div class="field">
                <label>Название устройства </label>
                <input class="obj-input" type="text" width="400px">
              </div>

              <div class="field">
                <label>Местонахождение </label>
                <input class="obj-input" type="text" width="400px">
              </div>

              <div class="field">
                <label>Подтип </label>
                <input class="obj-input" type="text" width="400px">
              </div>

              <div class="field">
                <label>Номер ОС </label>
                <input class="obj-input" type="text" width="400px">
              </div>

              <div class="field">
                <label>Номер оборудования </label>
                <input class="obj-input" type="text" width="400px">
              </div>

              <div class="field">
                <label>Дата 1 кв </label>
                <input class="obj-input" type="date" width="400px">
              </div>

              <div class="field">
                <label>Дата 2 кв </label>
                <input class="obj-input" type="date" width="400px">
              </div>

              <div class="field">
                <label>Дата 3 кв </label>
                <input class="obj-input" type="date" width="400px">
              </div>

              <div class="field">
                <label>Время </label>
                <input class="obj-input" type="text" width="400px">
              </div>

              <div class="field">
                <label>Участок </label>
                <input type="text" name="">
              </div>
        
              <div class="field">
                <label>Линия/КО </label>
                <input type="text" name="">
              </div>

              <div class="field">
                <label>Условия работ </label>
                <input type="text" name="">
              </div>

              <div class="field">
                <label>Содержание </label>
                <input type="text" name="">
              </div>

              <div class="field">
                <label>Ответственный(ФИО, тел) </label>
                <input type="text" name="">
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      showForm: false
    }
  },

  methods: {
    openForm() {
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false;
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