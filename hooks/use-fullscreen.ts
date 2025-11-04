import { useState, useEffect, useRef } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const enterFullscreen = async (element: HTMLElement) => {
    try {
      elementRef.current = element
      if (element.requestFullscreen) {
        await element.requestFullscreen()
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error)
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
      elementRef.current = null
    } catch (error) {
      console.error('Error exiting fullscreen:', error)
    }
  }

  const toggleFullscreen = (element: HTMLElement) => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen(element)
    }
  }

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    elementRef,
  }
}
