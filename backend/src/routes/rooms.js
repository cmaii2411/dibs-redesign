const router = require('express').Router()
const pool = require('../db')

router.get('/:id/availability', async (req, res) => {
    try {
        const {id} = req.params
        const { date } = req.query
        
        const slots = []
        const library_query = await pool.query(
            `SELECT l.close_time FROM "Library" l
             JOIN "Room" r ON r.library_id = l.id
             WHERE r.id = $1`,
            [id]
        )

        const close_time = library_query.rows[0].close_time
        const close_hour = parseInt(close_time.split(':')[0])  // "22:00:00" → 22

        // Generate all 30-min slots
        for (let h = 8; h <= close_hour - 2; h++) {
            slots.push(`${String(h).padStart(2,'0')}:00`)
            slots.push(`${String(h).padStart(2,'0')}:30`)
        }

        // Fetch existing bookings
        const result = await pool.query(
            `SELECT start_time, end_time FROM "Booking"
            WHERE room_id = $1
            AND start_time::date = $2::date ORDER BY start_time`, [id, date]
        )

        const bookings = result.rows

        //Filter out slots 
        const available = [];
        let bookingIndex = 0;

        for (const slot of slots) {
            const slotStart = new Date(`${date}T${slot}:00`);
            const slotEnd = new Date(slotStart.getTime() + 2 * 60 * 60 * 1000); // 2hr duration

            // 1. Move the booking pointer past any bookings that finished BEFORE this slot starts
            while (bookingIndex < bookings.length && new Date(bookings[bookingIndex].end_time) <= slotStart) {
                bookingIndex++;
            }

            // 2. Check if the NEXT relevant booking overlaps with our current slot
            const currentBooking = bookings[bookingIndex];
  
            if (currentBooking) {
                const bStart = new Date(currentBooking.start_time);
                const bEnd = new Date(currentBooking.end_time);

                // Overlap check: does this slot hit the current booking?
                if (bStart < slotEnd && bEnd > slotStart) {
                    continue; // It's blocked! Move to next slot.
                }
            }

            // 3. If we got here, no overlap found
            available.push(slot);
        }

        res.json(available)
} catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router;
