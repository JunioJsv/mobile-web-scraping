import puppeteer from 'puppeteer'
import { AppScrapingInformations, AppUsersRatting as AppUserRatting } from '../@types/app-scraping-informations';

const target = 'https://play.google.com/store/apps/details'

type GooglePlayScrapingService = {
    getInformations: (_packages: string[]) => Promise<AppScrapingInformations[]>
}

const getInformationsByPackage = async (browser: puppeteer.Browser, _package: string) => {
    const page = await browser.newPage()
    await page.goto(`${target}?id=${_package}`)

    let informations: AppScrapingInformations = await page.evaluate(() => ({
        name: document.querySelector('h1[itemprop="name"] span')?.innerHTML ?? '',
        description: document.querySelector('div[itemprop="description"] > span > div')?.innerHTML.split('<br>').filter((text) => text !== "") ?? [],
        category: document.querySelector('a[itemprop="genre"]')?.innerHTML ?? '',
        ratingAmount: parseInt(document.querySelector('span.AYi5wd.TBRnV > span')?.innerHTML.replaceAll('.', '') ?? '0'),
        ratting: parseFloat(document.querySelector('.K9wGie > .BHMmbe')?.innerHTML.replace(',', '.') ?? '0'),
        rattings: []
    }))

    await page.goto(`${target}?id=${_package}&showAllReviews=true`)

    let rattings: AppUserRatting[] = await page.evaluate(() => {
        let elements: Element[] = Array.from(document.querySelectorAll('div[jsname="fk8dgd"] > div').values())
        return elements.map(element => {
            let userName = element.querySelector('span.X43Kjb')?.innerHTML ?? ''
            let rattingLikes = parseInt(element.querySelector('div.jUL89d.y92BAb')?.innerHTML ?? '0')
            let ratting = element.querySelectorAll('.vQHuPe').length
            let suggestion = element.querySelector('span[jsname="bN97Pc"]')?.innerHTML ?? ''
            suggestion = suggestion.replace('<div class=\"cQj82c\"><button class=\"LkLjZd ScJHi OzU4dc  \" jsaction=\"click:TiglPc\" jsname=\"gxjVle\">Resenha completa</button></div>', '')
            return {
                userName,
                ratting,
                rattingLikes,
                suggestion
            }
        })
    })

    informations.rattings = rattings

    return informations
};

const getInformations = async (_packages: string[]) => {
    const browser: puppeteer.Browser = await puppeteer.launch();
    const result = await Promise.all(_packages.map((_package) =>
        getInformationsByPackage(browser, _package)
    ));
    browser.close()
    return result
}

const service: GooglePlayScrapingService = {
    getInformations
}

export type {
    GooglePlayScrapingService
}

export default service;
