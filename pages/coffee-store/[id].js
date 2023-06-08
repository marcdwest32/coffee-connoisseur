import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { StoreContext } from '../../store/store-context'
import { fetchCoffeeStores } from '../../lib/coffee-stores'
import { isEmpty } from '../../utils'
import styles from '../../styles/coffee-store.module.css'
import coffeeAlt from '../../public/images/coffee-alt.jpg'

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

  const [coffeeStore, setCoffeeStore] = useState(() => {
    if (empty && coffeeStores.length > 0) {
      return coffeeStores.find(
        (coffeeStore) => coffeeStore.id.toString() === id,
      )
    }
    return initialProps.coffeeStore
  })

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      console.log(coffeeStore)
      const { id, name, image_url, url, rating, location = {} } = coffeeStore
      const { address1: address, city, zip_code, state } = location
      const neighborhood =
        city && state && zip_code ? `${city}, ${state} ${zip_code}` : ''
      const imgUrl =
        image_url ||
        'https://media.cnn.com/api/v1/images/stellar/prod/150929101049-black-coffee-stock.jpg?q=x_3,y_1231,h_1684,w_2993,c_crop/h_540,w_960/f_webp'

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
      console.log({ dbCoffeeStore })
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
    url,
    rating,
    location = {},
  } = coffeeStore
  const { address1: address, city, zip_code, state } = location
  const neighborhood =
    city && state && zip_code ? `${city}, ${state} ${zip_code}` : ''
  const imgUrl = image_url || coffeeAlt

  const [voteCount, setVoteCount] = useState(0)

  const handleUpvoteButton = () => {
    let count = voteCount + 1
    setVoteCount(count)
  }
  console.log(coffeeStore)

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
            alt={name}
            src={imgUrl}
            width={600}
            height={360}
          />
        </div>
        <div className={`glass ${styles.col2}`}>
          <div className={styles.iconWrapper}>
            <Image
              src='/icons/nearMe.svg'
              width='24'
              height='24'
              alt={'Near Me'}
            />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src='/icons/places.svg'
              width='24'
              height='24'
              alt={'Places'}
            />
            <p className={styles.text}>{neighborhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src='/icons/star.svg' width='24' height='24' alt={'Star'} />
            <p className={styles.text}>{rating} on Yelp!</p>
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
