import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userLoggedIn: false,
    userData: {},
    firebaseRef: null,
    snackbarOpen: false,
    snackbarText: '',
    pageTitle: ''
  },
  mutations: {
    loginUser (state, user) {
      state.userLoggedIn = true
      state.userData = user
    },
    logoutUser (state) {
      state.userLoggedIn = false
      state.userData = {}
    },
    setFirebaseRef (state, ref) {
      state.firebaseRef = ref
    },
    hideSnackbar (state) {
      state.snackbarOpen = false
      state.snackbarText = ''
    },
    showSnackbar (state, msg) {
      state.snackbarOpen = true
      state.snackbarText = msg
    },
    setPageTitle (state, title) {
      state.pageTitle = 'adda - ' + title
      document.title = state.pageTitle
    }
  }
})
