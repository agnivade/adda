<template>
  <div>
    <mu-row gutter>
    <mu-content-block>
      <!-- Tags as chips -->
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
        @focus="autoCompleteFocussed=true"
        @blur="autoCompleteFocussed=false"
        @select="itemSelected"
        @input="onAutoCompleteChange"
        v-model="tagText"
      />
      <!-- The underline effect -->
      <hr class="mu-text-field-line">
      <hr class="mu-text-field-focus-line" :class="{'focus' : autoCompleteFocussed}">

      <!--First, show the spinner if its loading data -->
      <mu-content-block v-if="loadingState">
        <mu-circular-progress :size="40"/>
      </mu-content-block>
      <mu-content-block v-else>
        <!--Then, if nothing is found -->
        <mu-content-block v-if="filteredThreads.length === 0">
          No threads found matching those tags
        </mu-content-block>
        <!--Then, if results are returned, show the list -->
        <mu-content-block v-else v-for="item in filteredThreads" :key="item.id">
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
  name: 'filter',
  data () {
    return {
      tags: [],
      autoCompleteFocussed: false,
      autoCompleteTags: ['general', 'dev', 'sales', 'ops'],
      loadingState: true,
      tagText: '',
      filteredThreads: []
    }
  },
  created () {
    // Setting the tags
    this.tags = this.$route.params.tags.split(',')
    // Setting the page title
    this.$store.commit('setPageTitle', 'Filter')
  },
  // This gets called when you go from one filter to another
  beforeRouteUpdate (to, from, next) {
    // Setting the tags
    this.tags = to.params.tags.split(',')
    next()
  },
  components: {
    'new-thread-dialog': NewThreadDialog
  },
  watch: {
    tags (tags) {
      // Update the filter view on any changes to tag array
      this.updateThreads()
    }
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
    'userData'
  ]),
  methods: {
    itemSelected (item) {
      // Check for dupes
      // Append to the list
      this.tags.push(item)
      // Setting tag text to empty
      this.tagText = ''
      // Putting the focus back to the auto complete again
      this.putFocus()
    },
    onAutoCompleteChange () {
      // Only do this if a space is pressed
      if (this.tagText.endsWith(' ')) {
        // Append to the list
        this.tags.push(this.tagText.trim())
        // Setting tag text to empty
        this.tagText = ''
        // Putting the focus back to the auto complete again
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
    // Displays the tag array in a comma separated string
    formatTags (tags) {
      return tags.join()
    },
    // Get the tag array and do a firebase query again to re-filter the threads
    updateThreads () {
      this.filteredThreads = []
      this.loadingState = true

      // Getting a list of promises from firebase refs
      let tagPromises = this.tags.map((tag) => {
        return this.firebaseRef.tags.child(tag).once('value')
      })

      // Executing all the promises
      Promise.all(tagPromises)
      .then((responses) => {
        this.loadingState = false
        // Temporary dict to hold the threads
        let tmpFilteredThreads = {}
        // Going through the response list
        for (const snapshot of responses) {
          let threads = snapshot.val()
          if (!threads) {
            return
          }
          // Each object under a tag is a dictionary of thread metadata
          // So storing them in a dict first, to get rid of duplicate threads coming from multiple tags
          Object.keys(threads).forEach((threadId) => {
            tmpFilteredThreads[threadId] = threads[threadId]
          })
        }
        // flattening them and pushing to filteredThreads list
        Object.keys(tmpFilteredThreads).forEach((threadId) => {
          this.filteredThreads.push({
            id: threadId,
            ...tmpFilteredThreads[threadId]
          })
        })
      })
      .catch(err => {
        this.$store.commit('showSnackbar', err)
        console.error(err)
      })

      // If there are no tags, then don't forget to state loadingState to false
      if (this.tags.length === 0) {
        this.loadingState = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.mu-text-field-line, .mu-text-field-focus-line {
  position: relative;
}
</style>

