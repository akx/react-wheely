/* eslint-disable react/no-array-index-key,react/jsx-curly-newline */
import React from "react";
import { storiesOf } from "@storybook/react";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import { Wheel } from "..";
import "./example-style.css";

const stories = storiesOf("Wheel", module);
stories.addDecorator(withInfo);
stories.addDecorator(withKnobs);

stories.add(
  "with a custom label",
  () => (
    <Wheel
      size={200}
      snap={boolean("Snap to 10 Degrees", false) ? 10 : undefined}
      min={boolean("Minimum Zero", false) ? 0 : undefined}
      max={boolean("Maximum 400", false) ? 400 : undefined}
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
  ),
  {
    info: {
      inline: true,
      text: `Also see the knobs tab below!`
    }
  }
);

stories.add("phone number input", () => {
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
});
