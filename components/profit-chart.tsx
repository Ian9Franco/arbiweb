"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchDailyProfits } from "@/lib/data"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartTooltip as Tooltip,
  ResponsiveContainer,
} from "@/components/ui/chart"

// Interfaz para los datos de beneficios diarios
interface DailyProfit {
  date: string
  profit: number
}

// Propiedades del componente de gráfico de beneficios
interface ProfitChartProps {
  className?: string
}

// Componente que muestra un gráfico de beneficios a lo largo del tiempo
export function ProfitChart({ className }: ProfitChartProps) {
  // Estado para almacenar los datos de beneficios diarios
  const [dailyProfits, setDailyProfits] = useState<DailyProfit[]>([])
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true)
  // Estado para el período de tiempo seleccionado (7 días, 30 días, 90 días)
  const [period, setPeriod] = useState("7d")

  // Efecto para cargar los datos de beneficios al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtener datos de beneficios diarios de la API
        const data = await fetchDailyProfits()
        setDailyProfits(data)
      } catch (error) {
        console.error("Error al cargar los beneficios diarios:", error)
      } finally {
        // Marcar como cargado independientemente del resultado
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtrar datos según el período seleccionado
  const filteredData = () => {
    if (!dailyProfits.length) return []

    // Determinar cuántos días mostrar según el período seleccionado
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90
    return dailyProfits.slice(-days)
  }

  const data = filteredData()

  // Función para calcular beneficios acumulados (para uso futuro)
  // Esta función se implementará en una futura mejora para mostrar beneficios acumulados
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const calculateCumulativeData = () => {
    return data.reduce((acc: DailyProfit[], current, index) => {
      const prevProfit = index > 0 ? acc[index - 1].profit : 0
      acc.push({
        date: current.date,
        profit: prevProfit + current.profit,
      })
      return acc
    }, [])
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Beneficios a lo largo del tiempo</CardTitle>
          <CardDescription>Beneficios diarios y acumulados de operaciones de arbitraje</CardDescription>
        </div>
        {/* Pestañas para seleccionar el período de tiempo */}
        <Tabs defaultValue="7d" value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="30d">30d</TabsTrigger>
            <TabsTrigger value="90d">90d</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {loading ? (
          // Mostrar mensaje de carga mientras se obtienen los datos
          <div className="flex h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">Cargando datos del gráfico...</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                {/* Cuadrícula de fondo */}
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                {/* Eje X con formato de fecha */}
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                  }
                />
                {/* Eje Y con formato de moneda */}
                <YAxis tickFormatter={(value) => `$${value.toFixed(0)}`} />
                {/* Tooltip personalizado para mostrar información al pasar el ratón */}
                <Tooltip
                  content={(props) => {
                    const { active, payload } = props
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as DailyProfit
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                              <span className="text-sm text-muted-foreground">
                                {new Date(data.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-left text-sm font-medium">
                              ${typeof payload[0].value === "number" ? payload[0].value.toFixed(2) : payload[0].value}
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                {/* Línea de beneficios */}
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

