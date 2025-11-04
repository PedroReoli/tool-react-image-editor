"use client"

import { useState, useRef, useEffect } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { EffectControls } from "@/components/effect-controls"
import { ImageCanvas } from "@/components/image-canvas"
import { ImageFiltersControls } from "@/components/image-filters"
import { ImageTransformsControls } from "@/components/image-transforms"
import { PresetsManager } from "@/components/presets-manager"
import { ExportDialog } from "@/components/export-dialog"
import { BeforeAfterView } from "@/components/before-after-view"
import { FullscreenButton } from "@/components/fullscreen-button"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"
import { ImageFilters } from "@/lib/image-filters"
import { ImageTransform } from "@/lib/image-transforms"
import { Preset } from "@/hooks/use-presets"

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [halftoneSize, setHalftoneSize] = useState(4)
  const [contrast, setContrast] = useState(1.5)
  const [accentColor, setAccentColor] = useState("#00d9ff")
  const [mouseRadius, setMouseRadius] = useState(100)
  const [repulsionStrength, setRepulsionStrength] = useState(1.0)
  const [returnSpeed, setReturnSpeed] = useState(0.3)
  const [accentProbability, setAccentProbability] = useState(0.03)
  const [sizeVariation, setSizeVariation] = useState(0.3)
  
  // Image filters state
  const [filters, setFilters] = useState<ImageFilters>({
    brightness: 0,
    saturation: 0,
    temperature: 0,
    blur: 0,
    sharpen: 0,
  })

  // Image transform state
  const [transform, setTransform] = useState<ImageTransform>({
    crop: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      enabled: false,
    },
    resize: {
      width: 0,
      height: 0,
      maintainAspectRatio: true,
      enabled: false,
    },
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      setUploadedImage(img)
      setOriginalImage(img)
      // Initialize transform with image dimensions
      setTransform({
        crop: {
          x: 0,
          y: 0,
          width: img.width,
          height: img.height,
          enabled: false,
        },
        resize: {
          width: img.width,
          height: img.height,
          maintainAspectRatio: true,
          enabled: false,
        },
        rotation: 0,
        flipHorizontal: false,
        flipVertical: false,
      })
    }
    img.src = "https://avatars.githubusercontent.com/u/51397083?v=4"
  }, [])

  const handleImageUpload = (image: HTMLImageElement) => {
    setUploadedImage(image)
    setOriginalImage(image)
    // Reset transform with new image dimensions
    setTransform({
      crop: {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
        enabled: false,
      },
      resize: {
        width: image.width,
        height: image.height,
        maintainAspectRatio: true,
        enabled: false,
      },
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
    })
    // Reset filters
    setFilters({
      brightness: 0,
      saturation: 0,
      temperature: 0,
      blur: 0,
      sharpen: 0,
    })
  }

  const handleUploadNewImage = () => {
    fileInputRef.current?.click()
  }

  const handleLoadPreset = (config: Preset['config']) => {
    setHalftoneSize(config.halftoneSize)
    setContrast(config.contrast)
    setAccentColor(config.accentColor)
    setMouseRadius(config.mouseRadius)
    setRepulsionStrength(config.repulsionStrength)
    setReturnSpeed(config.returnSpeed)
    setAccentProbability(config.accentProbability)
    setSizeVariation(config.sizeVariation)
    setFilters({
      brightness: config.brightness,
      saturation: config.saturation,
      temperature: config.temperature,
      blur: config.blur,
      sharpen: config.sharpen,
    })
  }

  const getCurrentConfig = (): Preset['config'] => ({
    halftoneSize,
    contrast,
    accentColor,
    mouseRadius,
    repulsionStrength,
    returnSpeed,
    accentProbability,
    sizeVariation,
    brightness: filters.brightness,
    saturation: filters.saturation,
    temperature: filters.temperature,
    blur: filters.blur,
    sharpen: filters.sharpen,
  })

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8" ref={fullscreenRef}>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Editor de Fotos Retro</h1>
          <p className="text-muted-foreground">Aplique efeitos interativos de meios-tons às suas imagens</p>
          <p className="text-xs text-muted-foreground mt-4">
            Feito por{" "}
            <a
              href="https://github.com/PedroReoli"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-accent"
            >
              Pedro Reoli
            </a>
            {" - "}
            <a
              href="https://pedroreoli.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-accent"
            >
              Portfólio
            </a>
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          <div className="space-y-4">
            {!uploadedImage ? (
              <ImageUploader onImageUpload={handleImageUpload} />
            ) : (
              <>
                <div className="relative">
                  <ImageCanvas
                    ref={canvasRef}
                    image={uploadedImage}
                    halftoneSize={halftoneSize}
                    contrast={contrast}
                    accentColor={accentColor}
                    mouseRadius={mouseRadius}
                    repulsionStrength={repulsionStrength}
                    returnSpeed={returnSpeed}
                    accentProbability={accentProbability}
                    sizeVariation={sizeVariation}
                    filters={filters}
                    transform={transform}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <ExportDialog
                    canvasRef={canvasRef}
                    trigger={
                      <Button className="gap-2">
                        <Download className="w-4 h-4" />
                        Exportar
                      </Button>
                    }
                  />
                  <Button variant="outline" onClick={handleUploadNewImage}>
                    Enviar Nova Imagem
                  </Button>
                  {fullscreenRef.current && (
                    <FullscreenButton targetRef={fullscreenRef} />
                  )}
                  <BeforeAfterView originalImage={originalImage} canvasRef={canvasRef} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const img = new Image()
                        img.crossOrigin = "anonymous"
                        img.onload = () => handleImageUpload(img)
                        img.src = event.target?.result as string
                      }
                      reader.readAsDataURL(file)
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {uploadedImage && (
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <Tabs defaultValue="effects" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="effects">Efeitos</TabsTrigger>
                  <TabsTrigger value="filters">Filtros</TabsTrigger>
                  <TabsTrigger value="transforms">Transformar</TabsTrigger>
                  <TabsTrigger value="presets">Presets</TabsTrigger>
                </TabsList>
                <TabsContent value="effects" className="mt-4">
                  <EffectControls
                    halftoneSize={halftoneSize}
                    contrast={contrast}
                    accentColor={accentColor}
                    mouseRadius={mouseRadius}
                    repulsionStrength={repulsionStrength}
                    returnSpeed={returnSpeed}
                    accentProbability={accentProbability}
                    sizeVariation={sizeVariation}
                    onHalftoneSizeChange={setHalftoneSize}
                    onContrastChange={setContrast}
                    onAccentColorChange={setAccentColor}
                    onMouseRadiusChange={setMouseRadius}
                    onRepulsionStrengthChange={setRepulsionStrength}
                    onReturnSpeedChange={setReturnSpeed}
                    onAccentProbabilityChange={setAccentProbability}
                    onSizeVariationChange={setSizeVariation}
                  />
                </TabsContent>
                <TabsContent value="filters" className="mt-4">
                  <ImageFiltersControls filters={filters} onFiltersChange={setFilters} />
                </TabsContent>
                <TabsContent value="transforms" className="mt-4">
                  <ImageTransformsControls
                    transform={transform}
                    imageWidth={uploadedImage.width}
                    imageHeight={uploadedImage.height}
                    onTransformChange={setTransform}
                  />
                </TabsContent>
                <TabsContent value="presets" className="mt-4">
                  <PresetsManager
                    currentConfig={getCurrentConfig()}
                    onLoadPreset={handleLoadPreset}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
