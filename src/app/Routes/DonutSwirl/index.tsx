import * as React from 'react';
import * as THREE from 'three';

import * as image from './cx.png';
import lightSources from './lightSources';
// import * as image from './stripe.png';
// import * as image from './Bart-Simpson.png';

// Forked from https://codepen.io/mattrothenberg/pen/MoWBze?editors=0010

const canvasStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  maxHeight: '100vh',
  position: 'absolute',
};

export default class DonutSwirl extends React.Component {
  private canvas!: HTMLCanvasElement;
  private setCanvasRef = (canvas: HTMLCanvasElement) => (this.canvas = canvas);
  private scene = new THREE.Scene();
  private camera!: THREE.PerspectiveCamera;
  private SPEED = 0.01;
  private renderer!: THREE.WebGLRenderer;
  private mesh = new THREE.Object3D();
  private loader = new THREE.TextureLoader();
  private texture!: THREE.Texture;

  componentDidMount() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
    this.camera.position.z = 17;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 1);

    this.scene.add(...lightSources);

    THREE.ImageUtils.crossOrigin = '';

    this.loader.crossOrigin = '';
    this.texture = this.loader.load(image);
    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.offset.set(0, 0);
    this.texture.repeat.set(-6, 6);

    this.mesh.add(
      new THREE.Mesh(
        new THREE.TorusGeometry(10, 7, 60, 100),
        new THREE.MeshPhongMaterial({
          color: 0xffffff,
          map: this.texture,
          side: THREE.DoubleSide,
        }),
      ),
    );

    this.mesh.rotation.x = Math.PI / 2;
    this.scene.add(this.mesh);

    window.addEventListener('resize', this.resizeHandler, false);
    this.canvas.addEventListener('mousemove', this.handleMouseMove, false);

    this.renderToCanvas();
  }

  private renderToCanvas = () => {
    requestAnimationFrame(this.renderToCanvas);
    this.rotateTorus();
    this.renderer.render(this.scene, this.camera);
  };

  private resizeHandler = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private lastX = window.innerWidth / 2;
  private lastY = window.innerHeight / 2;
  private handleMouseMove = (e: MouseEvent) => {
    const deltaX = this.lastX - e.x;
    const deltaY = this.lastY - e.y;

    this.camera.rotation.y += (this.SPEED * deltaX);
    this.camera.rotation.x += (this.SPEED * deltaY);

    this.lastX = e.x;
    this.lastY = e.y;
  };

  private rotateTorus() {
    this.mesh.rotation.z -= this.SPEED * -1.35;
  }

  render() {
    return (
      <div style={{ maxHeight: '100vh' }}>
        <canvas ref={this.setCanvasRef} style={canvasStyle} />
      </div>
    );
  }
}
