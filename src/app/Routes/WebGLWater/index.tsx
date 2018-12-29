import * as React from 'react';
import images from './webgl-water/images';
import loadEverything from './webgl-water/main.js';
import './webgl-water/lightgl.js';
import './webgl-water/cubemap.js';
import './webgl-water/renderer.js';
import './webgl-water/water.js';

// Forked from https://github.com/evanw/webgl-water

export default class WebGLWater extends React.Component {
  // tslint:disable-next-line
  private canvas!: HTMLCanvasElement;
  private setCanvasRef = (canvas: HTMLCanvasElement) => (this.canvas = canvas);

  componentDidMount() {
    window.addEventListener('load', loadEverything, { once: true });
  }

  render() {
    return (
      <div>
        <div id="help" />
        <canvas
          ref={this.setCanvasRef}
          style={{ /* width: '100%', height: '100%', */ backgroundColor: 'black' }}
        />

        {images.map(({ name, src }) => (
          <img key={name} id={name} hidden src={src} />
        ))}

        <div id="loading" hidden children="Loading..." />
      </div>
    );
  }
}
