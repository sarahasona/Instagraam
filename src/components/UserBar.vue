<template>
  <div class="content-data">
    <div v-if="userD">
      <div class="user-control flex justify-between">
        <ATypographyTitle :level="2">{{ userD.username }}</ATypographyTitle>
        <div v-if="user">
          <UploadModal v-if="user.username == userD.username" />
          <div v-else>
            <AButton
              type="primary"
              v-if="!isFollowing"
              @click="followUser"
              :disabled="updatFollow"
              >Follow</AButton
            >
            <AButton
              type="primary"
              v-else
              @click="unFollowUser"
              :disabled="updatFollow"
              >UnFollow</AButton
            >
          </div>
        </div>
      </div>
      <div class="details flex items-center justify-start gap-20">
        <ATypographyTitle :level="5"
          >{{ userData.posts }} Posts</ATypographyTitle
        >
        <ATypographyTitle :level="5"
          >{{ userData.followers }} Followers</ATypographyTitle
        >
        <ATypographyTitle :level="5"
          >{{ userData.following }} Following</ATypographyTitle
        >
      </div>
    </div>
    <div v-else>
      <div class="user-control flex justify-between">
        <ATypographyTitle :level="2">No such User</ATypographyTitle>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
import UploadModal from "./UploadModal.vue";
import { supabase } from "@/supabase";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const updatFollow = ref(false);
const {
  userD,
  userData,
  isFollowing,
  toggleFollowingFlag,
  updateFollowersCount,
} = defineProps([
  "userD",
  "userData",
  "isFollowing",
  "toggleFollowingFlag",
  "updateFollowersCount",
]);
const followUser = async () => {
  try {
    updatFollow.value = true;
    const response = await supabase.from("followers_following").insert({
      follower_id: user.value.id,
      following_id: userD.id,
    });
    console.log(response);
    toggleFollowingFlag(true);
    updateFollowersCount(1);
    updatFollow.value = false;
  } catch (error) {
    console.error(error);
    return;
  }
};

const unFollowUser = async () => {
  try {
    updatFollow.value = true;
    const response = await supabase.from("followers_following").delete().match({
      follower_id: user.value.id,
      following_id: userD.id,
    });
    console.log(response);
    toggleFollowingFlag(false);
    updatFollow.value = false;
    updateFollowersCount(-1);
  } catch (error) {
    console.error(error);
    return;
  }
};
</script>

<style scoped>
h5 {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
