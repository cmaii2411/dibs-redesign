import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export const getLibraries = () => api.get('/libraries')
export const getRooms = (libraryId) => api.get(`/libraries/${libraryId}/rooms`)
export const getLibraryAvailability = (libraryId, date, capacity) => {
  const params = new URLSearchParams({ date })
  if (capacity) {
    params.append('capacity', capacity)
  }
  return api.get(`/libraries/${libraryId}/rooms/availability?${params}`)
}
export const createBooking = (data) => api.post('/reserve', data)
export const searchLibraries = (date, start, capacity) => {
  const params = new URLSearchParams({date, start})
  if (capacity) {
    params.append('capacity', capacity)
  }
  return api.get(`/libraries/search/?${params}`)
}
