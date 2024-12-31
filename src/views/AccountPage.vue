<script setup lang="ts">
import { reactive } from 'vue';

const stuff = reactive({
  username: '',
  password: '',
  header: 'Login',
  button: 'Sign Up',
  respond: null as string | null,
});

let select = "login"

function toggle(idk: string) {
  stuff.respond = null;
  const isSignUp = idk === "Sign Up";
  stuff.header = isSignUp ? "Sign Up" : "Login";
  stuff.button = isSignUp ? "Login" : "Sign Up";
  select = isSignUp ? "signup" : "login";
}

async function post() {
  try {
    const response = await fetch(`/api/${select}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: stuff.username,
        password: stuff.password
      })
    });
    const data = await response.json();
    if (data.status === "successful") {
      console.log(data);
      // store.username = data.username;
      // store.tokens = data.tokens || 0;
    } else {
      stuff.respond = data.message;
    }
  } catch (error) {
    stuff.respond = "Network error occurred";
    console.error('Login/Signup failed:', error);
  }
}
</script>

<template>
  <div>
    <div>
      <div>
        <h1>
          {{ stuff.header }}
        </h1>
        <h2 v-if="stuff.respond">
          {{ stuff.respond }}
        </h2>
      </div>
      <form @submit.prevent="post">
        <div>
          <input v-model="stuff.username" placeholder="Username" required maxlength="50">
        </div>
        <div>
          <input v-model="stuff.password" placeholder="Password" type="password" required maxlength="1000">
        </div>
        <button type="submit">
          Submit
        </button>
      </form>
      <button @click="toggle(stuff.button)">
        {{ stuff.button }}
      </button>
    </div>
  </div>
</template>
