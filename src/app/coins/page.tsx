import Link from 'next/link'
import Image from 'next/image'
import { DataTable } from '@/components/data-table'
import { CoinsPagination } from '@/components/coins-pagination'
import { getMarketCoins } from '@/api/market-coins.api'
import { formatCurrency, formatPercentage } from '@/utils/helpers'
import { cn } from '@/lib/css'

const COLUMNS: DataTableColumn<CoinMarketData>[] = [
  {
    header: 'Rank',
    cellClassName: 'rank-cell',
    cell: coin => (
      <>
        #{coin.market_cap_rank}
        <Link href={`/coins/${coin.id}`} aria-label="View coin" />
      </>
    ),
  },
  {
    header: 'Token',
    cellClassName: 'token-cell',
    cell: coin => (
      <div className="token-info">
        <Image src={coin.image} alt={coin.name} width={36} height={36} />
        <p>
          {coin.name} ({coin.symbol.toUpperCase()})
        </p>
      </div>
    ),
  },
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: coin => formatCurrency(coin.current_price),
  },
  {
    header: '24h Change',
    cellClassName: 'change-cell',
    cell: coin => {
      const isTrendingUp = coin.price_change_percentage_24h >= 0
      return (
        <span
          className={cn(
            'change-value',
            isTrendingUp ? 'text-green-500' : 'text-destructive'
          )}
        >
          {isTrendingUp && '+'}
          {formatPercentage(coin.price_change_percentage_24h)}
        </span>
      )
    },
  },
  {
    header: 'Market Cap',
    cellClassName: 'market-cap-cell',
    cell: coin => formatCurrency(coin.market_cap),
  },
]

export default async function CoinsPage({ searchParams }: NextPageProps) {
  const { page } = await searchParams
  const currentPage = Number(page) || 1
  const perPage = 10

  const marketCoins = await getMarketCoins({ perPage, currentPage })

  const hasMorePages = marketCoins?.length === perPage
  const estimatedTotalPages =
    currentPage >= 100 ? Math.ceil(currentPage / 100) * 100 + 100 : 100

  return (
    <main id="coins-page">
      <div className="content">
        <h4>All coins</h4>

        <DataTable
          columns={COLUMNS}
          data={marketCoins?.slice(0, 10) ?? []}
          rowKey={coin => coin.id}
          tableClassName="coins-table"
        />

        <CoinsPagination
          currentPage={currentPage}
          totalPages={estimatedTotalPages}
          hasMorePages={hasMorePages}
        />
      </div>
    </main>
  )
}
