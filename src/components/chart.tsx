'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import {
  getCandlestickConfig,
  getChartConfig,
  LIVE_INTERVAL_BUTTONS,
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
  liveOhlcv,
  mode = 'historical',
  liveInterval,
  setLiveInterval,
}: CandlestickChartProps) {
  const [period, setPeriod] = useState<Period>(initialPeriod)
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? [])
  const [isPending, startTransition] = useTransition()

  const chartRef = useRef<IChartApi | null>(null)
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const prevOhlcDataLength = useRef<number>(data?.length || 0)

  const fetchOHLCData = async (selectedPeriod: Period) => {
    try {
      const { days } = PERIOD_CONFIG[selectedPeriod]
      const response = await fetcher<OHLCData[]>(`/coins/${coinId}/ohlc`, {
        vs_currency: 'usd',
        days,
        precision: 'full',
      })

      startTransition(() => {})

      setOhlcData(response ?? [])
    } catch (err) {
      console.error('Failed to fetch OHLCData', err)
    }
  }

  const handlePeriodChange = (newPeriod: Period) => {
    if (newPeriod === period) return

    setPeriod(newPeriod)
    fetchOHLCData(newPeriod)
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

    let merged: OHLCData[]
    if (liveOhlcv) {
      const liveTimestamp = liveOhlcv[0]

      const lastHistoricalCandle = convertedToSeconds[convertedToSeconds.length - 1]
      if (lastHistoricalCandle && lastHistoricalCandle[0] === liveTimestamp) {
        merged = [...convertedToSeconds.slice(0, -1), liveOhlcv]
      } else {
        merged = [...convertedToSeconds, liveOhlcv]
      }
    } else {
      merged = convertedToSeconds
    }

    merged.sort((a, b) => a[0] - b[0])

    const converted = convertOHLCData(merged)
    candleSeriesRef.current.setData(converted)

    const dataChanged = prevOhlcDataLength.current !== ohlcData.length
    if (dataChanged || mode === 'historical') {
      chartRef.current?.timeScale().fitContent()
      prevOhlcDataLength.current = ohlcData.length
    }
  }, [ohlcData, period, liveOhlcv, mode])

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

        {liveOhlcv && (
          <div className="button-group">
            <span className="text-sm mx-2 font-medium text-purple-100/50">
              Update Fequency
            </span>
            {LIVE_INTERVAL_BUTTONS.map(({ value, label }) => (
              <button
                key={value}
                className={
                  liveInterval === value ? 'config-button-active' : 'config-button'
                }
                onClick={() => setLiveInterval && setLiveInterval(value)}
                disabled={isPending}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div ref={chartContainerRef} className="chart" style={{ height }} />
    </div>
  )
}
