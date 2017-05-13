import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userLoggedIn: false,
    userData: {}
  },
  mutations: {
    loginUser (state, user) {
      state.userLoggedIn = true
      state.userData = user
    },
    logoutUser (state) {
      state.userLoggedIn = false
      state.userData = {}
    }
  }
})
