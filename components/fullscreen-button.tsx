"use client"

import { Button } from "@/components/ui/button"
import { Maximize, Minimize } from "lucide-react"
import { useFullscreen } from "@/hooks/use-fullscreen"

interface FullscreenButtonProps {
  targetRef: React.RefObject<HTMLElement>
}

export function FullscreenButton({ targetRef }: FullscreenButtonProps) {
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  const handleClick = () => {
    if (targetRef.current) {
      toggleFullscreen(targetRef.current)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="gap-2"
    >
      {isFullscreen ? (
        <>
          <Minimize className="w-4 h-4" />
          Sair de Tela Cheia
        </>
      ) : (
        <>
          <Maximize className="w-4 h-4" />
          Tela Cheia
        </>
      )}
    </Button>
  )
}
