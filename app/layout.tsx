import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Configuración de la fuente Inter con subconjunto latino
const inter = Inter({ subsets: ["latin"] })

// Metadatos de la aplicación
export const metadata = {
  title: "ArbiWeb - Panel de Control de Arbitraje",
  description: "Una interfaz web para el bot de arbitraje ArbiPy",
}

// Componente de diseño raíz que envuelve toda la aplicación
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Proveedor de tema para soportar modo claro/oscuro */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

