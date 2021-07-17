import { GetStaticProps } from 'next';
import Head from 'next/head'
import React from 'react';
import { AppScrapingInformations } from '../lib/@types/app-scraping-informations';
import GooglePlayScrapingService from '../lib/services/googleplay-scraping-service'
import styles from '../styles/index.module.scss'

type HomeProps = {
  googleplay: AppScrapingInformations[]
}

const Home: React.FC<HomeProps> = ({ googleplay }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mobile Web Scrapping</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div>
          {
            googleplay.map((informations, index) => {
              return (
                <ul key={index}>
                  <li>{informations.name}</li>
                  <li>Nota {informations.ratting}☆</li>
                  {informations.rattings.map((ratting, index) => {
                    return (
                      <ul key={index}>
                        <li>Usuário {ratting.userName} - {ratting.ratting}☆</li>
                        <p>{ratting.suggestion}</p>
                      </ul>
                    )
                  })}
                </ul>
              )
            })
          }
        </div>
      </main>

      <footer>

      </footer>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async (context) => {
  let googleplayTargets = process.env.GOOGLEPLAY_DEFAULT_SCRAPING_TARGETS?.split(',') ?? []
  let googleplay = await GooglePlayScrapingService.getInformations(googleplayTargets)
  return {
    props: {
      googleplay
    },
    revalidate: 10
  }
}

export default Home;