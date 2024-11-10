<template>
  <div class="container mx-auto pt-[40px]">
    <div v-if="!loadingUser">
      <Cards v-if="user" />
      <LogInMsg v-else />
    </div>
    <div v-else class="min-h-[80vh] flex justify-center items-center">
      <ASpin />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/users";
import Cards from "./Cards.vue";
import LogInMsg from "./LogInMsg.vue";
const userStore = useUserStore();
const { user, loadingUser } = storeToRefs(userStore);
</script>

<style lang="scss" scoped></style>
