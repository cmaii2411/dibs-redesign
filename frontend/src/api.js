import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export const getLibraries = () => api.get('/libraries')
export const getRooms = (libraryId) => api.get(`/libraries/${libraryId}/rooms`)
export const getAvailability = (roomId, date) => api.get(`/rooms/${roomId}/availability?date=${date}`)
export const createBooking = (data) => api.post('/reserve', data)
