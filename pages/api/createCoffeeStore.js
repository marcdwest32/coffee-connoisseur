import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from '../../lib/airtable'

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, address, neighborhood, votes, rating, url, imgUrl } =
      req.body
    if (id) {
      try {
        //find a record
        const records = await findRecordByFilter(id)

        if (records.length > 0) {
          res.json(records)
        } else {
          //create record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighborhood,
                  votes,
                  rating,
                  url,
                  imgUrl,
                },
              },
            ])
            const records = getMinifiedRecords(createRecords)
            res.json({ message: 'created record', records })
          } else {
            res.status(400)
            res.json({ message: 'Name missing' })
          }
        }
      } catch (err) {
        console.error('Error creating or finding store', err)
        res.status(500)
        res.json({ message: 'Error creating or finding store', err })
      }
    } else {
      res.status(400)
      res.json({ message: 'ID missing' })
    }
  }
}

export default createCoffeeStore
