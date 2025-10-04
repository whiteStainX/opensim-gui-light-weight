import './App.css'
import { VisualizerProvider } from './features/visualizer/state/VisualizerProvider'
import { VisualizerPage } from './features/visualizer/components/VisualizerPage'

function App() {
  return (
    <VisualizerProvider>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <p className="app-eyebrow">OpenSim React Prototype</p>
            <h1 className="app-title">Lightweight Visualizer</h1>
            <p className="app-subtitle">
              This React prototype mirrors the communication contract used by the original OpenSim GUI while we port the
              visualization to modern tooling.
            </p>
          </div>
        </header>
        <main className="app-main">
          <VisualizerPage />
        </main>
      </div>
    </VisualizerProvider>
  )
}

export default App
