<template>
  <div>
    <h1>Welcome to adda !</h1>
    <mu-float-button secondary icon="add" class="addBtn" @click="openDialog()" />

    <mu-dialog :open="dialogOpen" title="New thread" >
      Select tags
      <br />
      Put a markdown editor here

      <template v-if="userLoggedIn">
        <mu-raised-button slot="actions" label="Cancel" @click="closeDialog()" />
        <mu-raised-button slot="actions" primary label="Post" @click="createThread()" />
      </template>
      <template v-else>
        <mu-raised-button slot="actions" label="Cancel" @click="closeDialog()" />
        <mu-raised-button slot="actions" label="Sign In" @click="signIn()" />
      </template>
    </mu-dialog>

    <mu-snackbar v-if="snackbarOpen" v-bind:message="snackbarText" action="OK" @actionClick="hideSnackbar()" @close="hideSnackbar()"/>
  </div>
</template>

<script>
import * as firebase from 'firebase/app'
import {mapState} from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      dialogOpen: false,
      snackbarOpen: false,
      snackbarText: ''
    }
  },
  computed: mapState([
    // maps this.userLoggedIn to $store.state.userLoggedIn
    'userLoggedIn'
  ]),
  methods: {
    openDialog () {
      this.dialogOpen = true
    },
    closeDialog () {
      this.dialogOpen = false
    },
    createThread () {
      // disable button

      // post to firebase

      // on success, enable the button
      this.dialogOpen = false
    },
    hideSnackbar () {
      this.snackbarOpen = false
      this.snackbarText = ''
    },
    signIn () {
      let provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider).then((result) => {
        // The signed-in user info.
        this.$store.commit('loginUser', result.user)
      }).catch((error) => {
        console.error(error)
        this.snackbarText = error.message
        this.snackbarOpen = true

        // Handle Errors here.
        /* var errorCode = error.code
        var errorMessage = error.message
        // The email of the user's account used.
        var email = error.email
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential */
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.addBtn {
  position: fixed;
  z-index: 5;
  right: 3rem;
  bottom: 3rem;
}
</style>
