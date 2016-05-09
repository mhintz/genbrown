var Window          = require('pex-sys/Window');
var glslify         = require('glslify-promise');
var createCube = require('primitive-cube');
var chroma = require('chroma-js');
var makeQuad = require('./quad');
var range = require('range').range;
var KeyboardEvent = require('pex-sys/KeyboardEvent');

var browns = [
  '48240a',
  '311907'
];

var NUM_RECTS = 10;

function rand(lo, hi) {
  return lo + (Math.random() * (hi - lo));
}

function randPosNeg(bnd) {
  return -bnd + (Math.random() * 2 * bnd);
}

function getBrown() {
  return randSample(browns[0], browns[1], 'hsl');
}

function fmt(num) {
  return num < 0 ? String(num) : '+' + num;
}

function randOffset(color, r, g, b) {
  return color.set('rgb.r', fmt(randPosNeg(r)))
    .set('rgb.g', fmt(randPosNeg(g)))
    .set('rgb.b', fmt(randPosNeg(b)));
}

function randSample(colA, colB, mode) {
  mode = mode || 'rgb';
  return chroma.scale([colA, colB]).mode(mode)(Math.random());
}

function composeBrown() {
  var redval = rand(25, 70);
  var ratioGrn = rand(1.45, 1.65);
  var ratioBlu = rand(3.0, 3.4);
  return chroma(redval, redval / ratioGrn, redval / ratioBlu);
}

function hslRngBrown() {
  var h = rand(30, 35);
  var s = rand(.78, 1);
  var v = rand(.15, .25);
  return chroma(h, s, v, 'hsv');
}

function genQuads(ctx, num) {
  var side = 2 / num;
  return range(num).map(function(i) {
    var quad = makeQuad(-1 + side * i, -1, side, 2);
    // var color = randOffset(chroma('48240a'), 6, 3, 4);
    // var color = getBrown();
    // var color = composeBrown();
    var color = hslRngBrown();
    var mesh = ctx.createMesh([
      { data: quad.positions, location: ctx.ATTRIB_POSITION },
      { data: quad.normals, location: ctx.ATTRIB_NORMAL },
      { data: range(4).map(function() { return color.gl() }), location: ctx.ATTRIB_COLOR }
    ], {
      data: quad.cells, usage: ctx.STATIC_DRAW
    }, ctx.TRIANGLES);
    return mesh;
  });
}

Window.create({
    settings: {
        width:  1280,
        height: 720,
        fullScreen: true
    },
    resources: {
        passThroughVert: { glsl: glslify(__dirname + '/assets/passthrough.vert') },
        passThroughFrag: { glsl: glslify(__dirname + '/assets/passthrough.frag') },
    },
    init: function() {
        var ctx = this.getContext();
        var res = this.getResources();

        this.passThroughProgram = ctx.createProgram(res.passThroughVert, res.passThroughFrag);
        ctx.bindProgram(this.passThroughProgram);

        this.hotpink = chroma('ff85a2').gl();

        this.quads = genQuads(ctx, NUM_RECTS);
    },
    updateQuads: function() {
      this.quads = genQuads(this.getContext(), NUM_RECTS);
    },
    onKeyDown: function(e) {
      switch (e.keyCode) {
        case KeyboardEvent.VK_SPACE: this.updateQuads(); break;
      }
    },
    draw: function() {
        var ctx = this.getContext();

        ctx.setClearColor(this.hotpink[0], this.hotpink[1], this.hotpink[2], 1);
        ctx.clear(ctx.COLOR_BIT | ctx.DEPTH_BIT);
        ctx.setDepthTest(true);

        ctx.bindProgram(this.passThroughProgram);

        for (var i = 0; i < this.quads.length; i++) {
          ctx.bindMesh(this.quads[i]);
          ctx.drawMesh();
        }
    }
})
