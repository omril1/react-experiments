import * as React from 'react';
// Didn't change to typescript because it is using eperimental APIs
import initWebGLFluid from './initWebGLFluid';

// Forked from https://codepen.io/PavelDoGreat/pen/zdWzEL

const canvasStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: '100vw',
  height: '100vh',
};

export default class WebGLFluid extends React.Component {
  componentDidMount() {
    initWebGLFluid();
  }

  render() {
    return (
      <div>
        <canvas style={canvasStyle} />
      </div>
    );
  }
}
