import * as React from 'react';
import RandomPoint from './RandomPoint';
import { GUI } from 'dat.gui';
import { times } from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

const MAX_POINTS = 16000;
const CIRCLE_CENTER = new RandomPoint.Vector2(0.5, 0.5);

declare global {
  interface Window {
    randomPoints: RandomPoint.Vector2[];
  }
}

@observer
export default class RandomPointInCircle extends React.Component {
  public numOfPoints = 8000;
  @observable
  public pointState: number = 0;
  public rotation: number = 0;

  public getNextState = () => {
    this.pointState == RandomPoint.all.length - 1 ? (this.pointState = 0) : this.pointState++;
    this.updateAndRedraw();
  };
  public getPrevState = () => {
    this.pointState == 0 ? (this.pointState = RandomPoint.all.length - 1) : this.pointState--;
    this.updateAndRedraw();
  };
  public increaseRotation = () => {
    if (this.rotation < 90) this.rotation += 0.2;
    this.renderToCanvas();
  };
  public decreaseRotation = () => {
    if (this.rotation > 0) this.rotation -= 0.2;
    this.renderToCanvas();
  };

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private readonly gui = new GUI();
  private setCanvasRef = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  };
  private getRandomPoint = () => {
    return RandomPoint.all[this.pointState].method();
  };
  private randomPoints = (window.randomPoints = times(this.numOfPoints).map(this.getRandomPoint));

  componentDidMount() {
    this.initControls();
    window.addEventListener('resize', this.renderToCanvas);
    document.addEventListener('keydown', this.onKeyDown, true);
    this.renderToCanvas();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown, true);
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public initControls() {
    this.gui
      .add(this, 'numOfPoints', 100, MAX_POINTS)
      .step(100)
      .onChange(this.updateAndRedraw);

    this.gui
      .add(this, 'rotation', 0, 90)
      .step(0.2)
      .onChange(this.renderToCanvas);
    this.gui.add(this, 'getNextState');
  }

  public onKeyDown = (event: KeyboardEvent) => {
    event = event || window.event;

    if (event.keyCode == 38) {
      // up arrow
      this.increaseRotation();
    } else if (event.keyCode == 40) {
      // down arrow
      this.decreaseRotation();
    } else if (event.keyCode == 37) {
      // left arrow
      this.getNextState();
    } else if (event.keyCode == 39) {
      // right arrow
      this.getPrevState();
    }
  };

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
      const rotationInRadians = this.rotation * (Math.PI / 180);
      const rotatedPoint = p.getNewRotatedVector(CIRCLE_CENTER, rotationInRadians);
      const x = rotatedPoint.x * height + (width / 2 - height / 2);
      const y = rotatedPoint.y * height;
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
    return (
      <>
        <div style={{ position: 'absolute', left: '5vw', top: '5vw' }}>
          <span>state: {this.pointState}</span>
          <br />
          <pre>{RandomPoint.all[this.pointState].description}</pre>
        </div>
        <canvas ref={this.setCanvasRef} onClick={this.getNextState} />
      </>
    );
  }
}

if (module.hot) {
  module.hot.decline();
}
