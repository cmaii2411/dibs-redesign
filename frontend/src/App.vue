<template>
  <nav class="navbar">
    <RouterLink to="/" class="brand">DiBS</RouterLink>
    <div class="nav-icons">
      <img src="@/assets/user-nav.svg" alt="user" />
      <img src="@/assets/nav-bar-calendar.svg" alt="calendar" />
    </div>
  </nav>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 56px;
  background: white;
  border-bottom: 1px solid #d6e8d0;
}

.brand {
  font-size: 1.4rem;
  font-weight: 800;
  color: #3a7d44;
  letter-spacing: 1px;
}

.nav-icons {
  display: flex;
  gap: 16px;
  align-items: center;
}

.nav-icons img {
  width: 24px;
  height: 24px;
}
</style>
