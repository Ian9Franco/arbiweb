import { NextResponse } from "next/server"

export async function GET() {
  try {
    // In a real application, this would fetch data from the Python bot
    // For now, we'll generate sample data
    return NextResponse.json(generateSampleArbitrageOpportunities())
  } catch (error) {
    console.error("Error in arbitrage opportunities API:", error)
    return NextResponse.json({ error: "Failed to fetch arbitrage opportunities" }, { status: 500 })
  }
}

function generateSampleArbitrageOpportunities() {
  const exchanges = ["Binance", "Coinbase", "Kraken", "Huobi", "FTX"]
  const opportunities = []

  // Generate 100 sample opportunities
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

