import { Suspense } from "react"
import { ArbitrageStats } from "@/components/arbitrage-stats"
import { TradeHistory } from "@/components/trade-history"
import { ProfitChart } from "@/components/profit-chart"
import { ExchangePriceChart } from "@/components/exchange-price-chart"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardCards } from "@/components/dashboard-cards"
import { LoadingDashboard } from "@/components/loading-dashboard"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="flex flex-col space-y-2">
              <a
                href="#"
                className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
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
                  className="h-4 w-4"
                >
                  <rect width="7" height="9" x="3" y="3" rx="1"></rect>
                  <rect width="7" height="5" x="14" y="3" rx="1"></rect>
                  <rect width="7" height="9" x="14" y="12" rx="1"></rect>
                  <rect width="7" height="5" x="3" y="16" rx="1"></rect>
                </svg>
                Dashboard
              </a>
              <a
                href="#trades"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
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
                  className="h-4 w-4"
                >
                  <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1"></path>
                  <path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1"></path>
                  <path d="M12 3v10"></path>
                  <path d="m16 16-4 4-4-4"></path>
                  <path d="M12 21v-7"></path>
                </svg>
                Trades
              </a>
              <a
                href="#documentation"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
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
                  className="h-4 w-4"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                </svg>
                Documentation
              </a>
              <a
                href="#settings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
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
                  className="h-4 w-4"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Settings
              </a>
            </nav>
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardHeader />
          <DashboardShell>
            <Suspense fallback={<LoadingDashboard />}>
              <DashboardCards />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <ProfitChart className="md:col-span-2 lg:col-span-4" />
                <ArbitrageStats className="md:col-span-2 lg:col-span-3" />
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <ExchangePriceChart className="md:col-span-2 lg:col-span-4" />
                <TradeHistory className="md:col-span-2 lg:col-span-3" />
              </div>
              <div id="documentation" className="mt-6">
                <h2 className="text-2xl font-bold tracking-tight">Documentation</h2>
                <div className="mt-4 rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-medium">How the Arbitrage Bot Works</h3>
                  <p className="mt-2 text-muted-foreground">
                    The arbitrage bot monitors price differences between multiple cryptocurrency exchanges. When it
                    identifies a price difference that exceeds a specified threshold, it executes a trade by buying on
                    the exchange with the lower price and selling on the exchange with the higher price.
                  </p>
                  <h4 className="mt-4 font-medium">Key Components:</h4>
                  <ul className="mt-2 list-disc pl-6 text-muted-foreground">
                    <li>Exchange Simulation: Simulates multiple exchanges with configurable price volatility</li>
                    <li>Opportunity Detection: Identifies arbitrage opportunities based on price differences</li>
                    <li>Trade Execution: Simulates buying and selling across exchanges</li>
                    <li>Performance Tracking: Records trade history and calculates profits</li>
                  </ul>
                  <h4 className="mt-4 font-medium">Running Your Own Simulation:</h4>
                  <p className="mt-2 text-muted-foreground">
                    Check out the{" "}
                    <a href="https://github.com/yourusername/arbipy" className="text-primary underline">
                      ArbiPy GitHub repository
                    </a>{" "}
                    for instructions on how to run your own arbitrage simulations.
                  </p>
                </div>
              </div>
            </Suspense>
          </DashboardShell>
        </main>
      </div>
    </div>
  )
}

