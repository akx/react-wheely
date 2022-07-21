import React from "react";
import { beginMovementBehavior } from "./movementBehavior";
import { limitValue } from "./utils";

function getMovementConfiguration(movementMode) {
  if (typeof movementMode === "string") {
    switch (movementMode) {
      case "circular":
        return {
          mode: "circular",
          deltaR: 1
        };
      case "horizontal":
      case "vertical":
        return {
          mode: "linear",
          deltaX: movementMode === "horizontal" ? +1 : 0,
          deltaY: movementMode === "vertical" ? -1 : 0
        };
      default:
        throw new Error(`invalid motion mode string: ${movementMode}`);
    }
  } else if (movementMode.mode) {
    // Assume the user knows how to work movement configurations!
    return movementMode;
  }
  throw new Error(`Invalid movement configuration`);
}

function Wheel({
  size,
  initialDegrees,
  snap,
  min,
  max,
  onBeginChange,
  onChangeValue,
  onCommitValue,
  classNamePrefix,
  renderLabel,
  movementMode
}) {
  const ref = React.useRef(null);
  const [degrees, setDegrees] = React.useState(initialDegrees || 0);
  React.useEffect(() => {
    setDegrees(initialDegrees);
  }, [initialDegrees]);
  const [changing, setChanging] = React.useState(false);

  const handleBegin = React.useCallback(
    event => {
      const origStateDegrees = degrees;
      const snapValue = newDegrees =>
        limitValue(origStateDegrees, newDegrees, snap, min, max);
      if (ref.current && !changing) {
        setChanging(true);
        if (onBeginChange) {
          onBeginChange(origStateDegrees);
        }
        beginMovementBehavior(
          getMovementConfiguration(movementMode),
          ref.current,
          event,
          (moveEvent, newDegrees) => {
            const totalDegrees = snapValue(newDegrees);
            if (degrees !== totalDegrees) {
              setDegrees(totalDegrees);
              if (onChangeValue) {
                onChangeValue(totalDegrees);
              }
            }
          },
          (moveEvent, newDegrees) => {
            setChanging(false);
            const totalDegrees = snapValue(newDegrees);
            setDegrees(totalDegrees);
            if (onCommitValue) {
              onCommitValue(totalDegrees);
            }
          }
        );
      }
    },
    [
      changing,
      degrees,
      max,
      min,
      movementMode,
      onBeginChange,
      onChangeValue,
      onCommitValue,
      snap
    ]
  );

  const sizePx = `${size}px`;
  const style = { width: sizePx, height: sizePx, touchAction: "none" };
  return (
    <div
      className={`${classNamePrefix}base`}
      style={style}
      ref={ref}
      onMouseDown={handleBegin}
      onTouchStart={handleBegin}
    >
      <div
        className={`${classNamePrefix}inner`}
        style={{
          ...style,
          transform: `rotate(${degrees.toFixed(1)}deg)`
        }}
      />
      {renderLabel ? renderLabel({ degrees, changing, style }) : null}
    </div>
  );
}

Wheel.defaultProps = {
  size: 200,
  classNamePrefix: "wheely-",
  movementMode: "circular"
};

export default Wheel;
