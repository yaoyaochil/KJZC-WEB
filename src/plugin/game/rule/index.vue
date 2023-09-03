<template>
  <div>
    <div class="bodo-search-box">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="创建时间">
          <el-date-picker v-model="searchInfo.startCreatedAt" type="datetime" placeholder="开始时间" />
          —
          <el-date-picker v-model="searchInfo.endCreatedAt" type="datetime" placeholder="结束时间" />
        </el-form-item>
        <el-form-item label="规则名称">
          <el-input v-model="searchInfo.reward_name" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bodo-table-box">
      <div class="bodo-btn-box">
        <el-button type="primary" size="small" @click="addRule">新增规则</el-button>
      </div>
      <el-table ref="multipleTable" style="width: 100%;" tooltip-effect="light" :data="tableData" row-key="reward_rule_id">
        <el-table-column align="center" label="创建时间" width="240">
          <template #default="scope">
            {{ formatDate(scope.row.CreatedAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="reward_rule_id" label="ID" width="80" />
        <el-table-column prop="reward_name" label="规则名称" />
        <el-table-column prop="first_place_reward_percent" align="center" label="第一名获奖比例" />
        <el-table-column prop="second_place_reward_percent" align="center" label="第二名获奖比例" />
        <el-table-column prop="third_place_reward_percent" align="center" label="第三名获奖比例" />
        <el-table-column align="center" label="最后更新" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.UpdatedAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="editRule(row)">编辑</el-button>
            <el-button type="text" size="small" @click="deleteRule(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogVisible" title="规则管理" width="600px">
      <el-form ref="ruleForm" :model="formData" :rules="rules" style="overflow: auto;padding: 0 12px;">
        <el-form-item label="规则名称" prop="reward_name">
          <el-input v-model="formData.reward_name" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="第一名奖励数量" prop="first_place_reward_percent">
          <el-input-number v-model="formData.first_place_reward_percent" placeholder="请输入数量" :min="1" />
        </el-form-item>
        <el-form-item label="第二名奖励数量" prop="second_place_reward_percent">
          <el-input-number v-model="formData.second_place_reward_percent" placeholder="请输入数量" :min="1" />
        </el-form-item>
        <el-form-item label="第三名奖励数量" prop="third_place_reward_percent">
          <el-input-number v-model="formData.third_place_reward_percent" placeholder="请输入数量" :min="1" />
        </el-form-item>
        <el-form-item label="奖励道具" prop="game_item_id">
          <el-select v-model="formData.game_item_id" placeholder="请选择奖励物品">
            <el-option
              v-for="item in rewardItemList"
              :key="item.item_id"
              :label="item.item_name"
              :value="item.item_id"
            >
              <span style="float: left;display: flex;align-items: center;justify-content: center">
<!--                <el-avatar :size="30" :src="item.item_img" style="margin-right: 15px" />-->
                <el-image :src="item.item_img" style="width: 30px;height: 30px;border-radius: 5px" />
              </span>
              <span style="float: right;font-weight: bold">{{ item.item_name }}</span>

            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="disable">取 消</el-button>
          <el-button type="primary" @click="enter">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createRule, updateRule, deleteRule, getRuleById, getRuleList } from '@/plugin/game/api/rule'
import { formatDate } from '@/utils/format'
import { getGameItemList } from '@/plugin/game/api/game_item'
import { ElMessage } from 'element-plus'
const searchInfo = ref({})
const tableData = ref([])
const ruleForm = ref(null)
// ======================  查询  ======================
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

// ======================  表格控制部分  ======================
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const getTableData = async() => {
  const { data } = await getRuleList({
    page: page.value,
    pageSize: pageSize.value,
    ...searchInfo.value
  })
  tableData.value = data.list
  total.value = data.total
}
getTableData()

// ======================  新增  ======================
const formData = ref({
  first_place_reward_percent: 1,
  second_place_reward_percent: 1,
  third_place_reward_percent: 1,
  item_num: 1
})
const rules = ref({
  reward_name: [
    { required: true, message: '请输入规则名称', trigger: 'blur' }
  ],
  game_item_id: [
    { required: true, message: '请选择奖励物品', trigger: 'change' }
  ]
})
const rewardItemList = ref([])
const dialogVisible = ref(false)
const dialogFlag = ref('')
const addRule = async() => {
  const { data } = await getGameItemList()
  rewardItemList.value = data.list
  dialogVisible.value = true
  dialogFlag.value = 'add'
}

const getItemList = async() => {
  const { data } = await getGameItemList()
  rewardItemList.value = data.list
}

const editRule = async(row) => {
  const res = await getRuleById({ reward_rule_id: row.reward_rule_id })
  if (res.code === 0) {
    await getItemList()
    formData.value = res.data
    dialogVisible.value = true
    dialogFlag.value = 'edit'
  }
}

const enter = () => {
  ruleForm.value.validate(async(valid) => {
    if (valid) {
      if (dialogFlag.value === 'add') {
        const res = await createRule(formData.value)
        if (res.code === 0) {
          ElMessage.success('新增成功')
          dialogVisible.value = false
          await getTableData()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await updateRule(formData.value)
        if (res.code === 0) {
          ElMessage.success('更新成功')
          dialogVisible.value = false
          await getTableData()
        }
      }
    }
  })
}

const disable = async() => {
  dialogVisible.value = false
}
</script>

<style scoped lang="scss">

</style>
