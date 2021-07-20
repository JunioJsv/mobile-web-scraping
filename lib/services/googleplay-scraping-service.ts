import puppeteer from 'puppeteer'
import { AppScrapingInformations, AppUsersRatting as AppUserRatting } from '../@types/app-scraping-informations';

class GooglePlayScrapingService {
    target = 'https://play.google.com/store/apps/details'

    async getInformationsByAppPackage(browser: puppeteer.Browser, _package: string) {
        const page = await browser.newPage()
        await page.goto(`${this.target}?id=${_package}`)

        let informations: AppScrapingInformations = await page.evaluate(() => {
            let informationsElements = Array.from(document.querySelectorAll('.IxB2fe > .hAyfc').values());
            let lastUpdateElement = informationsElements[0]
            let appSizeElement = informationsElements[1]
            let downloadsElement = informationsElements[2]

            return {
                name: document.querySelector('h1[itemprop="name"] span')?.innerHTML ?? '',
                description: document.querySelector('div[itemprop="description"] > span > div')?.innerHTML.split('<br>').filter((text) => text !== "") ?? [],
                category: document.querySelector('a[itemprop="genre"]')?.innerHTML ?? '',
                company: document.querySelector('.hrTbp.R8zArc')?.innerHTML ?? '',
                size: appSizeElement?.querySelector('.IQ1z0d > .htlgb')?.innerHTML ?? '',
                lastUpdate: lastUpdateElement?.querySelector('.IQ1z0d > .htlgb')?.innerHTML ?? '',
                downloads: downloadsElement?.querySelector('.IQ1z0d > .htlgb')?.innerHTML ?? '0',
                link: window.location.href ?? '',
                ratingAmount: parseInt(document.querySelector('span.AYi5wd.TBRnV > span')?.innerHTML.replaceAll('.', '') ?? '0'),
                ratting: parseFloat(document.querySelector('.K9wGie > .BHMmbe')?.innerHTML.replace(',', '.') ?? '0'),
                rattings: []
            }
        })

        await page.goto(`${this.target}?id=${_package}&showAllReviews=true`)

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

    async getAppInformations(_packages: string[]): Promise<AppScrapingInformations[]> {
        const browser: puppeteer.Browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const result = await Promise.all(_packages.map((_package) =>
            this.getInformationsByAppPackage(browser, _package)
        ));
        browser.close()
        return result
    }
    
}

export default GooglePlayScrapingService;
