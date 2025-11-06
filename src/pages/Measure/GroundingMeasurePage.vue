<template>
    <div>
        <h2 :style="{ fontSize: '30px', marginLeft: '30px' }">Измерение заземлений</h2>
        <div className="actions">
            <button className="btn-add">Добавить</button>
            <button className="btn-green">Редактировать</button>
            <button className="btn-view">Просмотр</button>
            <button className="btn-filter">Фильтр</button>
            <button className="btn-export">Экспорт</button>
            <button className="btn-green">Согласовать</button>
            <button className="btn-green">Утвердить</button>
            <button className="btn-green">Выполнение</button>
            <button className="btn-green">Перенос сроков</button>
            <button className="btn-green">Уведомить</button>
            <button className="btn-red">Фиксация времени</button>
            <button className="btn-green">Просмотр фиксации времени</button>
            <button className="btn-green">Изменить ответственного</button>
            <button className="btn-green">Отмена завершения</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Согл.</th>
                    <th>Утв.</th>
                    <th>Идентификатор</th>
                    <th>% выполнения</th>
                    <th>Дата начала измерения</th>
                    <th>Дата окончания измерения</th>
                    <th>Дата окончания работ(перенос сроков)</th>
                    <th>Тип обьекта</th>
                    <th>РУСД</th>
                    <th>ДЭСД</th>
                    <th>Населенный пункт</th>
                    <th>Осмотр проводил</th>
                    <th>Дата последнего изменения</th>
                    <th>Количество обьектов</th>
                    <th>Выполнено работ по N обьектам</th>
                    
                </tr>
            </thead>
        </table>
    </div>
</template>

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