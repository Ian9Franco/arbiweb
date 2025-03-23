// Este archivo contiene funciones para obtener datos del bot de arbitraje

// En una aplicación real, estas funciones harían llamadas a una API backend
// que se comunica con el bot de arbitraje en Python. Para esta demo,
// simularemos los datos o los cargaremos desde archivos JSON estáticos.

// Obtener historial de operaciones
export async function fetchTradeHistory() {
  try {
    // En una app real, esto sería una llamada fetch a una API
    // const response = await fetch('/api/trade-history')
    // return await response.json()

    // Para fines de demostración, generamos datos de muestra
    return generateSampleTradeHistory()
  } catch (error) {
    console.error("Error al obtener historial de operaciones:", error)
    return []
  }
}

// Obtener estadísticas de trading
export async function fetchStats() {
  try {
    // En una app real, esto sería una llamada fetch a una API
    // const response = await fetch('/api/stats')
    // return await response.json()

    // Para fines de demostración, generamos datos de muestra
    return generateSampleStats()
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return {
      total_trades: 0,
      profitable_trades: 0,
      total_profit: 0,
      current_balance: 1000,
      start_balance: 1000,
      asset_balance: 10,
    }
  }
}

// Obtener beneficios diarios
export async function fetchDailyProfits() {
  try {
    // En una app real, esto sería una llamada fetch a una API
    // const response = await fetch('/api/daily-profits')
    // return await response.json()

    // Para fines de demostración, generamos datos de muestra
    return generateSampleDailyProfits()
  } catch (error) {
    console.error("Error al obtener beneficios diarios:", error)
    return []
  }
}

// Obtener precios de exchanges
export async function fetchExchangePrices() {
  try {
    // En una app real, esto sería una llamada fetch a una API
    // const response = await fetch('/api/exchange-prices')
    // return await response.json()

    // Para fines de demostración, generamos datos de muestra
    return generateSampleExchangePrices()
  } catch (error) {
    console.error("Error al obtener precios de exchanges:", error)
    return []
  }
}

// Obtener oportunidades de arbitraje
export async function fetchArbitrageOpportunities() {
  try {
    // En una app real, esto sería una llamada fetch a una API
    // const response = await fetch('/api/arbitrage-opportunities')
    // return await response.json()

    // Para fines de demostración, generamos datos de muestra
    return generateSampleArbitrageOpportunities()
  } catch (error) {
    console.error("Error al obtener oportunidades de arbitraje:", error)
    return []
  }
}

// Generadores de datos de muestra
function generateSampleTradeHistory() {
  const exchanges = ["Binance", "Coinbase", "Kraken", "Huobi", "FTX"]
  const basePrice = 50000
  const trades = []

  // Generar 50 operaciones de muestra
  for (let i = 0; i < 50; i++) {
    const buyExchange = exchanges[Math.floor(Math.random() * exchanges.length)]
    let sellExchange
    do {
      sellExchange = exchanges[Math.floor(Math.random() * exchanges.length)]
    } while (sellExchange === buyExchange)

    const priceVolatility = (Math.random() - 0.5) * 0.05
    const buyPrice = basePrice * (1 + priceVolatility)
    const sellPrice = buyPrice * (1 + Math.random() * 0.02)

    const amount = 0.1 + Math.random() * 0.4
    const profit = (sellPrice - buyPrice) * amount
    const profitPercentage = (sellPrice - buyPrice) / buyPrice

    const date = new Date()
    date.setMinutes(date.getMinutes() - i * 30)

    trades.push({
      buy_trade: {
        exchange: buyExchange,
        price: buyPrice,
        amount: amount,
      },
      sell_trade: {
        exchange: sellExchange,
        price: sellPrice,
        amount: amount,
      },
      profit: profit,
      profit_percentage: profitPercentage,
      timestamp: date.toISOString(),
    })
  }

  return trades
}

function generateSampleStats() {
  const totalTrades = 120 + Math.floor(Math.random() * 30)
  const profitableTrades = Math.floor(totalTrades * (0.7 + Math.random() * 0.2))
  const totalProfit = 250 + Math.random() * 500

  return {
    total_trades: totalTrades,
    profitable_trades: profitableTrades,
    total_profit: totalProfit,
    current_balance: 1000 + totalProfit,
    start_balance: 1000,
    asset_balance: 10 + Math.random() * 2,
  }
}

function generateSampleDailyProfits() {
  const dailyProfits = []
  const today = new Date()

  // Generar 90 días de datos
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Mayor volatilidad en días recientes
    const volatilityFactor = i < 10 ? 2 : 1
    const profit = (Math.random() * 20 - 5) * volatilityFactor

    dailyProfits.push({
      date: date.toISOString().split("T")[0],
      profit: profit,
    })
  }

  return dailyProfits
}

function generateSampleExchangePrices() {
  const exchanges = ["Binance", "Coinbase", "Kraken", "Huobi", "FTX"]
  const basePrice = 50000
  const prices = []

  // Generar puntos de datos de precio para cada exchange
  for (const exchange of exchanges) {
    // Variación de precio base específica del exchange
    const exchangeBasePrice = basePrice * (1 + (Math.random() - 0.5) * 0.02)

    // Generar 20 puntos de datos por exchange
    for (let i = 0; i < 20; i++) {
      const date = new Date()
      date.setMinutes(date.getMinutes() - i * 5)

      const priceVolatility = (Math.random() - 0.5) * 0.01
      const price = exchangeBasePrice * (1 + priceVolatility)

      prices.push({
        exchange: exchange,
        price: price,
        timestamp: date.toISOString(),
      })
    }
  }

  return prices
}

function generateSampleArbitrageOpportunities() {
  const exchanges = ["Binance", "Coinbase", "Kraken", "Huobi", "FTX"]
  const opportunities = []

  // Generar 100 oportunidades de muestra
  for (let i = 0; i < 100; i++) {
    const buyExchange = exchanges[Math.floor(Math.random() * exchanges.length)]
    let sellExchange
    do {
      sellExchange = exchanges[Math.floor(Math.random() * exchanges.length)]
    } while (sellExchange === buyExchange)

    const profitPercentage = 0.005 + Math.random() * 0.02

    const date = new Date()
    date.setHours(date.getHours() - Math.floor(i / 4))

    opportunities.push({
      buy_exchange: buyExchange,
      sell_exchange: sellExchange,
      profit_percentage: profitPercentage,
      timestamp: date.toISOString(),
    })
  }

  return opportunities
}

