<template>
  <div>
    <div class="bodo-table-box">
      <div class="bodo-btn-list">
        <el-button size="small" type="primary" icon="download" @click="exportExcel">导出Excel</el-button>
      </div>
    </div>
    <el-table ref="multipleTable" :data="tableData" row-key="ID" style="width: 100%" tooltip-effect="light">
      <el-table-column align="center" label="挖掘时间" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.CreatedAt) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="头像" width="180">
        <template #default="scope">
          <CustomPic style="margin-top:4px" :pic-src="scope.row.system_user.headerImg" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户" prop="system_user.nickName" width="120" />
      <el-table-column align="center" label="结果" width="120">
        <template #default="scope">
          {{ scope.row.is_success === 1 ? '挖掘成功' : '挖掘失败' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="当次概率(A)" width="120">
        <template #default="scope">
          {{ formatPercent(scope.row.probability) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="当次难度(K)" width="120">
        <template #default="scope">
          {{ formatPercent(scope.row.difficulty) }}
        </template>
      </el-table-column>

    </el-table>
    <div class="bodo-pagination">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getMiningLogList } from '@/plugin/wushi/api/api'
import { formatDate, formatPercent } from '@/utils/format'
import CustomPic from '@/components/customPic/index.vue'

const tableData = ref([])
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const searchInfo = ref({})
// 获取表格数据
const getTableData = async() => {
  const res = await getMiningLogList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value
  })
  if (res.code === 0) {
    tableData.value = res.data.list
    total.value = res.data.total
    page.value = res.data.page
    pageSize.value = res.data.pageSize
  }
}
getTableData()

// 修改页面容量
const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

// 导出excel
const exportExcel = () => {

}
</script>

<style lang="scss" scoped>

</style>
