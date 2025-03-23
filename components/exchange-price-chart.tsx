"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
} from "@/components/ui/chart"
import { fetchExchangePrices } from "@/lib/data"

interface ExchangePrice {
  timestamp: string
  exchange: string
  price: number
}

interface ExchangePriceChartProps {
  className?: string
}

export function ExchangePriceChart({ className }: ExchangePriceChartProps) {
  const [prices, setPrices] = useState<ExchangePrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchExchangePrices()
        setPrices(data)
      } catch (error) {
        console.error("Error loading exchange prices:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // Poll for updates every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Group data by exchange
  const exchangeData = prices.reduce((acc: Record<string, ExchangePrice[]>, price) => {
    if (!acc[price.exchange]) {
      acc[price.exchange] = []
    }
    acc[price.exchange].push(price)
    return acc
  }, {})

  const exchanges = Object.keys(exchangeData)
  const colors = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#f59e0b"]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Exchange Prices</CardTitle>
        <CardDescription>Real-time price comparison across exchanges</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading price data...</p>
          </div>
        ) : (
          <div className="h-[300px]">
            {exchanges.length > 0 ? (
              <Chart data={prices} x={(d) => new Date(d.timestamp)} y={(d) => d.price} series={(d) => d.exchange}>
                <ChartContainer>
                  <ChartYAxis />
                  <ChartXAxis />
                  {exchanges.map((exchange, i) => (
                    <ChartLine key={exchange} series={exchange} style={{ stroke: colors[i % colors.length] }} />
                  ))}
                  <ChartTooltip>
                    {({ datum }) => (
                      <ChartTooltipContent>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: colors[exchanges.indexOf(datum.exchange) % colors.length],
                              }}
                            />
                            <span className="text-sm font-medium">{datum.exchange}</span>
                          </div>
                          <div className="text-left text-sm">${datum.price.toFixed(2)}</div>
                          <div className="text-left text-xs text-muted-foreground">
                            {new Date(datum.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </ChartTooltipContent>
                    )}
                  </ChartTooltip>
                </ChartContainer>
              </Chart>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">No price data available</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

