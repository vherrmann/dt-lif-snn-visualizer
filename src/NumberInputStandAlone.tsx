import React from "react";
import {
  Box,
  Checkbox,
  Drawer,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { NumberInput } from "./NumberInput";
import { ParameterInput } from "./ParameterInput";
export function NumberInputStandAlone({
  paramName,
  defaultValue,
  setValue,
}: {
  paramName: string;
  defaultValue: number;
  setValue: (value: number) => void;
}) {
  return (
    <ParameterInput paramName={paramName}>
      <NumberInput defaultValue={defaultValue} setValue={setValue} />
    </ParameterInput>
  );
}
