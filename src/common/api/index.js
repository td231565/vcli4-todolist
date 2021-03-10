import { axiosInstance, apiDomain, setAuthToken } from './config'

export { axiosInstance, apiDomain, setAuthToken }
export const ApiAuth = {
  postUserLoginData: (data, config) => axiosInstance.post(`login`, data, config),
  postUserLogout: data => axiosInstance.post('signOut', data)
}
export const ApiPackage = {
  postQueryList: query => axiosInstance.post(`/package/queryList${query}`)
}