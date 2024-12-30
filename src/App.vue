<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';

const fileInput = ref<HTMLInputElement | null>(null);
const message = ref<string | null>(null);
const videos = ref<{ id: number, path: string }[]>([]);

async function getVideos() {
  fetch('/get')
    .then(response => response.json())
    .then(data => {
      videos.value = data;
    });
}

async function uploadVideo() {
  if (!fileInput.value || !fileInput.value.files || fileInput.value.files.length === 0) {
    message.value = "Please select a video file.";
    return;
  }

  const formData = new FormData();
  formData.append('video', fileInput.value.files[0]);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error uploading file.');
    }

    const data = await response.text();
    message.value = data;
    getVideos();
  } catch (error) {
    console.error(error);
    message.value = "Error uploading file.";
  }
};

onMounted(() => {
  getVideos();
});
</script>

<template>
  <h1>{{ message }}</h1>
  <form @submit.prevent="uploadVideo">
    <input type="file" ref="fileInput" accept="video/*" />
    <button type="submit">Upload</button>
  </form>
  <RouterLink v-for="video in videos" :key="video.id" :to="'/play/' + encodeURIComponent(video.path)">Watch Video
  </RouterLink>

  <RouterView />
</template>
