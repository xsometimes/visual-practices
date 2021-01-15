import Vector2d from '../../assets/js/vector2d.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.translate(0, canvas.height);
ctx.scale(1, -1);
ctx.lineCap = 'round';

drawBranch(ctx, new Vector2d(256, 0), 50, 8, 0.5 * Math.PI, 3);

/**
 * 
 * @param {any} context canvas 2d上下文
 * @param {Array} v0 起始向量
 * @param {Number} length 当前树枝的长度
 * @param {Number} thickness 当前树枝的粗细
 * @param {*} dir 当前树枝的方向，用与x轴的夹角表示，单位是弧度
 * @param {*} bias 随机偏向因子
 */
function drawBranch (context, v0, length, thickness, dir, bias) {
  // 1）创建一个单位向量(1, 0)，它是一个朝向x轴，长度为1的向量，然后我们旋转dir弧度，再乘以树枝长度length，这样我们就能计算出树枝的终点坐标
  const v = new Vector2d(1, 0).rotate(dir).scale(length);
  const v1 = v0.copy().add(v);

  context.lineWidth = thickness;
  context.beginPath();
  context.moveTo(...v0);
  context.lineTo(...v1);
  context.stroke();


  // 2）我们可以从一个起始角度开始递归地旋转树枝，每次将树枝分叉成左右两个分支
  if(thickness > 2) {
    // const left = dir + 0.2
    const left = (dir + 0.2) * 0.5 + Math.PI / 4 + bias * (Math.random() - 0.5); // 在上面注释语句的基础上，加入随机因子，让迭代生成的新树枝有一个随机的偏转角度。
    drawBranch(context, v1, length * 0.9, thickness * 0.8, left, bias * 0.9);
    const right = (dir - 0.2) * 0.5 + Math.PI / 4 + bias * (Math.random() - 0.5);
    drawBranch(context, v1, length * 0.9, thickness * 0.8, right, bias * 0.9);
  }

  // 3）再随机绘制一些花瓣
  if(thickness < 5 && Math.random() < 0.3) {
    context.save();
    context.strokeStyle = '#c72c35';
    const th = Math.random() * 6 + 3;
    context.lineWidth = th;
    context.beginPath();
    context.moveTo(...v1);
    context.lineTo(v1.x, v1.y - 2);
    context.stroke();
    context.restore();
  }
}
