import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import coffeeStoresData from '../../data/coffee-stores.json'

export async function getStaticProps({ params }) {
  return {
    props: {
      coffeeStore: coffeeStoresData.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id //dynamic id
      }),
    },
  }
}

export function getStaticPaths() {
  const paths = coffeeStoresData.map((coffeeStore) => {
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
  const {
    id: storeId,
    name,
    imgUrl,
    websiteUrl,
    address,
    neighborhood,
  } = props.coffeeStore

  const router = useRouter()
  if (router.isFallback) {
    return <div>...Loading</div>
  }

  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <Link href='/' scroll={false}>
        Back to Home
      </Link>
      <p>{name}</p>
      <p>{address}</p>
      <p>{neighborhood}</p>
    </div>
  )
}

export default CoffeeStore
