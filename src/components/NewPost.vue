<script setup lang="ts">
import { reactive, ref } from "vue";
import { store } from "@/assets/store.ts"

const emit = defineEmits(['refresh']);
const post = reactive({
  title: '',
  description: '',
});
const fileInput = ref<HTMLInputElement | null>(null);


async function newPost() {
  const formData = new FormData();
  if (fileInput.value && fileInput.value.files && fileInput.value.files.length > 0) {
    formData.append('media', fileInput.value.files[0]);
  }
  const json = JSON.stringify({
    title: post.title,
    description: post.description
  });

  formData.append('data', json);
  const response = await fetch('/api/newPost', {
    method: 'POST',
    body: formData,
  });
  console.log(response);
  emit('refresh');
}
</script>

<template>
  <button @click="store.newpost = false">exit</button>
  <form @submit.prevent="newPost">
    <input v-model="post.title" type="text" placeholder="Title" />
    <textarea v-model="post.description" placeholder="Description"></textarea>
    <input type="file" ref="fileInput" accept="image/*,video/*" />
    <button type="submit">Post</button>
  </form>
</template>
