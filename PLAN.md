# Technical Plan for React Integration

This document outlines the technical plan for integrating the OpenSim visualization into a new React application.

## 1. Setting Up the React Project

*   **Technology Stack:**
    *   **React:** The core of our new frontend application.
    *   **TypeScript:** For type safety and improved developer experience.
    *   **Vite:** As the build tool for a fast development experience.
    *   **Zustand or Redux Toolkit:** For state management, particularly for managing the state of the 3D scene and user interactions.
*   **Project Structure:**
    *   A new `react-app` directory will be created in the root of the repository to house the new React application.
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

## 6. Development Workflow

1.  **Phase 1: Basic Setup**
    *   Set up the React project with Vite and TypeScript.
    *   Create the basic `ThreeCanvas` component.
    *   Render a simple Three.js scene with a cube to verify the setup.
2.  **Phase 2: Server Communication**
    *   Implement the WebSocket and REST API communication logic.
    *   Load a simple model from the Jetty server and display it in the `ThreeCanvas` component.
3.  **Phase 3: Feature Parity**
    *   Implement the full functionality of the existing visualizer, including model loading, animation controls, and user interactions.
4.  **Phase 4: Integration and Replacement**
    *   Integrate the React application with the Jetty server.
    *   Remove the old `Gui/opensim/threejs` directory.