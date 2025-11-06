<template>
  <div>
    <h2 :style="{ fontSize: '30px', marginLeft: '30px' }">Технологические карты</h2>

    <div className="actions">
      <button className="btn-filter">Фильтр</button>
      <button className="btn-export">Экспорт</button>
    </div>

    <!-- Master list: each PROCESS is its own row -->
    <table class="tech-table">
      <thead>
        <tr>
          <th>Идентификатор</th>
          <th>Наименование (рус)</th>
          <th>Активный</th>
          <th>Наименование процесса планирования</th>
          <th>Количество операций</th>
          <th>Количество материалов</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.rowId"
          class="clickable-row"
          @click="openForm(row)"
        >
          <td>{{ row.cardId }}</td>
          <td>{{ row.cardName }}</td>
          <td>X</td>
          <td>{{ row.processName }}</td>
          <td>{{ countOperations(row.defects) }}</td>
          <td>{{ sumMaterials(row.defects) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
      <div class="modal-card">
        <div class="modal-header">
          <button class="close" @click="closeForm">x</button>
        </div>

        <div class="modal-body">
          <div class="field">
            <label>Наименованиe </label>
            <input class="obj-input" type="text" v-model="form.name" width="400px" disabled>
          </div>

          <div class="field">
            <label>Наименование процесса планирования</label>
            <input class="obj-input" type="text" :value="form.process" disabled>
          </div>

          <div class="defects-table-wrapper">
            <table class="defects-table">
              <thead>
                <tr>
                  <th>Наименование</th>
                  <th>Длит.операции, в мин</th>
                  <th>Кол-во исполнителей</th>
                  <th>Среднегодовые трудозатраты, чел*час</th>
                  <th>Расход. материалов</th>
                </tr>
              </thead>

              <tbody>
                <template v-for="(blk, bi) in (defects || [])" :key="'blk-' + bi">
                  <!-- Bundle -->
                  <template v-if="blk.type === 'bundle'">
                    <tr :key="'b-'+bi+'-0'" class="bundle-first-row">
                      <td>{{ blk.items?.[0]?.title }}</td>
                      <td :rowspan="blk.items.length" class="bundle-merged">{{ blk.timeInMinsTotal }}</td>
                      <td :rowspan="blk.items.length" class="bundle-merged">{{ blk.executorCounts }}</td>
                      <td :rowspan="blk.items.length" class="bundle-merged">{{ blk.avgAnnualLaborCost }}</td>
                      <td>{{ fmtMaterialsCount(blk.items?.[0]) }}</td>
                    </tr>
                    <tr
                      v-for="(child, ci) in blk.items.slice(1)"
                      :key="'b-'+bi+'-'+(ci+1)"
                      class="bundle-child-row"
                    >
                      <td>{{ child.title }}</td>
                      <td class="bundle-material">{{ fmtMaterialsCount(child) }}</td>
                    </tr>
                  </template>

                  <!-- Plain item -->
                  <tr v-else :key="'i-'+bi">
                    <td>{{ blk.title }}</td>
                    <td>{{ blk.timeInMins }}</td>
                    <td>{{ blk.executorCounts }}</td>
                    <td>{{ blk.avgAnnualLaborCost }}</td>
                    <td>{{ fmtMaterialsCount(blk) }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import techMapsData from "assets/techMapsData2.json";

export default {
  name: "TechCards",
  data() {
    return {
      techMapsData,
      showForm: false,
      selected: null,          // will store the clicked row object
      defectsLoading: false,
      defects: [],
      form: { id: 0, name: "", process: "" },
    };
  },

  computed: {
    // Flatten every card's processes into separate table rows
    rows() {
      const out = [];
      for (const card of this.techMapsData || []) {
        const processes = [
          { key: "techInspection", obj: card.techInspection },
          { key: "techService", obj: card.techService },
          { key: "currentRepair", obj: card.currentRepair },
        ];
        processes.forEach((p, i) => {
          out.push({
            rowId: `${card.id}-${p.key}`,
            cardId: `${card.id}.${i + 1}`,
            cardName: card.name,
            processKey: p.key,
            processName: p.obj.name,
            defects: p.obj.defects ?? [],
            _cardRef: card,
          });
        });
      }
      return out;
    },
  },

  methods: {
    // --- Counters for master list ---
    countOperations(defects = []) {
      if (!Array.isArray(defects)) return 0;
      let total = 0;
      for (const d of defects) {
        if (d?.type === "bundle") total += (d.items?.length || 0);
        else total += 1;
      }
      return total;
    },
    sumMaterials(defects = []) {
      if (!Array.isArray(defects)) return 0;
      let total = 0;
      for (const d of defects) {
        if (d?.type === "bundle") {
          for (const it of (d.items || [])) total += Number(it.materialsCount ?? 0);
        } else {
          total += Number(d.materialsCount ?? 0);
        }
      }
      return total;
    },
    fmtMaterialsCount(row) {
      const n = Number(row?.materialsCount ?? 0);
      return n ? n : "—";
    },

    // --- Modal logic ---
    openForm(row) {
      this.selected = row;
      this.form = {
        id: row.cardId,
        name: row.cardName,
        process: row.processName,
      };
      this.showForm = true;
      // We already have defects for the selected process in the row
      this.defects = Array.isArray(row.defects) ? row.defects : [];
    },
    closeForm() {
      this.showForm = false;
      this.selected = null;
      this.defects = [];
    },
    save() { this.closeForm(); },
  },
};
</script>

<style scoped>
.actions {
  margin-bottom: 10px;
  margin-left: 10px;
}

.tech-table { width: 100%; border-collapse: collapse; }
.tech-table th, .tech-table td { padding: 10px 12px; border-bottom: 1px solid #e6e6e6; }
.clickable-row { cursor: pointer; }
.clickable-row:hover { background: #f7fbff; }

.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.35);
  display: grid; place-items: center; z-index: 1000;
}

.obj-input {
  width: 70%;
}

.defects-table-wrapper {
  max-height: 300px;      /* set desired visible height */
  overflow-y: auto;       /* vertical scroll only */
  overflow-x: hidden;     /* no horizontal scroll */
  border: 1px solid #ddd; /* optional: border around table */
  border-radius: 6px;
}

.defects-table {
  width: 100%;
}

.defects-table td,
.defects-table th {
  border: 1px solid #ccc;
  padding: 6px 10px;
}

.defects-table thead th {
  position: sticky;
  top: 0;
  background: linear-gradient(to bottom, #2a6bb8, #3f7cc8);
  color: white;
  font-weight: 600;
  z-index: 2;
}

.bundle-first-row td,
.bundle-first-row .bundle-merged {
  border-top: 1px solid #000;   /* top of block */
}

.bundle-child-row:last-child td,
.bundle-child-row:last-child .bundle-material {
  border-bottom: 1px solid #000;
}

/* make scrollbars minimal (optional aesthetic) */
.defects-table-wrapper::-webkit-scrollbar {
  width: 6px;
}
.defects-table-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.modal-card {
  width: min(900px, 92vw); background: #fff; border-radius: 12px; overflow: hidden;
  box-shadow: 0 12px 40px rgba(0,0,0,.25);
}
.modal-header {
  display: flex; align-items: center; justify-content: flex-end;
  padding: 14px 18px; border-bottom: 1px solid #eee;
}

.title { font-size: 18px; font-weight: 600; }
.close { background: transparent; border: 0; font-size: 24px; cursor: pointer; }
.modal-body { padding: 16px 18px; display: flex; flex-direction: column; gap: 20px }

.defects-table {
  height: 50%;
  overflow: hidden;
  border-collapse: collapse;
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