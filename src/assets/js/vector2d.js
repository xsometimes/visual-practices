export default class Vector2d extends Array {
  constructor (x = 1, y = 0) {
    super(x, y);
  }

  set x (v) { // 取值函数（getter）和存值函数（setter）
    this[0] = v;
  }

  set y (v) {
    this[1] = v;
  }

  get x () {
    return this[0];
  }

  get y () {
    return this[1];
  }

  get length () {
    return Math.hypot(this.x, this.y);
  }

  get dir () {
    return Math.atan2(this.y, this.x);
  }

  copy () {
    return new Vector2d(this.x, this.y);
  }

  add (v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub (v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  scale (a) {
    this.x *= a;
    this.y *= a;
    return this;
  }

  /**
   * 向量叉积(Cross Product)
   * a^b = |a|*|b| * sinθ * n （n是根据右手法则得出的a ^ b方向上的单位向量，长度为1）
   * 几何意义：
   * 1）a ^ b != b ^ a 这是两个方向相反的平行向量
   * 2）|a ^ b|是a ^ b向量的长度，同时也是a和b所形成的平行四边形的面积
   * 3）|a ^ b| == 0，则 a // b
   * 4）|a ^ b| = |a| * |b| * sinθ，所以当 normalize a 和 b 的时候，sinθ = |a ^ b|
   */
  cross(v) {
    return this.x * v.y - v.x * this.y;
  }

  /**
   * 向量点积(Dot Product)
   * a * b = |a| * |b| * cosθ
   * 几何意义，两向量点击=0 则垂直；>0同向；<0异向
   */
  dot(v) {
    return this.x * v.x + v.y * this.y;
  }

  normalize() {
    return this.scale(1 / this.length);
  }

  rotate(rad) {
    const c = Math.cos(rad), s = Math.sin(rad);
    const [x, y] = this;

    this.x = x * c + y * -s;
    this.y = x * s + y * c;

    return this;
  }
}
