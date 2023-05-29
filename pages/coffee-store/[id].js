import { useRouter } from 'next/router'
import { fetchCoffeeStores } from '../../lib/coffee_stores'
import styles from '../../styles/coffee-store.module.css'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import coffeeAlt from '../../public/images/coffee-alt.jpg'

export async function getStaticProps({ params }) {
  const coffeeStores = await fetchCoffeeStores()
  return {
    props: {
      coffeeStore: coffeeStores.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id //dynamic id
      }),
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

const CoffeeStore = (props) => {
  const { id: storeId, name, image_url, url, location } = props.coffeeStore
  const { address1: address, city, zip_code, state } = location
  const neighborhood = `${city}, ${state} ${zip_code}`
  const imgUrl = image_url || coffeeAlt

  const router = useRouter()
  if (router.isFallback) {
    return <div>...Loading</div>
  }

  const handleUpvoteButton = () => {
    console.log('upvote')
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
            <p className={styles.text}>1</p>
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
