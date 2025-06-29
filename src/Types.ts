// TODO: switch to three.js types
export type Vec2D = [number, number];

export type Point2D = Vec2D;

export type Mat2D = [number, number, number, number];

export type Conf = {
  iterations: number;
  u0: Vec2D;
  beta: number;
  b: Vec2D;
  W: Mat2D;
  V: Mat2D;
  theta: number;
  offset: Vec2D;
  scale: number;
  showBorders: boolean;
  colorWithNumSpikes: [number, number];
  colorWithSpikeTrain: [number, number];
  colorWithSpikeTrainPrev: [number, number];
};
