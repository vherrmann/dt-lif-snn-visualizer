import React from "react";
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
