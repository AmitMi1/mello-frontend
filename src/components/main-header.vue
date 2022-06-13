<template>
  <section :style="{'background-color': `${bg}`}" class="main-header">
    <router-link to="/board"><button class="btn-boards" title="Boards"><img src="../assets/boards.png" alt=""></button></router-link>
    <router-link to="/"><button title="Mello" class="btn-logo" ><img src="../assets/logo.gif" alt=""></button></router-link>
    <button @click="boardMenuOpen=!boardMenuOpen" class="btn-opt create" title="Create">Create</button>
    <board-add-menu  @closeMenu="boardMenuOpen=false" :menuOpen="boardMenuOpen"></board-add-menu>
        <user-avatar v-if="user" :diameter="32" :user="user"/>
  </section>
</template>

<script>
import userAvatar from "../components/user-avatar.vue";
import boardCompose from "../components/board-compose.vue";
import boardList from "../components/board-list.vue";
import userMenu from "../components/user-menu.vue";
import boardAddMenu from "./board-add-menu.vue";
import BoardAddMenu from "./board-add-menu.vue";
import { userService } from "../services/user.service";

export default {
  data() {
    return {
      boardMenuOpen: false,
      user: null,
      bg: ''
    };
  },
  components: {
    userAvatar,
    boardCompose,
    boardList,
    userMenu,
    boardAddMenu,
    BoardAddMenu
},
  created() {
   
  },
  computed: {
    boards() {
      return this.$store.getters.boards;
    },
  },
  watch: {
    '$route.params'(p) {
      if (!p.boardId) {
        this.bg = '#026AA7'
      }
        else {
          this.user = userService.getLoggedinUser()
          this.bg = '#00000040'
        }
      { immediate: true }
    },
  }
};
</script>
