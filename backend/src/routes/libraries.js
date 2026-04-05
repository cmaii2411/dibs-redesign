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

module.exports = router;