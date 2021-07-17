import { NextApiRequest, NextApiResponse } from "next";
import googlePlayScrapingService, { AppScrapingInformations } from "../../../lib/services/googleplay-scraping-service";


const handler = async (req: NextApiRequest, res: NextApiResponse<AppScrapingInformations[]>) => {
    const { _package } = req.query
    const informations = await googlePlayScrapingService
        .getInformations([typeof _package === 'string' ? _package : (_package as string[])[0]])
    res.status(200).json(informations);
}

export default handler;