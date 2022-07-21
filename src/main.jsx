import React from "react";
import ReactDOM from "react-dom";
import "./stories/example-style.css";
import { Wheel } from "../lib";

function App() {
  return (
    <div className="App">
      <Wheel
        size={200}
        movementMode="circular"
        initialDegrees={42}
      />
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);
