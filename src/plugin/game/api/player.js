import service from '@/utils/request'

// 发放道具
export const giveItemToUser = (data) => {
  return service.request({
    method: 'post',
    url: '/game_api/giveItemToUser',
    data
  })
}

// 获取玩家道具列表
export const getPlayerItemList = (data) => {
  return service.request({
    method: 'post',
    url: '/game_api/getPlayerItemList',
    data
  })
}

// 分页获取玩家道具列表
export const getPlayerItemListByPage = (data) => {
  return service.request({
    method: 'post',
    url: '/game_api/getPlayerItemPageList',
    data
  })
}
