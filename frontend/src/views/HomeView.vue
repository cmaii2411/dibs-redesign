<template>
  <div class="home">

    <div class="banner">
      <img src="@/assets/banner.svg" class="banner-bg" alt="" />
      <h1>Book A Room</h1>
    </div>

    <div class="cards">
      <div class="card" @click="router.push('/libraries')">
        <img src="@/assets/lib.svg" alt="Library" />
        <h2>Library</h2>
      </div>

      <div class="card">
        <img src="@/assets/reservation.svg" alt="Reservation" />
        <h2>Reservation</h2>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
.home {
  background: #f0f7ee;
}

.banner {
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.banner-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner h1 {
  position: relative;
  z-index: 1;
  font-size: 2.4rem;
  font-family: 'Black Han Sans', sans-serif;
  color: #51733F;
}

.cards {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 60px 40px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 200px;
  height: 200px;
  background: #c5e8c0;
  border-radius: 20px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.card img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.card h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f3d1f;
}
</style>
