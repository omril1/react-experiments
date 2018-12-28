import * as React from 'react';
import Grid from './Grid';
import { findDOMNode } from 'react-dom';

// Forked from https://codepen.io/thebabydino/pen/zGmdep
// Or https://s.codepen.io/thebabydino/debug/zGmdep

const min = Math.min;
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const NEON_PALETE = [
  '#cb3301',
  '#ff0066',
  '#ff6666',
  '#feff99',
  '#ffff67',
  '#ccff66',
  '#99fe00',
  '#fe99ff',
  '#ff99cb',
  '#fe349a',
  '#cc99fe',
  '#6599ff',
  '#00ccff',
  '#ffffff',
];
const HEX_BG = '#171717';
const HEX_HL = '#2a2a2a';
const HEX_CRAD = 32;
const HEX_HLW = 2;
const HEX_GAP = 4;

const T_SWITCH = 64;
const unit_x = 3 * HEX_CRAD + HEX_GAP * sqrt(3);
const unit_y = HEX_CRAD * sqrt(3) * 0.5 + 0.5 * HEX_GAP;
const off_x = 1.5 * HEX_CRAD + HEX_GAP * sqrt(3) * 0.5;

export default class NeonHex extends React.Component {
  // tslint:disable-next-line:no-shadowed-variable
  private wp = NEON_PALETE.map(c => {
    const num = parseInt(c.replace('#', ''), 16);

    return {
      r: (num >> 16) & 0xff,
      g: (num >> 8) & 0xff,
      b: num & 0xff,
    };
  });
  private nwp = this.wp.length;
  private csi = 0;
  private f = 1 / T_SWITCH;
  private w!: number;
  private h!: number;
  private _min!: number;
  private contextA!: CanvasRenderingContext2D;
  private contextB!: CanvasRenderingContext2D;
  private grid!: Grid;
  private source!: { x: number; y: number };
  private t = 0;
  private request_id!: number;

  componentDidMount() {
    this.init();

    addEventListener('resize', () => this.init(), false);
    addEventListener('mousemove', e => (this.source = { x: e.clientX, y: e.clientY }), false);
  }

  fillBackground = (bg_fill: CanvasFillStrokeStyles['fillStyle']) => {
    this.contextA.fillStyle = bg_fill;
    this.contextA.beginPath();
    this.contextA.rect(0, 0, this.w, this.h);
    this.contextA.closePath();
    this.contextA.fill();
  };

  neon = () => {
    const k = (this.t % T_SWITCH) * this.f;

    const rgb = {
      r: ~~(this.wp[this.csi].r * (1 - k) + this.wp[(this.csi + 1) % this.nwp].r * k),
      g: ~~(this.wp[this.csi].g * (1 - k) + this.wp[(this.csi + 1) % this.nwp].g * k),
      b: ~~(this.wp[this.csi].b * (1 - k) + this.wp[(this.csi + 1) % this.nwp].b * k),
    };

    const rgb_str = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    const light = this.contextA.createRadialGradient(
      this.source.x,
      this.source.y,
      0,
      this.source.x,
      this.source.y,
      0.875 * this._min,
    );
    const stp = 0.5 - 0.5 * sin(7 * this.t * this.f) * cos(5 * this.t * this.f) * sin(3 * this.t * this.f);

    light.addColorStop(0, rgb_str);
    light.addColorStop(stp, 'rgba(0,0,0,.03)');

    this.fillBackground('rgba(0,0,0,.02)');
    this.fillBackground(light);

    this.t++;

    if (this.t % T_SWITCH === 0) {
      this.csi++;

      if (this.csi === this.nwp) {
        this.csi = 0;
        this.t = 0;
      }
    }

    this.request_id = requestAnimationFrame(this.neon);
  };

  init() {
    const canvases = Array.from((findDOMNode(this) as HTMLElement).querySelectorAll('canvas'));
    const s = getComputedStyle(canvases[0]);

    this.w = ~~s.width!.split('px')[0];
    this.h = ~~s.height!.split('px')[0];
    this._min = min(this.w, this.h) * 0.75;

    const rows = ~~(this.h / unit_y) + 2;
    const cols = ~~(this.w / unit_x) + 2;

    canvases.forEach(canvas => {
      canvas.width = this.w;
      canvas.height = this.h;
    });
    this.contextA = canvases[0].getContext('2d')!;
    this.contextB = canvases[1].getContext('2d')!;

    this.grid = new Grid(rows, cols, HEX_BG, HEX_HL, unit_x, unit_y, off_x, HEX_HLW, HEX_CRAD);
    this.grid.draw(this.contextB);

    if (!this.source) {
      this.source = { x: ~~(this.w / 2), y: ~~(this.h / 2) };
    }

    cancelAnimationFrame(this.request_id);
    this.neon();
  }

  render() {
    const canvasStyle: CSSProperties = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: '100vw',
      height: '100vh',
    };

    return (
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <canvas style={canvasStyle} />
        <canvas style={canvasStyle} />
      </div>
    );
  }
}
