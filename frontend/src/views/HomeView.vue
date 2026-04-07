<template>
  <div>
    <div class="banner">
      <img src="../assets/banner.svg" />
      <h1>Book A Room</h1>
    </div>

    <div class="cards">
      <div class="card" @click="router.push('/libraries')">
        <img src="../assets/lib.svg" />

        <h2>Library</h2>
      </div>

      <div class="card">
        <img src="../assets/reservation.svg" />
        <h2>Reservation</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
