"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/lib/utils"

// Definición de tipos para los datos de gráficos
type ChartDataPoint = Record<string, string | number | Date>

// Formato: { NOMBRE_TEMA: SELECTOR_CSS }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & ({ color?: string; theme?: never } | { color?: never; theme: Record<keyof typeof THEMES, string> })
}

type ChartContextProps = {
  config: ChartConfig
}

// Contexto para compartir la configuración del gráfico entre componentes
const ChartContext = React.createContext<ChartContextProps | null>(null)

// Contenedor principal para los gráficos
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ReactNode
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children as React.ReactElement}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

// Componente para aplicar estilos CSS a los gráficos
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, itemConfig]) => itemConfig.theme || itemConfig.color)

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`,
          )
          .join("\n"),
      }}
    />
  )
}

// Componentes personalizados para gráficos
interface ChartProps<T extends ChartDataPoint> {
  data: T[]
  x: (d: T) => string | number | Date
  y: (d: T) => string | number
  children: React.ReactNode
}

export function Chart<T extends ChartDataPoint>({ data, x, y, children }: ChartProps<T>) {
  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null
        return React.cloneElement(child as React.ReactElement, {
          data,
          x,
          y,
        })
      })}
    </div>
  )
}

// Componente personalizado para el tooltip
const ChartTooltipContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="rounded-lg border bg-background p-2 shadow-md">{children}</div>
}

// Componente personalizado para la línea del gráfico
const ChartLine = ({ dataKey, style }: { dataKey: string; style?: React.CSSProperties }) => {
  return <Line type="monotone" dataKey={dataKey} style={style} />
}

// Componentes para los ejes
const ChartXAxis = () => <XAxis />
const ChartYAxis = () => <YAxis />

// Exportar todos los componentes de Recharts para facilitar su uso
export {
  Tooltip as ChartTooltip,
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ChartContainer,
  ChartTooltipContent,
  ChartLine,
  ChartXAxis,
  ChartYAxis,
}

