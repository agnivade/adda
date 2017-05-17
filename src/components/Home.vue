<template>
  <div>
    <h1>Welcome to adda !</h1>

    <mu-row gutter>
      <mu-col width="100" tablet="50" desktop="50">
        <mu-sub-header>Latest</mu-sub-header>
        <mu-content-block v-for="item in latestThreadsDesc" :key="item.id">
          <mu-list-item :title="item.title">
            <mu-avatar :src="item.userData.photoURL" slot="leftAvatar"/>
            <span slot="describe">
              {{item.lastMessage}}
            </span>
          </mu-list-item>
          <mu-divider />
        </mu-content-block>
      </mu-col>
      <mu-col width="100" tablet="50" desktop="50">
        <mu-sub-header>Top</mu-sub-header>
        <mu-content-block v-for="item in topThreadsDesc" :key="item.id">
          <mu-list-item :title="item.title">
            <mu-avatar :src="item.userData.photoURL" slot="leftAvatar"/>
            <span slot="describe">
              {{item.lastMessage}}
            </span>
          </mu-list-item>
          <mu-divider />
        </mu-content-block>
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
