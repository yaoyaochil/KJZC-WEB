import service from '@/utils/request'

// 创建规则
export const createRule = (data) => {
  return service({
    method: 'post',
    url: '/game_api/createRuleSetting',
    data
  })
}

// 修改规则
export const updateRule = (data) => {
  return service({
    method: 'post',
    url: '/game_api/updateRuleSetting',
    data
  })
}

// 根据id获取规则
export const getRuleById = (data) => {
  return service({
    method: 'post',
    url: '/game_api/getRuleSettingById',
    data
  })
}

// 删除规则
export const deleteRule = (data) => {
  return service({
    method: 'post',
    url: '/game_api/deleteRuleSetting',
    data
  })
}

// 分页获取规则列表
export const getRuleList = (data) => {
  return service({
    method: 'post',
    url: '/game_api/getRuleSettingList',
    data
  })
}
