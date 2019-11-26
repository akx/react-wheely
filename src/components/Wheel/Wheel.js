import React from "react";
import { beginRotationBehavior } from "./rotationBehavior";
import { limitValue } from "./utils";

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
  renderLabel
}) {
  const ref = React.useRef(null);
  const [degrees, setDegrees] = React.useState(initialDegrees || 0);
  React.useEffect(() => {
    setDegrees(initialDegrees);
  }, [initialDegrees]);
  const [changing, setChanging] = React.useState(false);

  function handleBegin(event) {
    const origStateDegrees = degrees;
    const snapValue = newDegrees =>
      limitValue(origStateDegrees, newDegrees, snap, min, max);
    if (ref.current && !changing) {
      setChanging(true);
      if (onBeginChange) {
        onBeginChange(origStateDegrees);
      }

      beginRotationBehavior(
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
  }

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
  classNamePrefix: "wheely-"
};

export default Wheel;
