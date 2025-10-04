import { useMemo } from 'react'
import { useVisualizerConnection } from '../hooks/useVisualizerConnection'

const statusCopy = {
  idle: 'Not connected',
  connecting: 'Connecting…',
  connected: 'Connected',
  disconnected: 'Disconnected',
  error: 'Connection error',
}

export function ConnectionPanel() {
  const { status, error, connect, disconnect, send, lastMessage } = useVisualizerConnection({ autoConnect: false })
  const messagePreview = useMemo(() => {
    if (!lastMessage) return 'No messages received yet.'
    try {
      return JSON.stringify(lastMessage.parsed ?? lastMessage.raw, null, 2)
    } catch (serializationError) {
      return String(lastMessage.raw)
    }
  }, [lastMessage])

  const handleConnectToggle = () => {
    if (status === 'connected' || status === 'connecting') {
      disconnect()
    } else {
      connect()
    }
  }

  const handlePing = () => {
    const payload = { Op: 'Ping', timestamp: Date.now() }
    const sent = send(payload)
    if (!sent) {
      // eslint-disable-next-line no-console
      console.warn('Unable to send message: socket not connected')
    }
  }

  return (
    <section className="connection-panel" aria-labelledby="connection-panel-title">
      <header className="connection-panel__header">
        <div>
          <h2 id="connection-panel-title">Connection</h2>
          <p className="connection-panel__status" data-status={status}>
            {statusCopy[status] ?? status}
          </p>
          {error ? <p className="connection-panel__error">{error}</p> : null}
        </div>
        <div className="connection-panel__actions">
          <button type="button" onClick={handleConnectToggle} className="connection-panel__button">
            {status === 'connected' || status === 'connecting' ? 'Disconnect' : 'Connect'}
          </button>
          <button type="button" onClick={handlePing} className="connection-panel__button" disabled={status !== 'connected'}>
            Send ping
          </button>
        </div>
      </header>
      <div className="connection-panel__body">
        <h3 className="connection-panel__subtitle">Last message</h3>
        <pre className="connection-panel__message" aria-live="polite">{messagePreview}</pre>
      </div>
    </section>
  )
}
