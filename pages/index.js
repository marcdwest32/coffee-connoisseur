import Head from 'next/head'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { ACTION_TYPES, StoreContext } from '../store/store-context'
import styles from '../styles/Home.module.css'
import Banner from '../components/banner'
import Card from '../components/card'
import heroImage from '../public/images/hero-image.png'
import { fetchCoffeeStores } from '../lib/coffee-stores'
import useTrackLocation from '../hooks/useTrackLocation'

const coffeeAlt =
  'https://s3-media1.fl.yelpcdn.com/bphoto/G0qtDI4vD1aQk1zlPkhA5w/o.jpg'

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores()

  return {
    props: {
      coffeeStores,
    },
  }
}

export default function Home(props) {
  const { handleTrackLocation, isFindingLocation, locationErrorMsg } =
    useTrackLocation()
  const [coffeeStoresError, setCoffeeStoresError] = useState(null)
  const { dispatch, state } = useContext(StoreContext)
  const { coffeeStores, latLong } = state

  useEffect(() => {
    const setCoffeeStoresByLocation = async () => {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=20`,
          )
          const coffeeStores = await response.json()
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores },
          })
          setCoffeeStoresError('')
        } catch (error) {
          console.error({ error })
          setCoffeeStoresError(error.message)
        }
      }
    }
    setCoffeeStoresByLocation()
  }, [latLong])

  const handleOnBannerBtnClick = () => {
    handleTrackLocation()
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View Stores Nearby'}
          handleOnClick={handleOnBannerBtnClick}
        ></Banner>
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src={heroImage}
            width={700}
            height={400}
            alt='hero image'
            priority={true}
          />
        </div>
        {coffeeStores.length > 0 && (
          <>
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2}>Stores Near Me</h2>
              <div className={styles.cardLayout}>
                {coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      alt={'coffee'}
                      name={coffeeStore.name}
                      imgUrl={coffeeStore.image_url || coffeeAlt}
                      src={''}
                      href={`coffee-store/${coffeeStore.id}`}
                    />
                  )
                })}
              </div>
            </div>
          </>
        )}
        {props.coffeeStores.length > 0 && (
          <>
            <div className={styles.sectionWrapper}>
              <h2 className={styles.heading2}>New Orleans</h2>
              <div className={styles.cardLayout}>
                {props.coffeeStores.map((coffeeStore) => {
                  return (
                    <Card
                      key={coffeeStore.id}
                      name={coffeeStore.name}
                      imgUrl={coffeeStore.image_url}
                      src={''}
                      href={`coffee-store/${coffeeStore.id}`}
                    />
                  )
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
