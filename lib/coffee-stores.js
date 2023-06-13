const axios = require('axios')
require('dotenv').config()

export async function fetchCoffeeStores(
  latLong = '43.653833032607096,-79.37896808855945',
  limit = 6,
) {
  const latLongSplit = latLong.split(',')
  try {
    const apiKey = process.env.YELP_API_KEY

    const response = await axios.get(
      'https://api.yelp.com/v3/businesses/search',
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        params: {
          latitude: latLongSplit[0],
          longitude: latLongSplit[1],
          term: 'coffee',
          radius: 10000,
          sort_by: 'best_match',
          limit,
        },
      },
    )

    const coffeeStores = response.data.businesses
    return coffeeStores
  } catch (error) {
    console.error('LIB Error fetching coffee stores:', error)
    return []
  }
}
