<template>
  <div id="app">
  <mu-appbar title="adda" class="appbar" :zDepth="2">
    <mu-icon-button icon="menu" slot="left" @click="toggleDrawer" />
    <mu-avatar v-if="userLoggedIn" slot="right" :src="userData.photoURL" />
    <mu-avatar v-else slot="right" icon="account_circle"/>
    <mu-icon-menu icon="more_vert" slot="right" :anchorOrigin="rightTop"
      :targetOrigin="rightTop">
      <mu-menu-item title="Profile" />
      <mu-menu-item title="Sign out" @click="signOut" />
    </mu-icon-menu>
  </mu-appbar>
  <div class="empty-space">
  </div>
  <mu-drawer class="drawer" :open="drawerOpen" :zDepth="0">
    <mu-list @itemClick="">
      <mu-list-item title="Home">
        <mu-icon slot="left" value="home"/>
      </mu-list-item>
      <mu-list-item title="Following">
        <mu-icon slot="left" value="turned_in"/>
      </mu-list-item>
      <mu-divider />
      <mu-list-item title="General">
        <mu-icon slot="left" value="label"/>
      </mu-list-item>
    </mu-list>
  </mu-drawer>
  <div class="data-container" :class="{ 'container-open': !drawerOpen }">
    <router-view></router-view>
  </div>
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
      leftTop: {horizontal: 'left', vertical: 'top'},
      leftBottom: {horizontal: 'left', vertical: 'bottom'},
      rightBottom: {horizontal: 'right', vertical: 'bottom'},
      rightTop: {horizontal: 'right', vertical: 'top'}
    }
  },
  created () {
    // react to user login changes from vuex
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.$store.commit('loginUser', user)
      } else {
        // User is signed out.
        this.$store.commit('logoutUser')
      }
    })
  },
  computed: mapState([
    // maps this.<prop> to $store.state.<prop>
    'userLoggedIn',
    'userData'
  ]),
  methods: {
    toggleDrawer () {
      this.drawerOpen = !this.drawerOpen
    },
    signOut () {
      firebase.auth().signOut().then(() => {
        // TODO: show snackbar
      }).catch((error) => {
        console.error(error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$drawerWidth: 20rem;
$appbarHeight: 64px;
$containerPadding: 6rem;

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.appbar {
  position: fixed;
}
.empty-space {
  height: 5rem;
}
.drawer {
  top:$appbarHeight;
  width: $drawerWidth;
}
.data-container {
  margin-left: $drawerWidth;
  padding: 0 $containerPadding;
  transition: margin-left 0.45s;
}
.container-open {
  margin-left: 0rem;
  padding: 0 $containerPadding - 1;
}
</style>
