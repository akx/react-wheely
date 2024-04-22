/* eslint-disable react/function-component-definition,jsx-a11y/control-has-associated-label */
import React from "react";
import { Wheel } from "../../lib";
import "./example-style.css";
import type { Story } from "@ladle/react";
import { LabelRenderer, MovementMode } from "../../lib/components/Wheel/Wheel";

export default {
  title: "Wheel",
  component: Wheel,
};

export const WithACustomLabel: Story<{
  snap10: boolean;
  movementMode: MovementMode;
  min0: boolean;
  max400: boolean;
}> = ({ snap10, min0, max400, movementMode }) => (
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
WithACustomLabel.args = {
  snap10: false,
  min0: false,
  max400: false,
  movementMode: "circular",
};
WithACustomLabel.argTypes = {
  movementMode: {
    options: ["circular", "horizontal", "vertical"],
    control: { type: "radio" },
    defaultValue: "circular",
  },
  // TODO: for some reason, these break with with Ladle
  // snap10: {
  //   description: "Snap to 10 Degrees",
  // },
  // min0: {
  //   description: "Minimum Zero",
  // },
  // max400: {
  //   description: "Maximum 400",
  // },
  // size: {
  //   control: {
  //     type: "range",
  //     min: 90,
  //     max: 1000,
  //   },
  // },
};

export const PhoneNumberInput = () => {
  const [number, setNumber] = React.useState("0000000");
  const replaceDigit = (index: number, digit: number) => {
    const digitArray = Array.from(number);
    digitArray.splice(index, 1, `${Math.min(digit, 9)}`);
    setNumber(digitArray.join(""));
  };
  const wheels = Array.from(number).map((v, index) => (
    <Wheel
      // eslint-disable-next-line react/no-array-index-key
      key={index}
      size={70}
      min={0}
      initialDegrees={+v * 36}
      onChangeValue={(value) =>
        replaceDigit(index, Math.round((value % 360) / 36))
      }
    />
  ));
  return (
    <div>
      <input
        readOnly
        value={`${number.substring(0, 3)}-${number.substring(3)}`}
        style={{ fontSize: "40px" }}
      />
      <div style={{ display: "flex", marginTop: ".5em" }}>{wheels}</div>
    </div>
  );
};

export const InfuriatingRangeInput = () => {
  const minPage = 1;
  const maxPage = 100;
  const [min, setMin] = React.useState(minPage);
  const [max, setMax] = React.useState(Math.floor(maxPage / 2));
  const degPerPage = 10;
  const renderLabel: LabelRenderer = ({ degrees, style }) => (
    <div className="my-wheel-label" style={style}>
      {Math.floor(degrees / degPerPage)}
    </div>
  );
  return (
    <table>
      <tr>
        <td>
          <Wheel
            size={150}
            min={minPage * degPerPage}
            max={max * degPerPage}
            initialDegrees={min * degPerPage}
            renderLabel={renderLabel}
            onChangeValue={(value) => setMin(Math.floor(value / degPerPage))}
          />
        </td>
        <td>
          {" "}
          <Wheel
            size={150}
            min={min * degPerPage}
            max={maxPage * degPerPage}
            initialDegrees={max * degPerPage}
            renderLabel={renderLabel}
            onChangeValue={(value) => setMax(Math.floor(value / degPerPage))}
          />
        </td>
      </tr>
      <tr>
        <td colSpan={2} style={{ textAlign: "center" }}>
          Print pages: {min}
          {" to "}
          {max}
          {" / "}
          {maxPage}
          <br />
          Print capacity: <progress max={maxPage} value={max - min + 1} />
        </td>
      </tr>
    </table>
  );
};
