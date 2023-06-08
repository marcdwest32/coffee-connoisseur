import { findRecordByFilter } from '../../lib/airtable'

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query
  if (id) {
    try {
      const records = await findRecordByFilter(id)

      if (records.length > 0) {
        res.json(records)
      } else {
        res.json({ message: 'id was not found' })
      }
    } catch (err) {
      res.status(500)
      res.json({ message: 'Something went wrong', err })
    }
  } else {
    res.status(400)
    res.json({ message: `id missing` })
  }
}

export default getCoffeeStoreById
