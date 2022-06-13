<template>
  <section>
    <main-header></main-header>
    <router-view></router-view>
  </section>
</template>

<script>
import mainHeader from './components/main-header.vue'

export default {
  name: 'app-vue',
  computed: {
    editModalStatus() {
      return this.$store.getters.editModalStatus
    }
  },
  components: {
    mainHeader
  },


}
</script>

<style>
</style>