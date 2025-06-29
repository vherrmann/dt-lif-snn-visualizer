import React from "react";
import { TextField } from "@mui/material";
import { ParamSliderVals } from "./Globals";
import { requestRerender } from "./Rerender";

export function NumberInput({
  defaultValue,
  setValue,
}: {
  defaultValue: number;
  step?: number;
  setValue: (value: number) => void;
}) {
  const [valueStr, setValueStr] = React.useState<string>(
    defaultValue.toString(),
  );
  const [intervalId, setIntervalId] = React.useState<number | null>(null);
  const handleInputChange = (event: any) => {
    const str = event.target.value;
    intervalId && clearInterval(intervalId);
    setValueStr(str);
    if (str === "") {
      return;
    }
    const newValue = Number(str);
    if (!isNaN(newValue)) {
      setValue(newValue);
    } else {
      try {
        const f = eval(`(x,a,b,c,sin,cos,exp) => ${str}`);
        setIntervalId(
          setInterval(() => {
            try {
              const evaluatedValue = f(
                Date.now() / 1000,
                ParamSliderVals.a,
                ParamSliderVals.b,
                ParamSliderVals.c,
                Math.sin,
                Math.cos,
                Math.exp,
              );
              if (isNaN(evaluatedValue)) {
                throw new Error("Evaluated value is NaN");
              }
              setValue(evaluatedValue);
              requestRerender();
            } catch (e) {
              intervalId && clearInterval(intervalId);
              console.error("Error evaluating expression:", e);
            }
          }, 1000 / 20),
        );
      } catch (e) {
        console.error("Invalid input:", str);
      }
    }
    requestRerender();
  };

  /* const modifyIfNum = (modifier: (x: number) => number) => {
   *   const x = Number(valueStr);
   *   if (!isNaN(x)) {
   *     const newValue = modifier(x);
   *     setValue(newValue);
   *     setValueStr(newValue.toString());
   *   }
   * }; */
  return (
    <TextField
      value={valueStr}
      onChange={handleInputChange}
      variant="standard"
    />
  );
}
