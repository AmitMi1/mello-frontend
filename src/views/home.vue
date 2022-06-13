<template>
<section class="homepage">
      <nav class="homepage-nav flex">
         <router-link title="Boards" to='/board' class="logo"><img src="../assets/homeLogo.png" alt=""></router-link>
        <div>

         <router-link title="Login" to='/login' class="login">Log in</router-link>
         <router-link title="Signup" to='/signup' class="signup">Sign up</router-link>
        </div>
      </nav>
      <main class="flex center">
        <img class="hero" src="../assets/Asset3.png" alt="">
        <div class="text">
        <h1>Mello helps teams move work forward.</h1>
        <p>As your software team grows, Mello makes it easy to manage workflows across multiple teams and projects. Simple, intuitive, fast: Mello is where software teams do their best work.
         Free to get started, with easy user experience Mello.</p>
         <a @click="startGuest" class="btn-start">Start as a guest</a>
        </div>
      </main>
  </section>
</template>

<script>

import { userService } from '../services/user.service';

export default {
  name: 'home',
  components: {
  },

  
  created() { },
  methods: {
    async goToBoardsPage() {
      this.$router.push("/board/624afa5e47cdb81018c1bc99");
    },
    async startGuest(){
     const res = await userService.guest()    
      this.$router.push("/board/6297c0b99389cf297839f68a");
    }
  },
};
</script>