<template>
  <div>
    <el-drawer v-model="drawer" :title="`正在操作 用户 ${userInfo.userName} 背包`" size="650px">
      <warning-bar
        title="玩家背包系统/可查看或操作玩家背包物品，需慎重操作，操作不可逆"
      />
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
            <div class="item-btn-group">
              <el-button class="btn-border-blue" size="small" type="danger" @click="open_dia(false,item)">扣减数量</el-button>
              <el-button class="btn-border-red" size="small" type="primary" @click="open_dia(true,item)">增加数量</el-button>
            </div>
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
    <el-dialog v-model="diaVisible" :title="diaTitle" width="220" :align-center="true">
      <warning-bar
        title="注意操作窗口标题"
      />
      <div class="dia-content">
        <el-form ref="FormVisible" :model="form" :rules="rules">
          <el-form-item name="have_num" label="数量">
            <div style="display: flex; justify-content: center;width: 100%">
              <el-input-number v-model="form.have_num" class="custom-input-num" size="small" />
            </div>
          </el-form-item>
          <el-form-item>
            <div style="display: flex; justify-content: center;width: 100%">
              <el-button size="small" @click="diaCancel">取消</el-button>
              <el-button size="small" type="primary" @click="submitItem">确定</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import WarningBar from '@/components/warningBar/warningBar.vue'
import { getPlayerItemListByPage } from '@/plugin/game/api/player'
import { giveItemToUser, deductItemFromUser } from '@/plugin/game/api/player'
import { ElMessage } from 'element-plus'

const form = ref({
  have_num: 0,
  game_item_id: 0,
  bodo_user_id: 0
})
const drawer = ref(false)
const userid = ref(0)
const search = ref({})
const page = ref(1)
const total = ref(0)
const pageSize = ref(20)
const itemList = ref([])

const userInfo = ref({
  userName: ''
})

const diaVisible = ref(false)
const FormVisible = ref()
const diaTitle = ref('')

const rules = ref({
  have_num: [
    { required: true, message: '请输入数量', trigger: 'blur' }
  ]
})

const diaCancel = () => {
  // 初始化数据
  form.value.have_num = 0
  form.value.game_item_id = 0
  diaTitle.value = ''
  diaVisible.value = false
}

const open_dia = (type, item_info) => {
  if (type) {
    // 扣减
    form.value.have_num = 0
    form.value.game_item_id = item_info.game_item_id
    diaTitle.value = '增加数量'
  } else {
    form.value.have_num = 0
    form.value.game_item_id = item_info.game_item_id
    diaTitle.value = '扣减数量'
    console.log(form.value.game_item_id)
    // 增加
  }
  diaVisible.value = true
}

const submitItem = async() => {
  if (form.value.have_num <= 0) {
    ElMessage.error('数量必须大于0')
    return
  }
  if (diaTitle.value === '增加数量') {
    const res = await giveItemToUser({ ...form.value, bodo_user_id: userid.value })
    if (res.code === 0) {
      form.value.have_num = 0
      form.value.game_item_id = 0
      diaVisible.value = false
      await open(userid.value)
      ElMessage.success('增加成功')
    }
  } else {
    const res = await deductItemFromUser({ ...form.value, bodo_user_id: userid.value })
    if (res.code === 0) {
      form.value.have_num = 0
      form.value.game_item_id = 0
      diaVisible.value = false
      await open(userid.value)
      ElMessage.success('扣减成功')
    }
  }
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  open(userid.value)
}

const handleCurrentChange = (val) => {
  page.value = val
  open(userid.value)
}

const open = async(id, userName) => {
  userid.value = id
  userInfo.value.userName = userName
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
		text-align: center;
    .img-title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
    }

		.item-btn-group {
			padding-top: 5px;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			.el-button--small {
				min-height: 0;
				line-height: 20px;
				width: 50px;
				font-size: 10px!important;
			}
			.btn-border-blue {
				// 虚线边框
				border: 1px dashed #409eff;
			}
			.btn-border-red {
				// 虚线边框
				border: 1px dashed #f56c6c;
			}
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

.custom-input-num {
	.el-form-item__content {
		flex: none!important;
	}
}
</style>
