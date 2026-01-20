'use client'

import { LIVE_INTERVAL_BUTTONS, PERIOD_BUTTONS } from '@/utils/constants'
import { useChart } from '@/hooks/use-chart'

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
  const { period, isPending, handlePeriodChange, chartContainerRef } = useChart({
    initialPeriod,
    data,
    coinId,
    mode,
    height,
    liveOhlcv,
  })

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
              Update Frequency
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
