import service from '@/utils/request'

// 同步频道
export const syncChannels = () => {
  return service({
    url: '/dodo/syncChannel',
    method: 'post'
  })
}

// 获取频道列表
export const getChannelList = (data) => {
  return service({
    url: '/dodo/getChannelList',
    method: 'post',
    data,
  })
}
