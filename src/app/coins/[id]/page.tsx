import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { LiveDataWrapper } from '@/components/live-data-wrapper'
import { Converter } from '@/components/converter'
import { getCoinDetails } from '@/api/coin-details.api'

export default async function CoinDetail({ params }: NextPageProps) {
  const { id } = await params

  const { coinData, coinOHLCData, coinDetails, pool } = await getCoinDetails(id)

  return (
    <main id="coin-details-page">
      <section className="primary">
        <LiveDataWrapper
          coinId={id}
          poolId={pool.id}
          coin={coinData}
          coinOHLCData={coinOHLCData}
        >
          <h4>Exchange Listings</h4>
        </LiveDataWrapper>
      </section>

      <section className="secondary">
        <Converter
          symbol={coinData.symbol}
          icon={coinData.image.small}
          priceList={coinData.market_data.current_price}
        />

        <div className="details">
          <h4>Coin Details</h4>
          <ul className="details-grid">
            {coinDetails.map(({ label, value, link, linkText }, idx) => (
              <li key={idx}>
                <p className={label}>{label}</p>

                {link ? (
                  <div className="link">
                    <Link href={link} target="_blank" rel="noopener noreferrer">
                      {linkText || label}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : (
                  <p className="text-base font-medium">{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
