/**
 * 评论接口模块
 */
import request from '@/utils/request'

/**
 * 获取文章列表
 */
export const getCommentList = params => {
    return request({
        method: 'GET',
        url: '/app/v1_0/comments',
        // get参数使用params进行传递
        // 我们写的是对象，传给后端的数据是？
        // axios会把params对象转为key=value？key=value的形式放到url中
        params
    })
}

/**
 * 点赞评论
 */
export const addCommentLike = target => {
    return request({
        method: 'POST',
        url: '/app/v1_0/comment/likings',
        data: { target }
    })
}

/**
 * 取消点赞评论
 */
export const deleteCommentLike = target => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/comment/likings/${target}`
    })
}

/**
 * 添加评论
 */
export const addComment = target => {
    return request({
        method: 'POST',
        url: '/app/v1_0/comments',
        data: target
    })
}