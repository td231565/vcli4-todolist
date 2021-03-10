// 產生日期字串
export function getDateString (date) {
  return new Date(date).toLocaleString('zh-TW', {hour12: false})
    .split(' ')[0]
    .split('/')
    .map(d => d.length === 1 ? '0' + d : d)
    .join('-')
}

const tools = {
  getDateString
}

export default tools