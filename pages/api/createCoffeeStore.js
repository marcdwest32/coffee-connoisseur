import { getMinifiedRecords, table } from '../../lib/airtable'

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, address, neighborhood, votes, imgUrl } = req.body
    if (id) {
      try {
        //find a record
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id="${id}"`,
          })
          .firstPage()

        if (findCoffeeStoreRecords.length > 0) {
          const records = getMinifiedRecords(findCoffeeStoreRecords)
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
