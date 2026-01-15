import { fetcher } from '@/lib/coingecko.api'

export async function getCoinOverview(): Promise<{
  coin: CoinDetailsData
  coinOHLC: OHLCData[]
} | null> {
  try {
    const [coin, coinOHLC] = await Promise.all([
      await fetcher<CoinDetailsData>('/coins/bitcoin', {
        dex_pair_format: 'symbol',
      }),
      await fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
        precision: 'full',
      }),
    ])

    return {
      coin,
      coinOHLC,
    }
  } catch (e) {
    console.error('Error fetching coins overview: ', e)
    return null
  }
}
