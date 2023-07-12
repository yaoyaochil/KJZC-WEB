<template>
  <div>
    <div class="bodo-search-box">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="创建时间">
          <el-date-picker v-model="searchInfo.startCreatedAt" type="datetime" placeholder="开始时间" />
          —
          <el-date-picker v-model="searchInfo.endCreatedAt" type="datetime" placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="成员昵称">
          <el-input v-model="searchInfo.personalNickName" placeholder="模糊搜索" />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="searchInfo.dodoSourceId" placeholder="模糊搜索" />
        </el-form-item>
        <el-form-item label="身份组">
          <el-select v-model="searchInfo.roleIdInt">
            <el-option
              v-for="item in roleList"
              :key="item.roleIdInt"
              :label="item.roleName"
              :value="item.roleIdInt"
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
        <el-button size="small" type="primary" icon="refresh" @click="syncMember">一键同步成员及身份</el-button>
        <el-button size="small" type="primary" icon="refresh" @click="syncMemberRole">重新同步成员身份</el-button>
        <el-button size="small" type="primary" icon="promotion" @click="toRoleView">去同步身份组</el-button>
      </div>
    </div>
    <el-table ref="multipleTable" style="width: 100%" tooltip-effect="light" :data="tableData" row-key="ID">
      <el-table-column align="center" label="同步日期" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.CreatedAt) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户ID" prop="dodoSourceId" width="120" />
      <el-table-column align="center" label="昵称" prop="nickName" width="200" />
      <el-table-column align="center" label="头像" width="120">
        <template #default="scope">
          <div style="display: flex;align-items: center;justify-content: center">
            <el-avatar :size="50" :src="scope.row.avatarUrl" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="140">
        <template #default="scope">
          {{ convertGender(scope.row.sex) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份组" width="200">
        <template #default="scope">
          <div v-if="scope.row.roleIdInt !== 0" class="background-text-blue" :style="`background-image: linear-gradient(200deg, gray 0%, ${scope.row.role.roleColor} 100%);`">
            {{ scope.row.role.roleName }}
          </div>
          <div v-if="scope.row.roleIdInt === 0" class="background-text-normal">
            无身分组
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="加入社群时间" prop="joinTime" width="200" />
      <el-table-column align="center" label="等级" width="120">
        <template #default="scope">
          <span>Lv</span> {{ scope.row.level }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="机器人" width="120">
        <template #default="scope">
          {{ convertRobotType(scope.row.isBot) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="退出社群" width="140">
        <template #default="scope">
          <div v-if="scope.row.isQuit" class="strikethrough">{{ scope.row.isQuit ? '是' : '否' }}</div>
          <div v-else>{{ scope.row.isQuit ? '是' : '否' }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后更新" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.UpdatedAt) }}
        </template>
      </el-table-column>
      <el-table-column v-auth="admin" align="center" width="400" label="按钮组">
        <template #default="scope">
          <el-button class="table-button" link size="small" type="primary">封禁</el-button>
          <el-button class="table-button" link size="small" type="primary">查看数字账户</el-button>
          <el-button class="table-button" link size="small" type="primary">赠送积分</el-button>
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
import { getCommunityMemberList, syncCommunityMember } from '@/plugin/dodo/api/member_api'
import { formatDate } from '@/utils/format'
import { convertGender, convertRobotType } from '@/plugin/dodo/util/format'
import { useBtnAuth } from '@/utils/btnAuth'
import { getDoDoRoleList } from '@/plugin/dodo/api/role'
import { useRouter } from 'vue-router'
const router = useRouter()
// 权限按钮
const btnAuth = useBtnAuth()
// =========== 表格控制部分 ===========
const roleList = ref([])
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({
  role: {
    roleId: '',
    roleName: ''
  }
})
// 获取表格数据
const getTableData = async() => {
  const res = await getCommunityMemberList({
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

// 获取身份组
const getRoleList = async() => {
  const res = await getDoDoRoleList({
    page: 1,
    pageSize: 999
  })
  if (res.code === 0) {
    roleList.value = res.data.list
  }
}

getRoleList()

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

// 同步成员
const syncMember = async() => {
  const res = await syncCommunityMember()
  if (res.code === 0) {
    await getTableData()
    ElMessage({
      message: '同步成员成功',
      type: 'success'
    })
    setTimeout(async() => {
      ElMessage({
        message: '开始同步身份关系',
        type: 'success'
      })
      await syncMemberRole()
    }, 500)
  }
}

// 同步成员身份组
const syncMemberRole = async() => {
  const res = await syncDoDoMemberRole()
  if (res.code === 0) {
    await getTableData()
    ElMessage({
      message: '同步身份关系成功',
      type: 'success'
    })
  }
}

const toRoleView = () => {
  router.push({
    name: 'roleList'
  })
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
    background-image: linear-gradient(225deg, rgb(161, 206, 194) 0%, rgb(73, 73, 79) 100%);
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
