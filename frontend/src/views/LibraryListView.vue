<template>
  <div>
    <!-- Sidebar -->
    <div class="sidebar">
      <h3>Choose a Date</h3>
      <input type="date" v-model="selectedDate" />

      <h3>Choose Time</h3>
      <select v-model="startTime">
        <option v-for="slot in timeSlots" :value="slot" :key="slot">
            {{  slot  }}
        </option>
      </select>

      <input type="number" v-model="capacity" placeholder="Number of attendees" />
      <button @click="search">Search</button>
    </div>

    <!-- Library list -->
    <div class="library-list">
        <div v-if="libraries.length === 0 && hasSearched">
            No libraries are available
        </div>
    <div v-else>

      <div v-for="library in libraries" :key="library.id">
        <span>{{ library.name }}</span>
        <button @click="viewAvailability(library.id)">View Availabilities</button>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getLibraries } from '../api'

const router = useRouter()
const libraries = ref([])
const selectedDate = ref('')
const capacity = ref('')
const startTime = ref('')
const hasSearched = false

onMounted(async () => {
    const res = await getLibraries()
    libraries.value = res.data
})

function viewAvailability (libraryId) {
    router.push({
        path: `/libraries/${libraryId}availability`
    })
}

onMounted(async () => {
  const res = await getLibraries()
  libraries.value = res.data
})

function viewAvailability(libraryId) {
  router.push({
    path: `/libraries/${libraryId}`,
    query: { date: selectedDate.value, capacity: capacity.value }
  })
}

async function search() {
    const res = await searchLibraries(selectedDate.value, startTime.value, capacity.value)
    libraries.value = res.data
    hasSearched = true
}
</script>
