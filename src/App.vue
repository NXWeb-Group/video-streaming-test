<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue';
import { store } from '@/assets/store';
import newPost from '@/components/NewPost.vue';

const message = ref<string | null>(null);
const posts = ref<{ id: number, title: string }[]>([]);

function getPost() {
  fetch('/api/get')
    .then(response => response.json())
    .then(data => {
      posts.value = data;
    });
}

async function logout() {
  fetch('/api/logout', { method: 'POST', })
    .then(response => {
      if (response.ok) {
        // window.location.href = '/';
      }
    });
}

onMounted(() => {
  getPost();
});
</script>

<template>
  <h1>{{ message }}</h1>

  <RouterLink to="/">Home</RouterLink>
  <button @click="logout">Logout</button>
  <RouterLink to="/account">Account</RouterLink>
  <button @click="store.newpost = true">New Post</button>
  <newPost v-if="store.newpost" @refresh="getPost" />

  <RouterLink v-for="post in posts" :key="post.id" :to="`/post/${post.id}`">
    {{ post.title }}
  </RouterLink>

  <RouterView />
</template>
