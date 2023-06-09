const axios = require('axios')

export async function fetchCoffeeStores(
  latLong = '29.9850132,-90.0840306',
  limit = 6,
) {
  const latLongSplit = latLong.split(',')
  try {
    const response = await axios.get('http://localhost:3001/coffee-stores', {
      params: {
        latitude: latLongSplit[0],
        longitude: latLongSplit[1],
        limit,
      },
    })

    const coffeeStores = response.data
    return coffeeStores
  } catch (error) {
    console.error('LIB Error fetching coffee stores:', error)
    return []
  }
}
