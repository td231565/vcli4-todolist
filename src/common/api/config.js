import Axios from 'axios'

let userInfo = localStorage.getItem('userInfo')
if (userInfo) { userInfo = JSON.parse(userInfo) }
const apiRoot = {
  development: 'https://mdms.uat.hpicorp.tk/medical/',
  sit: 'https://mdms.uat.hpicorp.tk/medical/',
  uat: 'https://mdms.uat.hpicorp.tk/medical/',
  production: 'https://mdms.uat.hpicorp.tk/medical/'
}
const ENV_NAME = process.env.NODE_ENV
export const apiDomain = apiRoot[ENV_NAME]

const setting = {
  baseURL: apiDomain
  // timeout: 30000
}
export const axiosInstance = Axios.create(setting)

const authToken = (function () {
  let token = userInfo && userInfo.authToken
  return {
    get: () => token,
    set: (val) => { token = val }
  }
}())
export const setAuthToken = authToken.set

// http request 欄截
axiosInstance.interceptors.request.use(
  config => {
    config.headers['authToken'] = authToken.get()
    return config
  },
  error => { return Promise.reject(error) }
)

// 異常處理
axiosInstance.interceptors.response.use(
  response => { return response },
  err => {
    if (err && err.response) {
      const { data, status: httpCode } = err.response
      // 權限不符 or Token過期
      switch (httpCode) {
        case 401: {
          console.log(`%chttp 401: unauthorized`, 'color:#fff;background-color:orange;')
          break
        }
        case 400: {
          console.log(`%chttp 400: ${data.message}`, 'color:#fff;background-color:red;')
          console.log(`%cdeta: ↓ `, 'color:#fff;background-color:red;')
          console.log(data)
          break
        }
        default: {
          const errorList = [404, 500, 503]
          errorList.includes(httpCode)
            ? console.log(`network failed`)
            : console.log(err.response)
          break
        }
      }
    } else {
      console.log('連接到服務器失敗')
    }
    return Promise.reject(err.response)
  }
)
