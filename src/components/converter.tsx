'use client'

import { ChangeEvent, useState } from 'react'
import { Input } from '@/components/ui-kit/input'
import Image from 'next/image'
import { formatCurrency } from '@/utils/helpers'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select'

export function Converter({ symbol, icon, priceList }: ConverterProps) {
  const [currency, setCurrency] = useState('usd')
  const [amount, setAmount] = useState('10')

  const convertedPrice = (parseFloat(amount) || 0) * (priceList[currency] || 0)

  const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value)
  }

  return (
    <div id="converter">
      <h4>{symbol.toUpperCase()} Converter</h4>
      <div className="panel">
        <div className="input-wrapper">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={onAmountChange}
            className="input"
          />
          <div className="coin-info">
            <Image src={icon} alt={symbol} width={20} height={20} />
            <p>{symbol.toUpperCase()}</p>
          </div>
        </div>

        <div className="divider">
          <div className="line" />
          <Image
            src="/converter.svg"
            alt="Converter"
            width={32}
            height={32}
            className="icon"
          />
        </div>

        <div className="output-wrapper">
          <p>{formatCurrency(convertedPrice, 2, currency, false)}</p>

          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger value={currency} className="select-trigger">
              <SelectValue placeholder="Select" className="select-value">
                {currency.toUpperCase()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="select-content" data-converter>
              {Object.keys(priceList).map(currencyCode => (
                <SelectItem
                  key={currencyCode}
                  value={currencyCode}
                  className="select-value"
                >
                  {currencyCode.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
