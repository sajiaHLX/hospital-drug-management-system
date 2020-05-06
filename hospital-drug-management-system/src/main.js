import Vue from 'vue'
import App from './App.vue'
import "./plugins/element"
import router from './router'
import store from './store'
import 'assets/css/global.css'
import 'assets/font/iconfont.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000/'
Vue.prototype.$http = axios

Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
