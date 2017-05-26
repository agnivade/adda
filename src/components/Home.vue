<template>
  <div>
    <mu-row gutter>
      <mu-col width="100" tablet="80" desktop="50">
        <!-- Latest threads secton -->
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
        <!-- Top threads secton -->
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
    // Getting the threads sorted by lastUpdated and stars
    // and populating the data model
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
    // Show the loading gif if the data model is not yet populated
    showLatestThreads () {
      return this.latestThreads.length !== 0
    },
    showTopThreads () {
      return this.topThreads.length !== 0
    },
    // computed property to reverse the list, because firebase only orders by asc
    latestThreadsDesc () {
      return this.latestThreads.reverse()
    },
    topThreadsDesc () {
      // Also sorting by numReplies
      return this.topThreads.sort((a, b) => {
        return a['numReplies'] > b['numReplies']
      }) // and then reversing
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
    // Displays the tag array in a comma separated string
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
