(async function () {

  // 步骤一、创建WebGL上下文
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl');

  /**
   * 步骤二、创建WebGL程序并完成配置
   * 此处的WebGL程序是一个WebGLProgram对象，它是给GPU最终运营着色器的程序
   */
  // 顶点着色器程序
  const vertex = `
    attribute vec2 position;
    void main() {
      gl_PointSize = 1.0;
      gl_Position = vec4(position, 1.0, 1.0);
    }
  `;
  // 片元着色器程序
  const fragment = `
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1.0, 0.0, 0.0, 0.4);
    }
  `;

  // 创建一个着色器
  function createShader (gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source) // 绑定着色器数据
    gl.compileShader(shader); // 编译着色器
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader
    }
  }

  // 创建着色程序/创建WebGLProgram对象，并将这两个shader关联到这个WebGL程序上。
  function createProgram (gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER); // 创建顶点着色器
    const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER); // 片元顶点着色器
    const program = gl.createProgram(); // 创建着色程序
    gl.attachShader(program, vertexShader); // 绑定顶点着色器
    gl.attachShader(program, fragmentShader); // 绑定片元着色器
    gl.linkProgram(program); // 链接着色器
    return program
  }

  const program = createProgram(gl, vertex, fragment);
  // 通过useProgram选择启用这个WebGLProgram对象。
  gl.useProgram(program);

  // -----------------------------------------------------------------------------------------------------------------------------
  /**
   * 步骤三、将数据存入缓冲区
   */
  const points = new Float32Array([
    -1, -1, 
    0, 1, 
    1, -1
  ]);
  // 创建一个缓存对象，将它绑定为当前操作对象，再把当前的数据写入缓存对象。
  const bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

  /**
   * 步骤四、将缓存区数据读取到GPU
   */
  const vPosition = gl.getAttribLocation(program, 'position'); // 获取顶点着色器中的position变量的地址
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);  // 给变量设置长度和类型
  gl.enableVertexAttribArray(vPosition); // 激活这个变量

  /**
   * 步骤五、执行着色器程序完成绘制
   */
  gl.clear(gl.COLOR_BUFFER_BIT);
  // gl.drawArrays(gl.TRIANGLES, 0, points.length / 2); // 实心三角形

  // ---------------------------------------------------------------------------------------------------------------------------

  /**
   * 作业1：绘制空心三角形
   * WebGLRenderingContext.drawArrays(mode, first, count)方法用于从向量数组中绘制图元
   * 其中参数mode：指定绘制图元的方式，取值如下：
   * gl.POINTS：绘制一系列点
   * gl.LINE_STRIP：绘制一个线条，类似折线，上一点连接下一点
   * gl.LINE_LOOP：绘制一个线圈，在上一种的基础上，最后一点与第一个点相连
   * gl.LINES：绘制一系列单独线段，每两个点作为端点，线段之间不连接
   * gl.TRIANGLE_STRIP：绘制一个三角带
   * gl.TRIANGLE_FAN：绘制一个三角扇
   * gl.TRIANGLES：绘制一系列三角形。每三个顶点作为顶点
   */
  gl.drawArrays(gl.LINE_LOOP, 0, points.length / 2); // [-1, -1, 0, 1, 1, -1]
  // gl.drawArrays(gl.LINE_STRIP, 0, points.length / 2); // [-1, -1, 0, 1, 1, -1, -1, -1]
  // gl.drawArrays(gl.LINES, 0, points.length / 2); // [-1, -1, 0, 1, 1, -1, 0, 1, -1, -1, 1, -1]

  /**
   * 作业2：绘制正多边形、正多角星
   * 正多边形：创建几个顶点的坐标数组 + gl.LINE_LOOP连线
   * 正多角星：思路同上 + 分成内外两个圆 https://www.cnblogs.com/wufangfang/p/6373972.html
   */

   /**
    * 计算正多边形几个顶点的坐标数组并返回
    * @param {number} x 正多边形外接圆圆心的横坐标
    * @param {number} y 正多边形外接圆圆心的纵坐标
    * @param {number} r 正多边形外接圆的半径
    * @param {number} n 正多边形的边数
    * @returns 数组
    */
  function createRugularPolygonVertex (x, y, r, n) {
    const perAngle = 2 * Math.PI / n;
    const res = [];
    for (let i = 0; i < n; i++) {
      const angle = i * perAngle;
      const nx = x + r * Math.cos(angle);
      const ny = y + r * Math.sin(angle);
      res.push(nx, ny);
    }
    return new Float32Array(res)
  }
  
  /* const sPPoints = createRugularPolygonVertex(0, 0, 0.5, 6); // 六边形的顶点

  const sBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, sBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, sPPoints, gl.STATIC_DRAW);

  const vPosition = gl.getAttribLocation(program, 'position');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.LINE_LOOP, 0, sPPoints.length / 2); */

}());
