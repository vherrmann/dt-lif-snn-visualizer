struct SNNConfig {
    int iterations;
    vec2 u0;
    float beta;
    mat2 W;
    vec2 b;
    mat2 V;
    float theta;
    vec2 offset;
    float scale;
    bool showBorders;
    bool autoShowPrev;
    ivec2 colorWithNumSpikes;
    // ivec2 colorWithNumSpikesPrev;
    ivec2 colorWithSpikeTrain;
    // ivec2 colorWithSpikeTrainPrev;
};

uniform vec2 iResolution;
uniform SNNConfig conf;

uint[4] shiftRightST(uint[4] st, int n)
{
    uint[4] stRest = st;
    if (n <= 0) {
        return stRest;
    } else if (n <= 32) {
        stRest[0] = (stRest[0] >> n) | (stRest[1] << (32 -n));
        stRest[1] = (stRest[1] >> n);
        stRest[2] = (stRest[2] >> n) | (stRest[3] << (32 -n));
        stRest[3] = (stRest[3] >> n);
    } else if (n <= 64) {
        stRest[0] = stRest[1] >> (n - 32);
        stRest[1] = 0u;
        stRest[2] = stRest[3] >> (n - 32);
        stRest[3] = 0u;
    } else {
        stRest = uint[4](0u, 0u, 0u, 0u);
    }
    return stRest;
}

struct LayerRes
{
  uint[4] spikeTrain;
  vec2 uRes;
};


LayerRes first_layer(vec2 x, SNNConfig conf)
{
    vec2 u = conf.u0;
    uvec2 s = uvec2(0,0);
    uvec2 spiketrLow = uvec2(0,0);
    uvec2 spiketrUp = uvec2(0,0);
    for (int i = 0; i < conf.iterations; ++i) {
        u = conf.beta * u + conf.W * x + conf.b + conf.V * vec2(s) - conf.theta * vec2(s);
        s = uvec2(step(conf.theta,u));
        spiketrUp = (spiketrUp << 1) + (spiketrLow >> 31);
        spiketrLow = (spiketrLow << 1) + s;
    }
    return LayerRes(uint[4](spiketrLow.x, spiketrUp.x, spiketrLow.y, spiketrUp.y), u);
}

vec2 posToUV(vec2 pos, SNNConfig conf)
{
    float resMin = min(iResolution.x, iResolution.y);
    vec2 nuv = pos/resMin- vec2(0.5);
    return conf.scale*nuv+conf.offset;
}

uint bitCount(uint x) {
    uint count = 0u;
    for (int i = 0; i < 32; ++i) {
        count += (x >> uint(i)) & uint(1);
    }
    return count;
}

float uint2colScal(uint high, uint low, int iterations)
{
    float n = 10.;
    float x = float(high) * pow(2., 32.) + float(low);
    float a = ((1. / n) * log(1. + (exp(n) - 1.) * x / pow(2., float(iterations))));
    return a;
}

vec4 uint2col(uint[4] res, int iterations)
{
    return vec4(uint2colScal(res[1], res[0], iterations),
                uint2colScal(res[3], res[2], iterations),
                0.0, 1.0);
}

bool[2] newestSpikes(uint[4] res) {
    return bool[2]((res[0] & 1u) == 1u, (res[2] & 1u) == 1u);
}

bool vec2smallerEQ(vec2 a, vec2 b) {
    return (a.x <= b.x) && (a.y <= b.y);
}

float Rto01(float x) {
    return atan((x-1.)*2.)*(1./3.15) + 0.5; // atan((x - 0.5)*3)/pi + 0.5
}

float Rto01Norm(float x) {
    return atan((x-.5)*3.)*(1./3.15) + 0.5; // atan((x - 0.5)*3)/pi + 0.5
}

vec4 colU(LayerRes res, float blue) {
        return vec4(Rto01(res.uRes.x), Rto01(res.uRes.y), blue, 1.0);
}

// we remove the last spike (like in the original model)
vec4 colUNorm(LayerRes res, float blue) {
        return vec4(Rto01Norm(res.uRes.x-float(res.spikeTrain[0] & 1u)),
                    Rto01Norm(res.uRes.y-float(res.spikeTrain[2] & 1u)),
                    blue,
                    1.0);
}

vec4 uint2colBorder(vec2 fragCoord, LayerRes res, SNNConfig conf)
{
    vec2 aBitRightPos = posToUV(fragCoord.xy+vec2(1,0), conf);
    vec2 aBitUpPos    = posToUV(fragCoord.xy+vec2(0,1), conf);
    LayerRes aBitRightRes = first_layer(aBitRightPos, conf);
    LayerRes aBitUpRes = first_layer(aBitUpPos, conf);
    uint[4] aBitRightSt = aBitRightRes.spikeTrain;
    uint[4] aBitUpSt = aBitUpRes.spikeTrain;
    uint[4] st = res.spikeTrain;
    if ((!vec2smallerEQ(res.uRes, aBitRightRes.uRes)) || (!vec2smallerEQ(res.uRes, aBitUpRes.uRes))) {
        return colUNorm(res, 1.0);
    } else if (st != aBitRightSt || st != aBitUpSt) {
        uint[4] aBitRightRest = aBitRightSt;
        uint[4] aBitUpRest = aBitUpSt;
        uint[4] resRest = st;
        for (int i = 0; i < 64; ++i) {
            if ((newestSpikes(aBitRightRest) != newestSpikes(resRest))
                || (newestSpikes(aBitUpRest) != newestSpikes(resRest))) {
                // if ((aBitRightRest == resRest) && (aBitUpRest == resRest)) {
                if (i == 0) {
                    if (shiftRightST(aBitRightRest, 1) == shiftRightST(resRest, 1) &&
                        shiftRightST(aBitUpRest, 1) == shiftRightST(resRest,1)) {
                        return vec4(1.0);
                    }
                    return vec4(vec3(0.6), 1.0); // gray
                } else {
                    return vec4(vec2(0.5-0.5*sin(float(i)), 0.5+0.5*sin(float(i)))/pow(float(i+1), 0.2),1.0,1.0);
                    // return vec4(0.0, 0.5-0.5*sin(float(fragCoord.x+fragCoord.y)/30.*float(i)) ,0.5+0.5*sin(float(fragCoord.x+fragCoord.y)/30.*float(i)), 1.0);
                    // return vec4(vec3(1.0)/sqrt(float(i+1)), 1.0);
                    // return vec4(vec3(0.5)+0.5*sin(vec3(0.3,0.6,1.0)*3.14+vec3(float(uv.x+uv.y)*float(i))), 1.0);
                }
            }

            aBitRightRest = shiftRightST(aBitRightRest, 1);
            aBitUpRest = shiftRightST(aBitUpRest, 1);
            resRest = shiftRightST(resRest, 1);
        }
        return vec4(1.0, 0.0, 1.0, 1.0); // shouldn't be reached (set to purple as alert)
    } else {
        return colUNorm(res, 0.0);
        // return uint2col(st, conf.iterations);
    }
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = posToUV(fragCoord.xy, conf);
    uint index = uint(fragCoord.x + fragCoord.y * iResolution.x);

    LayerRes res = first_layer(uv, conf);
    uint[4] st = res.spikeTrain;

    if (conf.showBorders) {
        fragColor = uint2colBorder(fragCoord, res, conf);
    } else {
        fragColor = colUNorm(res, 0.0);
        // fragColor = uint2col(st, conf.iterations);
    }

    // if ((int(bitCount(st[0] >> 1) + bitCount(st[1])) == conf.colorWithNumSpikesPrev.x) ||
    //     (int(bitCount(st[2] >> 1) + bitCount(st[3])) == conf.colorWithNumSpikesPrev.y)) {
    //     fragColor.z = 0.4;
    // }

    uint shiftN = conf.autoShowPrev ? 1u : 0u;

    if ((conf.colorWithNumSpikes[0] != -1 &&
         (bitCount(st[0] >> shiftN) + bitCount(st[1])) == bitCount(uint(conf.colorWithSpikeTrain[0]) >> shiftN)) ||
        (conf.colorWithNumSpikes[1] != -1 &&
         (bitCount(st[2] >> shiftN) + bitCount(st[3])) == bitCount(uint(conf.colorWithSpikeTrain[1]) >> shiftN))) {
        fragColor.z = 0.4;
    }

    if ((conf.colorWithNumSpikes[0] != -1 &&
         (bitCount(st[0] >> shiftN) + bitCount(st[1])) == bitCount(uint(conf.colorWithSpikeTrain[0]) >> shiftN)) &&
        (conf.colorWithNumSpikes[1] != -1 &&
         (bitCount(st[2] >> shiftN) + bitCount(st[3])) == bitCount(uint(conf.colorWithSpikeTrain[1]) >> shiftN))) {
        fragColor.z = 0.8;
    }

    // if ((st[1]==0u && (int(st[0] >> 1)) == conf.colorWithSpikeTrainPrev[0]) ||
    //     (st[3]==0u && (int(st[2] >> 1)) == conf.colorWithSpikeTrainPrev[1])) {
    //     fragColor.z = 0.75;
    // }

    // if ((st[1]==0u && ((st[0] & 0x80000000u) != 1u) && int(st[0] >> 1) == (conf.colorWithSpikeTrain[0] >> 1)) ||
    //     (st[3]==0u && ((st[2] & 0x80000000u) != 1u) && int(st[2] >> 1) == (conf.colorWithSpikeTrain[1] >> 1))) {
    //     fragColor.z = .85;
    // }

    // if ((st[1]==0u && ((st[0] & 0x80000000u) != 1u) && int(st[0]) == (conf.colorWithSpikeTrain[0])) ||
    //     (st[3]==0u && ((st[2] & 0x80000000u) != 1u) && int(st[2]) == (conf.colorWithSpikeTrain[1]))) {
    //     fragColor.z = 1.;
    // }
}

void main()
{
    vec2 fragCoord = gl_FragCoord.xy;
    vec4 fragColor;
    mainImage(fragColor, fragCoord);
    gl_FragColor = fragColor;
}
