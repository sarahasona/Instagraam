<template>
  <div
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-5 min-h-[80vh] mx-auto"
  >
    <Card v-for="post in posts" :key="post.id" :user="post" />
  </div>
  <Observer v-if="posts.length" @intersect="fetchNextData" />
</template>

<script setup>
import { supabase } from "@/supabase";
import Card from "./Card.vue";
import Observer from "./Observer.vue";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
const reachedEnd = ref(false);
const lastIndex = ref(3);
const ownersIds = ref([]);
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const fetchData = async () => {
  const { data } = await supabase
    .from("followers_following")
    .select("following_id")
    .eq("follower_id", user.value.id);
  const following_ids = data.map((f) => f.following_id);
  ownersIds.value = following_ids;
  console.log(data);
  console.log(following_ids);
  // get data of follwing

  const res = await supabase
    .from("posts")
    .select()
    .in("owner_id", following_ids)
    .range(0, lastIndex.value)
    .order("created_at", { ascending: false });
  console.log(res);

  posts.value = res.data;
};
const fetchNextData = async () => {
  if (reachedEnd.value) return;
  const { data } = await supabase
    .from("posts")
    .select()
    .in("owner_id", ownersIds.value)
    .range(lastIndex.value + 1, lastIndex.value + 4)
    .order("created_at", { ascending: false });
  posts.value = [...posts.value, ...data];
  lastIndex.value += 4;
  if (!data.length) {
    reachedEnd.value = true;
  }
};
onMounted(() => {
  fetchData();
});
const posts = ref([]);
</script>

<style lang="scss" scoped></style>
