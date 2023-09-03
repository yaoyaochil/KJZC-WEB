import { formatTimeToStr } from '@/utils/date'
import { getDict } from '@/utils/dictionary'

export const formatBoolean = (bool) => {
  if (bool !== null) {
    return bool ? '是' : '否'
  } else {
    return ''
  }
}
export const formatDate = (time) => {
  if (time !== null && time !== '') {
    var date = new Date(time)
    return formatTimeToStr(date, 'yyyy-MM-dd hh:mm:ss')
  } else {
    return ''
  }
}

export const filterDict = (value, options) => {
  const rowLabel = options && options.filter(item => item.value === value)
  return rowLabel && rowLabel[0] && rowLabel[0].label
}

export const getDictFunc = async(type) => {
  const dicts = await getDict(type)
  return dicts
}

export const formatInt = (value) => {
  // 如果是数字
  if (!isNaN(value)) {
    // 如果是1返回是，如果是0返回否
    return value === 1 ? '是' : '否'
  }
}

// 10位时间戳转换为时间格式
export const formatTime = (time) => {
  if (time !== null && time !== '') {
    var date = new Date(time * 1000)
    return formatTimeToStr(date, 'yyyy-MM-dd hh:mm:ss')
  } else {
    return ''
  }
}

// 小数转换为百分比
export const formatPercent = (value) => {
  if (!isNaN(value)) {
    return value * 100 + '%'
  }
}
