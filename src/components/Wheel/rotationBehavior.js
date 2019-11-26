import { angleDifference, RAD_TO_DEG } from "./utils";

function getEventXY(event, touchId) {
  if (touchId !== null) {
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches[i];
      if (touch.identifier === touchId) {
        return [touch.clientX, touch.clientY];
      }
    }
    return undefined;
  }
  return [event.clientX, event.clientY];
}

export function beginRotationBehavior(
  element,
  beginEvent,
  onAngleChange,
  onFinish
) {
  const isTouch = beginEvent.type === "touchstart";
  const touchId = isTouch ? beginEvent.changedTouches[0].identifier : null;
  const document = element.ownerDocument;
  const wheelBbox = element.getBoundingClientRect();
  const wheelMidX = (wheelBbox.left + wheelBbox.right) / 2;
  const wheelMidY = (wheelBbox.top + wheelBbox.bottom) / 2;
  const [origX, origY] = getEventXY(beginEvent, touchId);
  const origRelX = origX - wheelMidX;
  const origRelY = origY - wheelMidY;
  let lastAngleRadians = Math.atan2(origRelY, origRelX);
  let currDegrees = 0;

  function handleMove(moveEvent) {
    const xy = getEventXY(moveEvent, touchId);
    if (xy === undefined) {
      return;
    }
    const [x, y] = xy;
    const relX = x - wheelMidX;
    const relY = y - wheelMidY;
    const angleRadians = Math.atan2(relY, relX);
    const deltaDegrees = angleDifference(
      angleRadians * -RAD_TO_DEG,
      lastAngleRadians * -RAD_TO_DEG
    );
    if (Math.abs(deltaDegrees) >= 0.1) {
      lastAngleRadians = angleRadians;
      currDegrees += deltaDegrees;
      onAngleChange(moveEvent, currDegrees);
    }
  }

  function handleUp(upEvent) {
    if (isTouch) {
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleUp);
      document.removeEventListener("touchcancel", handleUp);
    } else {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    }
    onFinish(upEvent, currDegrees);
  }

  if (isTouch) {
    document.addEventListener("touchmove", handleMove);
    document.addEventListener("touchend", handleUp);
    document.addEventListener("touchcancel", handleUp);
  } else {
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  }
  return true;
}
