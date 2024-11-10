<script setup>
import { ref, inject } from "vue";
import { supabase } from "@/supabase";
import { useUserStore } from "@/stores/users";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const open = ref(false);
const loading = ref(false);
const errorMsg = ref("");
const fileInput = ref(null);
const showModal = () => {
  open.value = true;
};
const handleOk = async (e) => {
  if (file.value && validateFileType) {
    loading.value = true;
    const fileName = `${Date.now()}-${file.value.name}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(`public/${fileName}`, file.value);
    console.log(data);
    if (error) {
      loading.value = false;
      return (errorMsg.value = "error uploading photo");
    }
    saveToPosts(data.path);
  }
};
const injectHandleAddNewPost = inject("addNewPost");
const saveToPosts = async (path) => {
  const response = await supabase.from("posts").insert({
    url: path,
    caption: description.value,
    owner_id: user.value.id,
  });
  console.log(response);
  if (response.status === 201) {
    injectHandleAddNewPost({
      url: path,
      caption: description.value,
    });
    resetFields();
    open.value = false;
  } else {
    console.log("Error saving post");
  }
  loading.value = false;
};
const validateFileType = () => {
  const allowedTypes = ["image/jpeg", "image/png"];
  return allowedTypes.includes(file.value.type);
};
const description = ref("");
const file = ref(null);
const handleImageUpload = (e) => {
  const Img = e.target.files[0];
  if (Img) {
    file.value = Img;
  }
  // upload image to your server here
};
const handleCancel = () => {
  resetFields();
  open.value = false;
};
const resetFields = () => {
  description.value = "";
  file.value = null;
  errorMsg.value = "";
  fileInput.value = "";
};
</script>
<template>
  <div>
    <a-button danger type="primary" @click="showModal">Upload Photo</a-button>

    <a-modal v-model:open="open" title="Upload Image" @ok="handleOk">
      <template #footer>
        <a-button key="back" @click="handleCancel" :disabled="loading"
          >Return</a-button
        >
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          :disabled="loading"
          @click="handleOk"
          >Submit</a-button
        >
      </template>
      <div class="content" v-if="!loading">
        <input
          type="file"
          accept=".jpeg,.png"
          @change="handleImageUpload"
          class="mb-3"
          ref="fileInput"
        />
        <AInput
          :maxLength="50"
          placeholder="Caption..."
          v-model:value="description"
        />
        <a-typography-title :level="5" type="danger">{{
          errorMsg
        }}</a-typography-title>
      </div>
      <div class="spinner flex justify-center items-center py-10" v-else>
        <ASpin />
      </div>
    </a-modal>
  </div>
</template>
