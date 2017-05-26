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
    // use login, logout functions
    loginUser (state, user) {
      state.userLoggedIn = true
      state.userData = user
    },
    logoutUser (state) {
      state.userLoggedIn = false
      state.userData = {}
    },
    // setting the firebase ref
    setFirebaseRef (state, ref) {
      state.firebaseRef = ref
    },
    // snackbar hide/show
    hideSnackbar (state) {
      state.snackbarOpen = false
      state.snackbarText = ''
    },
    showSnackbar (state, msg) {
      state.snackbarOpen = true
      state.snackbarText = msg
    },
    // setting the page title depending on what component is loaded
    setPageTitle (state, title) {
      state.pageTitle = 'adda - ' + title
      document.title = state.pageTitle
    }
  }
})
