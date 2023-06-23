import service from '@/utils/request'

// getCommunityMemberList 分页获取社区成员列表
export const getCommunityMemberList = (data) => {
  return service({
    url: '/dodo/getUserList',
    method: 'post',
    data,
  })
}

// 绑定DoDo账号
export const bindDodo = (data) => {
  return service({
    url: '/dodo/bindDoDo',
    method: 'post',
    data,
  })
}

// 解绑DoDo账号
export const unbindDodo = (data) => {
  return service({
    url: '/dodo/unBindDoDo',
    method: 'post',
    data,
  })
}

// 获取验证码信息
export const getVerifyCode = (params) => {
  return service({
    url: '/dodo/getDoDoValidateCode',
    method: 'get',
    params,
  })
}

// 检查是否绑定
export const checkDoDoBind = () => {
  return service({
    url: '/dodo/getDoDoUserIsBind',
    method: 'get',
  })
}

// 同步社区成员
export const syncCommunityMember = () => {
  return service({
    url: '/dodo/syncMembers',
    method: 'post',
  })
}

// 获取社区成员数量
export const getCommunityMemberCount = () => {
  return service({
    url: '/dodo/getDoDoUserCount',
    method: 'get',
  })
}
