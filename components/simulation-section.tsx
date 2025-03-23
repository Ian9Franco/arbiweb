"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, AlertCircle, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Exchange {
  name: string
  prices: {
    [key: string]: number
  }
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
  crypto: string
}

// Tipos de criptomonedas disponibles
const CRYPTO_TYPES = [
  { id: "BTC", name: "Bitcoin", basePrice: 50000 },
  { id: "ETH", name: "Ethereum", basePrice: 3000 },
  { id: "USDT", name: "Tether", basePrice: 1 },
]

// Función para obtener precios simulados de API (en una app real, esto sería una llamada fetch)
const fetchCryptoPrices = async () => {
  // Simulamos una llamada a API con un pequeño retraso
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generamos precios simulados para cada criptomoneda
  const prices: Record<string, Record<string, number>> = {}

  CRYPTO_TYPES.forEach((crypto) => {
    const basePrice = crypto.basePrice
    prices[crypto.id] = {
      Binance: basePrice * (1 + (Math.random() - 0.5) * 0.02),
      Coinbase: basePrice * (1 + (Math.random() - 0.5) * 0.02),
      Kraken: basePrice * (1 + (Math.random() - 0.5) * 0.02),
      Huobi: basePrice * (1 + (Math.random() - 0.5) * 0.02),
      FTX: basePrice * (1 + (Math.random() - 0.5) * 0.02),
    }
  })

  return prices
}

export function SimulationSection() {
  // Estado para los exchanges
  const [exchanges, setExchanges] = useState<Exchange[]>([
    { name: "Binance", prices: { BTC: 50000, ETH: 3000, USDT: 1 }, volatility: 0.02 },
    { name: "Coinbase", prices: { BTC: 50100, ETH: 3010, USDT: 1 }, volatility: 0.025 },
    { name: "Kraken", prices: { BTC: 49900, ETH: 2990, USDT: 1 }, volatility: 0.03 },
    { name: "Huobi", prices: { BTC: 50050, ETH: 3005, USDT: 1 }, volatility: 0.02 },
    { name: "FTX", prices: { BTC: 49950, ETH: 2995, USDT: 1 }, volatility: 0.025 },
  ])

  // Estado para la configuración de la simulación
  const [selectedCrypto, setSelectedCrypto] = useState("BTC")
  const [amount, setAmount] = useState(1.0)
  const [investmentAmount, setInvestmentAmount] = useState(1000)
  const [threshold, setThreshold] = useState(0.5)

  // Estado para los resultados de la simulación
  const [results, setResults] = useState<SimulationResult[]>([])
  const [balance, setBalance] = useState(10000)
  const [assets, setAssets] = useState<Record<string, number>>({ BTC: 0, ETH: 0, USDT: 0 })
  const [isSimulating, setIsSimulating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  // Función para actualizar precios desde la "API"
  const updatePricesFromAPI = async () => {
    setIsLoading(true)
    try {
      const prices = await fetchCryptoPrices()

      // Actualizar precios en los exchanges
      setExchanges((prevExchanges) =>
        prevExchanges.map((exchange) => ({
          ...exchange,
          prices: {
            BTC: prices["BTC"][exchange.name] || exchange.prices["BTC"],
            ETH: prices["ETH"][exchange.name] || exchange.prices["ETH"],
            USDT: prices["USDT"][exchange.name] || exchange.prices["USDT"],
          },
        })),
      )
    } catch (error) {
      console.error("Error al obtener precios:", error)
      setAlertMessage("Error al obtener precios actualizados")
      setShowAlert(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Actualizar precios al cargar y cada 30 segundos
  useEffect(() => {
    updatePricesFromAPI()

    const interval = setInterval(() => {
      updatePricesFromAPI()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Función para actualizar la volatilidad de un exchange
  const updateExchangeVolatility = (index: number, newVolatility: number) => {
    const updatedExchanges = [...exchanges]
    updatedExchanges[index].volatility = newVolatility
    setExchanges(updatedExchanges)
  }

  // Calcular cuántas unidades de cripto se pueden comprar con el monto de inversión
  const calculateCryptoAmount = (exchangeIndex: number) => {
    const exchange = exchanges[exchangeIndex]
    const price = exchange.prices[selectedCrypto]
    return investmentAmount / price
  }

  // Función para simular una operación de arbitraje
  const simulateArbitrage = () => {
    setIsSimulating(true)

    // Simular fluctuaciones de precio
    const updatedExchanges = exchanges.map((exchange) => {
      const updatedPrices: Record<string, number> = {}

      // Actualizar cada criptomoneda
      Object.entries(exchange.prices).forEach(([crypto, price]) => {
        const priceChange = (Math.random() - 0.5) * 2 * exchange.volatility
        updatedPrices[crypto] = Number.parseFloat((price * (1 + priceChange)).toFixed(crypto === "USDT" ? 4 : 2))
      })

      return {
        ...exchange,
        prices: updatedPrices,
      }
    })

    setExchanges(updatedExchanges)

    // Buscar oportunidades de arbitraje para la criptomoneda seleccionada
    let bestOpportunity = null
    let maxProfitPercentage = 0

    for (let i = 0; i < updatedExchanges.length; i++) {
      for (let j = 0; j < updatedExchanges.length; j++) {
        if (i === j) continue

        const buyExchange = updatedExchanges[i]
        const sellExchange = updatedExchanges[j]

        const buyPrice = buyExchange.prices[selectedCrypto]
        const sellPrice = sellExchange.prices[selectedCrypto]

        const profitPercentage = ((sellPrice - buyPrice) / buyPrice) * 100

        if (profitPercentage > threshold && profitPercentage > maxProfitPercentage) {
          maxProfitPercentage = profitPercentage
          bestOpportunity = {
            buyExchange: buyExchange.name,
            sellExchange: sellExchange.name,
            buyPrice: buyPrice,
            sellPrice: sellPrice,
            profitPercentage: profitPercentage,
          }
        }
      }
    }

    // Si se encontró una oportunidad, ejecutar la operación
    if (bestOpportunity) {
      // Calcular cuántas unidades de cripto podemos comprar con el monto de inversión
      const cryptoAmount = investmentAmount / bestOpportunity.buyPrice

      // Verificar si hay suficiente saldo
      if (investmentAmount > balance) {
        setAlertMessage("No tienes suficiente saldo para esta operación")
        setShowAlert(true)
        setIsSimulating(false)
        return
      }

      const cost = bestOpportunity.buyPrice * cryptoAmount
      const revenue = bestOpportunity.sellPrice * cryptoAmount
      const profit = revenue - cost

      // Actualizar saldo
      setBalance((prevBalance) => Number.parseFloat((prevBalance - cost + revenue).toFixed(2)))

      // Registrar la operación
      const newResult: SimulationResult = {
        buyExchange: bestOpportunity.buyExchange,
        sellExchange: bestOpportunity.sellExchange,
        buyPrice: bestOpportunity.buyPrice,
        sellPrice: bestOpportunity.sellPrice,
        amount: cryptoAmount,
        profit: Number.parseFloat(profit.toFixed(2)),
        profitPercentage: Number.parseFloat(bestOpportunity.profitPercentage.toFixed(2)),
        timestamp: new Date().toISOString(),
        crypto: selectedCrypto,
      }

      setResults((prevResults) => [newResult, ...prevResults].slice(0, 5))
    } else {
      setAlertMessage("No se encontraron oportunidades de arbitraje que superen el umbral establecido")
      setShowAlert(true)
    }

    setIsSimulating(false)
  }

  // Función para comprar activos directamente
  const buyAssets = (exchangeIndex: number) => {
    const exchange = exchanges[exchangeIndex]
    const price = exchange.prices[selectedCrypto]
    const cryptoAmount = calculateCryptoAmount(exchangeIndex)

    if (investmentAmount > balance) {
      setAlertMessage("No tienes suficiente saldo para esta compra")
      setShowAlert(true)
      return
    }

    // Actualizar saldo y activos
    setBalance((prevBalance) => Number.parseFloat((prevBalance - investmentAmount).toFixed(2)))
    setAssets((prevAssets) => ({
      ...prevAssets,
      [selectedCrypto]: Number.parseFloat(
        (prevAssets[selectedCrypto] + cryptoAmount).toFixed(selectedCrypto === "USDT" ? 2 : 6),
      ),
    }))

    // Registrar la operación
    const newResult: SimulationResult = {
      buyExchange: exchange.name,
      sellExchange: "",
      buyPrice: price,
      sellPrice: 0,
      amount: cryptoAmount,
      profit: 0,
      profitPercentage: 0,
      timestamp: new Date().toISOString(),
      crypto: selectedCrypto,
    }

    setResults((prevResults) => [newResult, ...prevResults].slice(0, 5))
  }

  // Función para vender activos directamente
  const sellAssets = (exchangeIndex: number) => {
    const exchange = exchanges[exchangeIndex]
    const price = exchange.prices[selectedCrypto]
    const cryptoAmount = calculateCryptoAmount(exchangeIndex)

    if (cryptoAmount > assets[selectedCrypto]) {
      setAlertMessage(`No tienes suficiente ${selectedCrypto} para esta venta`)
      setShowAlert(true)
      return
    }

    const revenue = price * cryptoAmount

    // Actualizar saldo y activos
    setBalance((prevBalance) => Number.parseFloat((prevBalance + revenue).toFixed(2)))
    setAssets((prevAssets) => ({
      ...prevAssets,
      [selectedCrypto]: Number.parseFloat(
        (prevAssets[selectedCrypto] - cryptoAmount).toFixed(selectedCrypto === "USDT" ? 2 : 6),
      ),
    }))

    // Registrar la operación
    const newResult: SimulationResult = {
      buyExchange: "",
      sellExchange: exchange.name,
      buyPrice: 0,
      sellPrice: price,
      amount: cryptoAmount,
      profit: revenue - investmentAmount,
      profitPercentage: ((revenue - investmentAmount) / investmentAmount) * 100,
      timestamp: new Date().toISOString(),
      crypto: selectedCrypto,
    }

    setResults((prevResults) => [newResult, ...prevResults].slice(0, 5))
  }

  // Función para formatear precios según la criptomoneda
  const formatPrice = (price: number, crypto: string) => {
    if (crypto === "USDT") return price.toFixed(4)
    return price.toFixed(2)
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
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium">Precios en tiempo real</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={updatePricesFromAPI}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
                  Actualizar
                </Button>
              </div>

              {exchanges.map((exchange, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{exchange.name}</Label>
                    <div className="text-sm font-medium">
                      ${formatPrice(exchange.prices[selectedCrypto], selectedCrypto)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Criptomoneda</Label>
                      <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Seleccionar criptomoneda" />
                        </SelectTrigger>
                        <SelectContent>
                          {CRYPTO_TYPES.map((crypto) => (
                            <SelectItem key={crypto.id} value={crypto.id}>
                              {crypto.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  <Label>Criptomoneda</Label>
                  <span className="text-sm font-medium">{CRYPTO_TYPES.find((c) => c.id === selectedCrypto)?.name}</span>
                </div>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar criptomoneda" />
                  </SelectTrigger>
                  <SelectContent>
                    {CRYPTO_TYPES.map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id}>
                        {crypto.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Monto a invertir (USD)</Label>
                  <span className="text-sm font-medium">${investmentAmount}</span>
                </div>
                <Input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number.parseFloat(e.target.value))}
                  min={10}
                  max={100000}
                  step={10}
                />
                <p className="text-xs text-muted-foreground">
                  Aproximadamente{" "}
                  {(investmentAmount / exchanges[0].prices[selectedCrypto]).toFixed(selectedCrypto === "USDT" ? 2 : 6)}{" "}
                  {selectedCrypto}
                </p>
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
              <AlertDescription>{alertMessage}</AlertDescription>
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
              <div className="space-y-1">
                {Object.entries(assets).map(([crypto, amount]) => (
                  <div key={crypto} className="flex justify-between items-center">
                    <span className="text-sm">{crypto}:</span>
                    <span className="text-sm font-medium">{amount.toFixed(crypto === "USDT" ? 2 : 6)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Operaciones Recientes</h4>

            {results.length > 0 ? (
              results.map((result, index) => (
                <div key={index} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">
                      {result.buyExchange && result.sellExchange
                        ? `${result.buyExchange} → ${result.sellExchange}`
                        : result.buyExchange
                          ? `Compra en ${result.buyExchange}`
                          : `Venta en ${result.sellExchange}`}
                    </div>
                    <div
                      className={
                        result.profit > 0
                          ? "text-green-500"
                          : result.profit < 0
                            ? "text-red-500"
                            : "text-muted-foreground"
                      }
                    >
                      {result.profit > 0 ? "+" : ""}
                      {result.profit.toFixed(2)} USD
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.amount.toFixed(result.crypto === "USDT" ? 2 : 6)} {result.crypto}
                    {result.buyExchange && result.sellExchange && (
                      <>
                        {" "}
                        | ${result.buyPrice.toFixed(2)} → ${result.sellPrice.toFixed(2)} |{" "}
                        {result.profitPercentage.toFixed(2)}% beneficio
                      </>
                    )}
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

