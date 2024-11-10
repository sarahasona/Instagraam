<template>
  <div class="mb-5">
    <NCard
      title="Card with Cover"
      class="flex flex-col shadow-lg border border-gray-200 max-w-[300px] mx-auto min-h-[300px]"
    >
      <img :src="`${VITE_BASE_IMAGE_URL}${user.url}`" />
      <div class="content px-2">
        <p class="text-xl font-bold">{{ user.name }}</p>
        <p>{{ user.caption }}</p>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
img {
  height: 200px;
}
</style>
<script setup>
import { defineProps } from "vue";
defineProps(["user"]);
const { VITE_BASE_IMAGE_URL } = import.meta.env;

// const props = defineProps({
//   user: {
//     type: Object,
//     required: true,
//   },
// });
</script>
