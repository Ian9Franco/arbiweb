import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // In a real application, this would fetch data from the Python bot
    // For now, we'll try to read from a local file if it exists, or return sample data

    const dataPath = path.join(process.cwd(), "arbipy/data/trade_history.json")

    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, "utf8")
      return NextResponse.json(JSON.parse(data))
    } else {
      // Return sample data if file doesn't exist
      return NextResponse.json(generateSampleTradeHistory())
    }
  } catch (error) {
    console.error("Error in trade history API:", error)
    return NextResponse.json({ error: "Failed to fetch trade history" }, { status: 500 })
  }
}

function generateSampleTradeHistory() {
  const exchanges = ["Binance", "Coinbase", "Kraken", "Huobi", "FTX"]
  const basePrice = 50000
  const trades = []

  // Generate 50 sample trades
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
        timestamp: date.toISOString(),
      },
      sell_trade: {
        exchange: sellExchange,
        price: sellPrice,
        amount: amount,
        timestamp: date.toISOString(),
      },
      profit: profit,
      profit_percentage: profitPercentage,
      timestamp: date.toISOString(),
    })
  }

  return trades
}

