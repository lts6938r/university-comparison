<template>
  <div class="comparison-container">
    <div class="header-actions">
        <span class="title-discipline-info">评估指标</span>
        <span class="separator-line"></span>
        <span v-if="currentlySelectedDisciplines" class="selected-discipline-info">
          {{ getDisciplineName(currentlySelectedDisciplines) }} ({{ currentlySelectedDisciplines }})
        </span>
        <span v-else class="placeholder-discipline-info">
          请选择学科
        </span>
        <el-button type="primary" @click="showDisciplineModal = true">
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
        <div class="discipline-row-container top-row">
          <div class="discipline-column-flow-container">
            <div
              v-for="(category, categoryIndex) in disciplinesRow1"
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
        </div>

        <hr class="row-separator">

        <div class="discipline-row-container middle-row">
          <div class="discipline-column-flow-container">
            <div
              v-for="(category, categoryIndex) in disciplinesRow2"
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
        </div>

         <hr class="row-separator">

        <div class="discipline-row-container bottom-row">
          <div class="discipline-column-flow-container">
            <div
              v-for="(category, categoryIndex) in disciplinesRow3"
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
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirmSelection" :disabled="!selectedDiscipline">确定</el-button>
        </span>
      </template>
    </el-dialog>


    <div v-if="currentlySelectedDisciplines && allData[currentlySelectedDisciplines]" class="tables-container">
      <el-tabs v-model="activeTab" class="discipline-tabs" @tab-click="handleTabClick">
          <el-tab-pane label="全部指标" name="all"></el-tab-pane>

          <el-tab-pane
              v-for="(header, index) in dynamicTabHeaders"
              :key="index"
              :label="header"
              :name="header"
          ></el-tab-pane>
          <el-tab-pane label="定位标杆" name="benchmark"></el-tab-pane>
      </el-tabs>
      <!-- <div class="discipline-comparison-section">
          </div> -->
      <div v-if="activeTab === 'all'" class="tables-container">


        <el-card shadow="never" class="data-card">
          <!-- 图例 -->
          <div
              class="legend"
              style="display: flex; justify-content: center; align-items: center; gap: 24px; margin-bottom: 16px;"
          >
            <!-- 人才培养质量：蓝 -->
            <span style="display: flex; align-items: center; font-weight: bold;">
              <span
                  style="
                  display: inline-block;
                  width: 12px;
                  height: 12px;
                  background: #409EFF;
                  margin-right: 6px;
                "
              ></span>
              人才培养质量
            </span>

            <!-- 师资队伍与资源：绿 -->
            <span style="display: flex; align-items: center; font-weight: bold;">
              <span
                  style="
                  display: inline-block;
                  width: 12px;
                  height: 12px;
                  background: #67C23A;
                  margin-right: 6px;
                "
              ></span>
              师资队伍与资源
            </span>

            <!-- 科学研究水平：橙 -->
            <span style="display: flex; align-items: center; font-weight: bold;">
              <span
                  style="
                  display: inline-block;
                  width: 12px;
                  height: 12px;
                  background: #E6A23C;
                  margin-right: 6px;
                "
              ></span>
              科学研究水平
            </span>
          </div>

          <el-table
              :data="allData[currentlySelectedDisciplines].allData"
              border
              class="tableStyle"
              :span-method="tableSpanMethod"
              :cell-style="{ fontWeight: 'bold' }"
              @cell-click="handleCellClick">

            <el-table-column label="核心指标" align="center" :header-cell-style="{ fontWeight: 'bold' }">
              <!-- 子列1 -->
              <el-table-column
                  width="150"
                  align="center"
              >
                <template #default="{ row, $index }">
                  <span v-if="$index < 5" style="color: #409EFF;">人才培养质量</span>
                  <span v-else-if="$index < 10" style="color: #67C23A;" >师资队伍与资源</span>
                  <span v-else style="color: #E6A23C;">科学研究水平</span>
                </template>
              </el-table-column>
              <!-- 子列2 -->
              <el-table-column
                  prop="col0"
                  align="center"
              >
                <template #default="scope">
                  {{ scope.row[0] }}
                </template>
              </el-table-column>
            </el-table-column>


            <!-- 其他列 -->
            <el-table-column
                v-for="(header, idx) in allData[currentlySelectedDisciplines].allHeaders.slice(1)"
                :key="idx+1"
                :prop="`col${idx+1}`"
                :label="header"
                align="center"
            >
              <template #default="scope">
                {{ scope.row[idx+1] }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>

      </div>
      <div v-else-if="activeTab !== 'benchmark' && currentlySelectedDisciplines && allData[currentlySelectedDisciplines] && allData[currentlySelectedDisciplines][activeTab]" class="tables-container">
        <el-card
          v-for="(tableContent, tableName) in allData[currentlySelectedDisciplines][activeTab]"
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
      <!-- Placeholder text when a dynamic tab is active -->
      <div v-else class="no-data-placeholder">
        <p>数据建设中...</p>
      </div>
    </div>

    <div v-else>
            <el-alert
              :title="`学科数据 (${currentlySelectedDisciplines}) 未找到或不完整，无法显示详情。`"
              type="warning"
              :closable="false">
            </el-alert>
         </div>
  </div>
  <el-dialog
  v-model="showDetailDialog"
  :title="detailDialogTitle"
  width="70%"
  destroy-on-close>
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
</template>

<script>
import api from '@/api/index';
// Import the shared discipline list
import { fullDisciplineList } from './disciplines.js';
// Import Element Plus components needed for both the main view and the merged modal
import {
    ElButton,
    ElCard,
    ElTable,
    ElTableColumn,
    ElAlert,
    ElDialog,
    ElRadioGroup,
    ElRadio,
    ElTabs,       
    ElTabPane,   
} from 'element-plus';


export default {
  name: 'SchoolComparison',
  components: {
    ElButton,
    ElCard,
    ElTable,
    ElTableColumn,
    ElAlert,
    ElDialog,
    ElRadioGroup,
    ElRadio,
    ElTabs,       
    ElTabPane,  
  },
  data() {
    return {
      allData: {}, // Stores all loaded comparison data, keyed by discipline code
      showDisciplineModal: false, // Controls the visibility of the modal dialog
      currentlySelectedDisciplines: null, // Stores the code of the single selected discipline
      dialogVisible: false, // Controls the internal visibility of the el-dialog
      selectedDiscipline: null, // Local state for the discipline selected within the modal
      activeTab: 'all', // Default active tab in the tabs component
      showDetailDialog: false, // 控制详情对话框的显示与隐藏
      detailTableData: [],     // 存储详情表格的数据
      detailTableHeaders: [],  // 存储详情表格的表头
      detailDialogTitle: '',   // 详情对话框的标题
    };
  },
   computed: {
      // Provide the imported list to the template via computed property
      allDisciplines() {
          return fullDisciplineList;
      },
      // Split disciplines into THREE rows based on the total number of DISCIPLINES
      disciplinesRow1() {
          return this.splitDisciplinesIntoRows(3)[0];
      },
       disciplinesRow2() {
          return this.splitDisciplinesIntoRows(3)[1];
       },
       disciplinesRow3() {
          return this.splitDisciplinesIntoRows(3)[2];
       },
       dynamicTabHeaders() {
            // Only compute if a discipline is selected and data is available
            if (this.currentlySelectedDisciplines && this.allData[this.currentlySelectedDisciplines]) {
                const headers = this.allData[this.currentlySelectedDisciplines].allHeaders;
                // Return headers from the third column (index 2) onwards
                return headers ? headers.slice(2) : [];
            }
            return [];
        },


   },
  watch: {
    showDisciplineModal(newValue) {
      this.dialogVisible = newValue;
      if (newValue) {
        if (this.currentlySelectedDisciplines) {
          let discipline = null;
          for (const category of this.allDisciplines) {
            discipline = category.items.find(item => item.abbr === this.currentlySelectedDisciplines);
            if (discipline) break;
          }
          if (discipline && !discipline.disabled) {
            this.selectedDiscipline = this.currentlySelectedDisciplines;
          } else {
            this.selectedDiscipline = null;
          }
        } else {
          this.selectedDiscipline = null;
        }
      }
    },
     dialogVisible(newValue) {
         this.showDisciplineModal = newValue;
     },
    // Watch for discipline change to reset active tab
     currentlySelectedDisciplines(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.activeTab = 'all'; // 重置到 "全部指标"
        if (newValue) { // 如果有新选择的学科，则获取数据
          this.fetchDisciplineData(newValue);
        } else {
          this.allData = {}; // 如果没有选择学科，清空数据
        }
      }
    }
  },
  created() {
    console.log("Component created. Awaiting discipline selection for data loading.");
  },
  methods: {
    tableSpanMethod({ rowIndex, columnIndex }) {
      // 只对“分组列”（也就是第一列）做行合并
      if (columnIndex === 0) {
        // “人才培养质量”要合并前 5 行
        if (rowIndex === 0) return [5, 1];
        if (rowIndex > 0 && rowIndex < 5) return [0, 0];
        // “师资队伍与资源”合并行 6～10
        if (rowIndex === 5) return [5, 1];
        if (rowIndex > 5 && rowIndex < 10) return [0, 0];
        // “科学研究水平”合并行 11～18（总数 18 行，此处共 8 行）
        if (rowIndex === 10) return [8, 1];
        if (rowIndex > 10 && rowIndex < 18) return [0, 0];
      }
      // 其它列不合并
      return [1, 1];
    },

    handleTabClick(tab) {
    // 在这里可以添加 Tab 切换时的额外逻辑
    // 注意：v-model 已经更新了 activeTab 的值，通常无需在此方法内再次更新 activeTab
    console.log('标签页被点击了:', tab.props.name);
  },
    handleClose() {
        this.dialogVisible = false;
    },
    confirmSelection() {
      let confirmedAbbr = null;
      if (this.selectedDiscipline) {
        let discipline = null;
        for (const category of this.allDisciplines) {
          discipline = category.items.find(item => item.abbr === this.selectedDiscipline);
          if (discipline) break;
        }
        if (discipline && !discipline.disabled) {
          confirmedAbbr = this.selectedDiscipline;
        }
      }

      console.log("Confirmed Discipline Abbr:", confirmedAbbr);
      // 在这里更新 currentlySelectedDisciplines，这将触发 watch 侦听器并调用 fetchDisciplineData
      this.currentlySelectedDisciplines = confirmedAbbr;
      this.handleClose();
    },

    getDisciplineName(abbr) {
      for (const category of fullDisciplineList) {
        const discipline = category.items.find(item => item.abbr === abbr);
        if (discipline) {
          return discipline.name;
        }
      }
      return '未知学科';
    },

    // New method to split disciplines into a specified number of rows
    splitDisciplinesIntoRows(numRows) {
      const totalDisciplines = this.allDisciplines.reduce((sum, category) => sum + category.items.length, 0);
      const targetPerRow = Math.ceil(totalDisciplines / numRows);

      const rows = Array.from({ length: numRows }, () => []);
      let currentRowIndex = 0;
      let currentDisciplineCount = 0;

      for (const category of this.allDisciplines) {
        if (currentRowIndex < numRows - 1 && currentDisciplineCount + category.items.length >= targetPerRow) {
          currentRowIndex++;
          currentDisciplineCount = 0;
        }
        rows[currentRowIndex].push(category);
        currentDisciplineCount += category.items.length;
      }

      return rows;
    },
    async fetchDisciplineData(disciplineAbbr) {
      if (!disciplineAbbr) {
        this.allData = {}; // 如果没有学科代码，清空数据
        return;
      }
      try {
        const response = await api.get('/discipline/assessment', { params: { discipline: disciplineAbbr } });
        if (!response.data || !response.data.data) {
          console.warn(`获取 ${disciplineAbbr} 的数据时，返回的数据格式不正确或为空。`);
          this.allData = {
            [disciplineAbbr]: null // 标记为获取失败或不存在
          };
          this.currentlySelectedDisciplines = disciplineAbbr; // 强制显示警告
          return;
        }
        if(response.data.code !== 200) {
          console.error(`获取 ${disciplineAbbr} 的数据失败:`, response.data.message);
          this.allData = {
            [disciplineAbbr]: null // 标记为获取失败或不存在
          };
          this.currentlySelectedDisciplines = disciplineAbbr; // 强制显示警告
          return;
        }
        this.allData = {
          [disciplineAbbr]: response.data.data || null, // 确保数据存在
        };
        console.log(`成功获取 ${disciplineAbbr} 的数据:`, JSON.stringify(response.data));
        // 设置当前选择的学科
        this.currentlySelectedDisciplines = disciplineAbbr;
      } catch (error) {
        console.error(`获取 ${disciplineAbbr} 的数据失败:`, error);
        // 可以根据需要处理错误，例如显示警告信息
        this.allData = {
          [disciplineAbbr]: null // 标记为获取失败或不存在
        };
        // 强制显示警告
        this.currentlySelectedDisciplines = disciplineAbbr;
      }
    },
    handleCellClick(row, column, cell, event) {
      // row: 点击的行的数据对象
      // column: 点击的列的配置对象
      // cell: 点击的单元格的 DOM 元素
      // event: 原始的 DOM 事件对象

      console.log("点击了表格单元格:");
      console.log("行数据:", row[0]);
      // console.log("列属性 (prop):", column.property); // 获取列的 prop，例如 'col0', 'col1'
      console.log("列标签 (label):", column.label);   // 获取列的 label
      if (!this.currentlySelectedDisciplines || !this.allData[this.currentlySelectedDisciplines]) {
        console.warn('当前未选择学科或学科数据不存在。');
        return;
      }
      let targetData = this.allData[this.currentlySelectedDisciplines][column.label][row[0]];
      let detailTitle = `${column.label} - ${row[0]} 详情`;
      if (targetData) {
        this.detailTableData = targetData.tableData;
        this.detailTableHeaders = targetData.tableHeaders;
        this.detailDialogTitle = detailTitle;
        this.showDetailDialog = true; // 打开详情对话框
      } else {
        console.warn(`未找到 '${column.label}' 的详细数据或数据格式不正确。`);
        this.detailTableData = [];
        this.detailTableHeaders = [];
        this.detailDialogTitle = '无详细数据';
        this.showDetailDialog = true; // 即使无数据也打开对话框，显示“无详细数据”
      }
    },
      
    },
  
};
</script>

<style scoped>



.header {
  text-align: center;
  margin-bottom: 30px;
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: space-between; /* 在主轴上平均分布子元素 */
  align-items: center; /* 在交叉轴上居中对齐子元素 */
  flex-wrap: wrap; /* 允许项目换行，防止在小屏幕上溢出 */
}

.header h1 {
  /* color: #333; */
  /* font-size: 24px; */
  /* font-weight: bold; */
  margin: 0; /* 移除默认 margin */
  flex-shrink: 0; /* 防止标题缩小 */
}

.header-actions {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: 0;
  gap: 20px;
  margin-bottom: 10px;
}

.selected-discipline-info {
  font-size: 20px; /* 调整字体大小 */
  color: black; /* 调整字体颜色 */
  flex-shrink: 0; /* 防止文本缩小 */
}

.placeholder-discipline-info {
  font-size: 20px; /* 调整字体大小 */
  color: black; /* 使用稍浅的颜色表示提示 */
  flex-shrink: 0; /* 防止文本缩小 */
}
.title-discipline-info {
  font-size: 18px; /* 调整字体大小 */
  color: black; /* 使用稍浅的颜色表示提示 */
  flex-shrink: 0; /* 防止文本缩小 */
}

.separator-line {
  display: inline-block; /* 或者 flex 布局下的 block */
  width: 3px; /* 线的宽度 */
  height: 25px; /* 线的长度，根据文本行高调整 */
  background-color: #409eff; /* Element Plus Primary Color */
  flex-shrink: 0; /* 防止线缩小 */
   /* gap 属性会自动处理线左右的间距，无需额外 margin */
}

/* Style for the single comparison section when a discipline is selected */
.discipline-comparison-section {
  margin-top: 30px;
  padding-top: 0;
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



/* --- Styles for the Three-Row Modal Layout --- */

/* Container for the three rows */
.modal-content-three-rows {
    padding: 0 10px; /* Add padding around the rows */
}

/* Style for each row container */
.discipline-row-container {
    /* Set a fixed height for each row */
    height: 290px; /* Adjust this value as needed */
    /* Add bottom margin between rows */
    margin-bottom: 15px;
    /* Ensure content that flows into columns is contained */
    overflow: hidden; /* Hide content that exceeds the fixed height of the row */
    /* If you want horizontal scrolling within a row if columns exceed width, use overflow-x: auto; */
    /* overflow-x: auto; */
}

/* Apply column layout to the inner container within each row */
.discipline-column-flow-container {
  height: 100%; /* Fill the height of the parent .discipline-row-container */
  /* Apply column layout */
  /* column-count: 7; 
  column-gap: 20px; */
  /* Or use column-width instead */
  column-width: 152px;
}

/* Style for the separator line between rows */
.row-separator {
    border: none;
    border-top: 1px solid #eee;
    margin: 10px 0; /* Space above and below the separator */
}

.discipline-tabs {
    margin-top: 20px; /* Space above the tabs */
    margin-bottom: 20px; /* Space between tabs and tables */
}


/* Prevent a category block from being split across columns */
.discipline-category-block {
  margin-bottom: 20px; /* Space between category blocks */
  /* Ensure the block stays together in one column if possible */
  break-inside: avoid-column;
  -webkit-break-inside: avoid-column; /* For older webkit browsers */
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

.el-radio-group {
  display: block;
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


/* --- Style to make the El-dialog body scrollable --- */
/* Use a deep selector to target the internal Element Plus class */
:deep(.el-dialog__body) {
    /* Allow vertical scrolling */
    overflow-y: auto;
    /* Add padding to the bottom of the scrollable area if needed */
    padding-bottom: 20px; /* Example padding */
}
.no-data-placeholder {
    text-align: center;
    padding: 40px 0;
    color: #999; /* A muted color for placeholder text */
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