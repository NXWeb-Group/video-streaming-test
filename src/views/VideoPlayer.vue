<script setup lang="ts">
import videojs from 'video.js';
import type Player from "video.js/dist/types/player";
import { useRoute } from 'vue-router';
import 'video.js/dist/video-js.css';
import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue';

const route = useRoute();
const videoPlayer = ref<Player | null>(null);
const videoElement = ref<HTMLElement | null>(null);

function createVideo() {
  if (!videoElement.value) return;
  const videoPath = route.params.path;
  videoPlayer.value = videojs(videoElement.value, {
    controls: true,
    fluid: true,
    sources: [{
      src: `/${decodeURIComponent(String(videoPath))}`,
      type: 'application/x-mpegURL'
    }]
  });
}

onMounted(() => {
  createVideo();
});

watch(() => route.params.path, () => {
  nextTick().then(() => {
    createVideo();
  });
});

onUnmounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.dispose();
  }
});
</script>

<template>
  <div class="video-container" :key="String(route.params.path)">
    <video ref="videoElement" class="video-js">
    </video>
  </div>
</template>
