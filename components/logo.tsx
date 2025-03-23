import { TrendingUp } from "lucide-react"

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
        <TrendingUp className="h-6 w-6 text-primary-foreground" />
      </div>
      <div className="font-bold text-xl">ArbiWeb</div>
    </div>
  )
}

