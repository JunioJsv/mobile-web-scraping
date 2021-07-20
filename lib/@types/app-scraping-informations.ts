type AppUsersRatting = {
    userName: string,
    ratting: number,
    rattingLikes: number,
    suggestion: string
}

type AppScrapingInformations = {
    name: string,
    description: string[],
    category: string,
    company: string,
    size: string,
    lastUpdate: string,
    downloads: string,
    link: string,
    ratingAmount: number,
    ratting: number,
    rattings: AppUsersRatting[]
}

export type {
    AppUsersRatting, AppScrapingInformations
}