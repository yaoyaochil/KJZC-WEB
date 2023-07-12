<template>
  <div>
    <div class="bodo-search-box">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="创建时间">
          <el-date-picker v-model="searchInfo.startCreatedAt" type="datetime" placeholder="开始时间" />
          —
          <el-date-picker v-model="searchInfo.endCreatedAt" type="datetime" placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="频道名称">
          <el-input v-model="searchInfo.channelName" placeholder="模糊搜索" clearable />
        </el-form-item>
        <el-form-item label="频道类型">
          <el-select v-model="searchInfo.channelType" clearable>
            <el-option
              v-for="item in channelTypeSlect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-auth="btnAuth.admin" class="bodo-table-box">
      <div class="bodo-btn-list">
        <el-button size="small" type="primary" icon="refresh" @click="syncRole">同步频道</el-button>
      </div>
    </div>
    <el-table ref="multipleTable" style="width: 100%" tooltip-effect="light" :data="tableData" row-key="ID">
      <el-table-column align="center" label="同步日期" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.CreatedAt) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="频道ID" prop="channelId" width="120" />
      <el-table-column align="center" label="名称" prop="channelName" width="240" />
      <el-table-column align="center" label="类型" width="120" >
        <template #default="scope">
          {{ convertChannelType(scope.row.channelType) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="分组" width="400">
        <template #default="scope">
          <div>
            {{ scope.row.groupName.length >= 1 ? scope.row.groupName : '无' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="删除" width="140">
        <template #default="scope">
          <div :style="{ 'text-decoration': scope.row.isDel === 1 ? 'line-through' : 'none' }">
            {{ scope.row.isDel === 1 ? '是' : '否' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后更新" width="240">
        <template #default="scope">
          {{ formatDate(scope.row.UpdatedAt) }}
        </template>
      </el-table-column>
    </el-table>
    <div class="bodo-pagination">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { formatDate } from '@/utils/format'
import { useBtnAuth } from '@/utils/btnAuth'
import { syncChannels, getChannelList } from '@/plugin/dodo/api/channel'
import { convertChannelType } from '@/plugin/dodo/util/format'
// 权限按钮
const btnAuth = useBtnAuth()
// =========== 表格控制部分 ===========
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})
// 频道类型，1：文字频道，2：语音频道，4：帖子频道，5：链接频道，6：资料频道
const channelTypeSlect = ref([
  { label: '文字频道', value: 1 },
  { label: '语音频道', value: 2 },
  { label: '帖子频道', value: 4 },
  { label: '链接频道', value: 5 },
  { label: '资料频道', value: 6 }
])
// 获取表格数据
const getTableData = async() => {
  const res = await getChannelList({
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

const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  if (searchInfo.value.current_month_duty === '') {
    searchInfo.value.current_month_duty = null
  }
  getTableData()
}

const onReset = () => {
  searchInfo.value = {}
}

// =========== 表格控制部分结束 ===========

// 同步身份组
const syncRole = async() => {
  const res = await syncChannels()
  if (res.code === 0) {
    await getTableData()
    ElMessage({
      message: '同步成功',
      type: 'success'
    })
  }
}
</script>

<style scoped>
</style>
