import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import ColumnDetail from './views/ColumnDetail.vue'
import CreatePost from './views/CreatePost.vue'
import PostDetail from './views/PostDetail.vue'
import store from './store'
import { useUserStore } from './store/user'
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      // 配置路由元信息，用于设置路由守卫，如果已经登陆，访问登陆页面会自动跳转主页
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      // 配置路由元信息，用于设置路由守卫，如果已经登陆，访问注册页面会自动跳转主页
      meta: { redirectAlreadyLogin: true }
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      // 配置路由元信息，用于设置路由守卫,判断是否需要登陆
      meta: { requiredLogin: true }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    }
  ]
})
// 全局路由前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  // 根据路由元信息来判断是否需要进行路由守卫
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  if (!userStore.isLogin) {
    if (userStore.token) {
      axios.defaults.headers.common.Authorization = `Bearer ${userStore.token}`
      userStore.fetchCurrentUser().then(() => {
        if (redirectAlreadyLogin) {
          // 如果满足条件，则next跳转路由
          next('/')
        } else {
          // 如果不满足，则继续进行下一个路由守卫判断
          next()
        }
      }).catch(e => {
        console.error(e)
        userStore.logout()
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
