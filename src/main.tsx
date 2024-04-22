import React from "react";
import { createRoot } from "react-dom/client";
import "./stories/example-style.css";
import { Wheel } from "../lib";

function App() {
  return (
    <div className="App">
      <Wheel size={200} movementMode="circular" initialDegrees={42} />
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
