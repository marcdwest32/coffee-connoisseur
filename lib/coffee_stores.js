const getDataForCoffeeStores = async (latLong, limit) => {
  console.log('coffee_stores', latLong)
  const sdk = require('api')('@yelp-developers/v1.0#deudoolf6o9f51')

  sdk.auth(`Bearer ${process.env.YELP_API_KEY}`)
  const latLongSplit = latLong.split(',')
  console.log('coffee_stores 2', latLongSplit)

  const { data } = await sdk.v3_business_search({
    latitude: latLongSplit[0],
    longitude: latLongSplit[1],
    term: 'coffee',
    radius: '10000',
    sort_by: 'best_match',
    limit,
  })
  console.log(data)

  return data
}

export const fetchCoffeeStores = async (
  latLong = '43.6490502,-79.3920888',
  limit = 10,
) => {
  const { businesses } = await getDataForCoffeeStores(latLong, limit)
  return businesses
}
