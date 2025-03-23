import { Suspense } from "react"
import { ArbitrageStats } from "@/components/arbitrage-stats"
import { TradeHistory } from "@/components/trade-history"
import { ProfitChart } from "@/components/profit-chart"
import { ExchangePriceChart } from "@/components/exchange-price-chart"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { DashboardCards } from "@/components/dashboard-cards"
import { LoadingDashboard } from "@/components/loading-dashboard"
import { Navigation } from "@/components/navigation"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <Navigation />
          </div>
        </aside>
        <main className="flex w-full flex-col overflow-hidden">
          <DashboardHeader />
          <DashboardShell>
            <Suspense fallback={<LoadingDashboard />}>
              <section id="dashboard">
                <DashboardCards />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                  <ProfitChart className="md:col-span-2 lg:col-span-4" />
                  <ArbitrageStats className="md:col-span-2 lg:col-span-3" />
                </div>
              </section>

              <section id="trades" className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight">Operaciones</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-4">
                  <ExchangePriceChart className="md:col-span-2 lg:col-span-4" />
                  <TradeHistory className="md:col-span-2 lg:col-span-3" />
                </div>
              </section>

              <section id="documentation" className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight">Documentación</h2>
                <div className="mt-4 rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-medium">Cómo funciona el Bot de Arbitraje</h3>
                  <p className="mt-2 text-muted-foreground">
                    El bot de arbitraje monitorea las diferencias de precios entre múltiples exchanges de criptomonedas.
                    Cuando identifica una diferencia de precio que excede un umbral especificado, ejecuta una operación
                    comprando en el exchange con el precio más bajo y vendiendo en el exchange con el precio más alto.
                  </p>
                  <h4 className="mt-4 font-medium">Componentes Clave:</h4>
                  <ul className="mt-2 list-disc pl-6 text-muted-foreground">
                    <li>Simulación de Exchanges: Simula múltiples exchanges con volatilidad configurable</li>
                    <li>
                      Detección de Oportunidades: Identifica oportunidades de arbitraje basadas en diferencias de
                      precios
                    </li>
                    <li>Ejecución de Operaciones: Simula compra y venta entre exchanges</li>
                    <li>Seguimiento de Rendimiento: Registra historial de operaciones y calcula beneficios</li>
                  </ul>
                  <h4 className="mt-4 font-medium">Ejecutando tu propia simulación:</h4>
                  <p className="mt-2 text-muted-foreground">
                    Consulta el{" "}
                    <a
                      href="https://github.com/Ian9Franco/arbipy"
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      repositorio GitHub de ArbiPy
                    </a>{" "}
                    para obtener instrucciones sobre cómo ejecutar tus propias simulaciones de arbitraje.
                  </p>
                </div>
              </section>

              <section id="settings" className="mt-10 mb-10">
                <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
                <div className="mt-4 rounded-lg border bg-card p-6">
                  <p className="text-muted-foreground">
                    La sección de configuración estará disponible en futuras actualizaciones.
                  </p>
                </div>
              </section>
            </Suspense>
          </DashboardShell>
        </main>
      </div>
    </div>
  )
}

