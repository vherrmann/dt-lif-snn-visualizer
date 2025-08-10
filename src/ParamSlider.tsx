import React, { useCallback, useState } from "react";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";
import { ParameterInput } from "./ParameterInput";
import { requestRerender } from "./Rerender";

export function ParamSlider({
  paramName,
  defaultValue,
  min,
  max,
  step = 0.01,
  setValue,
  transformValue = (v: number) => v,
}: {
  paramName: string;
  defaultValue: number;
  min: number;
  max: number;
  step?: number;
  setValue: (value: number) => void;
  transformValue?: (v: number) => number;
}) {
  const [value, setValueIntern] = useState(defaultValue);
  const handleChange = useCallback(
    (_: Event, newValue: number) => {
      const transformedValue = transformValue(newValue);
      setValue(transformedValue);
      setValueIntern(transformedValue);
      requestRerender();
    },
    [setValue, setValueIntern, transformValue],
  );
  return (
    <ParameterInput paramName={paramName}>
      <Slider
        size="small"
        sx={{
          px: 1,
          py: 2,
        }}
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        onChange={handleChange}
      />
      <Typography variant="h6" sx={{ flexGrow: 1, px: 2 }}>
        {value.toFixed(2)}
      </Typography>
    </ParameterInput>
  );
}
