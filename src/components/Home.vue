<template>
  <div>
    <h1>Welcome to adda !</h1>
    <mu-float-button secondary icon="add" class="addBtn" @click="openDialog" />

    <mu-dialog :open="dialogOpen" title="New Thread" @close="dialogOpen=false">
      <mu-chip v-for="tag in tags" :key="tag" showDelete @delete="removeTag(tag)">
        {{tag}}
      </mu-chip>
      <mu-auto-complete
        ref="autoComplete"
        class="autoComplete"
        hintText="Tags"
        :dataSource="autoCompleteTags"
        :underlineShow="false"
        @focus="autoCompleteFocussed=true"
        @blur="autoCompleteFocussed=false"
        @select="itemSelected"
        @input="onAutoCompleteChange"
      />
      <hr class="mu-text-field-line">
      <hr class="mu-text-field-focus-line" :class="{'focus' : autoCompleteFocussed}">
      <mu-text-field hintText="Title" fullWidth :model='titleText' />
      <mu-text-field hintText="Message" fullWidth multiLine :model='messageBody' :rows="6" :rowsMax="6"/>

      <template v-if="userLoggedIn">
        <mu-flat-button slot="actions" :style="{marginRight: '1rem'}" label="Cancel" @click="closeDialog" />
        <mu-raised-button slot="actions" primary label="Post" @click="createThread" :disabled="postButtonDisabled" />
      </template>
      <template v-else>
        <mu-raised-button slot="actions" label="Cancel" @click="closeDialog" />
        <mu-raised-button slot="actions" label="Sign In" @click="signIn" />
      </template>
    </mu-dialog>

    <mu-snackbar v-if="snackbarOpen" :message="snackbarText" action="OK" @actionClick="hideSnackbar" @close="hideSnackbar"/>
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
      snackbarText: '',
      autoCompleteFocussed: false,
      autoCompleteTags: ['general', 'dev', 'sales', 'ops'],
      tags: [],
      postButtonDisabled: false,
      titleText: '',
      messageBody: ''
    }
  },
  computed: mapState([
    // maps this.<prop> to $store.state.<prop>
    'userLoggedIn',
    'firebaseRef'
  ]),
  methods: {
    openDialog () {
      this.dialogOpen = true
    },
    closeDialog () {
      this.clearDialogData()
      this.dialogOpen = false
    },
    createThread () {
      // disable button
      this.postButtonDisabled = true

      let rootRef = this.firebaseRef.threads.root
      let updates = {}
      let threadId = this.firebaseRef.threads.push().key
      // Updating tags
      this.tags.forEach((tag) => {
        updates['/tags/' + tag] = {}
        updates['/tags/' + tag][threadId] = true
      })
      let currentTime = new Date()
      // Updating thread
      updates['threads/' + threadId] = {
        title: this.titleText,
        lastMessage: this.messageBody,
        lastUpdated: currentTime,
        tags: this.tags
      }
      // Updating messages
      updates['messages/' + threadId] = [{
        msgBody: 'my message',
        timestamp: currentTime,
        stars: 0
      }]
      rootRef.update(updates)
      .then(() => {
        // on success, enable the button
        this.postButtonDisabled = false
        this.showSnackbar('Successfully created the thread')
        setTimeout(() => {
          this.hideSnackbar()
        }, 2000)
        this.clearDialogData()
      })
      .catch(err => {
        this.postButtonDisabled = false
        this.showSnackbar(err)
        this.clearDialogData()
        console.error(err)
      })

      // closing the dialog
      this.dialogOpen = false
    },
    hideSnackbar () {
      this.snackbarOpen = false
      this.snackbarText = ''
    },
    showSnackbar (msg) {
      this.snackbarText = msg
      this.snackbarOpen = true
    },
    clearDialogData () {
      this.tags = []
      this.titleText = ''
      this.messageBody = ''
    },
    itemSelected (tag) {
      this.tags.push(tag)
      this.putFocus()
    },
    onAutoCompleteChange (val) {
      if (val.endsWith(' ')) {
        this.tags.push(val.trim())
        this.putFocus()
      }
    },
    // We need to apply focus after the dom has re-rendered
    // Hence running it on nextTick
    putFocus () {
      this.$nextTick(() => {
        // A hack for now
        // Refer - https://github.com/museui/muse-ui/issues/495
        this.$refs.autoComplete.$el.getElementsByTagName('input')[0].focus()
      })
    },
    removeTag (tag) {
      let index = this.tags.indexOf(tag)
      this.tags.splice(index, 1)
    },
    signIn () {
      let provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithPopup(provider).then((result) => {
        // The signed-in user info.
        this.$store.commit('loginUser', result.user)
      }).catch((error) => {
        console.error(error)
        this.showSnackbar(error.message)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$fabBtnMargin: 3rem;

.addBtn {
  position: fixed;
  z-index: 5;
  right: $fabBtnMargin;
  bottom: $fabBtnMargin;
}

.autoComplete {
  height: 4rem;
}

.mu-text-field-line, .mu-text-field-focus-line {
  position: relative;
}
</style>

