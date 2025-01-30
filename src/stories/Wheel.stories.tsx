/* eslint-disable react/prop-types */
import React from "react";
import { Wheel } from "../../lib";
import "./example-style.css";
import type { Story } from "@ladle/react";
import { Renderer, MovementMode } from "../../lib/components/Wheel/Wheel";

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
  const renderLabel: Renderer = ({ degrees, style }) => (
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

function describeDonutSlice(
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  if (Math.abs(endAngle - startAngle) >= 360) {
    const halfPath1 = describeDonutSlice(innerRadius, outerRadius, 0, 180);
    const halfPath2 = describeDonutSlice(innerRadius, outerRadius, 180, 360);
    return `${halfPath1} ${halfPath2}`;
  }
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;
  const outerStartX = outerRadius * Math.cos(startRad);
  const outerStartY = outerRadius * Math.sin(startRad);
  const outerEndX = outerRadius * Math.cos(endRad);
  const outerEndY = outerRadius * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  const outerCommands = [
    `M ${outerStartX} ${outerStartY}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
  ];
  if (innerRadius !== outerRadius) {
    const innerStartX = innerRadius * Math.cos(startRad);
    const innerStartY = innerRadius * Math.sin(startRad);
    const innerEndX = innerRadius * Math.cos(endRad);
    const innerEndY = innerRadius * Math.sin(endRad);
    return [
      ...outerCommands,
      `L ${innerEndX} ${innerEndY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
      "Z",
    ].join("");
  }
  return [...outerCommands].join("");
}

export const CircularTimer = () => {
  const [time, setTime] = React.useState(42);
  const renderWheel: Renderer = ({ degrees, style, props: { size } }) => (
    <svg style={style}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 10}
        fill="none"
        stroke="#eee"
        strokeWidth="10"
      />

      <g transform={`translate(${size / 2},${size / 2}) `}>
        <path
          d={describeDonutSlice(30, size / 2, 0, time >= 60 ? 360 : degrees)}
          fill="#d33"
        />
      </g>
    </svg>
  );
  return (
    <>
      <div
        style={{
          textAlign: "center",
          padding: "2em",
          fontFamily: "Consolas,Monaco,monospace",
          width: "10em",
          border: "1px solid #eee",
        }}
      >
        <div style={{ paddingBottom: "1em" }}>
          <div style={{ fontSize: "2em", paddingBottom: "0.25em" }}>
            {Math.floor(time)}
            <br />
            MIN
          </div>
          SETUP TIME
        </div>
        <Wheel
          classNamePrefix="timer-wheel-"
          size={150}
          min={0}
          max={360}
          initialDegrees={time * 6}
          onChangeValue={(value) => setTime(value / 6)}
          renderWheel={renderWheel}
        />
      </div>
      <p>
        h/t, inspired by{" "}
        <a href="https://x.com/boredpxnda/status/1884668748331659631">
          boredpxnda
        </a>
      </p>
    </>
  );
  //
};
