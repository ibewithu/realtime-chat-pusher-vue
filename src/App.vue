<template>
  <div id="nav">
    
  </div>
  <router-view :username="username" />
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      username: 'Anonymous'
    }
  },
  created () {
    const currentUsername = window.prompt('Enter username: ', 'Anonymous')
    this.username = currentUsername
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
