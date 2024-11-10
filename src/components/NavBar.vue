<template>
  <div>
    <ALayout>
      <ALayoutHeader class="header">
        <div class="nav-container">
          <div class="left-content">
            <RouterLink to="/">Instagram</RouterLink>
            <AInputSearch
              v-model:value="searchValue"
              placeholder="input search text"
              style="width: 300px"
              @search="onSearch"
              class="searchInp"
            />
          </div>
          <div v-if="!loadingUser">
            <div class="btns" v-if="!user">
              <AuthModal title="SignUp" />
              <AuthModal title="Login" />
            </div>
            <div v-else class="btns">
              <AButton type="primary" @click="goToProfile">Profile</AButton
              ><AButton type="primary" @click="handleLogOut">LogOut</AButton>
              <!-- <p>{{ user }}</p> -->
            </div>
          </div>
        </div>
      </ALayoutHeader>
    </ALayout>
  </div>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router";
import { ref } from "vue";
import AuthModal from "./AuthModal.vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { user, loadingUser } = storeToRefs(userStore);
const searchValue = ref("");
const isAuth = ref(false);
const router = useRouter();
const onSearch = () => {
  if (searchValue.value.trim()) {
    router.push(`/profile/${searchValue.value.trim()}`);
    searchValue.value = "";
  }
};
const handleLogOut = async()=>{
  await userStore.handleLogOut()
}
const goToProfile = ()=>{
  router.push(`/profile/${user.value.username}`);
}
</script>

<style scoped>
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-content {
  display: flex;
  gap: 20px;
  align-items: center;
}
.btns {
  display: flex;
  gap: 10px;
}
@media (max-width: 600px) {
  .header {
    padding-inline: 10px;
  }
  .searchInp {
    width: 200px !important;
  }
}
@media (max-width: 500px) {
  .left-content {
    gap: 10px;
  }
  .btns {
    gap: 5px;
  }
}
@media (max-width: 400px) {
  .searchInp {
    width: 150px !important;
  }
  .left-content {
    gap: 5px;
  }
}
</style>
