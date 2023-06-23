import service from '@/utils/request'
// 同步DoDo身份组
export const syncDoDoRole = () => {
  return service({
    url: '/dodo/syncDoDoRole',
    method: 'post',
  })
}

// 同步DoDo成员对应身份组
export const syncDoDoMemberRole = () => {
  return service({
    url: '/dodo/syncDoDoUserRole',
    method: 'post',
  })
}

// 获取DoDo身份组列表
export const getDoDoRoleList = (data) => {
  return service({
    url: '/dodo/getDoDoRoleList',
    method: 'post',
    data,
  })
}

