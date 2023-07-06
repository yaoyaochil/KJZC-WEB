<template>
  <div>
    <div class="bodo-table-box">
      <p><el-icon style="margin-right: 0.4vw"><Headset /></el-icon> 社区机器人监听配置</p>
    </div>
    <el-table ref="multipleTable" style="width: 100%" tooltip-effect="light" :data="tableData" row-key="ID">
      <el-table-column align="center" label="序号" prop="ID" width="120" />
      <el-table-column align="center" label="社群ID" prop="islandSourceId" width="120" />
      <el-table-column align="center" label="归属社群" prop="islandName" width="120" />
      <el-table-column align="center" label="是否启用" width="120">
        <template #default="scope">
          <el-switch
            v-model="scope.row.isEnable"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="最后更新" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.UpdatedAt) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作人员" prop="updatedBy" width="120" />
      <el-table-column align="center" width="400" label="按钮组">
        <template #default="scope">
          <el-button class="table-button" round size="small" type="primary" @click="update(scope)">配置监听</el-button>
          <el-button class="table-button" round size="small" :disabled="scope.row.isEnable === 1" type="success" @click="openWss(scope)">开启服务</el-button>
          <el-button class="table-button" round size="small" :disabled="scope.row.isEnable === 0" type="danger" @click="closeWss(scope)">关闭服务</el-button>
          <el-button class="table-button" round size="small" type="primary" @click="restartWss(scope)">重启服务
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" title="配置监听" width="900px">
      <el-form :model="wssForm" :rules="rules" label-width="150px">
        <el-form-item label="社群ID">
          <el-input v-model="wssForm.islandSourceId" placeholder="请输入社群ID" />
        </el-form-item>
        <el-form-item label="归属社群" prop="islandName">
          <el-input v-model="wssForm.islandName" placeholder="请输入归属社群" />
        </el-form-item>
        <el-form-item label="监听地址(wss链接)" prop="wssUrl">
          <el-input v-model="wssForm.wssUrl" placeholder="请输入wss地址" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch
            v-model="wssForm.isEnable"
            :active-value="1"
            :inactive-value="0"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="settingConfig">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import { ref } from 'vue'
import { formatDate } from '@/utils/format'
import { getWssSetting, updateWssSetting, controlWss } from '@/plugin/wss_setting/api/api'
import { ElMessage } from 'element-plus'

const tableData = ref([])

const wssForm = ref({})

const dialogVisible = ref(false)

const rules = {
  islandSourceId: [
    { required: true, message: '请输入社群ID', trigger: 'blur' }
  ],
  islandName: [
    { required: true, message: '请输入归属社群', trigger: 'blur' }
  ],
  wssUrl: [
    { required: true, message: '请输入监听地址', trigger: 'blur' }
  ]
}

const getTableData = async() => {
  const res = await getWssSetting()
  if (res.code === 0) {
    tableData.value = res.data
  }
}

getTableData()
const update = async(e) => {
  wssForm.value = {
    CreatedAt: e.row.CreatedAt,
    ID: e.row.ID,
    islandSourceId: e.row.islandSourceId,
    islandName: e.row.islandName,
    wssUrl: e.row.wssUrl,
    isEnable: e.row.isEnable
  }
  dialogVisible.value = true
}

const openWss = async(e) => {
  const res = await controlWss({ ID: e.row.ID, isEnable: 1 })
  if (res.code === 0) {
    await getTableData()
    ElMessage({
      message: '开启成功',
      type: 'success'
    })
  }
}

const closeWss = async(e) => {
  const res = await controlWss({ ID: e.row.ID, isEnable: 0 })
  if (res.code === 0) {
    await getTableData()
    ElMessage({
      message: '关闭成功',
      type: 'success'
    })
  }
}

const restartWss = async(e) => {
  const res = await controlWss({ ID: e.row.ID, isEnable: 2 })
  if (res.code === 0) {
    await getTableData()
    ElMessage({
      message: '重启成功',
      type: 'success'
    })
  }
}

const settingConfig = async() => {
  const res = await updateWssSetting(wssForm.value)
  if (res.code === 0) {
    await controlWss({ ID: wssForm.value.ID, isEnable: wssForm.value.isEnable })
    await getTableData()
    dialogVisible.value = false
    ElMessage({
      message: '配置成功',
      type: 'success'
    })
  }
}

const closeDialog = () => {
  wssForm.value = {}
  dialogVisible.value = false
}

</script>

<style scoped>

</style>
