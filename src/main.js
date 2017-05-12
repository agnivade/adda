import Vue from 'vue'
import Router from 'vue-router'

// importing firebase
import VueFire from 'vuefire'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// importing material UI stuff
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css'

import App from './App'
import router from './routes'

Vue.use(MuseUI)
Vue.use(VueFire)
Vue.use(Router)

Vue.config.productionTip = false

// Initializing firebase config
firebase.initializeApp({
  apiKey: process.firebaseApiKey,
  authDomain: process.firebaseAuthDomain,
  databaseURL: process.firebaseDatabaseUrl,
  projectId: process.firebaseProjectId
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
