import service from '@/utils/request'

// 上传图片
export function uploadImage(data) {
  return service({
    url: '/dodo/uploadImage',
    method: 'post',
    data,
  })
}

// 修改图片信息
export function updateImage(data) {
  return service({
    url: '/dodo/updateResource',
    method: 'post',
    data,
  })
}

// 删除图片
export function deleteImage(data) {
  return service({
    url: '/dodo/deleteResource',
    method: 'post',
    data,
  })
}

// 获取图片列表
export function getImageList(data) {
  return service({
    url: '/dodo/getResourceList',
    method: 'post',
    data,
  })
}
