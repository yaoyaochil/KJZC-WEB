<template>
  <div class="wx-login">
    <div class="scan-ercode">
      <div v-if="timeout" @click="scan">
        验证码失效，请重新获取
      </div>
      <img v-else :src="wxUrl" width="250" @click="scan">
    </div>
  </div>

</template>

<script setup>
import { nextTick, ref, defineExpose } from 'vue'
import { getLoginPic, loginOrCreate } from '@/view/login/api/index.js'
import { createUniqueId } from '@/view/login/utils/createUniqueId.js'
import { ElMessage } from 'element-plus'

const wxUrl = ref('')
const timeout = ref(false)

const timer = ref(null)
const scan = async() => {
  const loginFlag = createUniqueId(6)
  const state = window.localStorage.getItem('token') || undefined
  await nextTick()
  const res = await getLoginPic({ loginFlag, state })
  if (res.code === 0) {
    timeout.value = false
    clearTimer()
    setTimeout(() => {
      timeout.value = true
    }, 250 * 1000)
    wxUrl.value = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${res.data.ticket}`
    timer.value = setInterval(() => {
      polling(loginFlag, state)
    }, 2000)
  }
}

scan()

const polling = async(loginFlag, state) => {
  const res = await loginOrCreate({ loginFlag, state })
  if (res.code === 0) {
    if (res.data.scan) {
      ElMessage.success(res.msg)
      clearInterval(timer.value)
      timer.value = null
      if (res.data.needRegister) {
        registerForm.value.loginFlag = loginFlag
        registerVisible.value = true
      }
    }
    if (res.data.token) {
      ElMessage.success(res.msg)
      window.localStorage.setItem('token', res.data.token)
      window.location.reload()
    }
  } else {
    clearInterval(timer.value)
    timer.value = null
    timeout.value = true
  }
}

const clearTimer = () => {
  clearInterval(timer.value)
}

const registerVisible = ref(false)

const registerForm = ref({
  username: '',
  password: '',
  loginFlag: '',
})
defineExpose({
    scan,
})

</script>

<style lang="scss" scoped>
.wx-login {
  display: inline-block;

  .scan-ercode {
    ::v-deep(iframe) {
      border: 0;
    }

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img {
      cursor: pointer;
      border: 1px dashed #ccc;
      border-radius: 4px;
    }

    div {
      display: inline-flex;
      width: 250px;
      height: 250px;
      align-items: center;
      justify-content: center;
      border: 1px dashed #ccc;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
</style>
