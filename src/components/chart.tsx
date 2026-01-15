'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import {
  getCandlestickConfig,
  getChartConfig,
  PERIOD_BUTTONS,
  PERIOD_CONFIG,
} from '@/utils/constants'
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import { fetcher } from '@/lib/coingecko.api'
import { convertOHLCData } from '@/utils/helpers'

export function Chart({
  children,
  coinId,
  data,
  height = 360,
  initialPeriod = 'daily',
}: CandlestickChartProps) {
  const [period, setPeriod] = useState<Period>(initialPeriod)
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? [])
  const [isPending, startTransition] = useTransition()

  const chartRef = useRef<IChartApi | null>(null)
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      const { days } = PERIOD_CONFIG[selectedPeriod]
      const response = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: 'usd',
        days,
        precision: 'full',
      })

      setOhlcData(response ?? [])
    } catch (err) {
      console.error('Failed to fetch OHLCData', err)
    }
  }

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return

    startTransition(async () => {
      setPeriod(newPeriod)
      await fetchOHLCData(newPeriod)
    })
  }

  useEffect(() => {
    const container = chartContainerRef.current
    if (!container) return

    const showTime = ['daily', 'weekly', 'monthly'].includes(period)

    const chart = createChart(container, {
      ...getChartConfig(height, showTime),
      width: container.clientWidth,
    })

    const series = chart.addSeries(CandlestickSeries, getCandlestickConfig())
    series.setData(convertOHLCData(ohlcData))
    chart.timeScale().fitContent()

    chartRef.current = chart
    candleSeriesRef.current = series

    const observer = new ResizeObserver(entities => {
      if (!entities.length) return
      chart.applyOptions({ width: entities[0].contentRect.width })
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
      chart.remove()
      chartRef.current = null
      candleSeriesRef.current = null
    }
  }, [height])

  useEffect(() => {
    if (!candleSeriesRef.current) return

    const convertedToSeconds = ohlcData.map(
      item => [Math.floor(item[0] / 1000), item[1], item[2], item[3], item[4]] as OHLCData
    )

    const converted = convertOHLCData(convertedToSeconds)
    candleSeriesRef.current.setData(converted)
    chartRef.current?.timeScale().fitContent()
  }, [ohlcData, period])

  return (
    <div id="candlestick-chart">
      <div className="chart-header">
        <div className="flex-1">{children}</div>
        <div className="button-group">
          <span className="text-sm mx-2 text-purple-100/50 font-medium">Period</span>
          {PERIOD_BUTTONS.map(({ value, label }) => (
            <button
              key={value}
              className={period === value ? 'config-button-active' : 'config-button'}
              onClick={() => handlePeriodChange(value)}
              disabled={isPending}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  )
}
