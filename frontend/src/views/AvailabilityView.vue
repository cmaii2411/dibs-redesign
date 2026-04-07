<template>
  <div>
    <!-- Room grid -->
    <table>
      <thead>
        <tr>
          <th>Room</th>
          <th v-for="day in days" 
            :key="day"
            :class="{ active: day === selectedDay}"
            @click="selectedDay = day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="room in rooms" :key="room.id">
          <td>{{ room.room_code }} - {{ room.name }}</td>
          <td v-for="day in days" :key="day">
            <button 
              v-for="slot in room.slots[day]" 
              :key="slot"
              @click="selectSlot(room, day, slot)"
            >
              {{ slot }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const selectedDay = ref(days[0])



</script>