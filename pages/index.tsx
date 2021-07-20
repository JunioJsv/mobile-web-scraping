import { GetStaticProps } from 'next';
import Head from 'next/head'
import React from 'react';
import { AppScrapingInformations } from '../lib/@types/app-scraping-informations';
import GooglePlayScrapingService from '../lib/services/googleplay-scraping-service'
import { exportAppScrapingInformations } from '../lib/utils';

type HomeProps = {
  googleplay: AppScrapingInformations[]
}

const Home: React.FC<HomeProps> = ({ googleplay }) => {
  return (
    <div>
      <Head>
        <title>Mobile Web Scrapping</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Mobile Web Scrapping</h1>
        <button onClick={() => {
          exportAppScrapingInformations(googleplay)
        }}>
          <span>GooglePlay</span>
        </button>
      </main>

      <footer>

      </footer>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async (context) => {
  let googleplayTargets = process.env.GOOGLEPLAY_DEFAULT_SCRAPING_TARGETS?.split(',') ?? []
  let googleplay = await new GooglePlayScrapingService().getAppInformations(googleplayTargets)
  return {
    props: {
      googleplay
    },
    revalidate: 10
  }
}

export default Home;