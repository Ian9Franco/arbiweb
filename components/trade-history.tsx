"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchTradeHistory } from "@/lib/data"

interface Trade {
  buy_trade: {
    exchange: string
    price: number
    amount: number
  }
  sell_trade: {
    exchange: string
    price: number
    amount: number
  }
  profit: number
  profit_percentage: number
  timestamp: string
}

interface TradeHistoryProps {
  className?: string
}

export function TradeHistory({ className }: TradeHistoryProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTradeHistory()
        setTrades(data.slice(-10).reverse()) // Get the 10 most recent trades
      } catch (error) {
        console.error("Error loading trade history:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // Poll for updates every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
        <CardDescription>Latest arbitrage trades executed by the bot</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading trade history...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trades.length > 0 ? (
              trades.map((trade, index) => (
                <div key={index} className="flex flex-col space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">
                        {trade.buy_trade.exchange} → {trade.sell_trade.exchange}
                      </div>
                    </div>
                    <div className={trade.profit > 0 ? "text-green-500" : "text-red-500"}>
                      {trade.profit > 0 ? "+" : ""}
                      {trade.profit.toFixed(2)} USD
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Buy: ${trade.buy_trade.price.toFixed(2)} | Sell: ${trade.sell_trade.price.toFixed(2)} |
                    {(trade.profit_percentage * 100).toFixed(2)}% profit
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(trade.timestamp).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No trade history available</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

