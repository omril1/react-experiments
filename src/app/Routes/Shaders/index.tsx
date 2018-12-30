import * as React from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';

// Forked from https://codepen.io/seanfree/pen/qVpQww

export default class Shaders extends React.Component {
  private canvas!: HTMLCanvasElement;
  private setCanvasRef = (canvas: HTMLCanvasElement) => (this.canvas = canvas);

  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
  private renderer!: THREE.WebGLRenderer;
  private material!: THREE.ShaderMaterial;
  private mesh!: THREE.Mesh;
  private tick = 0;

  componentDidMount() {
    window.addEventListener('load', this.init, { once: true });
  }

  private init = () => {
    this.camera.position.z = 1;

    const uniforms = {
      time: { type: 'f', value: 0.0 },
      resolution: { type: 'v2', value: new THREE.Vector2(50, 50) },
    };

    this.material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
    this.mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), this.material);
    this.scene.add(this.mesh);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.resize();
    window.addEventListener('resize', this.resize);
    this.renderToCanvas();
  };

  private renderToCanvas = () => {
    this.tick++;
    this.material.uniforms.time.value = this.tick * 0.0015;
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.renderToCanvas);
  };

  private resize = () => {
    this.material.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  };

  render() {
    return <canvas ref={this.setCanvasRef} />;
  }
}
