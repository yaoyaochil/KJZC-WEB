<template>
  <div>
    <div class="bodo-table-box">
      <div class="bodo-btn-list">
        <el-button size="small" type="primary" icon="refresh" @click="createBoss">创建副本</el-button>
      </div>
    </div>
    <el-table ref="multipleTable" style="width: 100%" tooltip-effect="light" :data="tableData" row-key="ID">
      <el-table-column align="center" label="创建日期" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.CreatedAt) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="副本名称" prop="game_title" width="120" />
      <el-table-column align="center" label="副本图片" width="120">
        <template #default="scope">
          <div style="display: flex;align-items: center;justify-content: center">
            <el-image :src="scope.row.game_image" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="启动时间" prop="weekday" width="200" />
      <el-table-column align="center" label="游戏开始时间" prop="start_time" width="200" />
      <el-table-column align="center" label="游戏结束时间" prop="end_time" width="200" />
      <el-table-column align="center" label="最后更新" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.UpdatedAt) }}
        </template>
      </el-table-column>
      <el-table-column align="center" width="400" label="按钮组">
        <template #default="scope">
          <el-button class="table-button" link size="small" type="primary">修改配置</el-button>
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
    <ChooseImg ref="chooseImgVisible" @enter-img="enterImg"/>
    <el-dialog v-model="dialogVisible" title="配置副本" width="600px" :before-close="closeDialog">
      <el-form :model="formData">
        <el-form-item label="副本名称" label-width="120px">
          <el-input v-model="formData.game_title" placeholder="请输入副本名称" />
        </el-form-item>
        <el-form-item label="副本图片" label-width="120px">
          <el-button class="image-select" style="border-radius: 10px" @click="openChooseImg">
            <el-image
              v-if="formData.game_image"
              :src="formData.game_image"
              class="image-select-img"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-button>

        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { formatDate } from '@/utils/format'
import {
  createBossSetting,
  updateBossSetting,
  deleteBossSettingById,
  getBossSettingById,
  getAllBossSetting
} from '@/plugin/boss_setting/api/api'
import ChooseImg from '@/plugin/boss_setting/chooseImg/index.vue'

// =========== dialog控制 ===========
const dialogVisible = ref(false)

// =========== 表格控制部分 ===========
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})
const chooseImgVisible = ref(null)
const formData = ref({
  game_title: '',
  game_image: '',
  weekday: 0,
  start_time: 0,
  end_time: 0,
  boss_hp: 0.0,
  boss_attack_min: 0,
  boss_attack_max: 0,
  boss_stage_threshold_one_min: 0,
  boss_stage_threshold_one_max: 0,
  boss_stage_threshold_two_min: 0,
  boss_stage_threshold_two_max: 0,
  player_initial_hp: 0.0,
  player_attack_min: 0,
  player_attack_max: 0,
  vip_bonus_hp: 0,
  boss_card_withdraw_time: 0,
  mvp_bonus_attack_percent: 0,
})
// 获取表格数据
const getTableData = async() => {
  const res = await getAllBossSetting({
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

// 创建副本
const createBoss = async() => {
  dialogVisible.value = true
}

// 选择图片
const openChooseImg = async() => {
  chooseImgVisible.value.open()
}

const enterImg = async(url) => {
  formData.value.game_image = url
}

const closeDialog = () => {
  formData.value.game_image = ''
  dialogVisible.value = false
}

getTableData()
</script>

<style scoped lang="scss">
.image-select {
  float: left;
  width: 240px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed rgba(48, 49, 51, 0.4);
  border-radius: 10px;
  .image-select-img {
    width: 240px;
    height: 120px;border: 1px dashed #303133;
    border-radius: 10px;
  }
}
</style>
