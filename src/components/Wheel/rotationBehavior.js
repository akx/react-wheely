import { angleDifference, RAD_TO_DEG } from "./utils";

export function beginRotationBehavior(
  element,
  mouseDownEvent,
  onAngleChange,
  onFinish
) {
  const document = element.ownerDocument;
  const wheelBbox = element.getBoundingClientRect();
  const wheelMidX = (wheelBbox.left + wheelBbox.right) / 2;
  const wheelMidY = (wheelBbox.top + wheelBbox.bottom) / 2;
  const origRelX = mouseDownEvent.clientX - wheelMidX;
  const origRelY = mouseDownEvent.clientY - wheelMidY;
  let lastAngleRadians = Math.atan2(origRelY, origRelX);
  let currDegrees = 0;

  function handleMouseMove(mouseMoveEvent) {
    const relX = mouseMoveEvent.clientX - wheelMidX;
    const relY = mouseMoveEvent.clientY - wheelMidY;
    const angleRadians = Math.atan2(relY, relX);
    const deltaDegrees = angleDifference(
      angleRadians * -RAD_TO_DEG,
      lastAngleRadians * -RAD_TO_DEG
    );
    if (Math.abs(deltaDegrees) >= 0.1) {
      lastAngleRadians = angleRadians;
      currDegrees += deltaDegrees;
      onAngleChange(mouseMoveEvent, currDegrees);
    }
  }

  function handleMouseUp(mouseUpEvent) {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    onFinish(mouseUpEvent, currDegrees);
  }

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}
