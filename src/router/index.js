import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [{
    path: '/login',
    name: 'login',
    component: () =>
        import ('@/views/login')
        // #这里是路由懒加载的写法
        // #完整写法是：@views/login/index.vue，但是index.vue可以省略，导入一个目录时默认导入目录下的index.vue
}]
const router = new VueRouter({
    routes
})

export default router