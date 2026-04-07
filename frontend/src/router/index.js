import { createRouter, createWebHistory } from 'vue-router'
import LibraryListView from '../views/LibraryListView.vue'
import AvailabilityView from '@/views/AvailabilityView.vue'
import ReserveView from '@/views/ReserveView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/libraries',
      name: 'libraries',
      component: LibraryListView,
    },
    {
      path: '/libraries/:id/rooms/availability',
      name: 'availability',
      component: AvailabilityView,
    },
    {
      path: '/reserve',
      name: 'reserve',
      component: ReserveView,
    }
  ],
})

export default router
