<template>
  <div>
    <h1>Welcome to adda !</h1>
    <mu-float-button secondary icon="add" class="addBtn" @click="openDialog()" />
    <mu-dialog :open="dialogOpen" title="New thread" >
      Select tags
      <br />
      Put a markdown editor here
    <mu-raised-button slot="actions" label="Cancel" @click="closeDialog" />
    <mu-raised-button slot="actions" primary label="Post" @click="closeDialog" />
  </mu-dialog>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      dialogOpen: false
    }
  },
  methods: {
    openDialog () {
      this.dialogOpen = true
    },
    closeDialog () {
      this.dialogOpen = false
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
