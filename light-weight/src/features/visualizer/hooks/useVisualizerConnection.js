import { useCallback, useEffect, useRef } from 'react'
import { useVisualizerDispatch, useVisualizerState } from '../state/VisualizerProvider'

const DEFAULT_WS_URL = import.meta.env.VITE_VISUALIZER_WS_URL ?? 'ws://localhost:8001/visEndpoint'

const createMessageId = () => (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Math.random().toString(36).slice(2))

export function useVisualizerConnection({ url = DEFAULT_WS_URL, autoConnect = true } = {}) {
  const dispatch = useVisualizerDispatch()
  const { connectionStatus, connectionError, lastMessage } = useVisualizerState((state) => ({
    connectionStatus: state.connectionStatus,
    connectionError: state.connectionError,
    lastMessage: state.lastMessage,
  }))
  const socketRef = useRef(null)

  const connect = useCallback(() => {
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return socketRef.current
    }

    dispatch({ type: 'connection:start' })

    try {
      const socket = new WebSocket(url)
      socketRef.current = socket

      socket.addEventListener('open', () => {
        dispatch({ type: 'connection:open' })
      })

      socket.addEventListener('message', (event) => {
        let parsed
        try {
          parsed = JSON.parse(event.data)
        } catch (error) {
          parsed = null
        }
        dispatch({
          type: 'message:received',
          payload: {
            id: createMessageId(),
            direction: 'inbound',
            receivedAt: Date.now(),
            raw: event.data,
            parsed,
          },
        })
      })

      socket.addEventListener('error', (event) => {
        dispatch({ type: 'connection:error', payload: event.message ?? 'WebSocket error' })
      })

      socket.addEventListener('close', () => {
        dispatch({ type: 'connection:close' })
        socketRef.current = null
      })

      return socket
    } catch (error) {
      dispatch({ type: 'connection:error', payload: error?.message ?? 'Unable to create WebSocket connection' })
      return null
    }
  }, [dispatch, url])

  const disconnect = useCallback(() => {
    if (!socketRef.current) return
    socketRef.current.close()
    socketRef.current = null
  }, [])

  const send = useCallback(
    (payload) => {
      const socket = socketRef.current
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        return false
      }
      const message = typeof payload === 'string' ? payload : JSON.stringify(payload)
      socket.send(message)
      dispatch({
        type: 'message:sent',
        payload: {
          id: createMessageId(),
          direction: 'outbound',
          sentAt: Date.now(),
          raw: message,
          parsed: typeof payload === 'string' ? null : payload,
        },
      })
      return true
    },
    [dispatch],
  )

  useEffect(() => {
    if (!autoConnect) return undefined
    const socket = connect()
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [autoConnect, connect])

  return {
    status: connectionStatus,
    error: connectionError,
    lastMessage,
    connect,
    disconnect,
    send,
    socket: socketRef.current,
  }
}
