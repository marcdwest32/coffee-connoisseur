import React from 'react'
import Image from 'next/image'
import styles from './banner.module.css'
import heroImage from '../public/images/hero-image.png'

const Banner = (props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>{' '}
        <span className={styles.title2}>Connoisseur</span>
      </h1>
      <div className={styles.heroImage}>
        <Image
          src={heroImage}
          width={600}
          height={400}
          alt='hero image'
          priority={true}
        />
      </div>

      <p className={styles.subTitle}>Discover your local coffee spots!</p>
      <div className={styles.buttonWrapper}>
        <button className={styles.button} onClick={props.handleOnClick}>
          {props.buttonText}
        </button>
      </div>
    </div>
  )
}

export default Banner
