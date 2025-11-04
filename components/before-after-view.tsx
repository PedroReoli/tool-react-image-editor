"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface BeforeAfterViewProps {
  originalImage: HTMLImageElement | null
  canvasRef: React.RefObject<HTMLCanvasElement>
}

export function BeforeAfterView({ originalImage, canvasRef }: BeforeAfterViewProps) {
  const [isBeforeAfter, setIsBeforeAfter] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [processedImageUrl, setProcessedImageUrl] = useState<string>("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isBeforeAfter && canvasRef.current) {
      const updateImage = () => {
        if (canvasRef.current) {
          setProcessedImageUrl(canvasRef.current.toDataURL())
        }
      }
      updateImage()
      const interval = setInterval(updateImage, 500)
      return () => clearInterval(interval)
    }
  }, [isBeforeAfter, canvasRef])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setSliderPosition(percentage)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
      return () => {
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging])

  if (!originalImage || !isBeforeAfter) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsBeforeAfter(true)}
        className="gap-2"
      >
        <Eye className="w-4 h-4" />
        Comparar Antes/Depois
      </Button>
    )
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Comparação Antes/Depois</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsBeforeAfter(false)}
          className="gap-2"
        >
          <EyeOff className="w-4 h-4" />
          Fechar
        </Button>
      </div>
      <div
        ref={containerRef}
        className="relative w-full border-2 border-border rounded-lg overflow-hidden cursor-col-resize"
        style={{ aspectRatio: `${originalImage.width} / ${originalImage.height}` }}
        onMouseDown={(e) => {
          setIsDragging(true)
          const rect = containerRef.current?.getBoundingClientRect()
          if (rect) {
            const x = e.clientX - rect.left
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
            setSliderPosition(percentage)
          }
        }}
      >
        {/* Original image (left side) */}
        <div className="absolute inset-0">
          <img
            src={originalImage.src}
            alt="Original"
            className="w-full h-full object-contain"
            draggable={false}
          />
          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            Antes
          </div>
        </div>

        {/* Processed canvas (right side) */}
        {processedImageUrl && (
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
          >
            <img
              src={processedImageUrl}
              alt="Processed"
              className="w-full h-full object-contain"
              draggable={false}
            />
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              Depois
            </div>
          </div>
        )}

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Arraste a linha para comparar. Esquerda = Antes, Direita = Depois
      </p>
    </Card>
  )
}
