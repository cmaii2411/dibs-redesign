<template>
  <div class="page">

    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-section">
        <h3>Choose a Date</h3>
        <input type="date" v-model="selectedDate" />
      </div>

      <div class="sidebar-section">
        <h3>Choose Time</h3>
        <label>Start</label>
        <select v-model="startTime">
          <option value="">Any time</option>
          <option v-for="slot in timeSlots" :value="slot" :key="slot">{{ slot }}</option>
        </select>
      </div>

      <div class="sidebar-section">
        <h3>Capacity</h3>
        <input type="number" v-model="capacity" placeholder="Number of attendees" min="1" />
      </div>

      <button class="search-btn" @click="search">Search</button>
    </aside>

    <!-- Library list -->
    <main class="library-list">
      <div class="list-header">
        <img src="@/assets/hero.svg" alt="" class="hero-icon" />
        <h2>Library</h2>
      </div>

      <div v-if="hasSearched && libraries.length === 0" class="empty">
        No libraries available for the selected filters.
      </div>

      <div v-else class="library-rows">
        <div v-for="library in libraries" :key="library.id" class="library-row">
          <span class="lib-name">{{ library.name }}</span>
          <span class="view-link" @click="viewAvailability(library.id, library.name)">View Availabilities</span>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLibraries, searchLibraries } from '../api'

const router = useRouter()
const libraries = ref([])
const selectedDate = ref('')
const capacity = ref('')
const startTime = ref('')
const hasSearched = ref(false)

const timeSlots = computed(() => {
  const slots = []
  for (let h = 8; h < 22; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`)
    slots.push(`${String(h).padStart(2, '0')}:30`)
  }
  return slots
})

onMounted(async () => {
  const res = await getLibraries()
  libraries.value = res.data
})

async function search() {
  const res = await searchLibraries(selectedDate.value, startTime.value, capacity.value)
  libraries.value = res.data
  hasSearched.value = true
}

function viewAvailability(libraryId, libraryName) {
  router.push({
    path: `/libraries/${libraryId}/rooms/availability`,
    query: { date: selectedDate.value, capacity: capacity.value, name: libraryName }
  })
}
</script>

<style scoped>
.page {
  display: flex;
  min-height: calc(100vh - 56px);
  background: white;
}

/* SIDEBAR */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  padding: 32px 24px;
  border-right: 1px solid #d6e8d0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.sidebar-section h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f3d1f;
}

.sidebar-section label {
  font-size: 0.8rem;
  color: #555;
}

.sidebar-section input,
.sidebar-section select {
  padding: 8px 10px;
  border: 1px solid #c5e0be;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #f5faf4;
  color: #1f3d1f;
}

.search-btn {
  margin-top: 8px;
  padding: 10px;
  background: #3a7d44;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
}

.search-btn:hover {
  background: #2d6235;
}

/* LIBRARY LIST */
.library-list {
  flex: 1;
  padding: 40px 60px;
}

.list-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.hero-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.list-header h2 {
  font-size: 2.2rem;
  font-family: 'Black Han Sans', sans-serif;
  color: #51733F;
}

.empty {
  color: #888;
  font-size: 1rem;
}

.library-rows {
  display: flex;
  flex-direction: column;
}

.library-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0;
  border-bottom: 1px solid #d6e8d0;
}

.lib-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f3d1f;
}

.view-link {
  font-size: 0.9rem;
  color: #3a7d44;
  font-weight: 500;
  cursor: pointer;
}

.view-link:hover {
  text-decoration: underline;
}
</style>
