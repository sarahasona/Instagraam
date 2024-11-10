<template>
  <div>
    <AButton type="primary" @click="showModal">{{ title }}</AButton>
    <AModal
      v-model:open="open"
      :title="title"
      @ok="handleOk"
      class="modal-container"
    >
      <template #footer>
        <AButton key="back" @click="handleCancel">Cancel</AButton>
        <AButton
          key="submit"
          type="primary"
          :disabled="loading"
          :loading="loading"
          @click="handleOk"
          >Submit</AButton
        >
      </template>
      <div class="content">
        <div class="input-container" v-if="!loading">
          <AInput
            v-model:value="userCredintails.username"
            placeholder="Username"
            v-if="title == 'SignUp'"
            class="mb-2"
          />
          <AInput
            v-model:value="userCredintails.email"
            placeholder="Email"
            class="mb-2"
          />
          <AInputPassword
            v-model:value="userCredintails.password"
            placeholder="password"
            class="mb-2"
          />
          <a-typography-title :level="5" type="danger">{{
            errorMsg
          }}</a-typography-title>
        </div>
        <div class="spinner flex justify-center items-center" v-else>
          <ASpin />
        </div>
      </div>
    </AModal>
  </div>
</template>
<script setup>
import { ref, defineProps, reactive } from "vue";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { user, errorMsg, loading } = storeToRefs(userStore);
const { title } = defineProps(["title"]);
const open = ref(false);
const userCredintails = reactive({
  email: "",
  password: "",
  username: "",
});
const showModal = () => {
  resetUserCredintial();
  errorMsg.value = "";
  open.value = true;
};
const handleCancel = () => {
  open.value = false;
  errorMsg.value = "";
  resetUserCredintial();
};
const resetUserCredintial = () => {
  userCredintails.email = "";
  userCredintails.password = "";
  userCredintails.username = "";
};
const handleOk = async (e) => {
  if (title == "SignUp") {
    await userStore.handleSignUp(userCredintails);
    if (user.value) {
      open.value = false;
      resetUserCredintial();
      errorMsg.value = "";
    }
  }
  else{
    await userStore.handleLogin(userCredintails);
    if (user.value) {
      open.value = false;
      resetUserCredintial();
      errorMsg.value = "";
    }
  }
};
</script>
<style scoped>
.modal-container .content {
  margin: 30px 0;
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
}
</style>
