import * as React from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import Controls from './Controls';

//Forked from https://codepen.io/enesser/pen/jdenE

const STEP_SIZE = 0.01;

export default class RotatingParticleMesh extends React.Component {
  private canvas!: HTMLCanvasElement;
  private setCanvasRef = (canvas: HTMLCanvasElement) => (this.canvas = canvas);

  componentDidMount() {
    setTimeout(() => renderSceneToCanvas(this.canvas), 100);
  }
  render() {
    return (
      <div style={{ maxHeight: '100vh' }}>
        <canvas ref={this.setCanvasRef} />
      </div>
    );
  }
}

function renderSceneToCanvas(canvas: HTMLCanvasElement) {
  // once everything is loaded, we run our Three.js stuff.
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  const webGLRenderer = new THREE.WebGLRenderer({ canvas });
  webGLRenderer.setClearColor(0x000000, 1.0);
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMap.enabled = true;

  // position and point the camera to the center of the scene
  camera.position.x = -30;
  camera.position.y = 40;
  camera.position.z = 50;
  camera.lookAt(new THREE.Vector3(10, 0, 0));

  // call the render function
  let step = 0;

  // setup the control gui
  const controls = new Controls(scene);

  const gui = new dat.GUI();
  gui.add(controls, 'radius', 0, 40).onChange(controls.redraw);
  gui.add(controls, 'tube', 0, 40).onChange(controls.redraw);
  gui
    .add(controls, 'radialSegments', 0, 400)
    .step(1)
    .onChange(controls.redraw);
  gui
    .add(controls, 'tubularSegments', 1, 20)
    .step(1)
    .onChange(controls.redraw);
  gui
    .add(controls, 'p', 1, 10)
    .step(1)
    .onChange(controls.redraw);
  gui
    .add(controls, 'q', 1, 15)
    .step(1)
    .onChange(controls.redraw);
  gui.add(controls, 'heightScale', 0, 5).onChange(controls.redraw);
  gui.add(controls, 'asParticles').onChange(controls.redraw);
  gui.add(controls, 'rotate').onChange(controls.redraw);

  gui.close();

  controls.redraw();

  render();

  // from THREE.js examples

  function render() {
    if (controls.rotate) {
      controls.knot.rotation.y = step += STEP_SIZE;
    }
    // render using requestAnimationFrame
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  }
}
