<template>
  <div>
    <el-drawer v-model="drawer" title="图片资源" size="650px">
      <warning-bar
        title="点击“文件名/备注”可以编辑文件名或者备注内容。"
      />
      <div class="bodo-btn-list">
        <el-upload
          :action="`${path}/dodo/uploadImage`"
          :headers="{ 'x-token': userStore.token }"
          :show-file-list="false"
          :on-success="handleImageSuccess"
          :before-upload="beforeImageUpload"
          :multiple="false"
          style="margin-left: 12px"
        >
          <el-button size="small" type="primary" :loading="upLoading">压缩上传</el-button>
        </el-upload>
        <el-form ref="searchForm" :inline="true" :model="search">
          <el-form-item label="">
            <el-input v-model="search.imageName" class="keyword" placeholder="请输入文件名或备注" />
          </el-form-item>

          <el-form-item>
            <el-button size="small" type="primary" icon="search" @click="open">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="media">
        <div v-for="(item,key) in picList" :key="key" class="media-box">
          <div class="header-img-box-list">
            <el-image
              :key="key"
              :src="(item.url && item.url.slice(0, 4) !== 'http')?path+item.url:item.url"
              @click="chooseImg(item.url,target,targetKey)"
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
          <div class="img-title" @click="editFileNameFunc(item)">{{ item.imageName }}</div>
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
import { ref, defineEmits } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import WarningBar from '@/components/warningBar/warningBar.vue'
import { useUserStore } from '@/pinia/modules/user'
import ImageCompress from '@/utils/image'
import { getImageList, updateImage } from '@/plugin/game/api/upload'

const userStore = useUserStore()
const path = ref(import.meta.env.VITE_BASE_API)
const drawer = ref(false)

const search = ref({})
const page = ref(1)
const total = ref(0)
const pageSize = ref(20)

const picList = ref([])

// 上传图片
const fileSize = ref(512)
const maxWH = ref(1080)
const upLoading = ref(false)

const emit = defineEmits(['enterImg'])
defineProps({
  target: {
    type: Object,
    default: null,
  },
  targetKey: {
    type: String,
    default: '',
  },
})

const chooseImg = (url, target, targetKey) => {
  if (target && targetKey) {
    target[targetKey] = url
  }
  emit('enterImg', url)
  drawer.value = false
}

/**
 * 编辑文件名或者备注
 * @param row
 * @returns {Promise<void>}
 */
const editFileNameFunc = async(row) => {
  ElMessageBox.prompt('请输入文件名或者备注', '编辑', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /\S/,
    inputErrorMessage: '不能为空',
    inputValue: row.imageName
  }).then(async({ value }) => {
    row.imageName = value
    // console.log(row)
    const res = await updateImage(row)
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '编辑成功!',
      })
      await open()
    }
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '取消修改'
    })
  })
}

const beforeImageUpload = (file) => {
  upLoading.value = true
  const isJPG = file.type === 'image/jpeg'
  const isPng = file.type === 'image/png'
  const isWebp = file.type === 'image/webp'
  if (!isJPG && !isPng && !isWebp) {
    ElMessage.error('上传头像图片只能是 jpg、png、webp 格式!')
    return false
  }

  const isRightSize = file.size / 1024 < fileSize
  if (!isRightSize) {
    // 压缩
    const compress = new ImageCompress(file, fileSize, maxWH)
    return compress.compress()
  }
  return isRightSize
}

const handleImageSuccess = (res) => {
  if (res.code !== 0) {
    ElMessage.error(res.msg)
    upLoading.value = false
    return
  }
  upLoading.value = false
  open()
  // const { data } = res
  // if (data.file) {
  //   emit('on-success', data.file.url)
  // }
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  open()
}

const handleCurrentChange = (val) => {
  page.value = val
  open()
}

const open = async() => {
  const res = await getImageList({ page: page.value, pageSize: pageSize.value, ...search.value })
  if (res.code === 0) {
    picList.value = res.data.list
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
