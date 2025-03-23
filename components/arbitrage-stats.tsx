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
        console.error("Error al cargar oportunidades de arbitraje:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // Actualizar datos cada 30 segundos
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Agrupar por pares de exchanges
  const exchangePairs = opportunities.reduce((acc: Record<string, number>, opp) => {
    const key = `${opp.buy_exchange} → ${opp.sell_exchange}`
    if (!acc[key]) {
      acc[key] = 0
    }
    acc[key]++
    return acc
  }, {})

  // Ordenar por frecuencia
  const sortedPairs = Object.entries(exchangePairs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Calcular total para porcentaje
  const total = Object.values(exchangePairs).reduce((sum, count) => sum + count, 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Oportunidades de Arbitraje</CardTitle>
        <CardDescription>Pares de exchanges más frecuentes para arbitraje</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Cargando datos de arbitraje...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedPairs.length > 0 ? (
              sortedPairs.map(([pair, count]) => (
                <div className="space-y-2" key={pair}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{pair}</div>
                    <div className="text-sm text-muted-foreground">{count} oportunidades</div>
                  </div>
                  <Progress value={(count / total) * 100} />
                </div>
              ))
            ) : (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">No hay datos de arbitraje disponibles</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

