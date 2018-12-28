import { random } from 'lodash';
const cw = window.innerWidth;
const ch = window.innerHeight;

export default class Orb {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  hue: number;
  colorAngle: number;
  angle: number;
  size: number;
  centerX: number;
  centerY: number;
  radius: number;
  speed: number;
  alpha: number;

  constructor(mx: number, my: number, angle: number, dist: number) {
    this.x = mx;
    this.y = my;
    this.lastX = mx;
    this.lastY = my;
    this.hue = 0;
    this.colorAngle = 0;
    this.angle = angle + Math.PI / 2;
    this.size = random(1, 3, false) / 2;
    this.centerX = cw / 2;
    this.centerY = ch / 2;
    this.radius = dist;
    this.speed = (random(5, 10, false) / 1000) * (dist / 750) + 0.015;
    this.alpha = 1 - Math.abs(dist) / cw;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = `hsla(${this.colorAngle},100%,50%,1)`;
    ctx.lineWidth = this.size;
    ctx.beginPath();
    ctx.moveTo(this.lastX, this.lastY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  }
  update() {
    const mx = this.x;
    const my = this.y;
    this.lastX = this.x;
    this.lastY = this.y;

    const x1 = cw / 2;
    const y1 = ch / 2;
    const x2 = mx;
    const y2 = my;
    const rise = y1 - y2;
    const run = x1 - x2;
    const slope = -(rise / run);
    const radian = Math.atan(slope);
    this.colorAngle = calculateAngle(radian, x2, x1, y2, y1, slope);
    this.x = this.centerX + Math.sin(this.angle * -1) * this.radius;
    this.y = this.centerY + Math.cos(this.angle * -1) * this.radius;
    this.angle += this.speed;
  }
}

// tslint:disable-next-line:cyclomatic-complexity
function calculateAngle(radian: number, x2: number, x1: number, y2: number, y1: number, slope: number) {
  let angleH = Math.floor(radian * (180 / Math.PI));
  if (x2 < x1 && y2 < y1) {
    angleH += 180;
  }
  if (x2 < x1 && y2 > y1) {
    angleH += 180;
  }
  if (x2 > x1 && y2 > y1) {
    angleH += 360;
  }
  if (y2 < y1 && slope == -Infinity) {
    angleH = 90;
  }
  if (y2 > y1 && slope == Infinity) {
    angleH = 270;
  }
  if (x2 < x1 && slope == 0) {
    angleH = 180;
  }
  if (isNaN(angleH)) {
    angleH = 0;
  }
  return angleH;
}
