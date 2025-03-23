import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real application, this would fetch real-time data from exchanges
    // For now, we'll generate sample data
    return NextResponse.json(generateSampleExchangePrices())
  } catch (error) {
    console.error("Error in exchange prices API:", error)
    return NextResponse.json({ error: "Failed to fetch exchange prices" }, { status: 500 })
  }
}

function generateSampleExchangePrices() {
  const exchanges = ["Binance", "Coinbase", "Kraken", "Huobi", "FTX"]
  const basePrice = 50000
  const prices = []

  // Generate price data points for each exchange
  for (const exchange of exchanges) {
    // Exchange-specific base price variation
    const exchangeBasePrice = basePrice * (1 + (Math.random() - 0.5) * 0.02)

    // Generate 20 data points per exchange
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

