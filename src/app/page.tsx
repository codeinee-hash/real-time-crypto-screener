import Image from 'next/image'
import Link from 'next/link'
import { DataTable } from '@/components/data-table'
import { ROUTES } from '@/utils/routes.const'
import { cn } from '@/lib/css'
import { TrendingDown, TrendingUp } from 'lucide-react'

const COLUMNS: DataTableColumn<TrendingCoin>[] = [
  {
    header: 'Token',
    cellClassName: 'name-cell',
    cell(coin) {
      const item = coin.item
      return (
        <Link href={`${ROUTES.COINS}/${item.id}`}>
          <Image src={item.large} alt={item.name} width={36} height={36} />
          <p>{item.name}</p>
        </Link>
      )
    },
  },
  {
    header: '24h Change',
    cellClassName: 'name-cell',
    cell(coin) {
      const item = coin.item
      const isTrendingUp = item.data.price_change_percentage_24h
      return (
        <div
          className={cn(
            'price-change',
            isTrendingUp ? 'text-green-500' : 'text-destructive'
          )}
        >
          <p>
            {isTrendingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
            {Math.abs(item.data.price_change_percentage_24h.usd).toFixed(2)}%
          </p>
        </div>
      )
    },
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: coin => coin.item.data.price,
  },
]

const TRENDING_COINS: TrendingCoin[] = [
  {
    item: {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      market_cap_rank: 1,
      thumb: '/logo.svg',
      large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      data: {
        price: 89113.0,
        price_change_percentage_24h: {
          usd: 2.5,
        },
      },
    },
  },
]

export default function Home() {
  return (
    <div className="main-container py-6 md:py-12">
      <section className="home-grid">
        <div id="coin-overview">
          <div className="header pt-2">
            <Image
              src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
              alt="Bitcoin"
              width={56}
              height={56}
            />
            <div className="info">
              <p>Bitcoin / BTC</p>
              <h1>$89,113.00</h1>
            </div>
          </div>
        </div>

        <p>Trending Coins</p>
        <div id="trending-coins">
          <DataTable
            data={TRENDING_COINS}
            columns={COLUMNS}
            rowKey={coin => coin.item.id}
            tableClassName="trending-coins-table"
          />
        </div>
      </section>

      <section className="w-full mt-7 space-y-4">
        <p>Categories</p>
      </section>
    </div>
  )
}
