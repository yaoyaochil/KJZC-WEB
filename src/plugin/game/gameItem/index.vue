<template>
  <div>
    <div class="bodo-search-box">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="创建时间">
          <el-date-picker v-model="searchInfo.startCreatedAt" type="datetime" placeholder="开始时间" />
          —
          <el-date-picker v-model="searchInfo.endCreatedAt" type="datetime" placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="道具名称">
          <el-input v-model="searchInfo.itemName" placeholder="输入道具名称" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bodo-table-box">
      <div class="bodo-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="addItem">创建道具</el-button>
      </div>
      <el-table ref="multipleTable" style="width: 100%;" tooltip-effect="light" :data="tableData" row-key="item_id">
        <el-table-column align="center" label="创建日期" width="240">
          <template #default="scope">
            {{ formatDate(scope.row.CreatedAt) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="item_id" label="ID" width="180" />
        <el-table-column align="center" prop="item_name" label="道具名称" width="180" />
        <el-table-column align="center" label="道具图片" width="240">
          <template #default="scope">
            <el-image class="table-img" size="small" :src="scope.row.item_img" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="道具类型" width="120">
          <template #default="scope">
            {{ formatType(scope.row.item_type) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="item_description" label="道具描述" width="360" />
        <el-table-column align="center" label="最后更新" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.UpdatedAt) }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="400" label="操作">
          <template #default="scope">
            <el-button class="table-button" link size="small" type="primary" @click="openAddItemDialog(scope.row)">批量发放</el-button>
            <el-button class="table-button" link size="small" type="primary" @click="updateItem(scope.row)">修改</el-button>
            <el-popover v-model="scope.row.visible" placement="top" width="160">
              <p>确定要删除此道具吗</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button size="small" type="primary" link @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="deleteItem(scope.row)">确定</el-button>
              </div>
              <template #reference>
                <el-button type="primary" link icon="delete" size="small">删除</el-button>
              </template>
            </el-popover>
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

    <el-dialog
      v-model="diaLog"
      title="道具"
      width="600px"
    >
      <el-form ref="itemForm" :model="formData" :rules="rules" style="overflow:auto;padding:0 12px;">
        <el-form-item label="道具名称" prop="item_name">
          <el-input v-model="formData.item_name" placeholder="输入道具名称" />
        </el-form-item>
        <el-form-item label="道具图片" prop="item_img">
          <el-button class="image-select" style="border-radius: 8px" @click="openChooseImg">
            <el-image
              v-if="formData.item_img"
              :src="formData.item_img"
              class="image-select-img"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-button>
        </el-form-item>
        <el-form-item label="道具描述" prop="item_description">
          <el-input v-model="formData.item_description" type="textarea" maxlength="50" show-word-limit placeholder="请输入描述/支持换行" rows="6" />
        </el-form-item>
        <el-form-item label="道具类型" prop="item_type">
          <el-select v-model="formData.item_type">
            <el-option
              v-for="item in itemType"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeAddUserDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterAddUserDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <ChooseImg ref="chooseImgVisible" @enter-img="enterImg" />
    <el-dialog v-model="addItemDialog" title="批量发放道具" width="600px">
      <warning-bar title="批量发放道具--多选用户也可单选发放，数量统一 谨慎操作！" />
      <el-form ref="addItemForm" :model="addItemFormData" :rules="addItemRules" style="overflow: auto;padding: 0 12px;">
        <el-form-item label="选中道具" prop="item_name">
          <el-input v-model="addItemFormData.item_name" disabled />
        </el-form-item>
        <el-form-item label="发放数量" prop="item_num">
          <el-input-number v-model="addItemFormData.have_num" :min="1" />
        </el-form-item>
        <el-form-item label="发放用户" prop="players">
          <el-select
            v-model="addItemFormData.players"
            filterable
            remote
            reserve-keyword
            placeholder="搜索账户"
            no-match-text="系统无此账户"
            remote-show-suffix
            clearable
            :remote-method="getDoDoUserList"
            :loading="loading"
            multiple
            style="width: 400px"
          >
            <el-option
              v-for="(item) in userOptions"
              :key="item.ID"
              :label="item.nickName"
              :value="item.ID"
            >
              <span style="float: left">{{ item.nickName }}</span>
              <span style="margin-left: 5%;color: var(--el-text-color-secondary);font-size: 13px;">联系方式：{{ item.phone }}</span>
              <span style="float: right;display: flex;align-items: center;justify-content: center">
                <el-avatar :size="30" :src="item.headerImg" style="margin-right: 15px" />
              </span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeAddItemDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterAddItemDialog">发 放</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  addGameItemToPlayers,
  createGameItem,
  deleteGameItem,
  getGameItemList,
  getGameItemById,
  updateGameItem
} from '@/plugin/game/api/game_item'
import { formatDate } from '@/utils/format'
import ChooseImg from '@/plugin/game/components/chooseImg/index.vue'
import WarningBar from '@/components/warningBar/warningBar.vue'
import { getUserList } from '@/api/user'

// 道具发放部分
const addItemDialog = ref(false)
const addItemFormData = ref({
  item_id: 0,
  item_name: '',
  have_num: 1,
  players: []
})

const addItemForm = ref(null)

const loading = ref(false)

const addItemRules = ref({
  item_name: [
    { required: true, message: '请选择道具', trigger: 'blur' }
  ],
  players: [
    { required: true, message: '请选择发放用户', trigger: 'change' }
  ]
})

const userOptions = ref([])

// 远程搜索系统用户
const getDoDoUserList = async(query) => {
  if (query) {
    loading.value = true
    setTimeout(async() => {
      const pageInfo = {
        page: 1,
        size: 999,
        phone: query,
      }
      const res = await getUserList(pageInfo)
      if (res.code === 0) {
        loading.value = false
        userOptions.value = res.data.list
      }
    }, 500)
  } else {
    const pageInfo = {
      page: 1,
      pageSize: 30,
    }
    const res = await getUserList(pageInfo)
    if (res.code === 0) {
      userOptions.value = res.data.list
    }
  }
}

const openAddItemDialog = async(row) => {
  addItemFormData.value.item_name = row.item_name
  addItemFormData.value.item_id = row.item_id
  addItemDialog.value = true
  await getDoDoUserList()
}

const closeAddItemDialog = () => {
  addItemDialog.value = false
  addItemFormData.value = {
    item_id: 0,
    item_name: '',
    have_num: 1,
    players: []
  }
  userOptions.value = []
}

const enterAddItemDialog = async() => {
  // const res = await addGameItemToPlayers(addItemFormData.value)
  // if (res.code === 0) {
  //   ElMessage.success('发放成功')
  //   closeAddItemDialog()
  // }
  addItemForm.value.validate(async(valid) => {
    if (valid) {
      const res = await addGameItemToPlayers(addItemFormData.value)
      if (res.code === 0) {
        ElMessage.success('发放成功')
        closeAddItemDialog()
      }
    }
  })
}

// ======================= 基础操作部分 ============================

const searchInfo = ref({})
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref([])
const formData = ref({
  item_name: '',
  item_img: '',
  item_type: '',
  item_description: ''
})
const diaLog = ref(false)
const dialogFlag = ref('')
const chooseImgVisible = ref(null)
const itemForm = ref(null)

const itemType = ref([
  {
    name: '金币',
    type: 1,
  },
  {
    name: '消耗品',
    type: 2,
  },
  {
    name: '装备',
    type: 3,
  },
  {
    name: '材料',
    type: 4,
  },
  {
    name: '证章',
    type: 5,
  }
])

const formatType = (row) => {
  switch (row) {
    case 1:
      return '金币'
    case 2:
      return '消耗品'
    case 3:
      return '装备'
    case 4:
      return '材料'
    case 5:
      return '证章'
  }
}

const rules = ref({
  item_name: [
    { required: true, message: '请输入道具名称', trigger: 'blur' },
    { min: 1, message: '最低1位字符', trigger: 'blur' }
  ],
  item_img: [
    { required: true, message: '请选择道具图片', trigger: 'blur' },
    { min: 1, message: '最低1位字符', trigger: 'blur' }
  ],
  item_description: [
    { required: true, message: '请输入道具描述 防止不知道作用是什么', trigger: 'blur' },
    { min: 1, message: '最低1位字符', trigger: 'blur' }
  ],
  item_type: [
    { required: true, message: '请选择道具类型', trigger: 'change' },
  ]
})

// 选择图片
const openChooseImg = async() => {
  chooseImgVisible.value.open()
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

const enterImg = async(url) => {
  formData.value.item_img = url
}

const addItem = async(data) => {
  dialogFlag.value = 'add'
  diaLog.value = true
  // const res = await createGameItem(formData.value)
}

const enterAddUserDialog = async() => {
  itemForm.value.validate(async valid => {
    if (valid) {
      if (dialogFlag.value === 'add') {
        formData.value.ID = 0
        const res = await createGameItem(formData.value)
        if (res.code === 0) {
          ElMessage.success('创建成功')
          closeAddUserDialog()
          await getTableData()
        }
      }
      if (dialogFlag.value === 'update') {
        const res = await updateGameItem(formData.value)
        if (res.code === 0) {
          ElMessage.success('修改成功')
          closeAddUserDialog()
          await getTableData()
        }
      }
    }
  })
}

const updateItem = async(row) => {
  dialogFlag.value = 'update'
  diaLog.value = true
  const res = await getGameItemById({ item_id: row.item_id })
  if (res.code === 0) {
    formData.value = res.data
  }
}

const closeAddUserDialog = () => {
  diaLog.value = false
  formData.value = {
    item_name: '',
    item_img: '',
    item_type: '',
    item_description: ''
  }
}

const deleteItem = async(row) => {
  const res = await deleteGameItem({ item_id: row.item_id })
  if (res.code === 0) {
    ElMessage.success('删除成功')
    row.visible = false
    await getTableData()
  }
}

const getTableData = async() => {
  const res = await getGameItemList({
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
</script>

<style scoped lang="scss">
.table-img {
  width: 80px;
  height: 80px;
  border: 1px dashed rgba(48, 49, 51, 0.4);
  border-radius: 8px;
}
.image-select {
  float: left;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed rgba(48, 49, 51, 0.4);
  border-radius: 8px;
  .image-select-img {
    width: 150px;
    height: 150px;border: 1px dashed #303133;
    border-radius: 10px;
  }
}
</style>
