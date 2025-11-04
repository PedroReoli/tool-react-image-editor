export interface ImageTransform {
  crop: {
    x: number
    y: number
    width: number
    height: number
    enabled: boolean
  }
  resize: {
    width: number
    height: number
    maintainAspectRatio: boolean
    enabled: boolean
  }
  rotation: number // 0, 90, 180, 270
  flipHorizontal: boolean
  flipVertical: boolean
}

export function applyImageTransform(
  image: HTMLImageElement,
  transform: ImageTransform
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  let sourceX = 0
  let sourceY = 0
  let sourceWidth = image.width
  let sourceHeight = image.height

  // Apply crop
  if (transform.crop.enabled) {
    sourceX = Math.max(0, Math.min(image.width, transform.crop.x))
    sourceY = Math.max(0, Math.min(image.height, transform.crop.y))
    sourceWidth = Math.max(1, Math.min(image.width - sourceX, transform.crop.width))
    sourceHeight = Math.max(1, Math.min(image.height - sourceY, transform.crop.height))
  }

  let outputWidth = sourceWidth
  let outputHeight = sourceHeight

  // Apply resize
  if (transform.resize.enabled) {
    if (transform.resize.maintainAspectRatio) {
      const aspectRatio = sourceWidth / sourceHeight
      if (transform.resize.width / transform.resize.height > aspectRatio) {
        outputHeight = transform.resize.height
        outputWidth = outputHeight * aspectRatio
      } else {
        outputWidth = transform.resize.width
        outputHeight = outputWidth / aspectRatio
      }
    } else {
      outputWidth = transform.resize.width
      outputHeight = transform.resize.height
    }
  }

  // Adjust canvas size for rotation
  if (transform.rotation === 90 || transform.rotation === 270) {
    canvas.width = outputHeight
    canvas.height = outputWidth
  } else {
    canvas.width = outputWidth
    canvas.height = outputHeight
  }

  // Translate to center for rotation
  ctx.translate(canvas.width / 2, canvas.height / 2)

  // Apply rotation
  if (transform.rotation !== 0) {
    ctx.rotate((transform.rotation * Math.PI) / 180)
  }

  // Apply flips
  let scaleX = transform.flipHorizontal ? -1 : 1
  let scaleY = transform.flipVertical ? -1 : 1
  ctx.scale(scaleX, scaleY)

  // Draw image
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    -outputWidth / 2,
    -outputHeight / 2,
    outputWidth,
    outputHeight
  )

  return canvas
}
