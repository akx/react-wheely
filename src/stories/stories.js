import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { withInfo } from "@storybook/addon-info";
import { action } from "@storybook/addon-actions";
import { Wheel } from "..";
import "./example-style.css";

const stories = storiesOf("Wheel", module);
stories.addDecorator(withInfo);
stories.addParameters({
  info: {
    inline: true,
    text: `Also see the knobs tab below!`
  }
});
stories.addDecorator(withKnobs);

stories.add("with a custom label", () => (
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
));
