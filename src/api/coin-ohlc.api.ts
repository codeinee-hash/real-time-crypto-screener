import { fetcher } from '@/lib/coingecko.api'
import { PERIOD_CONFIG } from '@/utils/constants'

export async function fetchOHLCData(
  coinId: string,
  selectedPeriod: Period
): Promise<OHLCData[] | null> {
  try {
    const { days } = PERIOD_CONFIG[selectedPeriod]
    const response = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
      vs_currency: 'usd',
      days,
      precision: 'full',
    })

    return response
  } catch (err) {
    console.error('Failed to fetch OHLCData', err)
    return null
  }
}
