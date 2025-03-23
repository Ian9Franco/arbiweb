"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ChartTooltip, ResponsiveContainer } from "@/components/ui/chart"
import { fetchExchangePrices } from "@/lib/data"

// Definir la interfaz para los datos de precios de exchange
interface ExchangePrice {
  timestamp: string
  exchange: string
  price: number
  [key: string]: string | number // Añadir índice de firma para permitir acceso con string
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
        // Obtener datos de precios de exchanges
        const data = await fetchExchangePrices()
        setPrices(data)
      } catch (error) {
        console.error("Error al cargar precios de exchanges:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
    // Actualizar datos cada 30 segundos
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Agrupar datos por exchange
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
        <CardTitle>Precios de Exchanges</CardTitle>
        <CardDescription>Comparación de precios en tiempo real entre exchanges</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Cargando datos de precios...</p>
          </div>
        ) : (
          <div className="h-[300px]">
            {exchanges.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prices}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    }
                  />
                  <YAxis tickFormatter={(value) => `$${value.toFixed(0)}`} />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-md">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor: colors[exchanges.indexOf(data.exchange) % colors.length],
                                  }}
                                />
                                <span className="text-sm font-medium">{data.exchange}</span>
                              </div>
                              <div className="text-left text-sm">${data.price.toFixed(2)}</div>
                              <div className="text-left text-xs text-muted-foreground">
                                {new Date(data.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  {exchanges.map((exchange, i) => (
                    <Line
                      key={exchange}
                      type="monotone"
                      dataKey="price"
                      stroke={colors[i % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name={exchange}
                      // Filtrar datos para mostrar solo los del exchange actual
                      data={prices.filter((p) => p.exchange === exchange)}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">No hay datos de precios disponibles</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

