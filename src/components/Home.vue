<template>
  <div>
    <mu-row gutter>
      <mu-col width="100" tablet="50" desktop="50">
        <mu-sub-header>Latest</mu-sub-header>
        <template v-if="showLatestThreads">
          <mu-content-block v-for="item in latestThreadsDesc" :key="item.id">
            <mu-list-item :title="item.title">
              <mu-avatar :src="item.userData.photoURL" slot="leftAvatar"/>
              <span slot="describe">
                {{item.lastMessage}}
              </span>
            </mu-list-item>
            <mu-divider />
          </mu-content-block>
        </template>
        <template v-else>
          <mu-content-block>
            <mu-circular-progress :size="40"/>
          </mu-content-block>
        </template>
      </mu-col>
      <mu-col width="100" tablet="50" desktop="50">
        <mu-sub-header>Top</mu-sub-header>
        <template v-if="showTopThreads">
          <mu-content-block v-for="item in topThreadsDesc" :key="item.id">
            <mu-list-item :title="item.title">
              <mu-avatar :src="item.userData.photoURL" slot="leftAvatar"/>
              <span slot="describe">
                {{item.lastMessage}}
              </span>
            </mu-list-item>
            <mu-divider />
          </mu-content-block>
        </template>
        <template v-else>
          <mu-content-block>
            <mu-circular-progress :size="40"/>
          </mu-content-block>
        </template>
      </mu-col>
    </mu-row>

    <new-thread-dialog />
  </div>
</template>

<script>
import {mapState} from 'vuex'

import NewThreadDialog from './NewThreadDialog'

export default {
  name: 'home',
  data () {
    return {
      latestThreads: [],
      topThreads: []
    }
  },
  components: {
    'new-thread-dialog': NewThreadDialog
  },
  created () {
    // Setting the page title
    this.$store.commit('setPageTitle', 'Home')
    // Getting data from firebase
    this.firebaseRef.threads.orderByChild('lastUpdated').limitToFirst(10)
    .on('child_added', (data) => {
      this.latestThreads.push({
        id: data.key,
        ...data.val()
      })
    })

    this.firebaseRef.threads.orderByChild('stars').limitToFirst(10)
    .on('child_added', (data) => {
      this.topThreads.push({
        id: data.key,
        ...data.val()
      })
    })
  },
  computed: {
    showLatestThreads () {
      return this.latestThreads.length !== 0
    },
    showTopThreads () {
      return this.topThreads.length !== 0
    },
    latestThreadsDesc () {
      return this.latestThreads.reverse()
    },
    topThreadsDesc () {
      // Also sorting by numReplies
      return this.topThreads.sort((a, b) => {
        return a['numReplies'] > b['numReplies']
      })
      .reverse()
    },
    ...mapState([
      // maps this.<prop> to $store.state.<prop>
      'userLoggedIn',
      'firebaseRef',
      'userData'
    ])
  }
}
</script>
