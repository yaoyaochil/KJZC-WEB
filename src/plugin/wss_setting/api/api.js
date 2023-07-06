import service from '@/utils/request'

export function getWssSetting() {
  return service({
    url: '/dodo/getWssSetting',
    method: 'get'
  })
}

export function updateWssSetting(data) {
  return service({
    url: '/dodo/updateWssSetting',
    method: 'post',
    data
  })
}

// 控制wss监听
export function controlWss(data) {
  return service({
    url: '/dodo/controlWssSetting',
    method: 'post',
    data
  })
}
