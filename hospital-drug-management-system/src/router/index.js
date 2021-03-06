import Vue from 'vue'
import VueRouter from 'vue-router'
import login from 'views/login/login.vue'
import home from 'views/home/home.vue'
import userList from 'views/userList/userlist.vue'
import Cin from 'views/in/in.vue'
import out from 'views/out/out.vue'
import buy from 'views/buy/buy.vue'
import store from 'views/store/store.vue'
import welcome from 'views/welcome/welcome.vue'
import system from 'views/system/system.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: welcome
      },
      {
        path: '/in',
        name: 'in',
        component: Cin
      },
      {
        path: '/out',
        name: 'out',
        component: out
      },
      {
        path: '/buy',
        name: 'buy',
        component: buy
      },
      {
        path: '/store',
        name: 'store',
        component: store
      },
      {
        path: '/userlist',
        name: 'userList',
        component: userList
      },
      {
        path: '/system',
        name: 'system',
        component: system
      }
    ],
    meta: {
      requireAuth: true // 配置此条，进入页面前判断是否需要登陆
    },

  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
