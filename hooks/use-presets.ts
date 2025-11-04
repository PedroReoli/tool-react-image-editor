import { useState, useEffect } from 'react'

export interface Preset {
  id: string
  name: string
  config: {
    halftoneSize: number
    contrast: number
    accentColor: string
    mouseRadius: number
    repulsionStrength: number
    returnSpeed: number
    accentProbability: number
    sizeVariation: number
    brightness: number
    saturation: number
    temperature: number
    blur: number
    sharpen: number
  }
}

const STORAGE_KEY = 'retro-shader-presets'

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setPresets(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load presets:', e)
      }
    }
  }, [])

  const savePreset = (name: string, config: Preset['config']) => {
    const newPreset: Preset = {
      id: Date.now().toString(),
      name,
      config,
    }
    const updated = [...presets, newPreset]
    setPresets(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return newPreset.id
  }

  const deletePreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id)
    setPresets(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const loadPreset = (id: string): Preset | undefined => {
    return presets.find((p) => p.id === id)
  }

  return {
    presets,
    savePreset,
    deletePreset,
    loadPreset,
  }
}
