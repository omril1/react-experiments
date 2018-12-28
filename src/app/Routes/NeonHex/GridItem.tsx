const cos = Math.cos;
const sin = Math.sin;
const PI = Math.PI;

interface Point {
  x: number;
  y: number;
}

export default class GridItem {
  private HexPoints: Point[] = [];
  private hlPoints: Point[] = [];
  x: number;
  y: number;

  constructor(x = 0, y = 0, HEX_CRAD: number, HEX_HLW: number) {
    this.x = x || 0;
    this.y = y || 0;

    // tslint:disable-next-line:one-variable-per-declaration
    const ba = PI / 3;
    const ri = HEX_CRAD - 0.5 * HEX_HLW;

    for (let i = 0; i < 6; i++) {
      const a = i * ba;
      x = this.x + HEX_CRAD * cos(a);
      y = this.y + HEX_CRAD * sin(a);

      this.HexPoints.push({ x, y });

      if (i > 2) {
        x = this.x + ri * cos(a);
        y = this.y + ri * sin(a);

        this.hlPoints.push({ x, y });
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.HexPoints.forEach(({ x, y }, i) => {
      ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y);
    });
    // for (let i = 0; i < 6; i++) {
    //   ctx[i === 0 ? 'moveTo' : 'lineTo'](this.HexPoints[i].x, this.HexPoints[i].y);
    // }
  }

  highlight(ctx: CanvasRenderingContext2D) {
    this.hlPoints.forEach(({ x, y }, i) => {
      ctx[i === 0 ? 'moveTo' : 'lineTo'](x, y);
    });
    // for (let i = 0; i < 3; i++) {
    //   ctx[i === 0 ? 'moveTo' : 'lineTo'](this.hlPoints[i].x, this.hlPoints[i].y);
    // }
  }
}
