import { fetcher } from '@/lib/coingecko.api'

export async function getMarketCoins({
  perPage,
  currentPage,
}: {
  perPage: number
  currentPage: number
}): Promise<CoinMarketData[] | null> {
  try {
    const response = await fetcher<CoinMarketData[]>('/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: perPage,
      page: currentPage,
      sparkline: 'false',
      price_change_percentage: '24h',
    })
    return response
  } catch (e) {
    console.error('Error fetching market coins: ', e)
    return null
  }
}
