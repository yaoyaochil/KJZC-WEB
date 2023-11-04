<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="fl-left avatar-box">
          <div class="user-card">
            <div
              class="user-headpic-update"
              :style="{
                'background-image': `url(${
                  userStore.userInfo.headerImg &&
                  userStore.userInfo.headerImg.slice(0, 4) !== 'http'
                    ? path + userStore.userInfo.headerImg
                    : userStore.userInfo.headerImg
                })`,
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
              }"
            >
              <span class="update" @click="openChooseImg">
                <el-icon>
                  <edit />
                </el-icon>
                重新上传</span>
            </div>
            <div class="user-personality">
              <p v-if="!editFlag" class="nickName">
                {{ userStore.userInfo.nickName }} &nbsp;
                <el-icon class="pointer" color="#66b1ff" @click="openEdit">
                  <edit />
                </el-icon>
              </p>
              <p v-if="editFlag" class="nickName">
                <el-input v-model="nickName" />
                <el-icon class="pointer" color="#67c23a" @click="enterEdit">
                  <check />
                </el-icon>
                <el-icon class="pointer" color="#f23c3c" @click="closeEdit">
                  <close />
                </el-icon>
              </p>
              <p class="person-info">这个家伙很懒，什么都没有留下</p>
            </div>
            <div class="user-information">
              <ul>
                <li>
                  <p class="title">密保手机</p>
                  <p class="desc">
                    已绑定手机:{{ userStore.userInfo.phone }}
                    <a href="javascript:void(0)" @click="changePhoneFlag = true">立即修改</a>
                  </p>
                </li>
                <li>
                  <p class="title">密保邮箱</p>
                  <p class="desc">
                    已绑定邮箱：{{ userStore.userInfo.email }}
                    <a href="javascript:void(0)" @click="changeEmailFlag = true">立即修改</a>
                  </p>
                </li>
                <li>
                  <p class="title">修改密码</p>
                  <p class="desc">
                    修改个人密码
                    <a
                      href="javascript:void(0)"
                      @click="showPassword = true"
                    >修改密码</a>
                  </p>
                </li>
                <li>
                  <p class="title">绑定微信</p>
                  <p class="desc">
                    <span v-if="!noBindwx" style="color: crimson">未绑定</span>
                    <span v-if="noBindwx">绑定中</span>
                    <a
                      v-if="!noBindwx"
                      style="color: #42b983;"
                      href="javascript:void(0)"
                      @click="scan"
                    >绑定微信</a>
                    <a
                      v-if="noBindwx"
                      style="color: crimson;"
                      href="javascript:void(0)"
                      @click="clear"
                    >解除绑定</a>
                  </p>
                </li>
                <li>
                  <p class="title">绑定DoDo</p>
                  <p class="desc">
                    <span v-if="!noBindDoDo" style="color: crimson">未绑定</span>
                    <span v-if="noBindDoDo">绑定中</span>
                    <a
                      v-if="!noBindDoDo"
                      href="javascript:void(0)"
                      @click="DoDodialogVisible = true"
                    >绑定DoDo</a>
                    <a
                      v-if="noBindDoDo"
                      style="color: crimson;"
                      href="javascript:void(0)"
                      @click="clearDoDo"
                    >解除绑定</a>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="fl-right right-main" />
      </el-col>
    </el-row>

    <ChooseImg ref="chooseImgRef" @enter-img="enterImg" />

    <el-dialog
      v-model="showPassword"
      title="修改密码"
      width="360px"
      @close="clearPassword"
    >
      <el-form
        ref="modifyPwdForm"
        :model="pwdModify"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item :minlength="6" label="原密码" prop="password">
          <el-input v-model="pwdModify.password" show-password />
        </el-form-item>
        <el-form-item :minlength="6" label="新密码" prop="newPassword">
          <el-input v-model="pwdModify.newPassword" show-password />
        </el-form-item>
        <el-form-item :minlength="6" label="确认密码" prop="confirmPassword">
          <el-input v-model="pwdModify.confirmPassword" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            size="small"
            @click="showPassword = false"
          >取 消
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="savePassword"
          >确 定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="changePhoneFlag" title="绑定手机" width="600px">
      <el-form :model="phoneForm">
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="phoneForm.phone" placeholder="请输入手机号" autocomplete="off" />
        </el-form-item>
        <el-form-item label="验证码" label-width="120px">
          <div class="code-box">
            <el-input
              v-model="phoneForm.code"
              autocomplete="off"
              placeholder="请自行设计短信服务，此处为模拟随便写"
              style="width:300px"
            />
            <el-button size="small" type="primary" :disabled="time>0" @click="getCode">
              {{ time > 0 ? `(${time}s)后重新获取` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="closeChangePhone"
          >取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="changePhone"
          >更改</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="changeEmailFlag" title="绑定邮箱" width="600px">
      <el-form :model="emailForm">
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="emailForm.email" placeholder="请输入邮箱" autocomplete="off" />
        </el-form-item>
        <el-form-item label="验证码" label-width="120px">
          <div class="code-box">
            <el-input
              v-model="emailForm.code"
              placeholder="请自行设计邮件服务，此处为模拟随便写"
              autocomplete="off"
              style="width:300px"
            />
            <el-button size="small" type="primary" :disabled="emailTime>0" @click="getEmailCode">
              {{ emailTime > 0 ? `(${emailTime}s)后重新获取` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="closeChangeEmail"
          >取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="changeEmail"
          >更改</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="WxdialogVisible"
      title="绑定微信"
      width="30%"
      destroy-on-close
      @close="clearTimer"
    >
      <div class="scan-ercode">
        <div v-if="timeout" @click="scan">
          验证码已过期，请重新获取
        </div>
        <img v-else :src="wxUrl" width="250" @click="scan">
        <span style="margin-top: 0.6vw;color: gray;font-size: 0.6vw">使用微信扫码绑定</span>
      </div>

    </el-dialog>
    <el-dialog v-model="DoDodialogVisible" title="绑定DoDo社区账号" width="600px">
      <el-form :model="DoDoForm">
        <el-form-item label="DoDo社区账号" label-width="120px">
          <el-select
            v-model="DoDoForm.dodoId"
            filterable
            remote
            reserve-keyword
            placeholder="搜索账户"
            no-match-text="系统无此账户"
            remote-show-suffix
            :remote-method="getDoDoUserList"
            :loading="loading"
            style="width: 80%"
          >
            <el-option
              v-for="(item) in dodoUserList"
              :key="item.ID"
              :label="item.personalNickName"
              :value="item.dodoSourceId"
            >
              <span style="float: left">{{ item.personalNickName }}</span>
              <span style="margin-left: 5%;color: var(--el-text-color-secondary);font-size: 13px;">{{
                item.dodoSourceId
              }}</span>
              <span style="float: right;display: flex;align-items: center;justify-content: center">
                <el-avatar :size="30" :src="item.avatarUrl" />
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="DoDo验证码" label-width="120px">
          <div class="code-box">
            <el-input
              v-model="DoDoForm.code"
              placeholder="请输入验证码"
              autocomplete="off"
              style="width:200px"
            />
            <el-button
              style="margin-left: 0.2vw"
              size="small"
              type="primary"
              :disabled="DoDoTime>0"
              @click="getDoDoCode"
            >
              {{ DoDoTime > 0 ? `(${DoDoTime}s)后重新获取` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            size="small"
            @click="closeBindDoDo"
          >取消</el-button>
          <el-button
            type="primary"
            size="small"
            @click="bindDoDoAccount"
          >绑定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Person'
}
</script>

<script setup>
import ChooseImg from '@/components/chooseImg/index.vue'
import { setSelfInfo, changePassword } from '@/api/user.js'
import { reactive, ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/pinia/modules/user'
import { createUniqueId } from '@/view/login/utils/createUniqueId'
import { clearWx, getLoginPic, loginOrCreate, checkBind } from '@/view/login/api'
import {
  bindDodo,
  checkDoDoBind,
  getCommunityMemberList,
  getVerifyCode,
  unbindDodo
} from '@/plugin/dodo/api/member_api'

// 微信绑定=====================================================================================
// 微信绑定状态 false未绑定 true已绑定
const noBindwx = ref(false)
const WxdialogVisible = ref(false)
const timer = ref(null)
const timeout = ref(false)
const wxUrl = ref('')
const registerVisible = ref(false)
const registerForm = ref({
  username: '',
  password: '',
  loginFlag: '',
})

// 检查是否绑定微信
const checkBindWx = async() => {
  const res = await checkBind()
  if (res.code === 0) {
    noBindwx.value = res.data
  }
}

checkBindWx()

// 开始扫码
const scan = async() => {
  WxdialogVisible.value = true
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
// 检查微信登陆状态
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
      WxdialogVisible.value = false
    }
    if (res.data.token) {
      ElMessage.success(res.msg)
      window.localStorage.setItem('token', res.data.token)
      window.location.reload()
    }
  } else {
    clearInterval(timer.value)
    timer.value = null
  }
}

// 清理定时器
const clearTimer = () => {
  clearInterval(timer.value)
  checkBindWx()
}
// 解绑微信
const clear = async() => {
  const res = await clearWx()
  if (res.code === 0) {
    await checkBindWx()
    ElMessage.success(res.msg)
  }
}
// 微信绑定=====================================================================================

// DoDo绑定=====================================================================================
// DoDo绑定状态 false未绑定 true已绑定
const noBindDoDo = ref(false)
const DoDodialogVisible = ref(false)
const DoDoTime = ref(0)
const DoDoForm = reactive({
  dodoId: '',
  code: '',
})
// 检查是否绑定
const clearDoDo = async() => {
  const res = await unbindDodo()
  if (res.code === 0) {
    await checkBindDoDo()
    ElMessage.success(res.msg)
  }
}

// 获取验证码
const getDoDoCode = async() => {
  if (DoDoForm.dodoId === '') {
    ElMessage.error('请先选择您的账户')
    return
  }
  DoDoTime.value = 60
  const res = await getVerifyCode({ DoDoUserSourceId: DoDoForm.dodoId })
  if (res.code === 0) {
    ElMessage.success(res.msg)
  }
  let timer = setInterval(() => {
    DoDoTime.value--
    if (DoDoTime.value <= 0) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

const loading = ref(false)
const dodoUserList = ref([])
// 远程搜索DoDo用户
const getDoDoUserList = async(query) => {
  if (query) {
    loading.value = true
    setTimeout(async() => {
      const pageInfo = {
        page: 1,
        size: 10,
        personalNickName: query,
      }
      const res = await getCommunityMemberList(pageInfo)
      if (res.code === 0) {
        loading.value = false
        dodoUserList.value = res.data.list
      }
    }, 500)
  } else {
    const pageInfo = {
      page: 1,
      pageSize: 10,
    }
    const res = await getCommunityMemberList(pageInfo)
    if (res.code === 0) {
      dodoUserList.value = res.data.list
    }
  }
}
getDoDoUserList()

const closeBindDoDo = () => {
  DoDodialogVisible.value = false
  DoDoForm.dodoId = ''
  DoDoForm.code = ''
}

// 检查是否绑定
const checkBindDoDo = async() => {
  const res = await checkDoDoBind()
  if (res.code === 0) {
    noBindDoDo.value = res.data
  }
}

checkBindDoDo()
const bindDoDoAccount = async() => {
  if (DoDoForm.dodoId === '' || DoDoForm.code === '') {
    ElMessage.error('请先输入账户和验证码')
    return
  }
  const res = await bindDodo({ DoDoUserSourceId: DoDoForm.dodoId, ValidateCode: DoDoForm.code })
  if (res.code === 0) {
    ElMessage.success(res.msg)
    closeBindDoDo()
    await checkBindDoDo()
  }
}

// DoDo绑定=====================================================================================

const path = ref(import.meta.env.VITE_BASE_API + '/')
const activeName = ref('second')
const rules = reactive({
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '最少6个字符', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '最少6个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码', trigger: 'blur' },
    { min: 6, message: '最少6个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== pwdModify.value.newPassword) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

const userStore = useUserStore()
const modifyPwdForm = ref(null)
const showPassword = ref(false)
const pwdModify = ref({})
const nickName = ref('')
const editFlag = ref(false)
const savePassword = async() => {
  modifyPwdForm.value.validate((valid) => {
    if (valid) {
      changePassword({
        password: pwdModify.value.password,
        newPassword: pwdModify.value.newPassword,
      }).then((res) => {
        if (res.code === 0) {
          ElMessage.success('修改密码成功！')
        }
        showPassword.value = false
      })
    } else {
      return false
    }
  })
}

const clearPassword = () => {
  pwdModify.value = {
    password: '',
    newPassword: '',
    confirmPassword: '',
  }
  modifyPwdForm.value.clearValidate()
}

const chooseImgRef = ref(null)
const openChooseImg = () => {
  chooseImgRef.value.open()
}

const enterImg = async(url) => {
  const res = await setSelfInfo({ headerImg: url })
  if (res.code === 0) {
    userStore.ResetUserInfo({ headerImg: url })
    ElMessage({
      type: 'success',
      message: '设置成功',
    })
  }
}

const openEdit = () => {
  nickName.value = userStore.userInfo.nickName
  editFlag.value = true
}

const closeEdit = () => {
  nickName.value = ''
  editFlag.value = false
}

const enterEdit = async() => {
  const res = await setSelfInfo({
    nickName: nickName.value
  })
  if (res.code === 0) {
    userStore.ResetUserInfo({ nickName: nickName.value })
    ElMessage({
      type: 'success',
      message: '设置成功',
    })
  }
  nickName.value = ''
  editFlag.value = false
}

const changePhoneFlag = ref(false)
const time = ref(0)
const phoneForm = reactive({
  phone: '',
  code: ''
})

const getCode = async() => {
  time.value = 60
  let timer = setInterval(() => {
    time.value--
    if (time.value <= 0) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

const closeChangePhone = () => {
  changePhoneFlag.value = false
  phoneForm.phone = ''
  phoneForm.code = ''
}

const changePhone = async() => {
  const res = await setSelfInfo({ phone: phoneForm.phone })
  if (res.code === 0) {
    ElMessage.success('修改成功')
    userStore.ResetUserInfo({ phone: phoneForm.phone })
    closeChangePhone()
  }
}

const changeEmailFlag = ref(false)
const emailTime = ref(0)
const emailForm = reactive({
  email: '',
  code: ''
})

const getEmailCode = async() => {
  emailTime.value = 60
  let timer = setInterval(() => {
    emailTime.value--
    if (emailTime.value <= 0) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
}

const closeChangeEmail = () => {
  changeEmailFlag.value = false
  emailForm.email = ''
  emailForm.code = ''
}

const changeEmail = async() => {
  const res = await setSelfInfo({ email: emailForm.email })
  if (res.code === 0) {
    ElMessage.success('修改成功')
    userStore.ResetUserInfo({ email: emailForm.email })
    closeChangeEmail()
  }
}

</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.right-main {
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  border-radius: 8px;
}

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

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-box {
  box-shadow: -2px 0 20px -16px;
  width: 100%;
  height: 100%;

  .user-card {
    min-height: calc(90vh - 200px);
    padding: 30px 20px;
    text-align: center;
    background-color: #fff;
    border-radius: 8px;
    flex-shrink: 0;

    .el-avatar {
      border-radius: 50%;
    }

    .user-personality {
      padding: 24px 0;
      text-align: center;

      p {
        font-size: 16px;
      }

      .nickName {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.8vw;
      }

      .person-info {
        margin-top: 0.5vw;
        font-size: 0.7vw;
        color: #999;
      }
    }

    .user-information {
      width: 100%;
      height: 100%;
      text-align: left;

      ul {
        display: inline-block;
        height: 100%;
        width: 100%;

        li {
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 1vw;

          i {
            margin-right: 8px;
          }

          .title {
            padding: 0.5vw;
            //font-size: 100%;
            // 大小自动变化
            font-size: 0.7vw;
            color: #696969;
            font-weight: bolder;
            background-color: #ffffff;
            // 外圈阴影
            box-shadow: 1px 1px 1px 1px rgba(31, 32, 35, 0.47);
            display: flex;
            width: 4vw;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            margin-bottom: 10px;
            margin-left: 1vw;
          }

          .desc {
            font-size: 0.6vw;
            margin-top: 0.6vw;
            margin-left: 1vw;
            color: #a9a9a9;

            a {
              color: rgb(64, 158, 255);
              float: right;
              margin-right: 1vw;
            }
          }

          &:last-child {
            border-bottom: none;
          }

          border-bottom: 2px solid #f0f2f5;
          padding: 20px 0;
          font-weight: 400;
          color: #606266;
        }
      }
    }
  }
}

.user-headpic-update {
  width: 120px;
  height: 120px;
  line-height: 120px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  border-radius: 20px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.62);

  &:hover {
    color: #5cacea;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(0, 0, 0, 0.15) 100%
    ),
    radial-gradient(
        at top center,
        rgba(255, 255, 255, 0.4) 0%,
        rgba(0, 0, 0, 0.4) 120%
    ) #989898;
    background-blend-mode: multiply, multiply;

    .update {
      color: #fff;
    }
  }

  .update {
    height: 120px;
    width: 120px;
    text-align: center;
    color: transparent;
  }
}

.pointer {
  cursor: pointer;
}

.code-box {
  display: flex;
  justify-content: space-between;
}
</style>
