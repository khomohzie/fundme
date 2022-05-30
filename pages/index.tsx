import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Fundme</title>
        <meta name="description" content="Fundme - Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>
        What's up!!!
      </h1>
    </div>
  )
}

export default Home
