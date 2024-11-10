<template>
  <div class="observer w-[10px] h-[10px] bg-red-500 mx-auto" ref="root"></div>
</template>

<script setup>
import { ref,onMounted,defineEmits } from "vue";
const root = ref(null);
const observer = ref(null);
const emits = defineEmits(["intersect"]);
onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      console.log("Element is visible");
      emits("intersect");
    }
  });
  observer.value.observe(root.value);
});
</script>

<style scoped></style>
