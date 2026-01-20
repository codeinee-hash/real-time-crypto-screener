'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { CandlestickSeries, createChart, IChartApi, ISeriesApi } from 'lightweight-charts'
import { fetchOHLCData } from '@/api/coin-ohlc.api'
import { convertOHLCData } from '@/utils/helpers'
import { getCandlestickConfig, getChartConfig } from '@/utils/constants'

interface ChartParams {
  initialPeriod: Period
  data?: OHLCData[]
  coinId: string
  mode: 'historical' | 'live'
  liveOhlcv?: OHLCData | null
  height: number
}

export function useChart({
  initialPeriod,
  data,
  coinId,
  mode,
  liveOhlcv,
  height,
}: ChartParams) {
  const [period, setPeriod] = useState<Period>(initialPeriod)
  const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? [])
  const [isPending, startTransition] = useTransition()

  const chartRef = useRef<IChartApi | null>(null)
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const prevOhlcDataLength = useRef<number>(data?.length || 0)

  const handlePeriodChange = async (newPeriod: Period) => {
    if (newPeriod === period) return

    setPeriod(newPeriod)
    const response = await fetchOHLCData(coinId, newPeriod)
    setOhlcData(response ?? [])
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

  return {
    period,
    isPending,
    handlePeriodChange,
    chartContainerRef,
  }
}
