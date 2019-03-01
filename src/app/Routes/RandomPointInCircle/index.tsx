import * as React from 'react';
import RandomPoint from './RandomPoint';
import { GUI } from 'dat.gui';
import { times } from 'lodash';

const MAX_POINTS = 16000;

declare global {
  interface Window {
    randomPoints: RandomPoint.Vector2[];
  }
}

export default class RandomPointInCircle extends React.Component {
  public numOfPoints = 8000;
  public pointState: 0 | 1 | 2 | 3 | 4 = 0;

  public changeState = () => {
    this.pointState == 4 ? (this.pointState = 0) : this.pointState++;
    this.updateAndRedraw();
  };

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private readonly gui = new GUI();
  private setCanvasRef = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  };
  private getRandomPoint = () => {
    return [
      RandomPoint.getRandomPoint,
      RandomPoint.getRandomPointUniform,
      RandomPoint.getRandomPointDror,
      RandomPoint.getRandomPointAllOfTheAbove,
      RandomPoint.getRandomPointWhile,
    ][this.pointState]();
  };
  private randomPoints = (window.randomPoints = times(this.numOfPoints).map(this.getRandomPoint));

  componentDidMount() {
    this.initControls();
    window.addEventListener('resize', this.renderToCanvas);
    this.renderToCanvas();
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public initControls() {
    this.gui
      .add(this, 'numOfPoints', 100, MAX_POINTS)
      .step(100)
      .onChange(this.updateAndRedraw);
    this.gui.add(this, 'changeState');
  }

  private updateAndRedraw = () => {
    this.randomPoints = window.randomPoints = times(this.numOfPoints).map(this.getRandomPoint);
    this.renderToCanvas();
  };

  private renderToCanvas = () => {
    const { canvas } = this;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    this.clearCanvas();

    this.drawSquare(width / 2 - height / 2, 0, height);
    this.drawCircle(width / 2, height / 2, height / 2);

    this.randomPoints.forEach(p => {
      const x = p.x * height + (width / 2 - height / 2);
      const y = p.y * height;
      this.drawCircle(x, y, 1);
    });
  };

  private drawSquare(x: number, y: number, size: number) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, size, size);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  private drawCircle(x: number, y: number, radius: number) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.closePath();
  }

  render() {
    return <canvas ref={this.setCanvasRef} onClick={this.changeState} />;
  }
}
