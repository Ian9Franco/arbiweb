"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchStats } from "@/lib/data"

export function DashboardCards() {
  // Estado para almacenar las estadísticas del bot de arbitraje
  const [stats, setStats] = useState({
    total_trades: 0,
    profitable_trades: 0,
    total_profit: 0,
    current_balance: 1000,
    start_balance: 1000,
    asset_balance: 10,
  })
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(true)

  // Efecto para cargar las estadísticas al montar el componente
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Obtener estadísticas de la API
        const data = await fetchStats()
        setStats(data)
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
      } finally {
        // Marcar como cargado independientemente del resultado
        setLoading(false)
      }
    }

    loadStats()
    // Actualizar datos cada 30 segundos
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Calcular el porcentaje de beneficio desde el saldo inicial
  const profitPercentage = ((stats.current_balance - stats.start_balance) / stats.start_balance) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {loading ? (
        // Mostrar esqueletos de carga
        <>
          <Card className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-3/4 rounded-md bg-muted"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-3/4 rounded-md bg-muted"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-3/4 rounded-md bg-muted"></div>
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-3/4 rounded-md bg-muted"></div>
            </CardContent>
          </Card>
        </>
      ) : (
        // Contenido real
        <>
          {/* Tarjeta de saldo total */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6"></path>
                <path d="M12 18v2"></path>
                <path d="M12 4v2"></path>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.current_balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {profitPercentage >= 0 ? (
                  <span className="text-green-500">+{profitPercentage.toFixed(2)}%</span>
                ) : (
                  <span className="text-red-500">{profitPercentage.toFixed(2)}%</span>
                )}
                {" desde el saldo inicial"}
              </p>
            </CardContent>
          </Card>

          {/* Tarjeta de beneficio total */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Beneficio Total</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.total_profit.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Beneficio total de todas las operaciones</p>
            </CardContent>
          </Card>

          {/* Tarjeta de operaciones totales */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operaciones Totales</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_trades}</div>
              <p className="text-xs text-muted-foreground">
                {stats.profitable_trades} rentables (
                {stats.total_trades > 0 ? ((stats.profitable_trades / stats.total_trades) * 100).toFixed(1) : 0}%)
              </p>
            </CardContent>
          </Card>

          {/* Tarjeta de saldo de activos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo de Activos</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v1"></path>
                <path d="M12 21v-1"></path>
                <path d="M4.93 4.93l.7.7"></path>
                <path d="M18.36 18.36l.7.7"></path>
                <path d="M2 12h1"></path>
                <path d="M21 12h-1"></path>
                <path d="M4.93 19.07l.7-.7"></path>
                <path d="M18.36 5.64l.7-.7"></path>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.asset_balance.toFixed(4)} BTC</div>
              <p className="text-xs text-muted-foreground">Aprox. ${(stats.asset_balance * 50000).toFixed(2)} USD</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

