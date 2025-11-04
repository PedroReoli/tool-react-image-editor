"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { usePresets, Preset } from "@/hooks/use-presets"
import { Save, Trash2 } from "lucide-react"

interface PresetsManagerProps {
  currentConfig: Preset['config']
  onLoadPreset: (config: Preset['config']) => void
}

export function PresetsManager({ currentConfig, onLoadPreset }: PresetsManagerProps) {
  const { presets, savePreset, deletePreset, loadPreset } = usePresets()
  const [presetName, setPresetName] = useState("")
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)

  const handleSave = () => {
    if (!presetName.trim()) return
    savePreset(presetName.trim(), currentConfig)
    setPresetName("")
    setSaveDialogOpen(false)
  }

  const handleLoad = (presetId: string) => {
    const preset = loadPreset(presetId)
    if (preset) {
      onLoadPreset(preset.config)
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">Presets</h3>
          <p className="text-sm text-muted-foreground">Salve e carregue suas configurações favoritas</p>
        </div>
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Save className="w-4 h-4" />
              Salvar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Salvar Preset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="preset-name">Nome do Preset</Label>
                <Input
                  id="preset-name"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Ex: Vintage Cool"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSave()
                    }
                  }}
                />
              </div>
              <Button onClick={handleSave} className="w-full" disabled={!presetName.trim()}>
                Salvar Preset
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {presets.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum preset salvo. Salve suas configurações favoritas para acessá-las rapidamente.
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <button
                onClick={() => handleLoad(preset.id)}
                className="flex-1 text-left hover:underline"
              >
                <p className="font-medium">{preset.name}</p>
              </button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deletePreset(preset.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
