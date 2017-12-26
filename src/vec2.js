

class Vec2 {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  copy() {
    return new Vec2(this.x, this.y);
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normal() {
    let magnitude = this.magnitude();
    return new Vec2(this.x / magnitude, this.y / magnitude);
  }

  multiply(factor) {
    return new Vec2(this.x * factor, this.y * factor);
  }

  static add(v1, v2) {
    return new Vec2(v1.x + v2.x, v1.y + v2.y);
  }
}

module.exports = Vec2;
