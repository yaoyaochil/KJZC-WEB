<template>
  <div id="userLayout">
    <div class="login_panel">
      <el-tabs v-model="activeName" class="login_panel_form" @tab-change="changeTables">
        <el-tab-pane label="账号密码登陆" name="account">
          <div class="login_panel_form_title">
            <img
              class="login_panel_form_title_logo"
              :src="$BODO_ADMIN.appLogo"
              alt
            >
            <p class="login_panel_form_title_p">{{ $BODO_ADMIN.appName }}</p>
          </div>
          <el-form
            ref="loginForm"
            :model="loginFormData"
            :rules="rules"
            :validate-on-rule-change="false"
            @keyup.enter="submitForm"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginFormData.username"
                placeholder="请输入用户名"
              >
                <template #suffix>
                  <span class="input-icon">
                    <el-icon>
                      <user />
                    </el-icon>
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginFormData.password"
                :type="lock === 'lock' ? 'password' : 'text'"
                placeholder="请输入密码"
              >
                <template #suffix>
                  <span class="input-icon">
                    <el-icon>
                      <component
                        :is="lock"
                        @click="changeLock"
                      />
                    </el-icon>
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <div class="vPicBox">
                <el-input
                  v-model="loginFormData.captcha"
                  placeholder="请输入验证码"
                  style="width: 60%"
                />
                <div class="vPic">
                  <img
                    v-if="picPath"
                    :src="picPath"
                    alt="请输入验证码"
                    @click="loginVerify()"
                  >
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <!--            <el-button-->
              <!--              type="primary"-->
              <!--              style="width: 46%"-->
              <!--              size="large"-->
              <!--              @click="checkInit"-->
              <!--            >前往初始化</el-button>-->
              <el-button
                type="primary"
                size="large"
                style="width: 46%; margin-left: 8%"
                @click="submitForm"
              >登 录</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="微信登陆" name="wechat" :lazy="true">
          <div style="width: 100%;display: flex;justify-content: center;align-items: center;margin-top: 5%">
            <wx-login :ref="wxRef" />
          </div>

          <text style="margin-top:5%;font-size: 14px;width: 100%;justify-content: center;display: flex;align-items: center;color: gray">微信 扫一扫 登陆</text>
        </el-tab-pane>

      </el-tabs>

      <div class="login_panel_right" />
      <div class="login_panel_foot">
        <div class="links">
          <!--          <a href="http://doc.henrongyi.top/" target="_blank">-->
          <!--            <img src="@/assets/docs.png" class="link-icon">-->
          <!--          </a>-->
          <!--          <a href="https://support.qq.com/product/371961" target="_blank">-->
          <!--            <img src="@/assets/kefu.png" class="link-icon">-->
          <!--          </a>-->
          <!--          <a-->
          <!--            href="https://github.com/flipped-aurora/bodoadmin"-->
          <!--            target="_blank"-->
          <!--          >-->
          <!--            <img src="@/assets/github.png" class="link-icon">-->
          <!--          </a>-->
          <!--          <a href="https://space.bilibili.com/322210472" target="_blank">-->
          <!--            <img src="@/assets/video.png" class="link-icon">-->
          <!--          </a>-->
        </div>
        <div class="copyright">
          <BottomInfo />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
}
</script>

<script setup>
import { captcha } from '@/api/user'
import { checkDB } from '@/api/initdb'
import BottomInfo from '@/view/layout/bottomInfo/bottomInfo.vue'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/pinia/modules/user'
import wxLogin from '@/view/login/components/login.vue'
import $BODO_ADMIN from '@/core/config'
const router = useRouter()

// 微信登陆ref
const wxRef = ref(null)

// 默认table页面
const activeName = ref('account')

// 选择Table
const changeTables = (tabName) => {
  if (tabName === 'wechat') {
    wxRef.value.scan()
  }
}

// 验证函数
const checkUsername = (rule, value, callback) => {
  if (value.length < 5) {
    return callback(new Error('请输入正确的用户名'))
  } else {
    callback()
  }
}
const checkPassword = (rule, value, callback) => {
  if (value.length < 6) {
    return callback(new Error('请输入正确的密码'))
  } else {
    callback()
  }
}

// 获取验证码
const loginVerify = () => {
  captcha({}).then(async(ele) => {
    rules.captcha.push({
      max: ele.data.captchaLength,
      min: ele.data.captchaLength,
      message: `请输入${ele.data.captchaLength}位验证码`,
      trigger: 'blur',
    })
    picPath.value = ele.data.picPath
    loginFormData.captchaId = ele.data.captchaId
  })
}
loginVerify()

// 登录相关操作
const lock = ref('lock')
const changeLock = () => {
  lock.value = lock.value === 'lock' ? 'unlock' : 'lock'
}

const loginForm = ref(null)
const picPath = ref('')
const loginFormData = reactive({
  username: '',
  password: '',
  captcha: '',
  captchaId: '',
})
const rules = reactive({
  username: [{ validator: checkUsername, trigger: 'blur' }],
  password: [{ validator: checkPassword, trigger: 'blur' }],
  captcha: [
    {
      message: '验证码格式不正确',
      trigger: 'blur',
    },
  ],
})

const userStore = useUserStore()
const login = async() => {
  return await userStore.LoginIn(loginFormData)
}
const submitForm = () => {
  loginForm.value.validate(async(v) => {
    if (v) {
      const flag = await login()
      if (!flag) {
        loginVerify()
      }
    } else {
      ElMessage({
        type: 'error',
        message: '请正确填写登录信息',
        showClose: true,
      })
      loginVerify()
      return false
    }
  })
}

// 跳转初始化
const checkInit = async() => {
  const res = await checkDB()
  if (res.code === 0) {
    if (res.data?.needInit) {
      userStore.NeedInit()
      router.push({ name: 'Init' })
    } else {
      ElMessage({
        type: 'info',
        message: '已配置数据库信息，无法初始化',
      })
    }
  }
}

</script>

<style lang="scss" scoped>
@import "@/style/newLogin.scss";
</style>
