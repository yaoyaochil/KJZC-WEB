<template>
  <div>
    <div class="bodo-search-box">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="创建时间">
          <el-date-picker v-model="searchInfo.startCreatedAt" type="datetime" placeholder="开始时间" />
          —
          <el-date-picker v-model="searchInfo.endCreatedAt" type="datetime" placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="身份组名称">
          <el-input v-model="searchInfo.dodoSourceId" placeholder="模糊搜索" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-auth="btnAuth.admin" class="bodo-table-box">
      <div class="bodo-btn-list">
        <el-button size="small" type="primary" icon="refresh" @click="syncRole">同步身份组</el-button>
      </div>
    </div>
    <el-table ref="multipleTable" style="width: 100%" tooltip-effect="light" :data="tableData" row-key="ID">
      <el-table-column align="center" label="同步日期" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.CreatedAt) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份组ID" prop="roleId" width="120" />
      <el-table-column align="center" label="名称" prop="roleName" width="200" />
      <el-table-column align="center" label="颜色" width="120">
        <template #default="scope">
          <!--          <img :src="scope.row.avatarUrl" alt="" style="width: 40px; height: 40px; border-radius: 50%;">-->
          <el-color-picker v-model="scope.row.roleColor" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="官方权限代码" prop="permission" width="140" />
      <el-table-column align="center" label="成员数量" prop="memberCount" width="140" />
      <el-table-column align="center" label="删除" width="140">
        <template #default="scope">
          <div :style="{ 'text-decoration': scope.row.isDel === 1 ? 'line-through' : 'none' }">
            {{ scope.row.isDel === 1 ? '是' : '否' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后更新" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.UpdatedAt) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="按钮组">
        <template #default="scope">
          <el-button class="table-button" link size="small" type="primary">刷新信息</el-button>
          <el-button class="table-button" link size="small" type="primary">详细信息</el-button>
          <el-button class="table-button" link size="small" type="danger">删除</el-button>
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
import { getDoDoRoleList, syncDoDoRole } from '@/plugin/dodo/api/role'
// 权限按钮
const btnAuth = useBtnAuth()
// =========== 表格控制部分 ===========
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})
// 获取表格数据
const getTableData = async() => {
  const res = await getDoDoRoleList({
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
  const res = await syncDoDoRole()
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

.background-text-origin {
    background-image: linear-gradient(45deg, rgb(251, 78, 140) 0%, rgb(255, 204, 71) 100%);
    -webkit-background-clip: text; /* 将背景限定在文字区域 */
    -webkit-text-fill-color: transparent; /* 将文字颜色设为透明 */
    font-size: 14px;
    font-weight: bolder;
}

.background-text-red {
    background-image: linear-gradient(225deg, rgb(253, 58, 93) 0%, rgb(230, 75, 255) 47.92%, rgb(72, 90, 255) 99.99%, rgb(90, 127, 255) 100%);
    -webkit-background-clip: text; /* 将背景限定在文字区域 */
    -webkit-text-fill-color: transparent; /* 将文字颜色设为透明 */
    font-size: 14px;
    font-weight: bolder;
}

.background-text-blue {
    background-image: linear-gradient(225deg, rgb(72, 255, 211) 0%, rgb(41, 63, 255) 100%);
    -webkit-background-clip: text; /* 将背景限定在文字区域 */
    -webkit-text-fill-color: transparent; /* 将文字颜色设为透明 */
    font-size: 14px;
    font-weight: bolder;
    padding: 0.1vw;
    /*background:#f3f5f5;*/
    border: 1px solid rgba(0, 0, 0, .06);
    border-radius: 10px;
}
.background-text-normal {
    background-image: linear-gradient(225deg, rgb(86, 100, 96) 0%, rgb(65, 65, 70) 100%);
    -webkit-background-clip: text; /* 将背景限定在文字区域 */
    -webkit-text-fill-color: transparent; /* 将文字颜色设为透明 */
    font-size: 14px;
    font-weight: bolder;
    padding: 0.1vw;
    /*background:#f3f5f5;*/
    border: 1px solid rgba(0, 0, 0, .06);
    border-radius: 10px;
}
</style>
