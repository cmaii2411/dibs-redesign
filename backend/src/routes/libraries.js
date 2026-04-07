const router = require('express').Router()
const pool = require('../db')

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Library" ORDER BY name')
    res.json(result.rows)
  } catch (err) {
    console.log(err)
    res.status(500).json({error: 'Server error'})
  }
})

router.get('/:id/rooms', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'SELECT * FROM "Room" WHERE library_id = $1 ORDER BY name', [id]
    )

    res.json(result.rows)
  } catch (err) {
    console.log(err)
    res.status(500).json({error: 'Server error'})
  }
})

router.get(`/search`, async (req, res) => {
  try {
    const { date, start, capacity } = req.query
    const slotStart = `${date}T${start}:00`
    const cap = parseInt(capacity) || 1

    const result = await pool.query(
      `SELECT DISTINCT l.* FROM "Library" l
      JOIN "Room" r ON r.library_id = l.id
      WHERE r.capacity >= $1
      AND NOT EXISTS (
        SELECT 1 FROM "Booking" b
        WHERE b.room_id = r.id
        AND b.start_time::date = $2::date
        AND b.start_time < $3::timestamptz + INTERVAL '2 hours'
        AND b.end_time > $3::timestamptz
        )
      ORDER BY l.name`,
      [cap,date, slotStart]
    ) 
    res.json(result.rows)
  } catch (err) {
    console.log(err)
    res.status(500).json({error: 'Server error'})
  }
})

// GET /libraries/:id/rooms/availability?date=2026-04-07&capacity=2
router.get('/:id/rooms/availability', async (req, res) => {
  try {
    const { id } = req.params
    const { date, capacity } = req.query

    // 1. Get library open/close hours
    const libResult = await pool.query(
      'SELECT open_time, close_time FROM "Library" WHERE id = $1', [id]
    )
    if (libResult.rows.length === 0) return res.status(404).json({ error: 'Library not found' })

    const { open_time, close_time } = libResult.rows[0]
    const openHour  = parseInt(open_time.split(':')[0])
    const closeHour = parseInt(close_time.split(':')[0])

    // 2. Get rooms, optionally filtered by minimum capacity
    let roomsQuery = 'SELECT * FROM "Room" WHERE library_id = $1'
    const roomsParams = [id]
    if (capacity) {
      roomsQuery += ' AND capacity >= $2'
      roomsParams.push(parseInt(capacity))
    }
    roomsQuery += ' ORDER BY name'
    const roomsResult = await pool.query(roomsQuery, roomsParams)
    const rooms = roomsResult.rows
    if (rooms.length === 0) return res.json([])

    // 3. Build 7-day window starting from date
    const days = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(date)
      d.setDate(d.getDate() + i)
      days.push(d.toISOString().split('T')[0])
    }

    // 4. Fetch all bookings for these rooms across the 7-day window in one query
    const roomIds = rooms.map(r => r.id)
    const bookingsResult = await pool.query(
      `SELECT room_id, start_time, end_time FROM "Booking"
       WHERE room_id = ANY($1)
         AND start_time::date >= $2::date
         AND start_time::date <= $3::date`,
      [roomIds, days[0], days[6]]
    )
    const allBookings = bookingsResult.rows

    // 5. For each room × each day, calculate available slots
    const result = rooms.map(room => {
      const slots = {}

      for (const day of days) {
        // Bookings for this specific room on this specific day
        const dayBookings = allBookings
          .filter(b => b.room_id === room.id && new Date(b.start_time).toISOString().split('T')[0] === day)
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))

        // Generate all 30-min slots between open and close (-2 so last slot ends by close)
        const allSlots = []
        for (let h = openHour; h <= closeHour - 2; h++) {
          allSlots.push(`${String(h).padStart(2, '0')}:00`)
          allSlots.push(`${String(h).padStart(2, '0')}:30`)
        }

        // Filter out slots that overlap a booking (pointer approach)
        let bookingIdx = 0
        const available = []
        for (const slot of allSlots) {
          const slotStart = new Date(`${day}T${slot}:00`)
          const slotEnd   = new Date(slotStart.getTime() + 2 * 60 * 60 * 1000)

          while (bookingIdx < dayBookings.length && new Date(dayBookings[bookingIdx].end_time) <= slotStart) {
            bookingIdx++
          }

          const b = dayBookings[bookingIdx]
          if (b && new Date(b.start_time) < slotEnd && new Date(b.end_time) > slotStart) continue

          available.push(slot)
        }

        slots[day] = available
      }

      return {
        id:             room.id,
        room_code:      room.room_code,
        name:           room.name,
        capacity:       room.capacity,
        has_projector:  room.has_projector,
        has_whiteboard: room.has_whiteboard,
        is_accessible:  room.is_accessible,
        slots
      }
    })

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router;