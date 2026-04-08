<template>
  <div class="page">

    <!-- Sidebar -->
    <aside class="sidebar">
      <p class="result-count">{{ rooms.length }} results</p>

      <div class="filter-group">
        <div class="filter-label" @click="showCapacity = !showCapacity">
          Capacity <span>{{ showCapacity ? '−' : '+' }}</span>
        </div>
        <div v-if="showCapacity" class="filter-body">
          <input type="number" v-model="filterCapacity" placeholder="Min capacity" min="1" />
        </div>
      </div>

      <div class="filter-group">
        <div class="filter-label" @click="showFeature = !showFeature">
          Feature <span>{{ showFeature ? '−' : '+' }}</span>
        </div>
        <div v-if="showFeature" class="filter-body">
          <label><input type="checkbox" v-model="filterProjector" /> Projector available</label>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="main">
      <!-- Library header -->
      <p class="breadcrumb">Home &gt; Library &gt; {{ libraryName }}</p>
      <div class="lib-header">
        <img src="@/assets/hero.svg" alt="" class="hero-icon" />
        <h2>{{ libraryName }}</h2>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th class="room-col">Room</th>
              <th
                v-for="day in days"
                :key="day.iso"
                :class="{ active: day.iso === selectedDay }"
                @click="changeDay(day.iso)"
              >
                {{ day.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in filteredRooms" :key="room.id">
              <td class="room-name">{{ room.room_code }} — {{ room.name }}</td>
              <td
                v-for="day in days"
                :key="day.iso"
                class="slots-cell"
              >
                <template v-if="day.iso === selectedDay">
                  <span v-if="!room.slots[day.iso] || room.slots[day.iso].length === 0" class="no-slots">—</span>
                  <button
                    v-for="slot in room.slots[day.iso]"
                    :key="slot"
                    class="slot-btn"
                    @click="selectSlot(room, slot)"
                  >
                    {{ slot }}
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

  </div>
</template>

<script setup>
import { getLibraryAvailability } from '@/api'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const date = route.query.date
const lib_id = route.params.id
const capacity = route.query.capacity
const libraryName = route.query.name || 'Library'

const rooms = ref([])
const selectedDay = ref(date)
const showCapacity = ref(false)
const showFeature = ref(false)
const filterCapacity = ref('')
const filterProjector = ref(false)

const days = computed(() => {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
  const result = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(date)
    d.setDate(d.getDate() + i)
    result.push({
      iso: d.toISOString().split('T')[0],
      label: `${dayNames[d.getDay()]} (${d.getMonth() + 1}/${d.getDate()})`
    })
  }
  return result
})

const filteredRooms = computed(() => {
  return rooms.value.filter(room => {
    if (filterCapacity.value && room.capacity < parseInt(filterCapacity.value)) return false
    if (filterProjector.value && !room.has_projector) return false
    return true
  })
})

onMounted(async () => {
  const res = await getLibraryAvailability(lib_id, date, capacity)
  rooms.value = res.data
})

async function changeDay(day) {
  selectedDay.value = day
  const res = await getLibraryAvailability(lib_id, day, capacity)
  rooms.value = res.data
}

function selectSlot(room, slot) {
  router.push({
    path: '/reserve',
    query: {
      room_id: room.id,
      room_code: room.room_code,
      room_name: room.name,
      library_name: libraryName,
      date: selectedDay.value,
      start_time: slot
    }
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
  width: 160px;
  flex-shrink: 0;
  padding: 24px 16px;
  border-right: 1px solid #d6e8d0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-count {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1f3d1f;
  padding-bottom: 12px;
  border-bottom: 1px solid #d6e8d0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1f3d1f;
  cursor: pointer;
}

.filter-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-body input[type="number"] {
  padding: 6px 8px;
  border: 1px solid #c5e0be;
  border-radius: 6px;
  font-size: 0.85rem;
}

.filter-body label {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #333;
}

/* MAIN */
.main {
  flex: 1;
  padding: 32px 40px;
  overflow-x: auto;
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

/* TABLE */
.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  padding: 10px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
}

thead th.room-col {
  text-align: left;
  cursor: default;
  color: #888;
}

thead th.active {
  background: #3a7d44;
  color: white;
  border-radius: 20px;
}

tbody tr {
  border-bottom: 1px solid #e8f5e4;
}

td {
  padding: 12px;
  vertical-align: middle;
  text-align: center;
}

.room-name {
  text-align: left;
  font-size: 0.85rem;
  font-weight: 500;
  color: #1f3d1f;
  white-space: nowrap;
  min-width: 200px;
}

.slots-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  justify-content: flex-start;
}

.slot-btn {
  padding: 5px 12px;
  background: #c5e8c0;
  border: none;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1f3d1f;
  white-space: nowrap;
  transition: background 0.15s;
}

.slot-btn:hover {
  background: #3a7d44;
  color: white;
}

.no-slots {
  font-size: 0.8rem;
  color: #ccc;
}
</style>
