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
      <el-table-column align="left" label="奖励规则" min-width="200">
        <template #default="scope">
          <el-select v-model="scope.row.reward_rule.reward_rule_id">
            <el-option
              v-for="(item,index) in scope.row.reward_rule"
              :key="index"
              :label="item.reward_name"
              :value="item.reward_rule_id"
            />
          </el-select>
        </template>
      </el-table-column>
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
    <ChooseImg ref="chooseImgVisible" @enter-img="enterImg" />
    <el-dialog v-model="dialogVisible" title="配置副本" width="1200px" :before-close="closeDialog">
      <warning-bar title="副本配置 注意时间目前仅可以选择整点~" />
      <el-row>
        <el-col :span="10" style="float: left">
          <el-form :model="formData">
            <el-form-item label="副本名称" label-width="120px">
              <el-input v-model="formData.game_title" placeholder="请输入副本名称" />
            </el-form-item>
            <el-form-item label="副本图片" label-width="120px">
              <el-button class="image-select" style="border-radius: 8px" @click="openChooseImg">
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
            <el-form-item label="启动时间" label-width="120px">
              <el-select v-model="formData.weekday">
                <el-option v-for="item in weekdaySelect" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间" label-width="120px">
              <el-time-picker v-model="start_time" type="datetime" format="HH:mm" value-format="H" @change="changeStartTime" />
            </el-form-item>
            <el-form-item label="结束时间" label-width="120px">
              <el-time-picker v-model="end_time" type="datetime" format="HH:mm" value-format="H" @change="changeEndTime" />
            </el-form-item>
            <el-form-item label="卡片撤回时间（单位：秒）" label-width="120px">
              <el-slider v-model.number="formData.boss_card_withdraw_time" show-input :show-input-controls="false" show-stops :max="60" :min="1" show-tooltip />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10" :offset="2" style="float: right">
          <el-form :model="formData">
            <el-form-item label="Boss初始血量" label-width="120px">
              <el-input-number v-model.number="formData.boss_hp" :min="1" size="large" />
            </el-form-item>
            <el-form-item label="Boss攻击力↑" label-width="120px">
              <el-input-number v-model.number="formData.boss_attack_max" :min="1" size="large" />
            </el-form-item>
            <el-form-item label="Boss攻击力↓" label-width="120px">
              <el-input-number v-model.number="formData.boss_attack_min" :min="1" size="large" />
            </el-form-item>
            <el-form-item label="阶段一Boss血量" label-width="120px">
              <el-slider v-model.number="formData.boss_stage_threshold_one" show-input :show-input-controls="false" show-stops :max="100" :min="1" show-tooltip />
            </el-form-item>
            <el-form-item label="阶段二Boss血量" label-width="120px">
              <el-slider v-model.number="formData.boss_stage_threshold_two" show-input :show-input-controls="false" show-stops :max="100" :min="1" show-tooltip />
            </el-form-item>
            <el-form-item label="阶段三Boss血量" label-width="120px">
              <el-slider v-model.number="formData.boss_stage_threshold_three" show-input :show-input-controls="false" show-stops :max="100" :min="1" show-tooltip />
            </el-form-item>
            <el-form-item label="玩家最高血量" label-width="120px">
              <el-slider v-model.number="formData.player_initial_hp" show-input :show-input-controls="false" show-stops :max="100" :min="1" show-tooltip />
            </el-form-item>
            <el-form-item label="玩家攻击范围" label-width="120px">
              <el-slider v-model="range_attack" range-start-label="最小攻击力" range-end-label="最大攻击力" range show-stops :max="100" :min="1" show-tooltip @change="changeRangeAttack" />
            </el-form-item>
            <el-form-item label="VIP血量加成" label-width="120px">
              <el-slider v-model.number="formData.vip_bonus_hp" show-input :show-input-controls="false" show-stops :max="100" :min="1" show-tooltip />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeAddUserDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterAddUserDialog">创 建</el-button>
        </div>
      </template>
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
} from '@/plugin/game/api/api'
import WarningBar from '@/components/warningBar/warningBar.vue'
import ChooseImg from '@/plugin/game/chooseImg/index.vue'

// =========== dialog控制 ===========
const dialogVisible = ref(false)
const start_time = ref('')
const end_time = ref('')
const range_attack = ref([1, 50])
const changeStartTime = (e) => {
  formData.value.start_time = parseInt(e)
}

const changeEndTime = (e) => {
  formData.value.end_time = parseInt(e)
}

const changeRangeAttack = (e) => {
  formData.player_attack_min = e[0]
  formData.player_attack_max = e[1]
}

const closeAddUserDialog = () => {
  formData.value = {
    boss_hp: 1,
    boss_attack_max: 1,
    boss_attack_min: 1,
    is_enabled: 0,
  }
  dialogVisible.value = false
}

const enterAddUserDialog = () => {
  const res = createBossSetting(formData.value)
  if (res.code === 0) {
    closeAddUserDialog()
    getAllBossSetting()
  }
}

// =========== 表格控制部分 ===========
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})
const chooseImgVisible = ref(null)
const formData = ref({
  boss_hp: 1,
  boss_attack_max: 1,
  boss_attack_min: 1,
  is_enabled: 0,
})

const weekdaySelect = ref([
  {
    value: 1,
    label: '周一'
  },
  {
    value: 2,
    label: '周二'
  },
  {
    value: 3,
    label: '周三'
  },
  {
    value: 4,
    label: '周四'
  },
  {
    value: 5,
    label: '周五'
  },
  {
    value: 6,
    label: '周六'
  },
  {
    value: 7,
    label: '周日'
  },
])

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
  border-radius: 8px;
  .image-select-img {
    width: 240px;
    height: 120px;border: 1px dashed #303133;
    border-radius: 10px;
  }
}
</style>
