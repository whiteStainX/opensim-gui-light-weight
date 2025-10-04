import { useEffect, useRef } from 'react'
import { useVisualizerState } from '../state/VisualizerProvider'

export function VisualizerCanvas() {
  const canvasRef = useRef(null)
  const connectionStatus = useVisualizerState((state) => state.connectionStatus)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const context = canvas.getContext('2d')
    if (!context) return undefined

    let animationFrameId

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const render = () => {
      const { width, height } = canvas
      const gradient = context.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#0b1f33')
      gradient.addColorStop(1, '#123d5d')

      context.fillStyle = gradient
      context.fillRect(0, 0, width, height)

      context.fillStyle = 'rgba(255, 255, 255, 0.85)'
      context.font = '16px system-ui'
      context.textAlign = 'center'
      context.fillText('Visualizer canvas placeholder', width / 2, height / 2)
      context.font = '12px system-ui'
      context.fillText(`Connection: ${connectionStatus}`, width / 2, height / 2 + 24)

      animationFrameId = requestAnimationFrame(render)
    }

    handleResize()
    render()
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [connectionStatus])

  return <canvas ref={canvasRef} className="visualizer-canvas" role="img" aria-label="OpenSim visualizer placeholder" />
}
