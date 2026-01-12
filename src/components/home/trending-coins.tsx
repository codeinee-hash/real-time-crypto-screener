import Link from 'next/link'
import Image from 'next/image'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { DataTable } from '@/components/data-table'
import { TrendingCoinsFallback } from '@/components/home/fallback'
import { getTrendingCoins } from '@/api/trending-coins.api'
import { ROUTES } from '@/utils/constants'
import { cn } from '@/lib/css'

const COLUMNS: DataTableColumn<TrendingCoin>[] = [
  {
    header: 'Token',
    cellClassName: 'name-cell',
    cell(coin) {
      const item = coin.item
      return (
        <Link href={`${ROUTES.COINS}/${item.id}`}>
          <Image src={item.large} alt={item.name} width={36} height={36} />
          <p className="mt-1">{item.name}</p>
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

export async function TrendingCoins() {
  const trendingCoins = await getTrendingCoins()

  if (!trendingCoins) return <TrendingCoinsFallback />

  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>
      <DataTable
        data={trendingCoins.slice(0, 5) || []}
        columns={COLUMNS}
        rowKey={coin => coin.item.id}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  )
}
