import Vue from 'vue'
import App from './App.vue'
import "./plugins/element"
import router from './router'
import store from './store'
import 'assets/css/global.css'
import 'assets/font/iconfont.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://sajiahlx.xyz:3000/'
Vue.prototype.$http = axios

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
    if (store.state.isLogin === 'true') {// 判断是否登录
      next()
    } else {// 没登录则跳转到登录界面
      next({
        path: '/login',
      })
    }
  } else {
    next()
  }
})
