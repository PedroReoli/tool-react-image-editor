export interface ImageFilters {
  brightness: number // -100 to 100
  saturation: number // -100 to 100
  temperature: number // -100 to 100 (-100 = azul, 100 = laranja)
  blur: number // 0 to 10
  sharpen: number // 0 to 10
}

export function applyImageFilters(
  imageData: ImageData,
  filters: ImageFilters
): ImageData {
  const data = new Uint8ClampedArray(imageData.data)
  const width = imageData.width
  const height = imageData.height

  // Apply brightness
  if (filters.brightness !== 0) {
    const brightness = filters.brightness / 100
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] + brightness * 255))
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness * 255))
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness * 255))
    }
  }

  // Apply temperature
  if (filters.temperature !== 0) {
    const temp = filters.temperature / 100
    for (let i = 0; i < data.length; i += 4) {
      // Blue channel (cooler)
      if (temp < 0) {
        data[i] = Math.max(0, Math.min(255, data[i] - temp * 255))
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + temp * 255))
      }
      // Red channel (warmer)
      else {
        data[i] = Math.max(0, Math.min(255, data[i] + temp * 255))
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] - temp * 255))
      }
    }
  }

  // Apply saturation
  if (filters.saturation !== 0) {
    const saturation = 1 + filters.saturation / 100
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255
      const g = data[i + 1] / 255
      const b = data[i + 2] / 255
      
      const gray = 0.299 * r + 0.587 * g + 0.114 * b
      
      data[i] = Math.max(0, Math.min(255, (gray + (r - gray) * saturation) * 255))
      data[i + 1] = Math.max(0, Math.min(255, (gray + (g - gray) * saturation) * 255))
      data[i + 2] = Math.max(0, Math.min(255, (gray + (b - gray) * saturation) * 255))
    }
  }

  // Apply blur (simple box blur)
  if (filters.blur > 0) {
    const radius = Math.floor(filters.blur)
    const blurredData = new Uint8ClampedArray(data)
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, a = 0, count = 0
        
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx
            const ny = y + dy
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const idx = (ny * width + nx) * 4
              r += data[idx]
              g += data[idx + 1]
              b += data[idx + 2]
              a += data[idx + 3]
              count++
            }
          }
        }
        
        const idx = (y * width + x) * 4
        blurredData[idx] = r / count
        blurredData[idx + 1] = g / count
        blurredData[idx + 2] = b / count
        blurredData[idx + 3] = a / count
      }
    }
    
    return new ImageData(blurredData, width, height)
  }

  // Apply sharpen (unsharp mask)
  if (filters.sharpen > 0) {
    const strength = filters.sharpen / 10
    const kernel = [
      0, -1 * strength, 0,
      -1 * strength, 1 + 4 * strength, -1 * strength,
      0, -1 * strength, 0
    ]
    
    const sharpenedData = new Uint8ClampedArray(data)
    const tempData = new Uint8ClampedArray(data)
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let r = 0, g = 0, b = 0
        
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4
            const kernelIdx = (ky + 1) * 3 + (kx + 1)
            r += data[idx] * kernel[kernelIdx]
            g += data[idx + 1] * kernel[kernelIdx]
            b += data[idx + 2] * kernel[kernelIdx]
          }
        }
        
        const idx = (y * width + x) * 4
        sharpenedData[idx] = Math.max(0, Math.min(255, r))
        sharpenedData[idx + 1] = Math.max(0, Math.min(255, g))
        sharpenedData[idx + 2] = Math.max(0, Math.min(255, b))
        sharpenedData[idx + 3] = data[idx + 3]
      }
    }
    
    return new ImageData(sharpenedData, width, height)
  }

  return new ImageData(data, width, height)
}
