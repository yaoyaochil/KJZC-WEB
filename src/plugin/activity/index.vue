<template>
  <div class="page">
    <div class="bodo-card-box">
      <el-card class="bodo-card quick-entrance">
        <template #header>
          <div class="card-header">
            <span>系统活动配置</span>
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
              <div class="quick-entrance-item-icon">
                <img :src="card.img_url" alt="" style="width: 200px; height: 100px; border-radius: 8px;">
              </div>
              <p>{{ card.label }}</p>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <!-- <div class="quick-entrance-title"></div> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const toolCards = ref([
  {
    label: 'BOSS地狱恶犬',
    img_url: 'https://huaduogiegie.oss-cn-shanghai.aliyuncs.com/picgo/202307011117353.jpg',
    name: 'user',
    color: '#ff9c6e',
    bg: 'rgba(255, 156, 110,.3)'
  }
])

const toTarget = (name) => {
  router.push({ name })
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
      border-radius: 10px;
      transition: all 0.2s;
      // 周围虚线包围
       box-shadow: 0 0 7px 0 rgba(66, 61, 61, 0.55);
      &:hover{
        box-shadow: 0 0 7px 0 rgba(217, 217, 217, 0.55);
      }
      cursor: pointer;
      height: auto;
      text-align: center;
    // align-items: center;
      p {
        margin-top: 10px;
        font-weight: bold;
        color: #494141;
      }
    }
  }
}
</style>
