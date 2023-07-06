import service from '@/utils/request'

// 创建Boss配置
export function createBossSetting(data) {
  return service({
    url: '/boss_api/createBossSetting',
    method: 'post',
    data,
  })
}

// 更新Boss配置
export function updateBossSetting(data) {
  return service({
    url: '/boss_api/updateBossSetting',
    method: 'post',
    data,
  })
}

// 根据id获取Boss配置
export function getBossSettingById(data) {
  return service({
    url: '/boss_api/getBossSettingById',
    method: 'post',
    data,
  })
}

// 根据id删除Boss配置
export function deleteBossSettingById(data) {
  return service({
    url: '/boss_api/deleteBossSetting',
    method: 'post',
    data,
  })
}

// 获取所有Boss配置
export function getAllBossSetting(data) {
  return service({
    url: '/boss_api/getBossSettingList',
    method: 'post',
    data,
  })
}
