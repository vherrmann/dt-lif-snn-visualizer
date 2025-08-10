export function posToUV(pos: Point2D, conf: Conf): Point2D {
  const minSize = Math.min(window.innerWidth, window.innerHeight);
  const uv: Point2D = [
    conf.scale * (pos[0] / minSize - 0.5) + conf.offset[0],
    conf.scale * (pos[1] / minSize - 0.5) + conf.offset[1],
  ];
  return uv;
}

export const clientCordConv = (
  clientX: number,
  clientY: number,
  conf: Conf,
) => {
  return posToUV([clientX, window.innerHeight - clientY - 1], conf);
};

export function firstLayer(x: Point2D, conf: Conf) {
  let u: [number, number] = conf.u0.slice() as Vec2D;
  let s: [number, number] = [0, 0];
  let spiketr: [string, string] = ["", ""];

  const beta = conf.beta;
  const b = conf.b;
  const theta = conf.theta;
  const W = conf.W;
  const V = conf.V;
  const xWb = [
    W[0] * x[0] + W[2] * x[1] + b[0],
    W[1] * x[0] + W[3] * x[1] + b[1],
  ];
  for (let i = 0; i < conf.iterations; i++) {
    const prevS = s.slice() as Vec2D;
    for (let j = 0; j < 2; j++) {
      u[j] =
        beta * u[j] +
        xWb[j] +
        (V[j] * prevS[0] + V[j + 2] * prevS[1]) -
        theta * prevS[j];
      s[j] = u[j] >= theta ? 1 : 0;

      spiketr[j] = spiketr[j] + (s[j] === 1 ? "1" : "0");
    }
  }

  return [u, spiketr];
}

export function countChar(str: string, char: string): number {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      count++;
    }
  }
  return count;
}
