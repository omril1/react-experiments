import * as React from 'react';
import './webgl-water/lightgl.js';
import './webgl-water/cubemap.js';
import './webgl-water/renderer.js';
import './webgl-water/water.js';
import loadEverything from './webgl-water/main.js';

// Forked from https://github.com/evanw/webgl-water

import * as tiles from './webgl-water/tiles.jpg';
import * as xneg from './webgl-water/xneg.jpg';
import * as xpos from './webgl-water/xpos.jpg';
import * as ypos from './webgl-water/ypos.jpg';
import * as zneg from './webgl-water/zneg.jpg';
import * as zpos from './webgl-water/zpos.jpg';

export default class WebGLWater extends React.Component {
  private canvas!: HTMLCanvasElement;
  private setCanvasRef = (canvas: HTMLCanvasElement) => (this.canvas = canvas);

  componentDidMount() {
    window.addEventListener('load', loadEverything, { once: true });
  }

  render() {
    return (
      <div>
        <div id="help" />
        <canvas ref={this.setCanvasRef} style={{ /* width: '100%', height: '100%', */ backgroundColor: 'black' }} />

        <img id="tiles" hidden src={tiles} />
        <img id="xneg" hidden src={xneg} />
        <img id="xpos" hidden src={xpos} />
        <img id="ypos" hidden src={ypos} />
        <img id="zneg" hidden src={zneg} />
        <img id="zpos" hidden src={zpos} />
        <div id="loading" hidden>
          Loading...
        </div>
      </div>
    );
  }
}
