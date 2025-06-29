import React from "react";
import { Grid } from "@mui/material";
import { Mat2D } from "./Types";
import { ParameterInput } from "./ParameterInput";
import { NumberInput } from "./NumberInput";

export function Mat2DInput({
  paramName,
  defaultValue,
  setValue,
}: {
  paramName: string;
  defaultValue: Mat2D;
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
        <Grid size={6}>
          <NumberInput
            defaultValue={defaultValue[0]}
            setValue={(v) => setValue(0, v)}
          />
        </Grid>
        <Grid size={6}>
          <NumberInput
            defaultValue={defaultValue[2]}
            setValue={(v) => setValue(2, v)}
          />
        </Grid>
        <Grid size={6}>
          <NumberInput
            defaultValue={defaultValue[1]}
            setValue={(v) => setValue(1, v)}
          />
        </Grid>
        <Grid size={6}>
          <NumberInput
            defaultValue={defaultValue[3]}
            setValue={(v) => setValue(3, v)}
          />
        </Grid>
      </Grid>
    </ParameterInput>
  );
}
