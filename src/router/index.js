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
    },
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ('@/views/search')
    },
    {
        path: '/',
        // name: 'layout', //如果父路由有默认子路由，那他的name就没有意义，可以省略
        component: () =>
            import ('@/views/layout'),
        children: [{
                path: '/', // 默认子路由，只能有一个，当访问/的时候，显示home组件
                name: 'home',
                component: () =>
                    import ('@/views/home')
            },
            {
                path: '/qa',
                name: 'qa',
                component: () =>
                    import ('@/views/qa')
            },
            {
                path: '/video',
                name: 'video',
                component: () =>
                    import ('@/views/video')
            },
            {
                path: '/my',
                name: 'my',
                component: () =>
                    import ('@/views/my')
            }
        ]

    }
]
const router = new VueRouter({
    routes
})

export default router