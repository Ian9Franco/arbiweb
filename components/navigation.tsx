"use client"

import { useEffect, useState } from "react"
import { LayoutDashboard, ArrowUpDown, BookOpen, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  className?: string
}

export function Navigation({ className }: NavigationProps) {
  const [activeSection, setActiveSection] = useState("dashboard")

  // Función para manejar el scroll y actualizar la sección activa
  const handleScroll = () => {
    const sections = {
      dashboard: document.getElementById("dashboard"),
      trades: document.getElementById("trades"),
      documentation: document.getElementById("documentation"),
      settings: document.getElementById("settings"),
    }

    const scrollPosition = window.scrollY + 100 // Añadir offset para mejor detección

    // Determinar qué sección está actualmente visible
    let currentSection = "dashboard"

    Object.entries(sections).forEach(([id, element]) => {
      if (!element) return

      const top = element.offsetTop
      const height = element.offsetHeight

      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSection = id
      }
    })

    setActiveSection(currentSection)
  }

  // Función para desplazarse a una sección
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80, // Offset para compensar la barra de navegación
        behavior: "smooth",
      })
      setActiveSection(sectionId)
    }
  }

  useEffect(() => {
    // Añadir listener para el scroll
    window.addEventListener("scroll", handleScroll)

    // Ejecutar una vez al montar para establecer la sección inicial
    handleScroll()

    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <nav className={cn("flex flex-col space-y-2", className)}>
      <a
        href="#dashboard"
        onClick={(e) => {
          e.preventDefault()
          scrollToSection("dashboard")
        }}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-primary",
          activeSection === "dashboard" ? "bg-muted text-primary" : "text-muted-foreground",
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        Panel Principal
      </a>
      <a
        href="#trades"
        onClick={(e) => {
          e.preventDefault()
          scrollToSection("trades")
        }}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-primary",
          activeSection === "trades" ? "bg-muted text-primary" : "text-muted-foreground",
        )}
      >
        <ArrowUpDown className="h-4 w-4" />
        Operaciones
      </a>
      <a
        href="#documentation"
        onClick={(e) => {
          e.preventDefault()
          scrollToSection("documentation")
        }}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-primary",
          activeSection === "documentation" ? "bg-muted text-primary" : "text-muted-foreground",
        )}
      >
        <BookOpen className="h-4 w-4" />
        Documentación
      </a>
      <a
        href="#settings"
        onClick={(e) => {
          e.preventDefault()
          scrollToSection("settings")
        }}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-primary",
          activeSection === "settings" ? "bg-muted text-primary" : "text-muted-foreground",
        )}
      >
        <Settings className="h-4 w-4" />
        Configuración
      </a>
    </nav>
  )
}

