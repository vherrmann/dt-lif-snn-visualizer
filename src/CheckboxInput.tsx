import React, { useState } from "react";
import { Checkbox } from "@mui/material";
import { ParameterInput } from "./ParameterInput";
export function CheckboxInput({
  paramName,
  defaultValue,
  onChange,
}: {
  paramName: string;
  defaultValue: boolean;
  onChange: (checked: boolean) => void;
}) {
  const [checked, setChecked] = useState(defaultValue);

  const handlechange = (event: any) => {
    setChecked(event.target.checked);
    onChange(event.target.checked);
  };

  return (
    <ParameterInput paramName={paramName}>
      <Checkbox checked={checked} onChange={handlechange} />
    </ParameterInput>
  );
}
