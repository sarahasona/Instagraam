<script setup>
import { onMounted } from "vue";
import NavBar from "./components/NavBar.vue";
import { RouterView } from "vue-router";
import { useUserStore } from "./stores/users";
const userStore = useUserStore()
onMounted(async ()=>{
  await userStore.getUser();
})
</script>

<template>
  <div class="">
    <NavBar />
    <RouterView />
  </div>
</template>
