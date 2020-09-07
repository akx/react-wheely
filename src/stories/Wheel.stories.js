/* eslint-disable react/no-array-index-key,react/jsx-curly-newline,react/jsx-props-no-spreading */
import React from "react";
import { action } from "@storybook/addon-actions";
import { Wheel } from "..";
import "./example-style.css";

export default {
  title: 'Wheel',
  component: Wheel,
};

export const withACustomLabel = ({ snap10, min0, max400, movementMode, ...props }) => (
  <Wheel
    size={200}
    snap={snap10 ? 10 : undefined}
    min={min0 ? 0 : undefined}
    max={max400 ? 400 : undefined}
    movementMode={movementMode}
    {...props}
    initialDegrees={42}
    onBeginChange={action("beginChange")}
    onChangeValue={action("changeValue", { limit: 5 })}
    onCommitValue={action("commitValue")}
    renderLabel={({ degrees, style, changing }) => (
      <div className="my-wheel-label" style={style}>
        {degrees.toFixed(2)}
        {changing ? "..." : ""}
      </div>
    )}
  />
);
withACustomLabel.args = {
  snap10: false,
  min0: false,
  max400: false,
  movementMode: 'circular',
};
withACustomLabel.argTypes = {
  movementMode: {
    control: {
      type: 'inline-radio',
      options: ['circular', 'horizontal', 'vertical'],
    },
  },
  snap10: {
    name: "Snap to 10 Degrees",
  },
  min0: {
    name: "Minimum Zero",
  },
  max400: {
    name: "Maximum 400",
  },
  size: {
    control: {
      type: 'range',
      min: 90,
      max: 1000,
    },
  },
};


export const phoneNumberInput = () => {
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
