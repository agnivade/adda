<template>
  <div>
    <mu-row gutter>
      <mu-content-block v-if="loadingState">
        <mu-circular-progress :size="40"/>
      </mu-content-block>
      <mu-content-block v-else>
        <!--Then, if nothing is found -->
        <mu-content-block v-if="threads.length === 0">
          Nothing to show here. Start following threads by clicking the bookmark icon on them.
        </mu-content-block>
        <!--Then, if results are returned, show the list -->
        <mu-content-block v-else v-for="item in threads" :key="item.id">
          <mu-list-item class="latest-threads" :title="item.title">
            <mu-avatar :src="item.userData.photoURL" slot="leftAvatar"/>
            <span slot="describe">
              {{item.lastMessage}}
              <br />
              {{item.lastUpdated | parseDate}}
            </span>
            <mu-badge
              v-for="tag in item.tags"
              class="badge"
              :content="tag"
              :key="tag"
              primary
              slot="right"
              :color="tagColorMap[tag]"
            />
            <mu-checkbox
              class="badge"
              slot="right"
              uncheckIcon="bookmark_border"
              checkedIcon="bookmark"
              v-model="followingThreads[item.id]"
              @change="onCheckboxChange(item.id, $event)"
            />
            <mu-badge :content="item.numReplies.toString()" primary slot="right">
              <mu-icon value="chat_bubble"/>
            </mu-badge>
          </mu-list-item>
          <mu-divider />
        </mu-content-block>
      </mu-content-block>
    </mu-row>

    <new-thread-dialog />
  </div>
</template>

<script>
import {mapState} from 'vuex'
import moment from 'moment'

import NewThreadDialog from './NewThreadDialog'

export default {
  name: 'following',
  data () {
    return {
      loadingState: true,
      threads: []
    }
  },
  created () {
    // Setting the page title
    this.$store.commit('setPageTitle', 'Following')

    this.updateThreads()
  },
  components: {
    'new-thread-dialog': NewThreadDialog
  },
  filters: {
    parseDate (date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    }
  },
  computed: mapState([
    // maps this.<prop> to $store.state.<prop>
    'userLoggedIn',
    'firebaseRef',
    'userData',
    'followingThreads',
    'tagColorMap'
  ]),
  watch: {
    followingThreads (threads) {
      this.updateThreads()
    }
  },
  methods: {
    // Displays the tag array in a comma separated string
    formatTags (tags) {
      return tags.join()
    },
    onCheckboxChange (threadId, state) {
      // update firebase with the state
      // update the dict in firebase
      // /users/userId/following/{threadId: true}
      // TODO: actually remove the key when state === false
      let updates = {}
      updates[threadId] = state
      this.firebaseRef.user.child(`${this.userData.uid}/following`)
      .update(updates)
      .then(() => {
        const statusMsg = state ? 'Following the thread' : 'Unfollowed the thread'
        this.$store.commit('showSnackbar', statusMsg)
        setTimeout(() => {
          this.$store.commit('hideSnackbar')
        }, 2000)
      })
      .catch((error) => {
        console.error(error)
        this.$store.commit('showSnackbar', error.message)
      })
    },
    updateThreads () {
      // Going through following threads dict
      let hasValue = false
      Object.keys(this.followingThreads).forEach((threadId) => {
        // If the threadId is set to true, fetch the contents of the thread
        if (this.followingThreads[threadId]) {
          hasValue = true
          this.firebaseRef.threads.child(threadId).once('value')
          .then((snapshot) => {
            let threadData = snapshot.val()
            this.threads.push({
              id: threadId,
              ...threadData
            })
            this.loadingState = false
          })
          .catch(err => {
            console.error(err)
            this.$store.commit('showSnackbar', err.message)
          })
        }
      })

      // If there's no data in the following threads, show the empty message
      if (!hasValue) {
        this.loadingState = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
