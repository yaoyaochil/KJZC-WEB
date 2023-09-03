import service from '@/utils/request'

// 创建物品
export const createGameItem = (data) => {
  return service.request({
    method: 'post',
    url: '/game_api/createGameItem',
    data
  })
}

// 获取物品列表
export const getGameItemList = (data) => {
  return service.request({
    method: 'post',
    url: '/game_api/getGameItemList',
    data
  })
}

// 更新物品
export const updateGameItem = (data) => {
  return service.request({
    method: 'post',
    url: '/game_api/updateGameItem',
    data
  })
}

// 删除物品
export const deleteGameItem = (data) => {
  return service.request({
    method: 'post',
    url: '/game_api/deleteGameItem',
    data
  })
}

// 根据id获取物品
export const getGameItemById = (data) => {
  return service.request({
    method: 'post',
    url: '/game_api/getGameItemById',
    data
  })
}

// 给批量玩家添加物品
export const addGameItemToPlayers = (data) => {
  return service.request({
    method: 'post',
    url: '/game_api/sendItemToPlayers',
    data
  })
}
