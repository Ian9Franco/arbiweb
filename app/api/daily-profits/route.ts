import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // In a real application, this would fetch data from the Python bot
    // For now, we'll try to read from a local file if it exists, or return sample data

    const statsPath = path.join(process.cwd(), "arbipy/data/stats.json")

    if (fs.existsSync(statsPath)) {
      const data = fs.readFileSync(statsPath, "utf8")
      const stats = JSON.parse(data)

      if (stats.daily_profits) {
        return NextResponse.json(stats.daily_profits)
      }
    }

    // Return sample data if file doesn't exist or doesn't contain daily profits
    return NextResponse.json(generateSampleDailyProfits())
  } catch (error) {
    console.error("Error in daily profits API:", error)
    return NextResponse.json({ error: "Failed to fetch daily profits" }, { status: 500 })
  }
}

function generateSampleDailyProfits() {
  const dailyProfits = []
  const today = new Date()

  // Generate 90 days of data
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // More volatility in recent days
    const volatilityFactor = i < 10 ? 2 : 1
    const profit = (Math.random() * 20 - 5) * volatilityFactor

    dailyProfits.push({
      date: date.toISOString().split("T")[0],
      profit: profit,
    })
  }

  return dailyProfits
}

