<script setup lang="ts">
import videojs from 'video.js';
import type Player from "video.js/dist/types/player";
import 'video.js/dist/video-js.css';
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  file: String,
});

const videoPlayer = ref<Player | null>(null);
const videoElement = ref<HTMLElement | null>(null);

function createVideo() {
  if (!videoElement.value) return;
  videoPlayer.value = videojs(videoElement.value, {
    controls: true,
    fluid: true,
    sources: [{
      src: props.file,
      type: 'application/x-mpegURL'
    }]
  });
}

onMounted(() => {
  createVideo();
});

onUnmounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.dispose();
  }
});
</script>

<template>
  <div class="video-container">
    <video ref="videoElement" class="video-js">
    </video>
  </div>
</template>
