import React from "react";
import { Stack, Typography } from "@mui/material";

export function ParameterInput({
  paramName,
  children,
}: {
  paramName: string;
  children: React.ReactNode;
}) {
  return (
    <Stack
      spacing={2}
      direction="row"
      sx={{ alignItems: "center", mb: 1, p: 1 }}
    >
      <Typography variant="h6" sx={{ px: 2 }}>
        {paramName}
      </Typography>
      {children}
    </Stack>
  );
}
