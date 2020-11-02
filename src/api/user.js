/**
 * 用户相关的请求模块
 */
//导入request.js中的request
import request from '@/utils/request'

/**
 * 用户登录
 */
// 导出login方法
// login = (data) => {}  定义形参data接收请求传来的参数
export const login = data => {
    return request({
        method: 'POST',
        url: '/app/v1_0/authorizations',
        data //data:data的简写
    })
}

// 发送验证码
// 注意，这个接口，每个手机号每分钟只能调用一次
export const sendSms = mobile => {
    return request({
        method: 'GET',
        url: `/app/v1_0/sms/codes/${mobile}`
    })
}