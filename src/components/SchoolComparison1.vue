<template>
  <div class="comparison-container">
    <div class="header-actions">
      <span class="title-discipline-info">评估指标</span>
      <span class="separator-line"></span>
      <span v-if="currentlySelectedDisciplineInfo" class="selected-discipline-info">
        {{ currentlySelectedDisciplineInfo.name }} ({{ currentlySelectedDisciplineInfo.abbr }})
      </span>
      <span v-else class="placeholder-discipline-info">
        请选择学科
      </span>
      <el-button type="primary" @click="dialogVisible = true">
        切换学科
      </el-button>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="选择学科进行展示"
      width="90%"
      :before-close="handleClose"
      destroy-on-close
    >
      <div class="modal-content-three-rows">
        <div
          v-for="(row, rowIndex) in disciplineRows"
          :key="rowIndex"
          class="discipline-row-container"
          :class="{ 'top-row': rowIndex === 0, 'middle-row': rowIndex === 1, 'bottom-row': rowIndex === 2 }"
        >
          <div class="discipline-column-flow-container">
            <div
              v-for="(category, categoryIndex) in row"
              :key="categoryIndex"
              class="discipline-category-block"
            >
              <div class="category-title">{{ category.name }}</div>
              <div class="discipline-list">
                <div
                  v-for="(discipline, disciplineIndex) in category.items"
                  :key="disciplineIndex"
                  class="discipline-item"
                >
                  <el-radio
                    v-model="selectedDiscipline"
                    :value="discipline.abbr"
                    :disabled="discipline.disabled"
                  >
                    {{ discipline.code }} {{ discipline.name }}
                  </el-radio>
                </div>
              </div>
            </div>
          </div>
          <hr v-if="rowIndex < disciplineRows.length - 1" class="row-separator">
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirmSelection" :disabled="!selectedDiscipline">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <div v-if="currentDisciplineData" class="tables-container">
      <el-tabs v-model="activeTab" class="discipline-tabs" @tab-click="handleTabClick">
        <el-tab-pane label="全部指标" name="all"></el-tab-pane>
        <el-tab-pane
          v-for="header in dynamicTabHeaders"
          :key="header"
          :label="header"
          :name="header"
        ></el-tab-pane>
        <el-tab-pane label="定位标杆" name="benchmark"></el-tab-pane>
      </el-tabs>

      <div v-if="activeTab === 'all'">
        <el-card shadow="never" class="data-card">
          <div class="legend">
            <span class="legend-item" style="--color: #409EFF;">人才培养质量</span>
            <span class="legend-item" style="--color: #67C23A;">师资队伍与资源</span>
            <span class="legend-item" style="--color: #E6A23C;">科学研究水平</span>
          </div>

          <el-table
            :data="currentDisciplineData.allData"
            border
            class="tableStyle"
            :span-method="tableSpanMethod"
            :cell-style="{ fontWeight: 'bold' }"
            @cell-click="handleCellClick"
          >
            <el-table-column label="核心指标" align="center" :header-cell-style="{ fontWeight: 'bold' }">
              <el-table-column width="150" align="center">
                <template #default="{ $index }">
                  <span v-if="$index < 5" style="color: #409EFF;">人才培养质量</span>
                  <span v-else-if="$index < 10" style="color: #67C23A;">师资队伍与资源</span>
                  <span v-else style="color: #E6A23C;">科学研究水平</span>
                </template>
              </el-table-column>
              <el-table-column prop="col0" align="center">
                <template #default="scope">
                  {{ scope.row[0] }}
                </template>
              </el-table-column>
            </el-table-column>

            <el-table-column
              v-for="(header, idx) in currentDisciplineData.allHeaders.slice(1)"
              :key="idx + 1"
              :prop="`col${idx + 1}`"
              :label="header"
              align="center"
            >
              <template #default="scope">
                {{ scope.row[idx + 1] }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <div v-else-if="activeTab !== 'benchmark' && currentDisciplineData[activeTab]" class="tables-container">
        <el-card
          v-for="(tableContent, tableName) in currentDisciplineData[activeTab]"
          :key="tableName"
          shadow="never"
          class="data-card"
        >
          <h3>{{ tableName }}</h3>
          <el-table
            :data="tableContent.tableData"
            border
            class="tableStyle"
            :cell-style="{ fontWeight: 'bold' }"
          >
            <el-table-column
              v-for="(header, headerIndex) in tableContent.tableHeaders"
              :key="headerIndex"
              :prop="`col${headerIndex}`"
              :label="header"
              align="center"
            >
              <template #default="scope">
                {{ scope.row[headerIndex] }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <div v-else class="no-data-placeholder">
        <p>数据建设中...</p>
      </div>
    </div>

    <div v-else>
      <el-alert
        :title="`学科数据 (${currentlySelectedDisciplineCode || '未选择'}) 未找到或不完整，无法显示详情。`"
        type="warning"
        :closable="false"
      ></el-alert>
    </div>

    <el-dialog
      v-model="showDetailDialog"
      :title="detailDialogTitle"
      width="70%"
      destroy-on-close
    >
      <el-table :data="detailTableData" border style="width: 100%">
        <el-table-column
          v-for="(header, index) in detailTableHeaders"
          :key="index"
          :prop="`col${index}`"
          :label="header"
          align="center"
        >
          <template #default="scope">
            {{ scope.row[index] }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDetailDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import api from '@/api/index';
import { fullDisciplineList } from './disciplines.js';
import { ElButton, ElCard, ElTable, ElTableColumn, ElAlert, ElDialog, ElRadio, ElTabs, ElTabPane } from 'element-plus';

// 状态变量
const allData = ref({}); // 存储所有加载的比较数据，以学科代码为键
const dialogVisible = ref(false); // 控制学科选择弹窗的可见性
const currentlySelectedDisciplineCode = ref(null); // 存储当前选中学科的代码
const selectedDiscipline = ref(null); // 弹窗内选中的学科
const activeTab = ref('all'); // 默认激活的 Tab
const showDetailDialog = ref(false); // 控制详情对话框的显示与隐藏
const detailTableData = ref([]); // 存储详情表格的数据
const detailTableHeaders = ref([]); // 存储详情表格的表头
const detailDialogTitle = ref(''); // 详情对话框的标题

// 计算属性
const allDisciplines = computed(() => fullDisciplineList);

const disciplineRows = computed(() => {
  const numRows = 3;
  const totalDisciplines = allDisciplines.value.reduce((sum, category) => sum + category.items.length, 0);
  const targetPerRow = Math.ceil(totalDisciplines / numRows);

  const rows = Array.from({ length: numRows }, () => []);
  let currentRowIndex = 0;
  let currentDisciplineCount = 0;

  for (const category of allDisciplines.value) {
    if (currentRowIndex < numRows - 1 && currentDisciplineCount + category.items.length > targetPerRow && currentDisciplineCount > 0) {
      currentRowIndex++;
      currentDisciplineCount = 0;
    }
    rows[currentRowIndex].push(category);
    currentDisciplineCount += category.items.length;
  }
  return rows;
});

const currentlySelectedDisciplineInfo = computed(() => {
  if (!currentlySelectedDisciplineCode.value) return null;
  for (const category of allDisciplines.value) {
    const discipline = category.items.find(item => item.abbr === currentlySelectedDisciplineCode.value);
    if (discipline) return discipline;
  }
  return null;
});

const currentDisciplineData = computed(() => {
  return allData.value[currentlySelectedDisciplineCode.value] || null;
});

const dynamicTabHeaders = computed(() => {
  if (currentDisciplineData.value && currentDisciplineData.value.allHeaders) {
    return currentDisciplineData.value.allHeaders.slice(2);
  }
  return [];
});

// 监听器
watch(dialogVisible, (newValue) => {
  if (newValue && currentlySelectedDisciplineCode.value) {
    const discipline = allDisciplines.value.flatMap(c => c.items).find(item => item.abbr === currentlySelectedDisciplineCode.value);
    selectedDiscipline.value = (discipline && !discipline.disabled) ? currentlySelectedDisciplineCode.value : null;
  } else if (newValue) {
    selectedDiscipline.value = null;
  }
});

watch(currentlySelectedDisciplineCode, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    activeTab.value = 'all'; // 重置到 "全部指标"
    if (newValue) {
      fetchDisciplineData(newValue);
    } else {
      allData.value = {}; // 如果没有选择学科，清空数据
    }
  }
});

// 方法
const tableSpanMethod = ({ rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowIndex === 0) return [5, 1];
    if (rowIndex > 0 && rowIndex < 5) return [0, 0];
    if (rowIndex === 5) return [5, 1];
    if (rowIndex > 5 && rowIndex < 10) return [0, 0];
    if (rowIndex === 10) return [8, 1];
    if (rowIndex > 10 && rowIndex < 18) return [0, 0];
  }
  return [1, 1];
};

const handleTabClick = (tab) => {
  console.log('标签页被点击了:', tab.props.name);
};

const handleClose = () => {
  dialogVisible.value = false;
};

const confirmSelection = () => {
  if (selectedDiscipline.value) {
    currentlySelectedDisciplineCode.value = selectedDiscipline.value;
  }
  handleClose();
};

const fetchDisciplineData = async (disciplineAbbr) => {
  if (!disciplineAbbr) {
    allData.value = {};
    return;
  }
  // 避免重复请求已加载的数据
  if (allData.value[disciplineAbbr]) {
    console.log(`数据已缓存，无需重复获取 ${disciplineAbbr}`);
    return;
  }
  try {
    const response = await api.get('/discipline/assessment', { params: { discipline: disciplineAbbr } });
    if (response.data?.code === 200 && response.data?.data) {
      allData.value[disciplineAbbr] = response.data.data;
      console.log(`成功获取 ${disciplineAbbr} 的数据:`, JSON.stringify(response.data.data));
    } else {
      console.warn(`获取 ${disciplineAbbr} 的数据时，返回的数据格式不正确或为空，或code不为200。`);
      allData.value[disciplineAbbr] = null; // 标记为获取失败或不存在
    }
  } catch (error) {
    console.error(`获取 ${disciplineAbbr} 的数据失败:`, error);
    allData.value[disciplineAbbr] = null; // 标记为获取失败或不存在
  }
};

const handleCellClick = (row, column) => {
  if (!currentDisciplineData.value) {
    console.warn('当前未选择学科或学科数据不存在。');
    return;
  }
  const targetData = currentDisciplineData.value[column.label]?.[row[0]];
  const detailTitle = `${column.label} - ${row[0]} 详情`;

  if (targetData) {
    detailTableData.value = targetData.tableData;
    detailTableHeaders.value = targetData.tableHeaders;
    detailDialogTitle.value = detailTitle;
    showDetailDialog.value = true;
  } else {
    console.warn(`未找到 '${column.label}' 的详细数据或数据格式不正确。`);
    detailTableData.value = [];
    detailTableHeaders.value = [];
    detailDialogTitle.value = '无详细数据';
    showDetailDialog.value = true;
  }
};

onMounted(() => {
  console.log("Component created. Awaiting discipline selection for data loading.");
});
</script>

<style scoped>
.header-actions {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
  gap: 20px;
}

.selected-discipline-info,
.placeholder-discipline-info {
  font-size: 20px;
  color: black;
  flex-shrink: 0;
}

.title-discipline-info {
  font-size: 18px;
  color: black;
  flex-shrink: 0;
}

.separator-line {
  display: inline-block;
  width: 3px;
  height: 25px;
  background-color: #409eff;
  flex-shrink: 0;
}

.tables-container {
  margin-top: 20px;
}

.data-card {
  margin-bottom: 30px;
  margin-top: 20px;
}

.data-card h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.el-table {
  margin-top: 10px;
}

/* Legend styles */
.legend {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-bottom: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.legend-item::before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  background: var(--color); /* 使用 CSS 变量 */
  margin-right: 6px;
}

/* Modal styles */
.modal-content-three-rows {
  padding: 0 10px;
}

.discipline-row-container {
  height: 290px;
  margin-bottom: 15px;
  overflow: hidden;
}

.discipline-column-flow-container {
  height: 100%;
  column-width: 152px;
}

.row-separator {
  border: none;
  border-top: 1px solid #eee;
  margin: 10px 0;
}

.discipline-tabs {
  margin-top: 20px;
  margin-bottom: 20px;
}

.discipline-category-block {
  margin-bottom: 20px;
  break-inside: avoid-column;
  -webkit-break-inside: avoid-column;
}

.category-title {
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
  font-size: 1em;
}

.discipline-list .discipline-item {
  margin-bottom: 5px;
}

.el-radio {
  margin-right: 0;
  display: flex;
  align-items: flex-start;
  line-height: 1.2;
}

.el-radio__label {
  white-space: normal;
  word-break: break-word;
  line-height: inherit;
  padding-left: 4px;
}

.el-radio__inner {
  width: 14px;
  height: 14px;
  margin-top: 2px;
}

/* Deep selector for Element Plus dialog body */
:deep(.el-dialog__body) {
  overflow-y: auto;
  padding-bottom: 20px;
}

.no-data-placeholder {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 18px;
}

.tableStyle {
  width: 100%;
}

.tableStyle :deep(.el-table__header-wrapper tr:nth-child(2) th:nth-child(1)),
.tableStyle :deep(.el-table__header-wrapper tr:nth-child(2) th:nth-child(2)) {
  display: none;
}

.tableStyle :deep(.el-table__header-wrapper th) {
  font-weight: bold;
  color: #000000;
}
</style>