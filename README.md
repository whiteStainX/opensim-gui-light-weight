# OpenSim GUI Fork for React Integration

This is a fork of the [OpenSim GUI](https://github.com/opensim-org/opensim-gui) project. The goal of this fork is to extract the visualization components and integrate them into a modern React-based web application. This will not be contributed back to the upstream project.

## Architecture Overview

The original OpenSim GUI uses a Java-based backend and a web-based frontend for its visualization. Here's a breakdown of the key components:

*   **Jetty Web Server:** A Java-based web server is used to host the visualization frontend and serve 3D model data. This is located in the `opensim-visualizer` directory.
*   **Three.js Frontend:** The client-side application is built using [Three.js](https://threejs.org/), a popular JavaScript library for 3D graphics. The source code for this application is located in the `Gui/opensim/threejs` directory.
*   **JxBrowser:** The Java application uses an embedded browser called JxBrowser to display the Three.js frontend.

## Plan for React Integration

The plan is to replace the existing Three.js frontend with a new React application. This will involve:

1.  Setting up a new React project.
2.  Creating a React component to host the Three.js canvas.
3.  Replicating the existing communication logic between the frontend and the Jetty server to load and control the 3D models.

For more detailed technical information, please refer to the `PLAN.md` file.