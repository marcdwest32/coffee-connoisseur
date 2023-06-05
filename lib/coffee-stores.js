const axios = require('axios')

export async function fetchCoffeeStores(
  latLong = '43.6490502,-79.3920888',
  limit = 2,
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
    console.error('LIB Error fetching coffee stores:')
    return []
  }
}
