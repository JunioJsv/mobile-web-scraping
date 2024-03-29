import { NextApiRequest, NextApiResponse } from "next";
import { AppScrapingInformations } from "../../../lib/@types/app-scraping-informations";
import GooglePlayScrapingService from "../../../lib/services/googleplay-scraping-service";


const handler = async (req: NextApiRequest, res: NextApiResponse<AppScrapingInformations[]>) => {
    const { _package } = req.query
    const informations = await new GooglePlayScrapingService()
        .getAppInformations([typeof _package === 'string' ? _package : (_package as string[])[0]])
    res.status(200).json(informations);
}

export default handler;