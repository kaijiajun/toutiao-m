/**
 * 封装 axios 请求模块
 */

import axios from 'axios'
import store from '@/store'

const request = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/' //基础路径
})

// 请求拦截
request.interceptors.request.use(function(config) {
        // config ：本次请求的配置对象
        // config 里面有一个属性：headers
        // console.log(config);
        const { user } = store.state
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`
        }
        return config
    }, function(error) {
        return Promise.reject(error)
    })
    // 响应拦截


export default request