import * as React from 'react';
import Orb from './Orb';

// tslint:disable-next-line:no-empty-interface
interface IAppProps {}

// Forked from https://codepen.io/jackrugile/pen/DGenc

const dpr = window.devicePixelRatio;
const cw = window.innerWidth;
const ch = window.innerHeight;
const showTrails = true;

export default class ParticleSwirl extends React.Component<IAppProps> {
  private canvas!: HTMLCanvasElement;
  private setCanvasRef = (canvas: HTMLCanvasElement) => (this.canvas = canvas);

  componentDidMount() {
    const ctx = this.canvas.getContext('2d')!;
    this.canvas.width = cw * dpr;
    this.canvas.height = ch * dpr;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    const orbs: Orb[] = [];

    let count = 100;
    while (count--) {
      const mx = cw / 2;
      const my = ch / 2 + count * 2;
      const dx = cw / 2 - mx;
      const dy = ch / 2 - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      orbs.push(new Orb(mx, my, angle, dist));
    }

    const loop = () => {
      requestAnimationFrame(loop);
      if (showTrails) {
        ctx.fillStyle = 'rgba(0,0,0,.1)';
        ctx.fillRect(0, 0, cw, ch);
      } else {
        ctx.clearRect(0, 0, cw, ch);
      }
      let i = orbs.length;
      while (i--) {
        const orb = orbs[i];
        let updateCount = 3;
        while (updateCount--) {
          orb.update();
          orb.draw(ctx);
        }
      }
    };

    loop();
  }

  render() {
    return (
      <div>
        <canvas ref={this.setCanvasRef} style={{ width: '100%', height: '100%', backgroundColor: 'black' }} />
      </div>
    );
  }
}
