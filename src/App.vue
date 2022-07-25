<template>
  <div id="app">
    <router-link to="/administrator/login"></router-link>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false,
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
    }
  }
}
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
}
</style>
