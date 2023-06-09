import { findRecordByFilter, table } from '../../lib/airtable'

const upvoteCoffeeStoreById = async (req, res) => {
  const { id } = req.body
  if (id && req.method === 'PUT') {
    try {
      const records = await findRecordByFilter(id)
      if (records.length > 0) {
        const record = records[0]
        const calculateVotes = parseInt(record.votes) + parseInt(1)

        const updateRecord = table.update([
          {
            id: record.recordId,
            fields: {
              votes: calculateVotes,
            },
          },
        ])
        if (updateRecord) {
          res.json(records)
        }
      } else {
        res.json({ message: 'Store does not exist', id })
      }
    } catch (err) {
      res.status(500)
      res.json({ message: 'Error upvoting', err })
    }
  } else {
    res.status(400)
    res.json({ message: 'ID is missing' })
  }
}

export default upvoteCoffeeStoreById
