import Vue from 'vue'
import Router from 'vue-router'

// importing firebase
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// importing material UI stuff
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css'

// importing font awesome
import 'font-awesome/scss/font-awesome.scss'

import App from './App'
import router from './routes'
import store from './store'

Vue.use(MuseUI)
Vue.use(Router)

Vue.config.productionTip = false

// Initializing firebase config
const firebaseApp = firebase.initializeApp({
  apiKey: process.firebaseApiKey,
  authDomain: process.firebaseAuthDomain,
  databaseURL: process.firebaseDatabaseUrl,
  projectId: process.firebaseProjectId
})
const db = firebaseApp.database()

let firebaseRef = {
  tags: db.ref('tags'),
  threads: db.ref('threads'),
  messages: db.ref('messages')
}
// Storing the firebaseRefs inside the store
store.commit('setFirebaseRef', firebaseRef)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
