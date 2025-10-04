# Technical Plan for React Integration

This document outlines the technical plan for integrating the OpenSim visualization into a new React application.

## 1. React Project Setup

*   **Technology Stack:**
    *   **React:** The core of our new frontend application.
    *   **TypeScript:** For type safety and improved developer experience.
    *   **Vite:** As the build tool for a fast development experience.
    *   **Zustand or Redux Toolkit:** For state management, particularly for managing the state of the 3D scene and user interactions.
*   **Project Structure:**
    *   The new React application is located in the `light-weight` directory. It is set up using Vite and TypeScript.
    *   The existing `Gui/opensim/threejs` directory will be kept for reference during the initial development phase but will eventually be removed.

## 2. Creating the Three.js Canvas Component

*   A dedicated React component, `ThreeCanvas`, will be created to encapsulate the Three.js rendering logic.
*   This component will be responsible for:
    *   Initializing the Three.js `WebGLRenderer`, `Scene`, and `Camera`.
    *   Handling the rendering loop using `requestAnimationFrame`.
    *   Managing the resizing of the canvas to fit its container.
*   We will use the `react-three-fiber` library to simplify the integration of Three.js with React. This will allow us to create and manage Three.js objects declaratively within our React components.

## 3. Communication with the Jetty Server

*   The existing communication between the frontend and the Jetty server is based on a WebSocket connection and REST API calls. We need to replicate this in our React application.
*   **WebSocket Connection:**
    *   A WebSocket connection will be established to receive real-time updates from the server, such as new models, animations, or changes in the scene.
    *   A dedicated service or hook will be created to manage the WebSocket connection and handle incoming messages.
*   **REST API Calls:**
    *   The existing REST API will be used to load initial model data and perform other actions.
    *   We will use a library like `axios` to make these API calls.

## 4. State Management

*   The state of the 3D scene, including the loaded models, their positions, and animations, will be managed using a state management library (e.g., Zustand or Redux Toolkit).
*   This will allow different components in the application to access and modify the scene state in a predictable way.

## 5. Replacing the Existing Web Application

*   Once the new React application has reached a sufficient level of maturity, we will switch the Jetty server to serve the new application instead of the old one.
*   This will involve:
    *   Building the React application for production.
    *   Configuring the Jetty server to serve the `index.html` file from the `react-app/dist` directory.
    *   Updating the Java code that launches the `JxBrowser` instance to point to the correct URL for the new application.

## 6. Original Architecture and Data Flow

The original OpenSim GUI visualization is composed of a Java-based backend and a JavaScript-based frontend. They communicate primarily through a WebSocket connection.

### Backend (opensim-visualizer)

*   **Jetty Server:** A lightweight, embeddable Java web server.
    *   `JettyMain.java`: Initializes the server on port 8001. It serves the static frontend files located in `Gui/opensim/threejs/editor/` and sets up a WebSocket endpoint at `/visEndpoint`.
*   **WebSocket Handling:**
    *   `OpenSimSocketServlet.java`: A servlet that registers `VisWebSocket` as the handler for incoming WebSocket connections.
    *   `VisWebSocket.java`: Manages the lifecycle of a WebSocket connection. It receives JSON messages from the client, parses them, and notifies the backend of user actions. It also sends messages from the backend to the client to update the visualization.
    *   `WebSocketDB.java`: A singleton that maintains a collection of all active `VisWebSocket` instances. This allows the backend to broadcast messages to all connected clients.

### Frontend (Gui/opensim/threejs/editor)

*   **Three.js Application:** A client-side application that renders the 3D scene.
    *   `index.html`: The main entry point of the application. It loads all the necessary JavaScript libraries, including Three.js, and the application-specific code.
    *   `websocket.js`: Establishes and manages the WebSocket connection to the server. It listens for incoming messages and triggers actions in the frontend based on the `Op` (operation) field in the JSON payload.
    *   `OpenSimEditor.js`: The core of the frontend application. It manages the Three.js scene, objects, and user interactions. The `websocket.js` script calls methods on the global `editor` object to manipulate the scene.

### Data Flow Diagram

```
+---------------------------------+      WebSocket (JSON)      +--------------------------------+
|         Backend (Java)          | <------------------------> |      Frontend (Three.js)       |
|                                 |                            |                                |
|  +---------------------------+  |                            |  +--------------------------+  |
|  |       OpenSim Core        |  |                            |  |       OpenSimEditor      |  |
|  +---------------------------+  |                            |  +--------------------------+  |
|               |               |                            |               ^              |
|               v               |                            |               |              |
|  +---------------------------+  |                            |  +--------------------------+  |
|  |     WebSocketDB/Server    |  |                            |  |       websocket.js       |  |
|  +---------------------------+  |                            |  +--------------------------+  |
|                                 |                            |                                |
+---------------------------------+                            +--------------------------------+
```

### Communication Protocol

*   The communication between the backend and frontend is based on JSON messages sent over the WebSocket.
*   Each message contains an `Op` field that specifies the action to be performed.
*   Examples of operations include:
    *   `OpenModel`: Loads a new 3D model.
    *   `Frame`: Updates the position and orientation of objects in the scene for an animation frame.
    *   `Select`: Selects an object in the scene.
    *   `execute`: Executes a command on the frontend, such as adding a new object.

## 7. Development Workflow

1.  **Phase 1: Basic Setup**
    *   Set up the React project with Vite and TypeScript.
    *   Create the basic `ThreeCanvas` component.
    *   Render a simple Three.js scene with a cube to verify the setup.
2.  **Phase 2: Server Communication**
    *   Implement the WebSocket and REST API communication logic in the new React application.
    *   Load a simple model from the Jetty server and display it in the `ThreeCanvas` component.
3.  **Phase 3: Feature Parity**
    *   Implement the full functionality of the existing visualizer, including model loading, animation controls, and user interactions.
4.  **Phase 4: Integration and Replacement**
    *   Integrate the React application with the Jetty server.
    *   Remove the old `Gui/opensim/threejs` directory.