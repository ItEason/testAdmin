// (一) 导入对应的模块
import Vue from 'vue'
import Router from 'vue-router'

// 导入所有需要进行规则的组件
import Layout from '@/components/Layout.vue'
import Article1 from '@/views/Article1.vue'
import UserInfo from '@/views/UserInfo.vue'
import AddAdmin from '@/views/AddAdmin.vue'
import Article2 from '@/views/Article2.vue'
import Classify from '@/views/Classify.vue'
import Login from '@/components/Login.vue'
import Manager from '@/views/Manager.vue'
import UserInfoBack from '@/components/UserInfoBack.vue'

// (二) 将Router注册为Vue的插件
Vue.use(Router)

// (三) 创建对应的Router插件的实例对象
const router = new Router({
    // 3.1 路由规则
    routes: [
        // 3.1.1 当用户输入的是'/'时,页面重定向到管理员登录页面
        { path: '/administrator/login', component: Login },
        { path: '/', redirect: '/administrator/login' },
        // 3.1.2 注意下面的props属性，用来使用路由中的动态id的传输(倘若子规则开启，父规则也需要开启)
        {
            path: '/layout', component: Layout, children: [
                { path: 'article1/:username', component: Article1 },
                { path: 'userInfo', component: UserInfo },
                { path: 'addAdmin', component: AddAdmin },
                { path: 'article2', component: Article2 },
                { path: 'classify', component: Classify },
                { path: 'manager', component: Manager },
                { path: 'userInfoBack', component: UserInfoBack}
            ]
        },
    ]
})

// (四) 创建路由的导航守卫，用来进行未登录无法到后台管理系统的验证
router.beforeEach(function (to, from, next) {
    // 4.1 当用户发送请求的页面是后后台管理页面时，进行下列的判断
    if (to.path === '/layout/article1/' || to.path === '/layout' || from.path === '/administrator/login') {
        // 4.1.1 获取用户浏览器中的token
        const token = window.localStorage.getItem('token')
        // 4.1.2 若已经存在token(即已经登录了)
        if (token) {
            // 4.1.3 使用next()进行放行
            next()
        } else {
            // 4.1.4 用户还没登录，就重定向到管理员登录页面
            next('/administrator/login')
        }
    } else {
        // 4.2 前往其他页面的地址直接放行
        next()
    }
})


// (五) 将router实例对象默认导出
export default router