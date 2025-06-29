import { Conf } from "./Types";

export const baseScale: number = 3;

export const ParamSliderVals = {
  a: 0,
  b: 0,
  c: 0,
};
export const frontConf = {
  autoShowLeft: false,
  autoShowRight: false,
};

export const conf: Conf = {
  iterations: 10,
  u0: [0, 0],
  beta: 1,
  b: [0, 0],
  W: [1, 0, 0, 1],
  V: [0, 0, 0, 0],
  theta: 1,
  offset: [0, 0],
  scale: baseScale,
  showBorders: true,
  colorWithNumSpikes: [-1, -1],
  colorWithSpikeTrain: [-1, -1],
  colorWithSpikeTrainPrev: [-1, -1],
};
