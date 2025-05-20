import { useEffect, useState } from "react"

/**
 * Retorna classes Tailwind para posicionar o FAB
 * sem colidir com os controles do Google Maps.
 */
export function useFabPosition() {
  const [cls, setCls] = useState("bottom-6 right-6")

  useEffect(() => {
    const handle = () => {
      const mobile = window.innerWidth < 640 // tailwind sm
      setCls(mobile ? "top-24 right-6 z-50" : "bottom-6 right-6")
    }
    handle()
    window.addEventListener("resize", handle)
    return () => window.removeEventListener("resize", handle)
  }, [])

  return cls
}
