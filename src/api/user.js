/**
 * 用户相关的请求模块
 */
//导入request.js中的request
import request from '@/utils/request'
// import store from '@/store'
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

/**
 * 获取用户自己的信息
 */
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user',
        // headers: {
        //     // 注意：该接口需要授权才能访问
        //     //             token的数据格式：Bearer token数据，注意 Bearer 后面有个空格
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}