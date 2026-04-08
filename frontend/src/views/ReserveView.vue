<template>
  <div class="reserve-page">

    <!-- Library header -->
    <p class="breadcrumb">Home &gt; Library &gt; {{ library_name }}</p>
    <div class="lib-header">
      <img src="@/assets/hero.svg" alt="" class="hero-icon" />
      <h2>{{ library_name }}</h2>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="state-box">
      <div class="dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <p class="state-text">Confirming your reservation...</p>
    </div>

    <!-- SUCCESS STATE -->
    <div v-else-if="success" class="state-box">
      <p class="state-text">Reservation successfully made!</p>
    </div>

    <!-- FORM STATE -->
    <div v-else class="form-layout">
      <div class="form-card">
        <h3>Create a Reservation</h3>

        <div class="field">
          <label>Room Code</label>
          <input :value="room_code + ' ' + room_name" readonly />
        </div>

        <div class="field-row">
          <div class="field">
            <label>Date</label>
            <input :value="date" readonly />
          </div>
          <div class="field">
            <label>Time from</label>
            <div class="time-range">
              <input :value="start_time" readonly />
              <span>to</span>
              <input :value="computedEndTime" readonly />
            </div>
          </div>
        </div>

        <div class="field-row">
          <div class="field">
            <label>Name</label>
            <input v-model="booking_name" placeholder="Enter your name" />
          </div>
          <div class="field">
            <label>Email</label>
            <input v-model="email" type="email" placeholder="Enter your email" />
          </div>
        </div>

        <button class="reserve-btn" @click="submitBooking">Reserve room</button>
      </div>

      <div class="photo-panel">
        <img src="@/assets/reserve.png" alt="" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { createBooking } from '@/api'

const route = useRoute()

const room_id = route.query.room_id
const room_code = route.query.room_code
const room_name = route.query.room_name
const library_name = route.query.library_name || 'Library'
const date = route.query.date
const start_time = route.query.start_time

const booking_name = ref('')
const email = ref('')
const loading = ref(false)
const success = ref(false)

const computedEndTime = computed(() => {
  const [hours, minutes] = start_time.split(':').map(Number)
  const end = new Date(2000, 0, 1, hours + 2, minutes)
  return end.toTimeString().slice(0, 5)
})

async function submitBooking() {
  loading.value = true
  try {
    await createBooking({
      booking_name: booking_name.value,
      email: email.value,
      room_id,
      date,
      start_time
    })
    success.value = true
  } catch (err) {
    alert('Booking failed: ' + (err.response?.data?.error || err.message))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reserve-page {
  padding: 32px 40px;
  background: white;
  min-height: calc(100vh - 56px);
}

.breadcrumb {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 16px;
}

.lib-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.hero-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.lib-header h2 {
  font-size: 2rem;
  font-family: 'Black Han Sans', sans-serif;
  color: #51733F;
}

/* FORM LAYOUT */
.form-layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
}

.form-card {
  flex: 1;
}

.form-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3a7d44;
  margin-bottom: 20px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.field label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
}

.field input {
  padding: 8px 12px;
  border: 1px solid #d6e8d0;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #1f3d1f;
  background: white;
}

.field input[readonly] {
  background: #f5faf4;
  color: #555;
}

.field-row {
  display: flex;
  gap: 16px;
}

.field-row .field {
  flex: 1;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-range input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d6e8d0;
  border-radius: 6px;
  font-size: 0.9rem;
  background: #f5faf4;
  color: #555;
}

.time-range span {
  font-size: 0.85rem;
  color: #888;
}

.reserve-btn {
  width: 100%;
  padding: 12px;
  background: #3a7d44;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 8px;
}

.reserve-btn:hover {
  background: #2d6235;
}

/* PHOTO PANEL */
.photo-panel {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  max-height: 340px;
}

.photo-panel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

/* LOADING / SUCCESS */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 24px;
}

.state-text {
  font-size: 1rem;
  color: #3a7d44;
  font-weight: 500;
}

/* PULSING DOTS */
.dots {
  display: flex;
  gap: 10px;
  align-items: center;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3a7d44;
  animation: pulse 1.2s ease-in-out infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 100% { transform: scale(0.6); opacity: 0.4; }
  50%       { transform: scale(1);   opacity: 1; }
}
</style>
