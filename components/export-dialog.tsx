"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Download } from "lucide-react"

interface ExportDialogProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  trigger: React.ReactNode
}

type ExportFormat = "png" | "jpeg" | "webp"

export function ExportDialog({ canvasRef, trigger }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("png")
  const [quality, setQuality] = useState(0.92)
  const [open, setOpen] = useState(false)

  const handleExport = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const filename = `retro-shader-${Date.now()}.${format}`

    let dataUrl: string
    if (format === "png") {
      dataUrl = canvas.toDataURL("image/png")
    } else if (format === "jpeg") {
      dataUrl = canvas.toDataURL("image/jpeg", quality)
    } else {
      dataUrl = canvas.toDataURL("image/webp", quality)
    }

    const link = document.createElement("a")
    link.download = filename
    link.href = dataUrl
    link.click()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar Imagem</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="format">Formato</Label>
            <Select value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
              <SelectTrigger id="format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (Alta qualidade, sem perda)</SelectItem>
                <SelectItem value="jpeg">JPEG (Melhor compressão)</SelectItem>
                <SelectItem value="webp">WebP (Moderno, melhor compressão)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {format !== "png" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="quality">Qualidade</Label>
                <span className="text-sm text-muted-foreground">{(quality * 100).toFixed(0)}%</span>
              </div>
              <Slider
                id="quality"
                min={0.1}
                max={1}
                step={0.01}
                value={[quality]}
                onValueChange={([value]) => setQuality(value)}
              />
              <p className="text-xs text-muted-foreground">
                Maior qualidade = arquivo maior, menor qualidade = arquivo menor
              </p>
            </div>
          )}

          <Button onClick={handleExport} className="w-full gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
