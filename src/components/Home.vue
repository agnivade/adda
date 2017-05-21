<template>
  <div>
    <mu-row gutter>
      <mu-col width="100" tablet="80" desktop="50">
        <mu-sub-header>Latest</mu-sub-header>
        <template v-if="showLatestThreads">
          <mu-content-block v-for="item in latestThreadsDesc" :key="item.id">
            <mu-list-item class="latest-threads" :title="item.title">
              <mu-avatar :src="item.userData.photoURL" slot="leftAvatar"/>
              <span slot="describe">
                {{item.lastMessage}}
                <br />
                {{item.lastUpdated | parseDate}}
              </span>
              <mu-badge class="badge" :content="formatTags(item.tags)" primary slot="right"/>
              <mu-checkbox class="badge" slot="right"  uncheckIcon="bookmark_border" checkedIcon="bookmark" />
              <mu-badge :content="item.numReplies.toString()" primary slot="right">
                <mu-icon value="chat_bubble"/>
              </mu-badge>
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
      <mu-col width="100" tablet="80" desktop="50">
        <mu-sub-header>Top</mu-sub-header>
        <template v-if="showTopThreads">
          <mu-content-block v-for="item in topThreadsDesc" :key="item.id">
            <mu-list-item class="top-threads" :title="item.title">
              <mu-avatar :src="item.userData.photoURL" slot="leftAvatar"/>
              <span slot="describe">
                {{item.lastMessage}}
                <br />
                {{item.lastUpdated | parseDate}}
              </span>
              <mu-badge class="badge" :content="formatTags(item.tags)" primary slot="right"/>
              <mu-checkbox class="badge" slot="right"  uncheckIcon="bookmark_border" checkedIcon="bookmark" />
              <mu-badge :content="item.numReplies.toString()" primary slot="right">
                <mu-icon value="chat_bubble"/>
              </mu-badge>
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
import moment from 'moment'

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
  filters: {
    parseDate (date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    }
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
  },
  methods: {
    formatTags (tags) {
      return tags.join()
    }
  }
}
</script>

<style lang="scss">
.badge {
  margin-right: 1rem;
}
.latest-threads .mu-item-right, .top-threads .mu-item-right{
  width: auto;
}
</style>
