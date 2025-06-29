import React from "react";
import ReactDOM from "react-dom/client";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ParamSlider } from "./ParamSlider";
import { conf, frontConf, ParamSliderVals } from "./Globals";
import { NumberInputStandAlone } from "./NumberInputStandAlone";
import { Mat2DInput } from "./Mat2DInput";
import { Vec2DInput } from "./Vec2DInput";
import { requestRerender } from "./Rerender";
import { CheckboxInput } from "./CheckboxInput";

export function Menu() {
  const [open, setOpen] = React.useState(false);
  const drawerWidth = "20vw";

  const handleDrawerFlip = () => {
    setOpen((b) => !b);
  };

  return (
    <Box>
      <IconButton
        color="inherit"
        onClick={handleDrawerFlip}
        edge="start"
        sx={[
          {
            position: "absolute",
            top: 10,
            mr: 2,
            right: open ? drawerWidth : 0,
            transition: "right 0.2s",
            zIndex: 1201, // above Drawer zIndex (default is 1200)
          },
        ]}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Typography variant="h5" sx={{ p: 2 }}>
          Parameters
        </Typography>
        <ParamSlider
          paramName="a"
          defaultValue={ParamSliderVals.a}
          min={0}
          max={1}
          step={0.01}
          setValue={(x) => (ParamSliderVals.a = x)}
        />
        <ParamSlider
          paramName="b"
          defaultValue={ParamSliderVals.b}
          min={0}
          max={1}
          step={0.01}
          setValue={(x) => (ParamSliderVals.b = x)}
        />
        <ParamSlider
          paramName="c"
          defaultValue={ParamSliderVals.c}
          min={0}
          max={1}
          step={0.01}
          setValue={(x) => (ParamSliderVals.c = x)}
        />
        <NumberInputStandAlone
          paramName="T"
          defaultValue={conf.iterations}
          setValue={(x) => (conf.iterations = Math.floor(x))}
        />
        <NumberInputStandAlone
          paramName="β"
          defaultValue={conf.beta}
          setValue={(x) => (conf.beta = x)}
        />
        <NumberInputStandAlone
          paramName="ϑ"
          defaultValue={conf.theta}
          setValue={(x) => (conf.theta = x)}
        />
        <Mat2DInput
          paramName="W"
          defaultValue={conf.W}
          setValue={(i, v) => (conf.W[i] = v)}
        />
        <Vec2DInput
          paramName="b"
          defaultValue={conf.b}
          setValue={(i, v) => (conf.b[i] = v)}
        />
        <Vec2DInput
          paramName="u(0)"
          defaultValue={conf.u0}
          setValue={(i, v) => (conf.u0[i] = v)}
        />
        <Mat2DInput
          paramName="V"
          defaultValue={conf.V}
          setValue={(i, v) => (conf.V[i] = v)}
        />
        <CheckboxInput
          paramName="Show borders"
          defaultValue={conf.showBorders}
          onChange={(c) => {
            conf.showBorders = c;
            requestRerender();
          }}
        />
        <CheckboxInput
          paramName="Auto show left"
          defaultValue={frontConf.autoShowLeft}
          onChange={(c) => {
            if (!c && frontConf.autoShowLeft) {
              conf.colorWithNumSpikes[0] = -1;
              conf.colorWithSpikeTrain[0] = -1;
              requestRerender();
            }
            frontConf.autoShowLeft = c;
          }}
        />
        <CheckboxInput
          paramName="Auto show right"
          defaultValue={frontConf.autoShowRight}
          onChange={(c) => {
            if (!c && frontConf.autoShowRight) {
              conf.colorWithNumSpikes[1] = -1;
              conf.colorWithSpikeTrain[1] = -1;
              requestRerender();
            }
            frontConf.autoShowRight = c;
          }}
        />
        <Vec2DInput
          paramName="CWNS"
          defaultValue={conf.colorWithNumSpikes}
          setValue={(i, v) => (conf.colorWithNumSpikes[i] = v)}
        />
        <Vec2DInput
          paramName="CWST"
          defaultValue={conf.colorWithSpikeTrain}
          setValue={(i, v) => (conf.colorWithSpikeTrain[i] = v)}
        />
        <Vec2DInput
          paramName="CWSTPREV"
          defaultValue={conf.colorWithSpikeTrainPrev}
          setValue={(i, v) => (conf.colorWithSpikeTrainPrev[i] = v)}
        />
      </Drawer>
    </Box>
  );
}

export function initMenu() {
  ReactDOM.createRoot(document.getElementById("menu")).render(
    <React.StrictMode>
      <Menu />
    </React.StrictMode>,
  );
}
