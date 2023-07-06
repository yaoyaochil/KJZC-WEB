<template>
  <div class="wx-login">
    <el-button @click="clear">解除绑定</el-button>
  </div>

</template>

<script setup>
import { ElMessage } from 'element-plus'
import { clearWx } from '@/view/login/api'

const clear = async() => {
  const res = await clearWx()
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
}

</script>

<style lang="scss" scoped>
.wx-login {
    display: inline-block;
    .scan-ercode{
        ::v-deep(iframe){
            border: 0;
        }
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
}
</style>
