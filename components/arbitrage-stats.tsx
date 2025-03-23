"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { fetchArbitrageOpportunities } from "@/lib/data"

interface ArbitrageOpportunity {
  buy_exchange: string
  sell_exchange: string
  profit_percentage: number
  timestamp: string
}

interface ArbitrageStatsProps {
  className?: string
}

export function ArbitrageStats({ className }: ArbitrageStatsProps) {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchArbitrageOpportunities()
        setOpportunities(data)
      } catch (error) {
        console.error("Error loading arbitrage opportunities:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // Poll for updates every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Group by exchange pairs
  const exchangePairs = opportunities.reduce((acc: Record<string, number>, opp) => {
    const key = `${opp.buy_exchange} → ${opp.sell_exchange}`
    if (!acc[key]) {
      acc[key] = 0
    }
    acc[key]++
    return acc
  }, {})

  // Sort by frequency
  const sortedPairs = Object.entries(exchangePairs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Calculate total for percentage
  const total = Object.values(exchangePairs).reduce((sum, count) => sum + count, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Arbitrage Opportunities</CardTitle>
        <CardDescription>Most frequent exchange pairs for arbitrage</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading arbitrage data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedPairs.length > 0 ? (
              sortedPairs.map(([pair, count]) => (
                <div className="space-y-2" key={pair}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{pair}</div>
                    <div className="text-sm text-muted-foreground">{count} opportunities</div>
                  </div>
                  <Progress value={(count / total) * 100} />
                </div>
              ))
            ) : (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No arbitrage data available</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

