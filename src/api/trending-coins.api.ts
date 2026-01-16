import { fetcher } from '@/lib/coingecko.api'

export async function getTrendingCoins(): Promise<TrendingCoin[] | null> {
  try {
    const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
      '/search/trending',
      undefined,
      300
    )
    return trendingCoins.coins
  } catch (e) {
    console.error('Error fetching trending coins: ', e)
    return null
  }
}
