
// 格式化性别
export const convertGender = (gender) => {
  if (gender === -1) {
    return '保密'
  } else if (gender === 0) {
    return '女'
  } else if (gender === 1) {
    return '男'
  } else {
    return '未知'
  }
}

// 格式化机器人类别
export const convertRobotType = (type) => {
  switch (type) {
    case 0:
      return '否'
    case 1:
      return '是'
  }
}

// 格式化频道类型
// 频道类型，1：文字频道，2：语音频道，4：帖子频道，5：链接频道，6：资料频道
export const convertChannelType = (type) => {
  switch (type) {
    case 1:
      return '文字频道'
    case 2:
      return '语音频道'
    case 4:
      return '帖子频道'
    case 5:
      return '链接频道'
    case 6:
      return '资料频道'
  }
}
