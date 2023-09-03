<template>
  <div>
    <div class="bodo-table-box">
      <div class="bodo-btn-list">
        <el-button size="small" type="primary" icon="refresh" @click="createBoss">创建副本</el-button>
      </div>

      <el-table ref="multipleTable" style="width: 100%" tooltip-effect="light" :data="tableData" row-key="ID">
        <el-table-column align="center" label="创建日期">
          <template #default="scope">
            {{ formatDate(scope.row.CreatedAt) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="副本名称" prop="game_title" />
        <el-table-column align="center" label="副本图片" width="120">
          <template #default="scope">
            <div style="display: flex;align-items: center;justify-content: center">
              <el-image class="game_img" :src="scope.row.game_image" />
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="启动时间" prop="weekday">
          <template #default="scope">
            每{{ formatWeekDay(scope.row.weekday) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="游戏开始时间" prop="start_time">
          <template #default="scope">
            {{ scope.row.start_time }}:00
          </template>
        </el-table-column>
        <el-table-column align="center" label="游戏结束时间" prop="end_time">
          <template #default="scope">
            {{ scope.row.end_time }}:00
          </template>
        </el-table-column>
        <el-table-column align="center" label="奖励规则">
          <template #default="scope">
            <div class="snake-wrapper">
              <span>{{ scope.row.reward_rule.reward_name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dodo_channel.channelName" align="center" label="生效频道">
          <template #default="scope">
            <div>
              <div style="color: #606266;font-weight: bold">{{ scope.row.dodo_channel.groupName }}</div>
              <div style="color: #42b983">{{ scope.row.dodo_channel.channelName }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="最后更新">
          <template #default="scope">
            {{ formatDate(scope.row.UpdatedAt) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="按钮组">
          <template #default="scope">
            <el-button class="table-button" size="small" :type="scope.row.is_enabled === 1 ? 'danger' : 'warning'" @click="updateSetting(scope.row)">
              <span v-if="scope.row.is_enabled === 0">启用副本</span>
              <span v-if="scope.row.is_enabled === 1">停止副本</span>
            </el-button>
            <el-button class="table-button" link size="small" type="primary" @click="updateSetting(scope.row)">修改配置</el-button>
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
              <el-time-picker v-model="start_time" type="datetime" format="HH:mm" value-format="H" :picker-options="{selectableRange: ['08:00 - 23:00']}" @change="changeStartTime"/>
            </el-form-item>
            <el-form-item label="结束时间" label-width="120px">
              <el-time-picker v-model="end_time" type="datetime" format="HH:mm" value-format="H" @change="changeEndTime" />
            </el-form-item>
            <el-form-item label="卡片撤回时间（单位：秒）" label-width="200px">
              <el-slider v-model.number="formData.boss_card_withdraw_time" show-input :show-input-controls="false" show-stops :max="60" :min="1" show-tooltip />
            </el-form-item>
            <el-form-item label="结算奖励规则" label-width="120px">
              <el-select v-model="formData.reward_rule_id" filterable>
                <el-option
                  v-for="item in ruleList"
                  :key="item.reward_rule_id"
                  :label="item.reward_name"
                  :value="item.reward_rule_id"
                />
              </el-select>
              <el-button link type="primary" icon="refresh" style="float: right;margin-left: 5px" @click="refreshRuleList" />
            </el-form-item>
            <el-form-item label="生效频道" label-width="120px">
<!--              下拉选择-->
              <el-select v-model="formData.on_channel_id" filterable>
                <el-option
                  v-for="item in channelList"
                  :key="item.ChannelIdIndex"
                  :label="item.channelName"
                  :value="item.ChannelIdIndex"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10" :offset="2" style="float: right">
          <el-form :model="formData">
            <el-form-item label="Boss初始血量">
              <el-input-number v-model.number="formData.boss_hp" :min="1" size="large" />
            </el-form-item>
            <el-form-item label="Boss攻击力↑">
              <el-input-number v-model.number="formData.boss_attack_max" :min="1" size="large" />
            </el-form-item>
            <el-form-item label="Boss攻击力↓">
              <el-input-number v-model.number="formData.boss_attack_min" :min="1" size="large" />
            </el-form-item>
            <el-form-item label="阶段一血量百分比(单位: %)">
              <el-slider v-model.number="formData.boss_stage_threshold_one" show-input :show-input-controls="false" show-stops :max="100" :min="1" show-tooltip />
            </el-form-item>
            <el-form-item label="阶段二血量百分比(单位: %)">
              <el-slider v-model.number="formData.boss_stage_threshold_two" show-input :show-input-controls="false" show-stops :max="100" :min="1" show-tooltip />
            </el-form-item>
            <el-form-item label="阶段三血量百分比(单位: %)">
              <el-slider v-model.number="formData.boss_stage_threshold_three" show-input :show-input-controls="false" show-stops :max="100" :min="1" show-tooltip />
            </el-form-item>
            <el-form-item label="玩家最高血量">
              <el-slider v-model.number="formData.player_initial_hp" show-input :show-input-controls="false" show-stops :max="100" :min="1" show-tooltip />
            </el-form-item>
            <el-form-item label="玩家攻击范围">
              <el-slider v-model="range_attack" range-start-label="最小攻击力" range-end-label="最大攻击力" range show-stops :max="100" :min="1" show-tooltip @change="changeRangeAttack" />
            </el-form-item>
            <el-form-item label="VIP血量加成">
              <el-slider v-model.number="formData.vip_bonus_hp" show-input :show-input-controls="false" show-stops :max="100" :min="1" show-tooltip />
            </el-form-item>
            <el-form-item label="阶段一发动技能" />
            <el-form-item label="阶段二发动技能" />
          </el-form>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeAddUserDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterAddUserDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/format'
import {
  createBossSetting,
  updateBossSetting,
  deleteBossSettingById,
  getBossSettingById,
  getAllBossSetting
} from '@/plugin/game/api/api'
import { getChannelList } from '@/plugin/dodo/api/channel'
import { getRuleList } from '@/plugin/game/api/rule'
import WarningBar from '@/components/warningBar/warningBar.vue'
import ChooseImg from '@/plugin/game/components/chooseImg/index.vue'

// =========== dialog控制 ===========
const dialogVisible = ref(false)
const channelList = ref([])
const dialogFlag = ref('')
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

const enterAddUserDialog = async() => {
  if (dialogFlag.value === 'add') {
    const res = await createBossSetting(formData.value)
    if (res.code === 0) {
      closeAddUserDialog()
      ElMessage.success('添加成功')
      await getTableData()
    }
  }
  if (dialogFlag.value === 'edit') {
    formData.value.player_attack_min = range_attack.value[0]
    formData.value.player_attack_max = range_attack.value[1]
    const res = await updateBossSetting(formData.value)
    if (res.code === 0) {
      closeAddUserDialog()
      ElMessage.success('修改成功')
      await getTableData()
    }
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

// ==================== 新增和修改 ====================

// 获取规则列表
const ruleList = ref([])
const getRuleListData = async() => {
  const res = await getRuleList()
  if (res.code === 0) {
    ruleList.value = res.data.list
  }
}

const refreshRuleList = async() => {
  await getRuleListData()
}

// 创建副本
const createBoss = async() => {
  dialogFlag.value = 'add'
  dialogVisible.value = true
  await getRuleListData()
}

const updateSetting = async(row) => {
  const res = await getBossSettingById({ ID: row.ID })
  if (res.code === 0) {
    formData.value = res.data
    start_time.value = res.data.start_time.toString()
    end_time.value = res.data.end_time.toString()
    range_attack.value = [res.data.player_attack_min, res.data.player_attack_max]
  }
  const channelRes = await getChannelList()
  if (channelRes.code === 0) {
    channelList.value = channelRes.data.list
  }
  dialogFlag.value = 'edit'
  dialogVisible.value = true
  await getRuleListData()
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

// 格式化时间
const formatWeekDay = (row) => {
  switch (row) {
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
    case 7:
      return '周日'
    default:
      return ''
  }
}

// 禁用可选择的时间
const disabledDate = (row) => {
  console.log(row)
}
</script>

<style scoped lang="scss">
.game_img {
  padding: 0.1vw;
  /*background:#f3f5f5;*/
  border: 1px solid rgba(0, 0, 0, .06);
  border-radius: 15px;
}
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
