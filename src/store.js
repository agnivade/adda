import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userLoggedIn: false,
    userData: {},
    followingThreads: {},
    firebaseRef: null,
    snackbarOpen: false,
    snackbarText: '',
    pageTitle: '',
    tagColorMap: {
      general: '#3E2723',
      dev: '#311B92',
      sales: '#0D47A1',
      ops: '#004D40',
      support: '#00B8D4'
    },
    tagSet: ['general', 'dev', 'sales', 'ops', 'support']
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
    // populating the following dict
    setFollowingThreads (state, threads) {
      state.followingThreads = threads
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
