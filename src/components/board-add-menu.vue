<template>
<section class="board-add-menu">
<custom-menu  :menuOpen="menuOpen">
   <p>Create board</p>
    <button @click="closeMenu" class="close" title="Close"></button>
   <hr>
   <section  class="board-add-container flex align-center column">
   <div :style="getBg" class="board-image-container flex center align-center"><img class="board-image" src="../assets/boardAdd.svg" alt=""></div>
   <div class="bg-selector">
   <p>Background</p>
   <div class="btn-bg-container flex wrap">
   <label v-for="(bg, idx) in boardToAdd.style.bgImg" :key="idx" @click.stop="setBg(bg)" :idx="idx">
      <img v-if="bg.split('')[0] !== '#'" class="bg-opt" :src="bg" alt="" :ref="bg">
      <div :style="getStyle(bg)" class="bg-opt clr" v-if="bg.split('')[0] == '#'" :ref="bg"></div>
   </label>
   <p>Board title <span>*</span></p>
    <form action="submit" @submit.prevent="">
   <input required ref="title" @focus="getClass" @input="getClass" placeholder="   " v-focus type="text">
   <div class="emoticon">👋 Board title is required</div>
   <button ref="btn" type="submit" @click="saveBoard">Create</button>
   </form>
   </div>
   </div> 
    
   </section>
</custom-menu>
  </section>
</template>

<script>

import customMenu from "./custom-menu.vue"

export default {
  props: {
    menuOpen:Boolean,
  },
  data(){
    return {
      boardToAdd: null,
      boardBg: '#0079bf'
    }
  },
  components: {
    customMenu
  },
  async created(){
    const board = await this.$store.dispatch({type: 'getEmptyBoard'})
    this.boardToAdd = board
  },
  mounted() {
  },
  methods: {
    setBg(bg){
      this.boardBg=bg
      
      for (const bg in this.$refs) {
        if(this.boardBg === bg){
          if(bg.split('')[0] === '#'){
            this.$refs[bg][0].classList.value = 'bg-opt clr checked'
          } else {
            this.$refs[bg][0].classList.value = 'bg-opt checked'
          }
        } else {
          if(bg.split('')[0] === '#'){
            this.$refs[bg][0].classList.value = 'bg-opt clr'
          } else {
            this.$refs[bg][0].classList.value = 'bg-opt'
          }
        } 
      }
    },
    closeMenu(){
      this.$emit('closeMenu')
    },
    getStyle(bg){
    return `background-color: ${bg}`
    },
    getClass(){
      if(this.$refs.title.value) this.$refs.btn.classList.value = 'enable'
      else this.$refs.btn.classList.value = 'disable'
    },
    async saveBoard(){
      if(!this.$refs.title.value) return
      this.boardToAdd.title = this.$refs.title.value
      this.boardToAdd.style.bg = this.boardBg
      const user = this.$store.getters.loggedinUser
      this.boardToAdd.createdBy = {
        "_id": user._id,
        "fullname": user.fullname,
        "imgUrl": "http://some-img"
      }
      this.boardToAdd.members.unshift(user)
      delete this.boardToAdd.style.bgImg
     const board = await this.$store.dispatch({type: 'saveCurrBoard', boardToSave: this.boardToAdd})
    this.boardToAdd = await this.$store.dispatch({type: "getEmptyBoard"})
    this.$emit('closeMenu')
    this.$router.push(`/board/${board._id}`);
    }
  },
  computed: {
    getBg(){
      if(this.boardBg){
        if(this.boardBg.split('')[0] === '#')
        return `background-color: ${this.boardBg}` 
        return `background-image: url(${this.boardBg})` 
      }
    },
  },
 
}
</script>

<style>

</style>