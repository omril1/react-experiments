import GridItem from './GridItem';

export default class Grid {
  private items: GridItem[] = [];

  constructor(
    rows = 16,
    cols = 16,
    private HEX_BG: CanvasFillStrokeStyles['fillStyle'],
    private HEX_HL: CanvasFillStrokeStyles['strokeStyle'],
    unit_x: number,
    unit_y: number,
    off_x: number,
    HEX_HLW: number,
    HEX_CRAD: number,
  ) {
    let x: number;
    let y: number;
    for (let row = 0; row < rows; row++) {
      y = row * unit_y;
      for (let col = 0; col < cols; col++) {
        x = (row % 2 == 0 ? 0 : off_x) + col * unit_x;
        this.items.push(new GridItem(x, y, HEX_CRAD, HEX_HLW));
      }
    }
  }

  draw(ct: CanvasRenderingContext2D) {
    ct.fillStyle = this.HEX_BG;
    ct.beginPath();
    this.items.forEach(item => {
      item.draw(ct);
    });

    ct.closePath();
    ct.fill();
    ct.strokeStyle = this.HEX_HL;
    ct.beginPath();
    this.items.forEach(item => {
      item.highlight(ct);
    });

    ct.closePath();
    ct.stroke();
  }
}
