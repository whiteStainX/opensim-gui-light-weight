# React Visualization Integration Plan

This plan describes how the OpenSim visualization pieces will be ported into the Vite/React application that lives in `light-weight/`. It focuses on a modern, modular build while keeping the communication and data-flow contracts from the original OpenSim GUI.

## 1. Project Goals

* Extract the reusable visualization pieces from the existing OpenSim GUI and surface them inside a standalone React application.
* Mirror the original client/server data flow so the React app can drive the OpenSim backend without rewriting core simulation logic.
* Keep the new frontend lightweight, testable, and easy to iterate on.

## 2. Repository Layout

```
opensim-gui-light-weight/
├── opensim-visualizer/   # Original Jetty + WebSocket backend (reference and runtime)
├── Gui/opensim/threejs/  # Legacy frontend (reference only)
└── light-weight/         # Vite/React implementation
```

All new UI work happens inside `light-weight/`. The legacy frontend remains in the repo for reference while parity is being built.

## 3. React Application Architecture

* **Tooling**: Vite, React 18, modern JSX, ESLint. TypeScript can be introduced feature-by-feature when the APIs stabilise.
* **3D Rendering**: [`three`](https://threejs.org/) with [`@react-three/fiber`](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) to manage the scene declaratively and keep React in control of the render lifecycle.
* **State Management**: [`zustand`](https://github.com/pmndrs/zustand) for simple, composable state slices (connection status, scene graph metadata, playback state).
* **Data Fetching**: Native `fetch` for REST-style endpoints; lightweight helpers can wrap the existing Jetty REST APIs when needed.
* **Code Organisation**:
  * `src/app/` – application shell, routing (later), layout primitives.
  * `src/features/visualizer/` – visualization UI, hooks, and stores.
  * `src/shared/` – utilities shared across features (formatters, HTTP helpers, etc.).

## 4. Communication & Data Flow

The React app must replicate the contract used by the original `Gui/opensim/threejs/editor` frontend.

### Backend Summary

* **Jetty Server** (`opensim-visualizer/src/.../JettyMain.java`): serves static assets and exposes `/visEndpoint` WebSocket + REST endpoints on port 8001.
* **WebSocket** (`VisWebSocket.java`): bidirectional JSON channel. Messages contain an `Op` field describing commands (`OpenModel`, `Frame`, `Select`, `execute`, etc.).
* **Broadcasting** (`WebSocketDB.java`): keeps active sockets so simulation updates can be broadcast to all connected clients.

### React Data Flow

1. The React app boots and initialises a WebSocket connection to `/visEndpoint`.
2. Incoming JSON payloads are parsed inside a connection hook and dispatched into the zustand store.
3. Components subscribe to store slices to update the canvas, info panels, and UI controls.
4. User interactions (e.g., selecting a body, changing playback) emit JSON messages that mirror the original `Op` values.
5. REST calls (model listings, metadata) are fetched on demand and cached per component.

```
+--------------------+     WebSocket/REST      +----------------------+
| React Components   | <---------------------> | Jetty / OpenSim Core |
|  (zustand store)   |                         |  (unchanged)         |
+--------------------+                         +----------------------+
```

## 5. Implementation Roadmap

1. **Foundation**
   * Scaffold visualizer feature folders, zustand store, and a `<VisualizerCanvas>` that mounts a Three.js scene.
   * Surface connection status and a placeholder scene to validate the render loop.
2. **Protocol Integration**
   * Mirror `websocket.js` message handling inside a dedicated hook/service.
   * Normalise message payloads in the store and expose typed selectors for React components.
3. **Model & Scene Controls**
   * Build components for model lists, playback controls, and selection info.
   * Sync Three.js objects with incoming `Frame` updates.
4. **Feature Parity & Cleanup**
   * Incrementally port functionality from the legacy frontend.
   * Replace the assets served by Jetty with the Vite build output once parity is acceptable.

## 6. Developer Workflow

* Run `npm install` / `npm run dev` inside `light-weight/` for local development.
* Use the zustand store for any cross-component state to keep React components easy to test.
* Keep integration points (WebSocket, REST) isolated behind hooks or services to simplify mocking during tests.
* Document new protocols or message formats in `light-weight/docs/` (create as needed).

This plan keeps the React side lean while preserving the original backend communication patterns so functionality can be ported incrementally.
