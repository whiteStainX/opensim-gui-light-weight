import { createContext, useContext, useMemo, useReducer } from 'react'

const VisualizerStateContext = createContext(undefined)
const VisualizerDispatchContext = createContext(undefined)

const initialState = {
  connectionStatus: 'idle',
  connectionError: null,
  lastMessage: null,
  messageLog: [],
}

function visualizerReducer(state, action) {
  switch (action.type) {
    case 'connection:start':
      return {
        ...state,
        connectionStatus: 'connecting',
        connectionError: null,
      }
    case 'connection:open':
      return {
        ...state,
        connectionStatus: 'connected',
      }
    case 'connection:error':
      return {
        ...state,
        connectionStatus: 'error',
        connectionError: action.payload ?? null,
      }
    case 'connection:close':
      return {
        ...state,
        connectionStatus: 'disconnected',
      }
    case 'message:received': {
      const nextLog = [action.payload, ...state.messageLog]
      return {
        ...state,
        lastMessage: action.payload,
        messageLog: nextLog.slice(0, 20),
      }
    }
    case 'message:sent': {
      const nextLog = [action.payload, ...state.messageLog]
      return {
        ...state,
        messageLog: nextLog.slice(0, 20),
      }
    }
    default:
      return state
  }
}

export function VisualizerProvider({ children }) {
  const [state, dispatch] = useReducer(visualizerReducer, initialState)
  const stateValue = useMemo(() => state, [state])
  const dispatchValue = useMemo(() => dispatch, [dispatch])

  return (
    <VisualizerStateContext.Provider value={stateValue}>
      <VisualizerDispatchContext.Provider value={dispatchValue}>
        {children}
      </VisualizerDispatchContext.Provider>
    </VisualizerStateContext.Provider>
  )
}

export function useVisualizerState(selector) {
  const state = useContext(VisualizerStateContext)
  if (state === undefined) {
    throw new Error('useVisualizerState must be used within a VisualizerProvider')
  }
  return selector ? selector(state) : state
}

export function useVisualizerDispatch() {
  const dispatch = useContext(VisualizerDispatchContext)
  if (dispatch === undefined) {
    throw new Error('useVisualizerDispatch must be used within a VisualizerProvider')
  }
  return dispatch
}
