/* eslint-disable react/no-array-index-key,react/jsx-curly-newline,react/jsx-props-no-spreading */
import React from "react";
import { Wheel } from "../../lib";
import "./example-style.css";

export default {
  title: 'Wheel',
  component: Wheel,
};

export const WithACustomLabel = ({ snap10, min0, max400, movementMode }) => (
  <Wheel
    size={200}
    snap={snap10 ? 10 : undefined}
    min={min0 ? 0 : undefined}
    max={max400 ? 400 : undefined}
    movementMode={movementMode}
    initialDegrees={42}
    renderLabel={({ degrees, style, changing }) => (
      <div className="my-wheel-label" style={style}>
        {degrees.toFixed(2)}
        {changing ? "..." : ""}
      </div>
    )}
  />
);
// TODO: re-enable these with Ladle
//WithACustomLabel.args = {
//  snap10: false,
//  min0: false,
//  max400: false,
//  movementMode: 'circular',
//};
//WithACustomLabel.argTypes = {
//  movementMode: {
//    options: ['circular', 'horizontal', 'vertical'],
//  },
//  snap10: {
//    name: "Snap to 10 Degrees",
//  },
//  min0: {
//    name: "Minimum Zero",
//  },
//  max400: {
//    name: "Maximum 400",
//  },
//  size: {
//    //control: {
//    //  type: 'range',
//    //  min: 90,
//    //  max: 1000,
//    //},
//  },
//  onBeginChange: {action: 'onBeginChange'},
//  onChangeValue: {action: 'onChangeValue'},
//  onCommitValue: {action: 'onCommitValue'},
//};


export const PhoneNumberInput = () => {
  const [number, setNumber] = React.useState("0000000");
  const replaceDigit = (index, digit) => {
    const digitArray = Array.from(number);
    digitArray.splice(index, 1, `${Math.min(digit, 9)}`);
    setNumber(digitArray.join(""));
  };
  const wheels = Array.from(number).map((v, index) => (
    <Wheel
      key={index}
      size={70}
      min={0}
      initialDegrees={v * 36}
      onChangeValue={value =>
        replaceDigit(index, Math.round((value % 360) / 36))
      }
    />
  ));
  return (
    <div>
      <input
        readOnly
        value={`${number.substr(0, 3)}-${number.substr(3)}`}
        style={{ fontSize: "40px" }}
      />
      <div style={{ display: "flex", marginTop: ".5em" }}>{wheels}</div>
    </div>
  );
};
