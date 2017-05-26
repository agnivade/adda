<template>
  <div>
	<mu-dialog :open="dialogOpen" title="New Thread" @close="dialogOpen=false">
    <!-- If logged in, show the text boxes -->
    <template v-if="userLoggedIn">
      <mu-chip v-for="tag in tags" :key="tag" showDelete @delete="removeTag(tag)">
        {{tag}}
      </mu-chip>
      <!-- Textbox to add tags -->
      <mu-auto-complete
        ref="autoComplete"
        class="autoComplete"
        hintText="Tags"
        inputClass="inputField"
        :dataSource="autoCompleteTags"
        :underlineShow="false"
        v-model="tagText"
        @focus="autoCompleteFocussed=true"
        @blur="autoCompleteFocussed=false"
        @select="itemSelected"
        @input="onAutoCompleteChange"
      />
      <!-- The underline effect -->
      <hr class="mu-text-field-line">
      <hr class="mu-text-field-focus-line" :class="{'focus' : autoCompleteFocussed}">
      <mu-text-field
        ref="title"
        hintText="Title"
        fullWidth
        v-model='titleText'
        @focus='onTitleFocus'
      />
      <mu-text-field
        hintText="Message"
        fullWidth
        multiLine
        v-model='messageBody'
        :rows="6"
        :rowsMax="6"
      />

      <mu-flat-button slot="actions" :style="{marginRight: '1rem'}" label="Cancel" @click="closeDialog" />
      <mu-raised-button slot="actions" primary label="Post" @click="createThread" :disabled="postButtonDisabled" />
    </template>
    <!-- If not logged in, show login buttons -->
    <template v-else>
      <div class="signin-buttons">
      <mu-raised-button
        label="Sign-in with Google"
        labelPosition="after"
        class="login-button"
        backgroundColor="#ea4335"
        @click="signIn('google')"
        fullWidth>
        <i class="fa fa-google" aria-hidden="true"></i>
      </mu-raised-button>
      <mu-raised-button
        label="Sign-in with Facebook"
        labelPosition="after"
        class="login-button"
        backgroundColor="#3b5998"
        @click="signIn('facebook')"
        fullWidth>
        <i class="fa fa-facebook" aria-hidden="true"></i>
      </mu-raised-button>
      <mu-raised-button
        label="Sign-in with Github"
        labelPosition="after"
        class="login-button"
        backgroundColor="#222222"
        @click="signIn('github')"
        fullWidth>
        <i class="fa fa-github" aria-hidden="true"></i>
      </mu-raised-button>
      </div>

      <mu-flat-button slot="actions" label="Cancel" @click="closeDialog" />
    </template>

  </mu-dialog>
  <mu-float-button secondary icon="add" class="addBtn" @click="openDialog" />
  </div>
</template>

<script>
import * as firebase from 'firebase/app'
import {mapState} from 'vuex'

export default {
  name: 'new-thread-dialog',
  data () {
    return {
      dialogOpen: false,
      autoCompleteFocussed: false,
      autoCompleteTags: ['general', 'dev', 'sales', 'ops'],
      tags: [],
      tagText: '',
      postButtonDisabled: false,
      titleText: '',
      messageBody: ''
    }
  },
  computed: mapState([
    // maps this.<prop> to $store.state.<prop>
    'userLoggedIn',
    'firebaseRef',
    'userData'
  ]),
  methods: {
    openDialog () {
      this.dialogOpen = true
    },
    closeDialog () {
      this.clearDialogData()
      this.dialogOpen = false
    },
    // when the user presses tab from the autocomplete text, the remaining text should get added to the tag array
    onTitleFocus () {
      if (this.tagText) {
        this.tags.push(this.tagText)
        this.tagText = ''
        // Putting the focus back to the title because the DOM is re-rendered
        this.$nextTick(() => {
          this.$refs.title.$el.getElementsByTagName('input')[0].focus()
        })
      }
    },
    createThread () {
      // disable button
      this.postButtonDisabled = true

      let rootRef = this.firebaseRef.threads.root
      let updates = {}
      // getting the thread id
      let threadId = this.firebaseRef.threads.push().key
      let currentTime = new Date()
      // creating a thread metadata object
      let threadMetadata = {
        title: this.titleText,
        lastMessage: this.messageBody,
        lastUpdated: currentTime,
        createdAt: currentTime,
        tags: this.tags,
        stars: 0,
        numReplies: 1,
        userData: {
          displayName: this.userData.displayName,
          email: this.userData.email,
          photoURL: this.userData.photoURL,
          uid: this.userData.uid
        }
      }
      // Updating tags
      this.tags.forEach((tag) => {
        updates[`tags/${tag}/${threadId}`] = threadMetadata
      })
      // Updating thread
      updates[`threads/${threadId}`] = threadMetadata
      // Updating messages
      updates[`messages/${threadId}`] = [{
        msgBody: this.messageBody,
        timestamp: currentTime,
        stars: 0,
        userData: {
          displayName: this.userData.displayName,
          email: this.userData.email,
          photoURL: this.userData.photoURL,
          uid: this.userData.uid
        }
      }]

      // updating to firebase
      rootRef.update(updates)
      .then(() => {
        // on success, enable the button
        this.postButtonDisabled = false
        this.$store.commit('showSnackbar', 'Successfully created the thread')
        setTimeout(() => {
          this.$store.commit('hideSnackbar')
        }, 2000)
        this.clearDialogData()
      })
      .catch(err => {
        this.postButtonDisabled = false
        this.$store.commit('showSnackbar', err)
        this.clearDialogData()
        console.error(err)
      })

      // closing the dialog
      this.dialogOpen = false
    },
    // clear the text fields after the post is done
    clearDialogData () {
      this.tags = []
      this.titleText = ''
      this.messageBody = ''
    },
    itemSelected (item) {
      // Check for dupes
      this.tags.push(item)
      this.tagText = ''
      this.putFocus()
    },
    onAutoCompleteChange () {
      if (this.tagText.endsWith(' ')) {
        this.tags.push(this.tagText.trim())
        this.tagText = ''
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
    // remove the tag from the array
    removeTag (tag) {
      let index = this.tags.indexOf(tag)
      this.tags.splice(index, 1)
    },
    signIn (company) {
      let provider = null
      if (company === 'google') {
        provider = new firebase.auth.GoogleAuthProvider()
      } else if (company === 'facebook') {
        provider = new firebase.auth.FacebookAuthProvider()
      } else if (company === 'github') {
        provider = new firebase.auth.GithubAuthProvider()
      }
      firebase.auth().signInWithPopup(provider).then((result) => {
        // The signed-in user info.
        this.$store.commit('loginUser', result.user)
      }).catch((error) => {
        console.error(error)
        this.$store.commit('showSnackbar', error.message)
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
.signin-buttons {
  width: 50%;
  margin: 0 auto;
}
.login-button {
  margin-bottom: 1rem;
}
.mu-text-field-line, .mu-text-field-focus-line {
  position: relative;
}
</style>

<!--Have to do an unscoped styling here to apply styles inside the autoComplete -->
<style lang="scss">
.autoComplete {
  height: 4rem;
  .inputField {
    width: 50rem;
  }
}

</style>
