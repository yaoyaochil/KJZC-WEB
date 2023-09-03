<template>
  <div>
    <el-drawer v-model="drawer" title="玩家背包" size="650px">
      <warning-bar
        title="玩家背包系统/可查看或操作玩家背包物品，需慎重操作，操作不可逆"
      />
      <!--      <div class="bodo-btn-list">-->
      <!--        <el-form ref="searchForm" :inline="true" :model="search">-->
      <!--          <el-form-item label="">-->
      <!--            <el-input v-model="search.imageName" class="keyword" placeholder="请输入文件名或备注" />-->
      <!--          </el-form-item>-->

      <!--          <el-form-item>-->
      <!--            <el-button size="small" type="primary" icon="search" @click="open">查询</el-button>-->
      <!--          </el-form-item>-->
      <!--        </el-form>-->
      <!--      </div>-->
      <div class="media">
        <div v-for="(item,key) in itemList" :key="key" class="media-box">
          <el-badge :value="item.have_num" type="primary">
            <div class="header-img-box-list">
              <el-image
                :key="key"
                :src="item.game_item.item_img"
              >
                <template #error>
                  <div class="header-img-box-list">
                    <el-icon>
                      <picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </div>
            <div class="img-title">{{ item.game_item.item_name }}</div>
          </el-badge>
        </div>
      </div>
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        :style="{'justify-content':'center'}"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-drawer>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import WarningBar from '@/components/warningBar/warningBar.vue'
import { getPlayerItemListByPage } from '@/plugin/game/api/player'

const drawer = ref(false)

const search = ref({})
const page = ref(1)
const total = ref(0)
const pageSize = ref(20)
const itemList = ref([])

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  open()
}

const handleCurrentChange = (val) => {
  page.value = val
  open()
}

const open = async(id) => {
  const res = await getPlayerItemListByPage({ bodo_user_id: id, page: page.value, pageSize: pageSize.value, ...search.value })
  if (res.code === 0) {
    itemList.value = res.data.list
    total.value = res.data.total
    page.value = res.data.page
    pageSize.value = res.data.pageSize
    drawer.value = true
  }
}
defineExpose({ open })
</script>
<style lang="scss">
.image-uploader {
  border: 1px dashed #d9d9d9;
  width: 180px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.image-uploader {
  border-color: #409eff;
}

.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.image {
  width: 178px;
  height: 178px;
  display: block;
}

.upload-btn-media-library {
  margin-left: 20px;
}

.media {
  display: flex;
  flex-wrap: wrap;

  .media-box {
    width: 120px;
    margin-left: 20px;

    .img-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }

    .header-img-box-list {
      width: 120px;
      height: 120px;
      border: 1px dashed #ccc;
      border-radius: 8px;
      text-align: center;
      line-height: 120px;
      cursor: pointer;
      overflow: hidden;

      .el-image__inner {
        max-width: 120px;
        max-height: 120px;
        vertical-align: middle;
        width: unset;
        height: unset;
      }
    }
  }
}
</style>
