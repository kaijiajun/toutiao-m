/**
 * 封装 axios 请求模块
 */

import axios from 'axios'

const request = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/' //基础路径
})

// 请求拦截

// 响应拦截


export default request