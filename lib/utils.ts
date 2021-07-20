import { AppScrapingInformations } from "./@types/app-scraping-informations"
import csv from 'json2csv'
import download from './donwload'

const exportAppScrapingInformations = (informations: AppScrapingInformations[]) => {
    const fields = [
        { value: 'id' },
        { value: 'name' },
        { value: 'ratting' },
        { value: 'ratingAmount' },
        { value: 'downloads' },
        { value: 'lastUpdate' },
        { value: 'company' },
        { value: 'size' },
        { value: 'link' }]
    let _csv = csv.parse(informations.map((information, index) => {

        return {
            id: index,
            ...information
        }

    }), {
        fields,
    })

    return download(_csv, 'googleplay-scraping.csv', 'text/csv')
}

export { exportAppScrapingInformations }