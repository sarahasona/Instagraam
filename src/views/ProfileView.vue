<template>
  <div class="profile-container">
    <div class="container mx-auto border border-red-500 p-5" v-if="!loading">
      <UserBar
        :userD="user"
        :userData="userData"
        :isFollowing="isFollowing"
        :toggleFollowingFlag="toggleFollowingFlag"
        :updateFollowersCount="updateFollowersCount"
      ></UserBar>
      <ImageGallary :posts="posts"></ImageGallary>
    </div>
    <div class="spinner flex justify-center items-center pt-[200px]" v-else>
      <ASpin size="large" />
    </div>
  </div>
</template>

<script setup>
import UserBar from "@/components/UserBar.vue";
import ImageGallary from "@/components/ImageGallary.vue";
import { onMounted, watch, ref, provide, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/supabase";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
// flag to check f person who is logged in follow the person profile
const isFollowing = ref(false);
const userStore = useUserStore();
const { user: loggedInUser } = storeToRefs(userStore);
const route = useRoute();
const name = ref("");
const followersCount = ref(0);
const followingCount = ref(0);
const userData = reactive({
  posts: computed(() => posts.value.length),
  followers: computed(() => followersCount.value),
  following: computed(() => followingCount.value),
});
const posts = ref([]);
const user = ref({});
const loading = ref(false);
const addNewPost = (post) => {
  posts.value.unshift(post);
};
provide("addNewPost", addNewPost);
onMounted(() => {
  console.log(route.params.username); // get user id from the route
  name.value = route.params.username;
  fetchUserData();
});
watch(route, () => {
  name.value = route.params.username; // update name when the route changes
  fetchUserData();
  console.log(user.value);
});
const fetchUserData = async () => {
  loading.value = true;
  const { data } = await supabase
    .from("users")
    .select()
    .eq("username", route.params.username)
    .single();
  if (!data) {
    loading.value = false;
    posts.value = [];
    return (user.value = null);
  }
  user.value = data;
  await getUserPosts(user.value.id);
  await fetchIsFollowing();
  await fetchFollowersCount();
  await fetchFollowingCount();
  // userData.posts = posts.value.length;
  loading.value = false;
};
const getUserPosts = async (id) => {
  posts.value = [];
  const { data } = await supabase
    .from("posts")
    .select()
    .eq("owner_id", id)
    .order("created_at", { ascending: false });
  posts.value = data;
};
const fetchIsFollowing = async () => {
  // follower id ===> user is logged in
  //following id ==> user profile
  if (loggedInUser.value) {
    console.log(loggedInUser.value);
    console.log(`loggedInUser ${loggedInUser.value.id}`);
    console.log(`user profile ${user.value.id}`);
    if (loggedInUser.value && loggedInUser.value.id != user.value.id) {
      const response = await supabase
        .from("followers_following")
        .select()
        .eq("follower_id", loggedInUser.value.id)
        .eq("following_id", user.value.id);
      // if we get data back that means the person is logged in is following the person profile
      console.log(response);
      if (response.data.length > 0) {
        isFollowing.value = true;
      } else {
        isFollowing.value = false;
      }
    }
  }
};
const fetchFollowersCount = async () => {
  // get followers count
  //logedin id ==> following_id
  const { data, count, error } = await supabase
    .from("followers_following")
    .select("*", { count: "exact" })
    .eq("following_id", user.value.id);
  console.log(data);
  if (error) {
    console.error("Error fetching count:", error);
  } else {
    console.log("Count of records:", count);
    followersCount.value = count || 0;
  }
};
const fetchFollowingCount = async () => {
  //logedin id ==> follower_id
  const { data, count, error } = await supabase
    .from("followers_following")
    .select("*", { count: "exact" })
    .eq("follower_id", user.value.id);
  if (error) {
    console.error("Error fetching count:", error);
  } else {
    console.log("Count of records:", count);
    // userData.following = count;
    followingCount.value = count || 0; // update the following count in user data object as well.  //this is a better way of updating the data as it's reactive in Vue.js.  //you can also use computed property to achieve the same result.  //if you want to update the count in real-time as followers change, you can use a websocket or a polling mechanism.  //Here we are just updating it once when the loggedInUser changes.  //This way, the UI will always reflect the current count of followers.  //It's also important to note that this approach assumes you have a followers_following table where follower_id and following_id are stored.  //If you have a different table structure, you may need to adjust the query accordingly.  //Also, please note that this code assumes you have a followers_following table with a primary key of follower_id and following_id
  }
};

const toggleFollowingFlag = (follow) => {
  isFollowing.value = follow;
};
watch(loggedInUser, () => {
  fetchIsFollowing();
});
const updateFollowersCount = (count) => {
  followersCount.value += count;
};
</script>

<style lang="scss" scoped></style>
