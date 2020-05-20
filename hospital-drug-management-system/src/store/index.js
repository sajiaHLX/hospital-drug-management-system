import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: 'false',
    role: '',
    user: '',
  },
  mutations: {
    setIsLogin(state, val) {
      state.isLogin = val;
    },
    setRole(state, val) {
      state.role = val;
    },
    setUser(state, val) {
      state.user = val;
    },
  },
  actions: {
  },
  modules: {
  }
})
