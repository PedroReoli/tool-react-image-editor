"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { RotateCw, FlipHorizontal, FlipVertical } from "lucide-react"
import { ImageTransform } from "@/lib/image-transforms"

interface ImageTransformsProps {
  transform: ImageTransform
  imageWidth: number
  imageHeight: number
  onTransformChange: (transform: ImageTransform) => void
}

export function ImageTransformsControls({
  transform,
  imageWidth,
  imageHeight,
  onTransformChange,
}: ImageTransformsProps) {
  const handleRotation = () => {
    const rotations = [0, 90, 180, 270]
    const currentIndex = rotations.indexOf(transform.rotation)
    const nextIndex = (currentIndex + 1) % rotations.length
    onTransformChange({ ...transform, rotation: rotations[nextIndex] })
  }

  const handleFlipHorizontal = () => {
    onTransformChange({ ...transform, flipHorizontal: !transform.flipHorizontal })
  }

  const handleFlipVertical = () => {
    onTransformChange({ ...transform, flipVertical: !transform.flipVertical })
  }

  return (
    <Card className="p-6 space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Transformações</h3>
        <p className="text-sm text-muted-foreground">Rotacione, espelhe e redimensione a imagem</p>
      </div>

      <div className="space-y-4">
        {/* Rotation */}
        <div className="flex items-center justify-between">
          <div>
            <Label>Rotação</Label>
            <p className="text-xs text-muted-foreground">{transform.rotation}°</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRotation} className="gap-2">
            <RotateCw className="w-4 h-4" />
            Rotacionar 90°
          </Button>
        </div>

        {/* Flips */}
        <div className="flex items-center justify-between">
          <Label>Espelhar Horizontalmente</Label>
          <Button
            variant={transform.flipHorizontal ? "default" : "outline"}
            size="sm"
            onClick={handleFlipHorizontal}
            className="gap-2"
          >
            <FlipHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Label>Espelhar Verticalmente</Label>
          <Button
            variant={transform.flipVertical ? "default" : "outline"}
            size="sm"
            onClick={handleFlipVertical}
            className="gap-2"
          >
            <FlipVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Resize */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Redimensionar</Label>
            <Switch
              checked={transform.resize.enabled}
              onCheckedChange={(checked) =>
                onTransformChange({
                  ...transform,
                  resize: { ...transform.resize, enabled: checked },
                })
              }
            />
          </div>
          {transform.resize.enabled && (
            <div className="space-y-2 pl-4 border-l-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="resize-width" className="w-16">
                  Largura
                </Label>
                <Input
                  id="resize-width"
                  type="number"
                  value={transform.resize.width}
                  onChange={(e) =>
                    onTransformChange({
                      ...transform,
                      resize: {
                        ...transform.resize,
                        width: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  min={1}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="resize-height" className="w-16">
                  Altura
                </Label>
                <Input
                  id="resize-height"
                  type="number"
                  value={transform.resize.height}
                  onChange={(e) =>
                    onTransformChange({
                      ...transform,
                      resize: {
                        ...transform.resize,
                        height: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  min={1}
                  className="flex-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="maintain-aspect" className="flex-1">
                  Manter Proporção
                </Label>
                <Switch
                  id="maintain-aspect"
                  checked={transform.resize.maintainAspectRatio}
                  onCheckedChange={(checked) =>
                    onTransformChange({
                      ...transform,
                      resize: {
                        ...transform.resize,
                        maintainAspectRatio: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Crop */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Recortar (Crop)</Label>
            <Switch
              checked={transform.crop.enabled}
              onCheckedChange={(checked) =>
                onTransformChange({
                  ...transform,
                  crop: { ...transform.crop, enabled: checked },
                })
              }
            />
          </div>
          {transform.crop.enabled && (
            <div className="space-y-2 pl-4 border-l-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="crop-x" className="text-xs">
                    X
                  </Label>
                  <Input
                    id="crop-x"
                    type="number"
                    value={transform.crop.x}
                    onChange={(e) =>
                      onTransformChange({
                        ...transform,
                        crop: { ...transform.crop, x: parseInt(e.target.value) || 0 },
                      })
                    }
                    min={0}
                    max={imageWidth}
                  />
                </div>
                <div>
                  <Label htmlFor="crop-y" className="text-xs">
                    Y
                  </Label>
                  <Input
                    id="crop-y"
                    type="number"
                    value={transform.crop.y}
                    onChange={(e) =>
                      onTransformChange({
                        ...transform,
                        crop: { ...transform.crop, y: parseInt(e.target.value) || 0 },
                      })
                    }
                    min={0}
                    max={imageHeight}
                  />
                </div>
                <div>
                  <Label htmlFor="crop-width" className="text-xs">
                    Largura
                  </Label>
                  <Input
                    id="crop-width"
                    type="number"
                    value={transform.crop.width}
                    onChange={(e) =>
                      onTransformChange({
                        ...transform,
                        crop: { ...transform.crop, width: parseInt(e.target.value) || 0 },
                      })
                    }
                    min={1}
                    max={imageWidth}
                  />
                </div>
                <div>
                  <Label htmlFor="crop-height" className="text-xs">
                    Altura
                  </Label>
                  <Input
                    id="crop-height"
                    type="number"
                    value={transform.crop.height}
                    onChange={(e) =>
                      onTransformChange({
                        ...transform,
                        crop: { ...transform.crop, height: parseInt(e.target.value) || 0 },
                      })
                    }
                    min={1}
                    max={imageHeight}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
