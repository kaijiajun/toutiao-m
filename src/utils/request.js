/**
 * 封装 axios 请求模块
 */

import axios from 'axios'
import store from '@/store'
import bigint from 'json-bigint'

const JSONBig = bigint({ "storeAsString": true }) // 通过该配置，让超大数字转为字符串
    // const jsonStr = '{ "art_id": 1245953273786007552 }'

// console.log(JSON.parse(jsonStr)) // 1245953273786007600
//     // JSON.stringify()

// // JSONBig 可以处理数据中超出 JavaScript 安全整数范围的问题
// console.log(JSONBig.parse(jsonStr)) // 把 JSON 格式的字符串转为 JavaScript 对象

// // 使用的时候需要把 BigNumber 类型的数据转为字符串来使用
// console.log(JSONBig.parse(jsonStr).art_id.toString()) // 1245953273786007552

// console.log(JSON.stringify(JSONBig.parse(jsonStr)))

// console.log(JSONBig.stringify(JSONBig.parse(jsonStr))) // 把 JavaScript 对象 转为 JSON 格式的字符串转


const request = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/', //基础路径

    // axios 默认会在内部这样处理后端返回的数据
    // return JSON.parse(data)

    // transformResponse 允许自定义原始的响应数据（字符串）
    // data后端返回的原始数据
    transformResponse: [function(data) {
        try {
            // 如果转换成功则返回转换的数据结果
            return JSONBig.parse(data)
        } catch (err) {
            // 如果转换失败，则包装为统一数据格式并返回
            return data
        }
    }]
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