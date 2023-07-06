<template>
  <div class="page">
    <div class="bodo-card-box">
      <div class="bodo-card bodo-top-card">
        <div class="bodo-top-card-left">
          <!--          <div class="bodo-top-card-left-title">祝你愉快的度过每一天</div>-->
          <div class="bodo-top-card-left-dot">{{ weatherInfo }}</div>
          <div class="bodo-top-card-left-rows">
            <el-row>
              <el-col :span="8" :xs="24" :sm="8">
                <div class="flex-center">
                  <div class="statistic-card">
                    <el-statistic :value="dashBoardData.dodoUserCount.total">
                      <template #title>
                        <div style="display: inline-flex; align-items: center">
                          <el-icon class="dashboard-icon">
                            <Avatar />
                          </el-icon>
                          社区成员总数
                          <el-tooltip effect="dark" content="数据来自DoDo社区实时数据" placement="top">
                            <el-icon style="margin-left: 4px" :size="12">
                              <Warning />
                            </el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-statistic>
                    <div class="statistic-footer">
                      <div class="footer-item">
                        <span>较昨日</span>
                        <span :class="dashBoardData.dodoUserCount.today >= 0 ? 'green' : 'red'">
                          {{ dashBoardData.dodoUserCount.today }}%
                          <el-icon>
                            <CaretTop v-if="dashBoardData.dodoUserCount.today >= 0"/>
                            <CaretBottom v-if="dashBoardData.dodoUserCount.today < 0"/>
                          </el-icon>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8" :xs="24" :sm="8">
                <div class="flex-center">
                  <div class="statistic-card">
                    <el-statistic :value="dashBoardData.userCount.total">
                      <template #title>
                        <div style="display: inline-flex; align-items: center">
                          <el-icon class="dashboard-icon">
                            <Avatar />
                          </el-icon>
                          系统成员总数
                          <el-tooltip effect="dark" content="数据来自系统实时统计" placement="top">
                            <el-icon style="margin-left: 4px" :size="12">
                              <Warning />
                            </el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-statistic>
                    <div class="statistic-footer">
                      <div class="footer-item">
                        <span>较昨日</span>
                        <span :class="dashBoardData.userCount.today >= 0 ? 'green' : 'red'">
                          {{ dashBoardData.userCount.today }}%
                          <el-icon>
                            <CaretTop v-if="dashBoardData.userCount.today >= 0"/>
                            <CaretBottom v-if="dashBoardData.userCount.today < 0"/>
                          </el-icon>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8" :xs="24" :sm="8">
                <div class="flex-center">
                  <div class="statistic-card">
                    <el-statistic :value="dashBoardData.goodRate.total">
                      <template #title>
                        <div style="display: inline-flex; align-items: center">
                          <el-icon class="dashboard-icon">
                            <sort />
                          </el-icon>
                          总会员积分
                          <el-tooltip effect="dark" content="数据由窥镜后台统一提供" placement="top">
                            <el-icon style="margin-left: 4px" :size="12">
                              <Warning />
                            </el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-statistic>
                    <div class="statistic-footer">
                      <div class="footer-item">
                        <span>较昨日</span>
                        <span :class="dashBoardData.goodRate.today >= 0 ? 'green' : 'red'">
                          {{dashBoardData.goodRate.today}}%
                          <el-icon>
                            <CaretTop v-if="dashBoardData.goodRate.today >= 0"/>
                            <CaretBottom v-if="dashBoardData.goodRate.today < 0"/>
                          </el-icon>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div>
            <div class="bodo-top-card-left-item">
              窥镜之城官网：
              <a
                style="color:#409EFF"
                target="view_window"
                href="http://kjzc.club/"
              >点击前往 click 🖕🏻</a>
            </div>
          </div>
        </div>
        <img src="../../assets/dashboard.svg" class="bodo-top-card-right" alt>
      </div>
    </div>
    <div class="bodo-card-box">
      <el-card class="bodo-card quick-entrance">
        <template #header>
          <div class="card-header">
            <span>快捷入口</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col
            v-for="(card, key) in toolCards"
            :key="key"
            :span="4"
            :xs="8"
            class="quick-entrance-items"
            @click="toTarget(card.name)"
          >
            <div class="quick-entrance-item">
              <div class="quick-entrance-item-icon" :style="{ backgroundColor: card.bg }">
                <el-icon>
                  <component :is="card.icon" :style="{ color: card.color }" />
                </el-icon>
              </div>
              <p>{{ card.label }}</p>
            </div>
          </el-col>
        </el-row>
      </el-card>
    <!-- <div class="quick-entrance-title"></div> -->
    </div>
    <div class="bodo-card-box">
      <div class="bodo-card">
        <div class="card-header">
          <span>数据统计</span>
        </div>
        <div class="echart-box">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="18">
              <echarts-line />
            </el-col>
            <!--            <el-col :xs="24" :sm="6">-->
            <!--              <dashboard-table />-->
            <!--            </el-col>-->
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EchartsLine from '@/view/dashboard/dashboardCharts/echartsLine.vue'
// import DashboardTable from '@/view/dashboard/dashboardTable/dashboardTable.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWeatherInfo } from '@/view/dashboard/weather.js'
import { getUserCount } from '@/api/user.js'
import { getCommunityMemberCount } from '@/plugin/dodo/api/member_api.js'

const dashBoardData = ref({
  userCount: {
    total: 0,
    today: 0
  },
  dodoUserCount: {
    total: 0,
    today: 0
  },
  goodRate: {
    total: 0,
    today: 0
  }
})

// 获取用户总数
const getUserCountData = async() => {
  const res = await getUserCount()
  if (res.code === 0) {
    console.log(res.data.total)
    dashBoardData.value.userCount.total = res.data.total
  }
}

getUserCountData()

// 获取社区成员总数
const getCommunityMemberCountData = async() => {
  const res = await getCommunityMemberCount()
  if (res.code === 0) {
    console.log(res.data.total)
    dashBoardData.value.dodoUserCount.total = res.data
  }
}
getCommunityMemberCountData()
const weatherInfo = useWeatherInfo()

const toolCards = ref([
  {
    label: '用户管理',
    icon: 'monitor',
    name: 'user',
    color: '#ff9c6e',
    bg: 'rgba(255, 156, 110,.3)'
  },
  {
    label: '角色管理',
    icon: 'setting',
    name: 'authority',
    color: '#69c0ff',
    bg: 'rgba(105, 192, 255,.3)'
  },
  {
    label: '菜单管理',
    icon: 'menu',
    name: 'menu',
    color: '#b37feb',
    bg: 'rgba(179, 127, 235,.3)'
  },
  {
    label: '分包开发',
    icon: 'set-up',
    name: 'autoPlug',
    color: '#b37feb',
    bg: 'rgba(179, 127, 235,.3)'
  },
  {
    label: '个人中心',
    icon: 'user',
    name: 'person',
    color: '#ff9c6e',
    bg: 'rgba(255, 156, 110,.3)'
  }
])

const router = useRouter()

const toTarget = (name) => {
  router.push({ name })
}

</script>
<script>
export default {
  name: 'Dashboard'
}
</script>

<style lang="scss" scoped>
@mixin flex-center {
    display: flex;
    align-items: center;
}
.page {
    background: #f0f2f5;
    padding: 0;
    .bodo-card-box{
      padding: 12px 16px;
      &+.bodo-card-box{
        padding-top: 0px;
      }
    }
    .bodo-card {
      box-sizing: border-box;
        background-color: #fff;
        border-radius: 2px;
        height: auto;
        padding: 26px 30px;
        overflow: hidden;
        box-shadow: 0 0 7px 1px rgba(0, 0, 0, 0.03);
    }
    .bodo-top-card {
        height: 260px;
        @include flex-center;
        justify-content: space-between;
        color: #777;
        &-left {
          height: 100%;
          display: flex;
          flex-direction: column;
            &-title {
                font-size: 22px;
                color: #343844;
            }
            &-dot {
                font-size: 16px;
                color: #6B7687;
                margin-top: 24px;
            }
            &-rows {
                // margin-top: 15px;
                margin-top: 18px;
                color: #6B7687;
                width: 600px;
                align-items: center;
            }
            &-item{
              +.bodo-top-card-left-item{
                margin-top: 24px;
              }
              margin-top: 14px;
            }
        }
        &-right {
            height: 500px;
            width: 500px;
          margin-top: 20px;
        }
    }
     ::v-deep(.el-card__header){
          padding:0;
          border-bottom: none;
        }
        .card-header{
          padding-bottom: 20px;
          border-bottom: 1px solid #e8e8e8;
        }
    .quick-entrance-title {
        height: 30px;
        font-size: 22px;
        color: #333;
        width: 100%;
        border-bottom: 1px solid #eee;
    }
    .quick-entrance-items {
        @include flex-center;
        justify-content: center;
        text-align: center;
        color: #333;
        .quick-entrance-item {
          padding: 16px 28px;
          margin-top: -16px;
          margin-bottom: -16px;
          border-radius: 4px;
          transition: all 0.2s;
          &:hover{
            box-shadow: 0px 0px 7px 0px rgba(217, 217, 217, 0.55);
          }
            cursor: pointer;
            height: auto;
            text-align: center;
            // align-items: center;
            &-icon {
                width: 50px;
                height: 50px !important;
                border-radius: 8px;
                @include flex-center;
                justify-content: center;
                margin: 0 auto;
                i {
                    font-size: 24px;
                }
            }
            p {
                margin-top: 10px;
                font-size: 14px;
                color: gray;
              font-weight: bolder;
            }
        }
    }
    .echart-box{
      padding: 14px;
    }
}
.dashboard-icon {
    font-size: 15px;
    color: rgb(85, 160, 248);
    height: 30px;
    margin-right: 10px;
    @include flex-center;
}
.flex-center {
    @include flex-center;
}

//小屏幕不显示右侧，将登录框居中
@media (max-width: 750px) {
    .bodo-card {
        padding: 20px 10px !important;
        .bodo-top-card {
            height: auto;
            &-left {
                &-title {
                    font-size: 20px !important;
                }
                &-rows {
                    margin-top: 15px;
                    align-items: center;
                }
            }
            &-right {
                display: none;
            }
        }
        .bodo-middle-card {
            &-item {
                line-height: 20px;
            }
        }
        .dashboard-icon {
            font-size: 18px;
        }
    }
}

// 统计组件
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  height: 100%;
  //padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 1.05vw;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}
::v-deep(.el-statistic__number){
  margin-left: 1.6vw;
}

.green {
  color: var(--positive-color,#67c23a);
}
.red {
  color: var(--el-color-error);
}
</style>
