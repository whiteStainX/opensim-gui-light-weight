import { VisualizerCanvas } from './VisualizerCanvas'
import { ConnectionPanel } from './ConnectionPanel'

export function VisualizerPage() {
  return (
    <div className="visualizer-page">
      <div className="visualizer-layout">
        <div className="visualizer-stage">
          <VisualizerCanvas />
        </div>
        <ConnectionPanel />
      </div>
    </div>
  )
}
