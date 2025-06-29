import React from "react";
import { Grid } from "@mui/material";
import { ParameterInput } from "./ParameterInput";
import { NumberInput } from "./NumberInput";
import { Vec2D } from "./Types";

export function Vec2DInput({
  paramName,
  defaultValue,
  setValue,
}: {
  paramName: string;
  defaultValue: Vec2D;
  setValue: (index: number, value: number) => void;
}) {
  return (
    <ParameterInput paramName={paramName}>
      <Grid
        container
        sx={{ px: 2 }}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid size={12}>
          <NumberInput
            defaultValue={defaultValue[0]}
            setValue={(v) => setValue(0, v)}
          />
        </Grid>
        <Grid size={12}>
          <NumberInput
            defaultValue={defaultValue[1]}
            setValue={(v) => setValue(1, v)}
          />
        </Grid>
      </Grid>
    </ParameterInput>
  );
}
