// const express = require('express')
// const axios = require('axios')
// const cors = require('cors')
// require('dotenv').config()

// const app = express()
// const port = 3001 // Choose a port number for your server

// app.use(cors({ origin: 'http://localhost:3000' }))

// app.get('/coffee-stores', async (req, res) => {
//   const { latitude, longitude, limit } = req.query
//   const apiKey = process.env.YELP_API_KEY
//   try {
//     const response = await axios.get(
//       'https://api.yelp.com/v3/businesses/search',
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//         },
//         params: {
//           latitude,
//           longitude,
//           term: 'coffee',
//           radius: 10000,
//           sort_by: 'distance',
//           limit,
//         },
//       },
//     )

//     return res.json(response.data.businesses)
//   } catch (error) {
//     console.error('API Error fetching coffee stores:', error)
//     res.status(500).json({ error: 'Failed to fetch coffee stores' })
//   }
// })

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`)
// })
