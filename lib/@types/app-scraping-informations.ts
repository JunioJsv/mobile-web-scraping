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
    ratingAmount: number,
    ratting: number,
    rattings: AppUsersRatting[]
}

export type {
    AppUsersRatting, AppScrapingInformations
}