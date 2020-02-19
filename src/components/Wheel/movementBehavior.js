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

export function beginMovementBehavior(
  configuration,
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
  const origXY = getEventXY(beginEvent, touchId);
  let currDegrees = 0;
  let handleMove;

  switch (configuration.mode) {
    case "circular":
      {
        const origRelX = origXY[0] - wheelMidX;
        const origRelY = origXY[1] - wheelMidY;
        const deltaR = configuration.deltaR || 1;
        let lastAngleRadians = Math.atan2(origRelY, origRelX);

        handleMove = moveEvent => {
          const xy = getEventXY(moveEvent, touchId);
          if (xy === undefined) {
            return;
          }
          const [x, y] = xy;
          const relX = x - wheelMidX;
          const relY = y - wheelMidY;
          const angleRadians = Math.atan2(relY, relX);
          const deltaDegrees =
            angleDifference(
              angleRadians * -RAD_TO_DEG,
              lastAngleRadians * -RAD_TO_DEG
            ) * deltaR;
          if (Math.abs(deltaDegrees) >= 0.1) {
            lastAngleRadians = angleRadians;
            currDegrees += deltaDegrees;
            onAngleChange(moveEvent, currDegrees);
          }
        };
      }
      break;
    case "linear":
      {
        let lastXY = origXY;
        const deltaX = configuration.deltaX || 0;
        const deltaY = configuration.deltaY || 0;
        handleMove = moveEvent => {
          const xy = getEventXY(moveEvent, touchId);
          if (xy === undefined) {
            return;
          }
          const relX = xy[0] - lastXY[0];
          const relY = xy[1] - lastXY[1];
          const delta = relX * deltaX + relY * deltaY;
          if (Math.abs(delta) >= 0.1) {
            currDegrees += delta;
            lastXY = xy;
            onAngleChange(moveEvent, currDegrees);
          }
        };
      }
      break;
    default:
      throw new Error(
        `Unsupported movement mode in configuration: ${JSON.stringify(
          configuration
        )}`
      );
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

export function beginRotationBehavior(
  element,
  beginEvent,
  onAngleChange,
  onFinish
) {
  return beginMovementBehavior(element, beginEvent, onAngleChange, onFinish, {
    mode: "circular"
  });
}
