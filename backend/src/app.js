const express = require('express')
const cors = require('cors')
require('dotenv').config()

const librariesRouter = require('./routes/libraries')
const roomsRouter = require('./routes/rooms')
const reserveRouter = require('./routes/reserve')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/libraries', librariesRouter)
app.use('/rooms', roomsRouter)
app.use('/reserve', reserveRouter)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Dibs API is running' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
