const canvas = document.querySelector('canvas');
const rc = rough.canvas(canvas);
const ctx = rc.ctx;

// 将画布坐标系变成以画布底边中点为原点，x轴向右，y轴向上的坐标系
ctx.translate(256, 256);
ctx.scale(1, -1);

const hillOpts = {roughness: 2.8, strokeWidth: 2, fill: 'blue'};
rc.path('M-180 0L-80 100L20 0', hillOpts);
rc.path('M-20 0L80 100L180 0', hillOpts);
rc.circle(0, 150, 105, {
  stroke: 'red', 
  strokeWidth: 4, 
  fill: 'rgba(255, 255, 0, 0.4)', 
  fillStyle: 'solid'
});
