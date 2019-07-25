export default class CanvasContextWrapper {
  private readonly ctx: CanvasRenderingContext2D;

  constructor(public readonly canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d')!;
  }

  public clearCanvas = () => this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  public drawSquare(x: number, y: number, size: number) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, size, size);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  public drawCircle(x: number, y: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
