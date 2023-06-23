
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
