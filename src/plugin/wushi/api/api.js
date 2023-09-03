import service from '@/utils/request'

// 获取挖矿记录列表
export const getMiningLogList = (data) => {
  return service({
    url: '/wushi/getMiningLogList',
    method: 'post',
    data
  })
}
