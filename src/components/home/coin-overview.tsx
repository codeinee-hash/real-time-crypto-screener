import Image from 'next/image'
import { formatCurrency } from '@/utils/helpers'
import { getCoinOverview } from '@/api/coin-overview.api'
import { CoinOverviewFallback } from '@/components/home/fallback'

export async function CoinOverview() {
  const coin = await getCoinOverview()

  if (!coin) return <CoinOverviewFallback />

  return (
    <div id="coin-overview">
      <div className="header pt-2">
        <Image src={coin?.image?.large} alt={coin.name} width={56} height={56} />
        <div className="info">
          <p>
            {coin.name} / {coin.symbol.toUpperCase()}
          </p>
          <h1>{formatCurrency(coin.market_data.current_price.usd)}</h1>
        </div>
      </div>
    </div>
  )
}
