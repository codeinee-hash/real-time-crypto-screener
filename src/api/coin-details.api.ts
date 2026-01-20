import { fetcher, getPools } from '@/lib/coingecko.api'
import { formatCurrency } from '@/utils/helpers'

export async function getCoinDetails(id: string) {
  const [coinData, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`, {
      dex_pair_format: 'contract_address',
    }),
    fetcher<OHLCData>(`/coins/${id}/ohlc`, {
      vs_currency: 'usd',
      days: 1,
      precision: 'full',
    }),
  ])

  const platform = coinData.asset_platform_id
    ? coinData.detail_platforms?.[coinData.asset_platform_id]
    : null
  const network = platform?.geckoterminal_url.split('/')[3] || null
  const contractAddress = platform?.contract_address || null

  const pool = await getPools(id, network, contractAddress)

  const coinDetails = [
    { label: 'Market Cap', value: formatCurrency(coinData.market_data.market_cap.usd) },
    { label: 'Market Cap Rank', value: `# ${coinData.market_cap_rank}` },
    {
      label: 'Total Volume',
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
    {
      label: 'Website',
      value: '-',
      link: coinData.links.homepage[0],
      linkText: 'Homepage',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links.blockchain_site[0],
      linkText: 'Explorer',
    },
    {
      label: 'Community',
      value: '-',
      link: coinData.links.subreddit_url,
      linkText: 'Community',
    },
  ]

  return {
    coinData,
    coinOHLCData,
    pool,
    coinDetails,
  }
}
