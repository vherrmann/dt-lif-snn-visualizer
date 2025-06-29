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
    ivec2 colorWithNumSpikes;
    ivec2 colorWithSpikeTrain;
    ivec2 colorWithSpikeTrainPrev;
};

uniform vec2 iResolution;
uniform SNNConfig conf;

uint[4] first_layer(vec2 x, SNNConfig conf)
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
    return uint[4](spiketrLow.x, spiketrUp.x, spiketrLow.y, spiketrUp.y);
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

vec4 uint2colBorder(vec2 fragCoord, uint[4] res, SNNConfig conf)
{
    vec2 aBitRightPos = posToUV(fragCoord.xy+vec2(1,0), conf);
    vec2 aBitUpPos    = posToUV(fragCoord.xy+vec2(0,1), conf);
    uint[4] aBitRight = first_layer(aBitRightPos, conf);
    uint[4] aBitUp = first_layer(aBitUpPos, conf);
    if (res != aBitRight || res != aBitUp) {
        return vec4(1.0); // white
    } else {
        return uint2col(res, conf.iterations);
    }
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = posToUV(fragCoord.xy, conf);
    uint index = uint(fragCoord.x + fragCoord.y * iResolution.x);

    uint[4] res = first_layer(uv, conf);

    if (conf.showBorders) {
        fragColor = uint2colBorder(fragCoord, res, conf);
    } else {
        fragColor = uint2col(res, conf.iterations);
    }

    if ((int(bitCount(res[0]) + bitCount(res[1])) == conf.colorWithNumSpikes.x) ||
        (int(bitCount(res[1]) + bitCount(res[2])) == conf.colorWithNumSpikes.y)) {
        fragColor.z = 0.5;
    }

    if ((res[1]==0u && (int(res[0] >> 1)) == conf.colorWithSpikeTrainPrev[0]) ||
        (res[3]==0u && (int(res[2] >> 1)) == conf.colorWithSpikeTrainPrev[1])) {
        fragColor.z = 0.75;
    }

    // the higher bytes as well as the highest bit of the lower bytes have to be zero
    if ((res[1]==0u && ((res[0] & 0x80000000u) != 1u) && int(res[0]) == conf.colorWithSpikeTrain[0]) ||
        (res[3]==0u && ((res[2] & 0x80000000u) != 1u) && int(res[2]) == conf.colorWithSpikeTrain[1])) {
        fragColor.z = 1.;
    }
}

void main()
{
    vec2 fragCoord = gl_FragCoord.xy;
    vec4 fragColor;
    mainImage(fragColor, fragCoord);
    gl_FragColor = fragColor;
}
