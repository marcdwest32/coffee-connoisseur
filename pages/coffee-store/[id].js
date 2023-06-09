import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { StoreContext } from '../../store/store-context'
import { fetchCoffeeStores } from '../../lib/coffee-stores'
import { fetcher, isEmpty } from '../../utils'
import styles from '../../styles/coffee-store.module.css'

const coffeeAlt =
  'https://s3-media1.fl.yelpcdn.com/bphoto/G0qtDI4vD1aQk1zlPkhA5w/o.jpg'

let altName = ''

export async function getStaticProps(staticProps) {
  const params = staticProps.params

  const coffeeStores = await fetchCoffeeStores()
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id //dynamic id
  })
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  }
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores()
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    }
  })
  return {
    paths,
    fallback: true,
  }
}

const CoffeeStore = (initialProps) => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>...Loading</div>
  }

  const id = router.query.id

  const {
    state: { coffeeStores },
  } = useContext(StoreContext)

  const empty = isEmpty(initialProps.coffeeStore)

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore)

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, image_url, url, rating, location = {} } = coffeeStore
      const { address1: address, city, zip_code, state } = location
      const neighborhood =
        city && state && zip_code ? `${city}, ${state} ${zip_code}` : ''
      const imgUrl = image_url || coffeeAlt

      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name,
          address: address || '',
          neighborhood: neighborhood || '',
          rating: rating || 0,
          votes: 0,
          url,
          imgUrl,
        }),
      })
      const dbCoffeeStore = await response.json()
    } catch (err) {
      console.error('error creating coffee store', err)
    }
  }

  useEffect(() => {
    if (empty && coffeeStores.length > 0) {
      const coffeeStoreFromContext = coffeeStores.find(
        (coffeeStore) => coffeeStore.id.toString() === id,
      )
      if (coffeeStoreFromContext) {
        setCoffeeStore(coffeeStoreFromContext)
        handleCreateCoffeeStore(coffeeStoreFromContext)
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore)
    }
  }, [id, empty, coffeeStores, initialProps.coffeeStore])

  const {
    id: storeId,
    name,
    image_url,
    url: storeUrl,
    rating,
    location = {},
  } = coffeeStore
  const address = location.address1 || coffeeStore.address
  const { city, zip_code, state } = location
  const neighborhood =
    city && state && zip_code
      ? `${city}, ${state} ${zip_code}`
      : coffeeStore.neighborhood
      ? coffeeStore.neighborhood
      : ''
  const imgUrl = coffeeStore.imgUrl || image_url || coffeeAlt

  const [voteCount, setVoteCount] = useState(0)

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0])
      setVoteCount(data[0].votes)
    }
  }, [data])

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch('/api/upvoteCoffeeStoreById', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
        }),
      })
      const dbCoffeeStore = await response.json()
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = voteCount + 1
        setVoteCount(count)
      }
    } catch (err) {
      console.error('error upvoting', err)
    }
  }

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHome}>
            <Link href='/' scroll={false}>
              ← Back to Home
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            className={styles.storeImage}
            alt={name || 'coffee'}
            src={imgUrl}
            width={600}
            height={360}
          />
        </div>
        <div className={`glass ${styles.col2}`}>
          <div className={styles.iconWrapper}>
            <Image
              src='/icons/places.svg'
              width='24'
              height='24'
              alt={'Places'}
            />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src='/icons/nearMe.svg'
              width='24'
              height='24'
              alt={'Near Me'}
            />
            <p className={styles.text}>{neighborhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src='/icons/star.svg' width='24' height='24' alt={'Star'} />
            <p className={styles.text}>{rating} Stars on Yelp!</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src='/icons/thumbUp.svg'
              width='24'
              height='24'
              alt={'Thumb'}
            />
            <p className={styles.text}>{voteCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            UpVote!
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore
