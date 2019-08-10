import * as React from 'react';
import CanvasContextWrapper from './CanvasContextWrapper';
import RandomPoint from './RandomPoint';
import { GUI } from 'dat.gui';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { times } from 'lodash';

const MAX_POINTS = 32000;
const CIRCLE_CENTER = new RandomPoint.Vector2(0, 0);

declare global {
  interface Window {
    randomPoints: RandomPoint.Vector2[];
  }
}

@observer
export default class RandomPointInCircle extends React.Component {
  private numOfPoints = 16000;
  @observable
  private pointState: number = 0;
  private rotation: number = 0;
  private readonly gui = new GUI();
  private canvasContextWrapper!: CanvasContextWrapper;

  private getNextState = () => {
    this.pointState == RandomPoint.all.length - 1 ? (this.pointState = 0) : this.pointState++;
    this.updateAndRedraw();
  };
  private getPrevState = () => {
    this.pointState == 0 ? (this.pointState = RandomPoint.all.length - 1) : this.pointState--;
    this.updateAndRedraw();
  };
  private increaseRotation = () => {
    if (this.rotation < 90) this.rotation += 0.2;
    this.renderToCanvas();
  };
  private decreaseRotation = () => {
    if (this.rotation > 0) this.rotation -= 0.2;
    this.renderToCanvas();
  };

  private setCanvasRef = (canvas: HTMLCanvasElement) => {
    this.canvasContextWrapper = new CanvasContextWrapper(canvas);
  };
  private getRandomPoint = () => RandomPoint.all[this.pointState].method();
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

  private initControls() {
    this.gui
      .add(this, 'numOfPoints', MAX_POINTS / 100, MAX_POINTS)
      .step(100)
      .onChange(this.updateAndRedraw);

    this.gui
      .add(this, 'rotation', 0, 90)
      .step(0.2)
      .onChange(this.renderToCanvas);
    this.gui.add(this, 'getNextState');
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (event.code == 'ArrowUp') {
      this.increaseRotation();
    } else if (event.code == 'ArrowDown') {
      this.decreaseRotation();
    } else if (event.code == 'ArrowRight') {
      this.getNextState();
    } else if (event.code == 'ArrowLeft') {
      this.getPrevState();
    }
  };

  private updateAndRedraw = () => {
    this.randomPoints = window.randomPoints = times(this.numOfPoints).map(this.getRandomPoint);
    this.renderToCanvas();
  };

  private renderToCanvas = () => {
    const { canvas } = this.canvasContextWrapper;
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);
    this.canvasContextWrapper.clearCanvas();

    this.canvasContextWrapper.drawSquare(width / 2 - height / 2, 0, height);
    this.canvasContextWrapper.drawCircle(width / 2, height / 2, height / 2);

    this.randomPoints.forEach(p => {
      const rotationInRadians = this.rotation * (Math.PI / 180);
      const rotatedPoint = p.getNewRotatedVector(CIRCLE_CENTER, rotationInRadians);
      const x = (rotatedPoint.x / 2 + 0.5) * height + (width / 2 - height / 2);
      const y = (rotatedPoint.y / 2 + 0.5) * height;
      this.canvasContextWrapper.drawSquare(x, y, 1);
    });
  };

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
