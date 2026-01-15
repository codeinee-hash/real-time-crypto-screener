import Image from 'next/image'
import { formatCurrency } from '@/utils/helpers'
import { getCoinOverview } from '@/api/coin-overview.api'
import { CoinOverviewFallback } from '@/components/home/fallback'
import { Chart } from '@/components/chart'

export async function CoinOverview() {
  const data = await getCoinOverview()
  if (!data) return <CoinOverviewFallback />

  const { coin, coinOHLC } = data

  return (
    <div id="coin-overview">
      <Chart data={coinOHLC} coinId="bitcoin">
        <div className="header pt-2">
          <Image src={coin.image.large} alt={coin.name} width={56} height={56} />
          <div className="info">
            <p>
              {coin.name} / {coin.symbol.toUpperCase()}
            </p>
            <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </Chart>
    </div>
  )
}
