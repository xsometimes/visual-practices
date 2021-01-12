import { throttle } from '../../assets/js/throttle-debounce.js';
const dataSource = 'https://s5.ssl.qhres.com/static/b0695e2dd30daa64.json';

(async function () {
  const data = await (await fetch(dataSource)).json();
  
  /**
   * 第一步
   * 我们需要数据中的x、y、r，这些数值可以通过调用d3.hierarchy帮我们算出来
   */
  const regions = d3.hierarchy(data).sum(d => 1).sort((a, b) => b.value - a.value) // 将省份数据按照包含城市的数量从多到少排序
  const pack = d3.pack().size([600, 600]).padding(2); // 通过d3.pack()将数据映射为一组1600宽高范围内的圆形，且为了美观，在每个相邻的圆之间保留3个像素的padding
  const root  = pack(regions)
  /**
   * 第二步
   * 遍历数据并且根据数据内容绘制圆弧
   * 1）绘制圆；2）如果这个数据节点有下一层数据，我们遍历它的下一级数据，然后递归地对这些数据调用绘图过程。
   */
  const TAU = 2 * Math.PI;
  const colors = ['bisque', 'dimgrey', 'chartreuse', 'cadetblue', 'blueviolet', 'aquamarine', 'aqua', 'darkblue'];
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');

  // 函数签名、函数的参数解构；函数调用举例：draw(context, el, {fillStyle: 'red', textColor: 'black'})这样的写法考虑到代码维护层面，传参很明显
  function drawCircle(ctx, node, { fillStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'white' } = {}) {
    const children = node.children;
    const { x, y, r } = node;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    if (children) {
      for (let i = 0; i < children.length; i++) {
        drawCircle(ctx, children[i]);
      }
    } else {
      const name = node.data.name;
      ctx.fillStyle = textColor;
      ctx.font = '0.8rem Arial';
      ctx.textAlign = 'center';
      ctx.fillText(name, x, y);
    }
  }

  function drawCircleByStatus (status, node) {
    switch (status) {
      case 'normal':
        drawCircle(context, node);
        break
      case 'hover':
        const l = Math.floor(Math.random() * colors.length);
        drawCircle(context, node, { fillStyle: colors[l]})
        break
      default: break
    }
  }

  /**
   * 拓展一、画五角星：定下10个顶点的坐标 -> 分别求内圆、外圆上一个顶点的坐标，其他4个顶点的角度+72度的倍数
   */
  function drawStar (ctx, node,  { strokeStyle = 'rgba(0, 0, 0, 0.2)', textColor = 'rgba(0, 0, 0, 0.2)' } = {}) {
    const children = node.children;
    const { x, y, r } = node;
    const R = 1.5 * r;
    const innerRadius = r;
    const outerRadius = innerRadius + 10;
    ctx.beginPath();
    ctx.strokeStyle = strokeStyle;
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((18 + 72 * i) / 180 * Math.PI)  * outerRadius + x, y + Math.sin((18 + 72 * i) / 180 * Math.PI) * outerRadius)
      ctx.lineTo(Math.cos((54 + 72 * i) / 180 * Math.PI) * innerRadius + x, y + Math.sin((54 + 72 * i) / 180 * Math.PI) * innerRadius)
    }
    ctx.closePath();
    ctx.stroke();
    if (children) {
      for (let j = 0; j < children.length; j++) {
        drawStar(ctx, children[j])
      }
    } else {
      const name = node.data.name;
      ctx.fillStyle = textColor;
      ctx.font = '0.8rem Arial';
      ctx.textAlign = 'center';
      ctx.fillText(name, x, y);
    }
  }

  drawCircleByStatus('normal', root);
  // drawStar(context, root);

  /**
   * 拓展二、给前面绘制的层次关系图增加鼠标的交互，让鼠标指针在移动到某个城市所属的圆的时候，这个圆显示不同的颜色
   * 1.storage：存储遍历的城市的圆点
   * 2. 遍历城市节点，若鼠标点击在某个城市范围内，该区域重新绘制
   * 3. 优化：防抖 + 判断是同个圆点，则不响应绘制
   */

  const storage = []; //  存储每个圆的节点信息，x、y的取值范围
  let lastNodeId = '-1';

  root.each(node => {
    node.id = `${node.depth}-${node.value}-${node.x}-${node.y}-${Math.random()*1000}`
    if (node.depth === 2) {
      storage.push(node)
    }
  })

  /**
   * 获取当前鼠标位置所在的node，判断点是否在node内
   * 对待圆：鼠标点击位置在该node内：点到该圆圆心的距离 < 该圆的半径
   * 对待多边形：凸包算法
   */
  // 1、第一种方式
  function calcPos0 (event) {
    let node = null
    const { x, y } = event
    for (let i = 0; i < storage.length; i++) {
      const s = storage[i];
      const flag = s.r - Math.sqrt(Math.pow(x - s.x, 2) + Math.pow(y - s.y, 2)) > 0
      if (flag) {
        node = s;
        break
      }
    }
    return node
  }
  // 第二种方式： todo
  function calcPos1 (event) {
    let node = null
    return node
  }

  canvas.addEventListener('mousemove', event => {
    const run = (status, node) => {
      const isSameNode = lastNodeId === node.id;
      if (!isSameNode) {
        lastNodeId = node.id;
        drawCircleByStatus(status, node)
      }
    }
    const node = calcPos0(event);
    node && throttle(run, 50)('hover', node);
  }, false)

}());

/**
 * 问题：如果是五角星，怎么确定鼠标移动的点在一个五角星的范围内
 */
