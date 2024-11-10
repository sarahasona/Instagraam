<template>
  <div
    class="gallary grid justify-items-center lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-10 mt-10"
  >
    <div v-for="post in posts" :key="post.url">
      <img :src="`${VITE_BASE_IMAGE_URL}${post.url}`" class="w-[200px] h-[200px] rounded" alt="" />
      <p>{{ post.caption }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps(["posts"]);
const { VITE_BASE_IMAGE_URL } = import.meta.env;
</script>

<style lang="scss" scoped></style>
