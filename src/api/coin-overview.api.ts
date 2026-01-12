import { fetcher } from '@/lib/coingecko.api'

export async function getCoinOverview(): Promise<CoinDetailsData | undefined> {
  try {
    const coin = await fetcher<CoinDetailsData>('/coins/bitcoin', {
      dex_pair_format: 'symbol',
    })
    return coin
  } catch (e) {
    console.error('Error fetching coins overview: ', e)
  }
}
