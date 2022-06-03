<template>
<section class="board-share-menu">
<custom-menu  :menuOpen="menuOpen">
   <p>Share</p>
    <button @click="closeMenu" class="close" title="Close"></button>
   <hr>
   <section class="users">
   <div @click="shareBoard(user._id)" class="user flex align-center" v-for="user in users" :key="user._id">
     <user-avatar :user="user"></user-avatar>
     <div class="name">{{user.fullname}}</div>
     <span v-if="checkMember(user._id)" class="member-mark"></span>
   </div>
    
   </section>
</custom-menu>
  </section>
</template>

<script>

import customMenu from "./custom-menu.vue"
import userAvatar from "./user-avatar.vue"
import { boardService } from "../services/board.service"
import { userService } from "../services/user.service"

export default {
  props: {
    menuOpen:Boolean,
  },
  data(){
    return {
      users: null,
      members: null,
      board: null,
      updateKey: 0,
    }
  },
  components: {
    customMenu,
    userAvatar
  },
  async created(){
    this.users = await userService.getUsers()
    const loggedInUser = userService.getLoggedinUser()
    this.users = this.users.filter(user=> user._id !== loggedInUser._id)
    console.log(this.$route.params.boardId);
    this.board = await boardService.getById(this.$route.params.boardId)
    this.members = this.board.members
    // console.log(this.users, loggedInUser);
  },
  mounted() {
    console.log(this.$store.getters.currBoard);
  },
  methods: {
    checkMember(userId){
      // console.log(this.members.findIndex(member=> member._id == userId));
      if (this.members.findIndex(member=> member._id == userId) !== -1){
        // this.members = this.members
        // this.$forceUpdate()
        return true
      }
      else return false
    },
   async shareBoard(userId){
       this.board = await boardService.getById(this.$route.params.boardId)
     this.members = this.board.members
     const idx = this.members.findIndex(member => member._id === userId)
      if (idx !== -1 ){
        console.log('hi');
        return
      }
      this.$emit('shareBoard', userId)
      this.updateKey +=1
//      const board = await this.$store.dispatch({ type: 'loadCurrBoard', boardId:this.board._id })
// this.board = this.$store.getters.currBoard
//       console.log(board);

      // this.board = this.$store.getters.currBoard
    // //   this.board = await boardService.getById(this.$route.params.boardId)
    // this.members = this.board.members
    // this.updateKey += 1
    //   // this.$forceUpdate()
    },
    closeMenu(){
      this.$emit('closeMenu')
    },
    async saveBoard(){
      

    }
  },
  computed: {
    
  },
  watch:{
     async '$route.params.boardId'(id) {
      // if (!id) return
      console.log('Changed to', this.board)
          console.log(this.$store.getters.currBoard);
// await this.$store.dispatch({ type: 'loadCurrBoard', boardId:id })
// this.board = this.$store.getters.currBoard
      this.board = await boardService.getById(this.$route.params.boardId)
    this.members = this.board.members
      // this.$forceUpdate()
      // this.members = this.board.members
      // { immediate: true }
    },
  }
 
}
</script>

<style>

</style>