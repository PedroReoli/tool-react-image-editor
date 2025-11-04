"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ImageFilters } from "@/lib/image-filters"

interface ImageFiltersProps {
  filters: ImageFilters
  onFiltersChange: (filters: ImageFilters) => void
}

export function ImageFiltersControls({ filters, onFiltersChange }: ImageFiltersProps) {
  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Filtros de Imagem</h3>
        <p className="text-sm text-muted-foreground">Ajuste brilho, saturação, temperatura e mais</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="brightness">Brilho</Label>
            <span className="text-sm text-muted-foreground">{filters.brightness}</span>
          </div>
          <Slider
            id="brightness"
            min={-100}
            max={100}
            step={1}
            value={[filters.brightness]}
            onValueChange={([value]) => onFiltersChange({ ...filters, brightness: value })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="saturation">Saturação</Label>
            <span className="text-sm text-muted-foreground">{filters.saturation}</span>
          </div>
          <Slider
            id="saturation"
            min={-100}
            max={100}
            step={1}
            value={[filters.saturation]}
            onValueChange={([value]) => onFiltersChange({ ...filters, saturation: value })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="temperature">Temperatura</Label>
            <span className="text-sm text-muted-foreground">{filters.temperature}</span>
          </div>
          <Slider
            id="temperature"
            min={-100}
            max={100}
            step={1}
            value={[filters.temperature]}
            onValueChange={([value]) => onFiltersChange({ ...filters, temperature: value })}
          />
          <p className="text-xs text-muted-foreground">Negativo = frio (azul), Positivo = quente (laranja)</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="blur">Desfoque</Label>
            <span className="text-sm text-muted-foreground">{filters.blur.toFixed(1)}</span>
          </div>
          <Slider
            id="blur"
            min={0}
            max={10}
            step={0.1}
            value={[filters.blur]}
            onValueChange={([value]) => onFiltersChange({ ...filters, blur: value })}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="sharpen">Nitidez</Label>
            <span className="text-sm text-muted-foreground">{filters.sharpen.toFixed(1)}</span>
          </div>
          <Slider
            id="sharpen"
            min={0}
            max={10}
            step={0.1}
            value={[filters.sharpen]}
            onValueChange={([value]) => onFiltersChange({ ...filters, sharpen: value })}
          />
        </div>
      </div>
    </Card>
  )
}
