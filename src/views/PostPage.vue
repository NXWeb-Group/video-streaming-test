<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import videoplayer from '@/components/VideoPlayer.vue';

const route = useRoute();
const posts = ref({ title: '', description: '', media: [""], username: '' });
const index = ref(0);

async function getPost() {
  fetch('/api/get/' + route.params.id)
    .then(response => response.json())
    .then(data => {
      posts.value = data;
    });
}

onMounted(() => {
  getPost();
});

watch(() => route.params.id, () => {
  getPost();
});
</script>

<template>
  <div :key="index">
    <h1>{{ posts.title }}</h1>
    <h2>{{ posts.username }}</h2>
    <p>{{ posts.description }}</p>
    <div v-if="posts.media[0]">
      <div v-for="item in posts.media" :key="item">
        <videoplayer v-if="item.endsWith('.m3u8')" :file="`/${item}`" />
        <img v-else :src="`/${item}`" alt="post media" />
      </div>
    </div>
  </div>
</template>
