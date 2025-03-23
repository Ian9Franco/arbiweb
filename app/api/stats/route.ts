import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // In a real application, this would fetch data from the Python bot
    // For now, we'll try to read from a local file if it exists, or return sample data

    const dataPath = path.join(process.cwd(), "arbipy/data/stats.json")

    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, "utf8")
      return NextResponse.json(JSON.parse(data))
    } else {
      // Return sample data if file doesn't exist
      return NextResponse.json(generateSampleStats())
    }
  } catch (error) {
    console.error("Error in stats API:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
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

