<template>
  <div id="app">
  <mu-appbar title="adda" class="appbar" :zDepth="2">
    <mu-avatar slot="right" icon="account_circle"/>
    <mu-icon-menu icon="more_vert" slot="right">
    </mu-icon-menu>
  </mu-appbar>
    <div class="empty-space">
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
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
</style>
