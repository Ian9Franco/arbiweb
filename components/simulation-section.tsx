"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, AlertCircle } from "lucide-react"

interface Exchange {
  name: string
  price: number
  volatility: number
}

interface SimulationResult {
  buyExchange: string
  sellExchange: string
  buyPrice: number
  sellPrice: number
  amount: number
  profit: number
  profitPercentage: number
  timestamp: string
}

export function SimulationSection() {
  // Estado para los exchanges
  const [exchanges, setExchanges] = useState<Exchange[]>([
    { name: "Binance", price: 50000, volatility: 0.02 },
    { name: "Coinbase", price: 50100, volatility: 0.025 },
    { name: "Kraken", price: 49900, volatility: 0.03 },
  ])

  // Estado para la configuración de la simulación
  const [amount, setAmount] = useState(1.0)
  const [threshold, setThreshold] = useState(0.5)

  // Estado para los resultados de la simulación
  const [results, setResults] = useState<SimulationResult[]>([])
  const [balance, setBalance] = useState(1000)
  const [assets, setAssets] = useState(0)
  const [isSimulating, setIsSimulating] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  // Función para actualizar el precio de un exchange
  const updateExchangePrice = (index: number, newPrice: number) => {
    const updatedExchanges = [...exchanges]
    updatedExchanges[index].price = newPrice
    setExchanges(updatedExchanges)
  }

  // Función para actualizar la volatilidad de un exchange
  const updateExchangeVolatility = (index: number, newVolatility: number) => {
    const updatedExchanges = [...exchanges]
    updatedExchanges[index].volatility = newVolatility
    setExchanges(updatedExchanges)
  }

  // Función para simular una operación de arbitraje
  const simulateArbitrage = () => {
    setIsSimulating(true)

    // Simular fluctuaciones de precio
    const updatedExchanges = exchanges.map((exchange) => {
      const priceChange = (Math.random() - 0.5) * 2 * exchange.volatility
      const newPrice = exchange.price * (1 + priceChange)
      return {
        ...exchange,
        price: Number.parseFloat(newPrice.toFixed(2)),
      }
    })

    setExchanges(updatedExchanges)

    // Buscar oportunidades de arbitraje
    let bestOpportunity = null
    let maxProfitPercentage = 0

    for (let i = 0; i < updatedExchanges.length; i++) {
      for (let j = 0; j < updatedExchanges.length; j++) {
        if (i === j) continue

        const buyExchange = updatedExchanges[i]
        const sellExchange = updatedExchanges[j]

        const profitPercentage = ((sellExchange.price - buyExchange.price) / buyExchange.price) * 100

        if (profitPercentage > threshold && profitPercentage > maxProfitPercentage) {
          maxProfitPercentage = profitPercentage
          bestOpportunity = {
            buyExchange: buyExchange.name,
            sellExchange: sellExchange.name,
            buyPrice: buyExchange.price,
            sellPrice: sellExchange.price,
            profitPercentage: profitPercentage,
          }
        }
      }
    }

    // Si se encontró una oportunidad, ejecutar la operación
    if (bestOpportunity) {
      const cost = bestOpportunity.buyPrice * amount

      // Verificar si hay suficiente saldo
      if (cost > balance) {
        setShowAlert(true)
        setIsSimulating(false)
        return
      }

      const revenue = bestOpportunity.sellPrice * amount
      const profit = revenue - cost

      // Actualizar saldo y activos
      setBalance((prevBalance) => Number.parseFloat((prevBalance - cost + revenue).toFixed(2)))

      // Registrar la operación
      const newResult: SimulationResult = {
        buyExchange: bestOpportunity.buyExchange,
        sellExchange: bestOpportunity.sellExchange,
        buyPrice: bestOpportunity.buyPrice,
        sellPrice: bestOpportunity.sellPrice,
        amount: amount,
        profit: Number.parseFloat(profit.toFixed(2)),
        profitPercentage: Number.parseFloat(bestOpportunity.profitPercentage.toFixed(2)),
        timestamp: new Date().toISOString(),
      }

      setResults((prevResults) => [newResult, ...prevResults].slice(0, 5))
    }

    setIsSimulating(false)
  }

  // Función para comprar activos directamente
  const buyAssets = (exchangeIndex: number) => {
    const exchange = exchanges[exchangeIndex]
    const cost = exchange.price * amount

    if (cost > balance) {
      setShowAlert(true)
      return
    }

    setBalance((prevBalance) => Number.parseFloat((prevBalance - cost).toFixed(2)))
    setAssets((prevAssets) => Number.parseFloat((prevAssets + amount).toFixed(4)))
  }

  // Función para vender activos directamente
  const sellAssets = (exchangeIndex: number) => {
    const exchange = exchanges[exchangeIndex]

    if (amount > assets) {
      setShowAlert(true)
      return
    }

    const revenue = exchange.price * amount
    setBalance((prevBalance) => Number.parseFloat((prevBalance + revenue).toFixed(2)))
    setAssets((prevAssets) => Number.parseFloat((prevAssets - amount).toFixed(4)))
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Simulación</CardTitle>
          <CardDescription>Ajusta los parámetros para simular operaciones de arbitraje</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="exchanges" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
              <TabsTrigger value="parameters">Parámetros</TabsTrigger>
            </TabsList>

            <TabsContent value="exchanges" className="space-y-4">
              {exchanges.map((exchange, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{exchange.name}</Label>
                    <div className="text-sm font-medium">${exchange.price.toFixed(2)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Precio ($)</Label>
                      <Input
                        type="number"
                        value={exchange.price}
                        onChange={(e) => updateExchangePrice(index, Number.parseFloat(e.target.value))}
                        min={1000}
                        max={100000}
                        step={100}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Volatilidad</Label>
                        <span className="text-xs text-muted-foreground">{(exchange.volatility * 100).toFixed(1)}%</span>
                      </div>
                      <Slider
                        value={[exchange.volatility * 100]}
                        onValueChange={(value: number[]) => updateExchangeVolatility(index, value[0] / 100)}
                        min={0.1}
                        max={5}
                        step={0.1}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => buyAssets(index)}>
                      Comprar
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => sellAssets(index)}>
                      Vender
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="parameters" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Cantidad a operar</Label>
                  <span className="text-sm font-medium">{amount} BTC</span>
                </div>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
                  min={0.01}
                  max={10}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Umbral de beneficio</Label>
                  <span className="text-sm font-medium">{threshold}%</span>
                </div>
                <Slider
                  value={[threshold]}
                  onValueChange={(value: number[]) => setThreshold(value[0])}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
                <p className="text-xs text-muted-foreground">
                  El umbral mínimo de diferencia de precio para ejecutar una operación de arbitraje
                </p>
              </div>

              <div className="pt-4">
                <Button className="w-full" onClick={simulateArbitrage} disabled={isSimulating}>
                  {isSimulating ? "Simulando..." : "Simular Arbitraje"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {showAlert && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>No tienes suficiente saldo o activos para esta operación.</AlertDescription>
              <Button variant="ghost" size="sm" className="mt-2" onClick={() => setShowAlert(false)}>
                Cerrar
              </Button>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados de Simulación</CardTitle>
          <CardDescription>Saldo y operaciones de arbitraje simuladas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">Saldo</div>
              <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm font-medium text-muted-foreground">Activos</div>
              <div className="text-2xl font-bold">{assets.toFixed(4)} BTC</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Operaciones Recientes</h4>

            {results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {result.buyExchange} → {result.sellExchange}
                    </div>
                    <div className={result.profit > 0 ? "text-green-500" : "text-red-500"}>
                      {result.profit > 0 ? "+" : ""}
                      {result.profit.toFixed(2)} USD
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Compra: ${result.buyPrice.toFixed(2)} | Venta: ${result.sellPrice.toFixed(2)} |
                    {result.profitPercentage.toFixed(2)}% beneficio
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(result.timestamp).toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                <div className="text-center">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aún no hay operaciones simuladas</p>
                  <p className="text-xs mt-1">Configura los parámetros y haz clic en "Simular Arbitraje"</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

