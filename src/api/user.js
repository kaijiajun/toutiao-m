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

/**
 * 获取获取频道列表数据
 */
export const getChannels = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/channels'
    })
}

/**
 * 关注用户
 */
export const addFollow = target => {
    return request({
        method: 'POST',
        url: '/app/v1_0/user/followings',
        data: {
            target
        }
    })
}

/**
 * 取消关注用户
 */
export const deleteFollow = target => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/user/followings/${target}`
    })
}

/**
 * 获取用户个人信息数据
 */
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/profile'
    })
}

/**
 * 更新用户昵称
 */
export const updataUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/profile',
        data
    })
}

/**
 * 更新用户头像
 */
// export const updataUserPhoto = data => {
//     return request({
//         method: 'PATCH',
//         url: '/app/v1_0/user/photo',
//         data
//     })
// }

export const updataUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/photo',
        data
    })
}