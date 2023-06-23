import service from '@/utils/request'

export const getLoginPic = (params) => {
  return service({
    url: '/wechat/getLoginPic',
    method: 'get',
    params
  })
}

export const loginOrCreate = (params) => {
  return service({
    url: '/wechat/loginOrCreate',
    method: 'get',
    params
  })
}

export const clearWx = () => {
  return service({
    url: '/wechat/clearWx',
    method: 'post'
  })
}

export const register = (data) => {
  return service({
    url: '/wechat/register',
    method: 'post',
    data
  })
}

// 检查是否绑定
export const checkBind = () => {
  return service({
    url: '/wechat/checkBind',
    method: 'get',
  })
}

