import { DataTable } from '@/components/data-table'
import { getCategories } from '@/api/categories.api'
import { cn } from '@/lib/css'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/utils/helpers'
import Image from 'next/image'

const COLUMNS: DataTableColumn<Category>[] = [
  {
    header: 'Category',
    cellClassName: 'category-cell',
    cell: category => category.name,
  },
  {
    header: 'Top Gainers',
    cellClassName: 'top-gainers-cell',
    cell: category =>
      category.top_3_coins.map(coin => (
        <Image key={coin} src={coin} alt={coin} width={26} height={26} />
      )),
  },
  {
    header: '24h Change',
    cell: category => {
      const isTrendingUp = category.market_cap_change_24h >= 0
      return (
        <div
          className={cn(
            'change-cell',
            isTrendingUp ? 'text-green-500' : 'text-destructive'
          )}
        >
          <p className="flex items-center gap-1">
            {formatPercentage(category.market_cap_change_24h)}
            {isTrendingUp ? (
              <TrendingUp width={16} height={16} />
            ) : (
              <TrendingDown width={16} height={16} />
            )}
          </p>
        </div>
      )
    },
  },
  {
    header: 'Market Cap',
    cellClassName: 'market-cap-cell',
    cell: category => formatCurrency(category.market_cap),
  },
  {
    header: '24h Volume',
    cellClassName: 'volume-cell',
    cell: category => formatCurrency(category.volume_24h),
  },
]

export async function Categories() {
  const categories = await getCategories()

  return (
    <div id="categories">
      <h4>Top Categories</h4>
      <DataTable
        columns={COLUMNS}
        data={categories?.slice(0, 10) ?? []}
        rowKey={category => category.id}
        headerCellClassName="change-header-cell"
      />
    </div>
  )
}
