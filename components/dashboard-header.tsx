import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"

export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between px-2 py-6 mt-4">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Panel de Control de Arbitraje</h1>
        <p className="text-muted-foreground">Monitorea el rendimiento y estadísticas de tus operaciones de arbitraje</p>
      </div>
      <div className="flex items-center gap-4">
        <Logo />
        <ThemeToggle />
      </div>
    </div>
  )
}

