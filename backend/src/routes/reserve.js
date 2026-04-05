const router = require('express').Router()
const pool = require('../db')

router.post('/', async (req, res) => {
  try {
    const { booking_name, email, room_id, start_time } = req.body

    // 1. Look up user by email
    const userResult = await pool.query(
      `SELECT id FROM "User" 
       WHERE email = $1`, [email]
    )

    if (userResult.rows.length === 0) {
      return res.status(404).json({error: 'User not found'})
    } 

    const user_id = userResult.rows[0].id

    // 2. Calculate end time (always +2hrs)
    const start = new Date(start_time)
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)

    // 3. Check slot is still available (overlap check)
    const conflict = await pool.query(
      `SELECT id FROM "Booking"
       WHERE room_id = $1
         AND start_time < $2
         AND end_time   > $3`,
      [room_id, end, start]
    )
    if (conflict.rows.length > 0) {
      return res.status(409).json({ error: 'This slot was just booked. Please choose another time.' })
    }

    // 4. Insert the booking
    const booking = await pool.query(
      `INSERT INTO "Booking" (booking_name, start_time, end_time, user_id, room_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [booking_name, start, end, user_id, room_id]
    )

    res.status(201).json(booking.rows[0])
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router