import service from '@/utils/request'

export const createPlugApi = (data) => {
  return service({
    url: '/autoCode/createPlug',
    method: 'post',
    data
  })
}
