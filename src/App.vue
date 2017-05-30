<template>
  <div id="app">
  <!-- Main app bar-->
  <mu-appbar :title="pageTitle" class="appbar" :zDepth="2">
    <mu-icon-button icon="menu" slot="left" @click="toggleDrawer" />
    <mu-avatar v-if="userLoggedIn" slot="right" :src="userData.photoURL" />
    <mu-avatar v-else slot="right" icon="account_circle"/>
    <mu-icon-menu icon="more_vert" slot="right" :anchorOrigin="rightTop"
      :targetOrigin="rightTop">
      <mu-menu-item title="Profile" />
      <mu-menu-item title="Sign out" @click="signOut" />
    </mu-icon-menu>
  </mu-appbar>
  <!-- An empty space to counter for the gap in html left by app bar-->
  <div class="empty-space">
  </div>
  <!-- The left drawer -->
  <mu-drawer class="drawer" :open="drawerOpen" :zDepth="0">
    <mu-list @itemClick="">
      <mu-list-item title="Home" to="/">
        <mu-icon slot="left" value="home"/>
      </mu-list-item>
      <mu-list-item title="Following" to="/following">
        <mu-icon slot="left" value="bookmark"/>
      </mu-list-item>
      <mu-divider />

      <mu-list-item
        v-for="tag in tagSet"
        :key="tag"
        :title="tag"
        :to="filterUrl(tag)">
        <mu-icon slot="left" value="label" :color="tagColorMap[tag]"/>
      </mu-list-item>
      </mu-list>
  </mu-drawer>
  <div class="data-container" :class="{ 'container-open': !drawerOpen }">
    <router-view></router-view>
  </div>
  <!-- Snackbar is used to show notifications to the user -->
  <mu-snackbar v-if="snackbarOpen" :message="snackbarText" action="OK" @actionClick="hideSnackbar" @close="hideSnackbar"/>
  </div>
</template>

<script>
import * as firebase from 'firebase/app'
import {mapState} from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      drawerOpen: true,
      rightTop: {horizontal: 'right', vertical: 'top'},
      highlightColor: '#ff5252'
    }
  },
  created () {
    // react to user login changes from vuex
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.$store.commit('loginUser', user)
        // get the list of following threads and put it in store
        this.firebaseRef.user.child(`${user.uid}/following`)
        .on('value', (snapshot) => {
          let following = snapshot.val()
          if (!following) {
            return
          }
          this.$store.commit('setFollowingThreads', following)
        })
      } else {
        // User is signed out.
        this.$store.commit('logoutUser')
      }
    })
  },
  computed: mapState([
    // maps this.<prop> to $store.state.<prop>
    'userLoggedIn',
    'userData',
    'snackbarOpen',
    'firebaseRef',
    'snackbarText',
    'pageTitle',
    'tagColorMap',
    'tagSet'
  ]),
  methods: {
    // toggles the drawer state
    toggleDrawer () {
      this.drawerOpen = !this.drawerOpen
    },
    filterUrl (tag) {
      return '/filter/' + tag
    },
    signOut () {
      firebase.auth().signOut().then(() => {
      }).catch((error) => {
        this.$store.commit('showSnackbar', error.message)
      })
    },
    hideSnackbar () {
      this.$store.commit('hideSnackbar')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "scss/variables";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.appbar {
  position: fixed;
}
.empty-space {
  height: 7rem;
}
.drawer {
  top:$appbarHeight;
  width: $drawerWidth;
}
.data-container {
  margin-left: $drawerWidth;
  padding: 0rem;
  transition: margin-left 0.45s;
}

.container-open {
  margin-left: 0rem;
  padding: 0rem;
}

@media only screen and (min-width: 768px) {
  .data-container {
    margin-left: $drawerWidth;
    padding: 0 $containerPadding;
    transition: margin-left 0.45s;
  }
  .container-open {
    margin-left: 0rem;
    padding: 0 $containerPadding - 1;
  }
}
</style>
