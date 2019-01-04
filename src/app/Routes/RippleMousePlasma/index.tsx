import * as CCapture from 'ccapture.js/build/CCapture.min.js';
import * as React from 'react';
import * as THREE from 'three';
import * as WebMWriter from 'webm-writer';
import { fragmentShader, vertexShader } from './shaders';
import { loadAllAssets } from './assetsLoader';

// Forked from https://codepen.io/shubniggurath/pen/wEymZN

window[`WebMWriter`] = WebMWriter;

interface Uniforms {
  [uniform: string]: THREE.IUniform & { type: string };
}

interface Props {
  style?: CSSProperties;
  className?: string;
}

export default class RippleMousePlasma extends React.Component<Props> {
  private canvas!: HTMLCanvasElement;
  private setCanvasRef = (canvas: HTMLCanvasElement) => (this.canvas = canvas);

  //region variables

  private camera!: THREE.Camera;
  private renderer!: THREE.WebGLRenderer;
  private uniforms!: Uniforms;

  private readonly scene = new THREE.Scene();
  private readonly divisor = 1 / 8;
  private readonly textureFraction = 1;
  private readonly newmouse = { x: 0, y: 0 };

  private texture!: THREE.Texture;
  private rtTexture!: THREE.WebGLRenderTarget;
  private rtTexture2!: THREE.WebGLRenderTarget;
  private environment!: THREE.Texture;
  private pooltex!: THREE.Texture;

  private capturer = new CCapture({
    verbose: true,
    framerate: 60,
    // motionBlurFrames: 4,
    quality: 90,
    format: 'webm',
    workersPath: 'js/',
  });

  private _isCapturing: boolean = false;
  private readonly beta = Math.random() * -1000;

  //endregion

  componentDidMount() {
    window.addEventListener('load', this.init, { once: true });
  }

  private init = () => {
    loadAllAssets().then(([texture, environment, pooltex]) => {
      this.texture = texture;
      this.environment = environment;
      this.pooltex = pooltex;

      this.initCanvas();
      this.renderToCanvas();
    });
    this._isCapturing = false;

    window.addEventListener('keyup', e => e.keyCode == 68 && this.toggleCapture());
  };

  private get width() {
    return window.innerWidth * this.textureFraction;
  }
  private get height() {
    return window.innerHeight * this.textureFraction;
  }

  private initCanvas = () => {
    this.camera = new THREE.Camera();
    this.camera.position.z = 1;

    this.rtTexture = this.getNewWebGLRenderTarget();
    this.rtTexture2 = this.getNewWebGLRenderTarget();

    this.uniforms = {
      u_time: { type: 'f', value: 1.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2() },
      u_noise: { type: 't', value: this.texture },
      u_buffer: { type: 't', value: this.rtTexture.texture },
      u_texture: { type: 't', value: this.pooltex },
      u_environment: { type: 't', value: this.environment },
      u_mouse: { type: 'v3', value: new THREE.Vector3() },
      u_mousemoved: { type: 'b', value: false },
      u_frame: { type: 'i', value: -1 },
      u_renderpass: { type: 'b', value: false },
    };

    const geometry = new THREE.PlaneBufferGeometry(2, 2);
    const material = new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader, fragmentShader });
    material.extensions.derivatives = true;

    this.scene.add(new THREE.Mesh(geometry, material));

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    // renderer.setPixelRatio( window.devicePixelRatio );

    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize, false);
    document.addEventListener('pointermove', this.onPointermove);
    document.addEventListener('pointerdown', () => (this.uniforms.u_mouse.value.z = 1));
    document.addEventListener('pointerup', () => (this.uniforms.u_mouse.value.z = 0));
  };

  private onPointermove = (e: PointerEvent) => {
    this.uniforms.u_mousemoved.value = true;
    const ratio = window.innerHeight / window.innerWidth;
    if (window.innerHeight > window.innerWidth) {
      this.newmouse.x = (e.pageX - window.innerWidth / 2) / window.innerWidth;
      this.newmouse.y = ((e.pageY - window.innerHeight / 2) / window.innerHeight) * -1 * ratio;
    } else {
      this.newmouse.x = (e.pageX - window.innerWidth / 2) / window.innerWidth / ratio;
      this.newmouse.y = ((e.pageY - window.innerHeight / 2) / window.innerHeight) * -1;
    }
    e.preventDefault();
  };

  private onWindowResize = () => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.uniforms.u_resolution.value.x = this.renderer.domElement.width;
    this.uniforms.u_resolution.value.y = this.renderer.domElement.height;

    this.rtTexture = new THREE.WebGLRenderTarget(this.width, this.height);
    this.rtTexture2 = new THREE.WebGLRenderTarget(this.width, this.height);

    this.uniforms.u_frame.value = -1;
  };

  private isCapturing = (val: boolean) => {
    if (!val && this._isCapturing) {
      this.capturer.stop();
      this.capturer.save();
    } else if (val && !this._isCapturing) {
      this.capturer.start();
    }
    this._isCapturing = val;
  };
  private toggleCapture = () => this.isCapturing(!this._isCapturing);

  private renderTexture = () => {
    // let ov = uniforms.u_buff.value;

    const odims = this.uniforms.u_resolution.value.clone();
    this.uniforms.u_resolution.value.x = this.width;
    this.uniforms.u_resolution.value.y = this.height;

    this.uniforms.u_buffer.value = this.rtTexture2.texture;

    this.uniforms.u_renderpass.value = true;

    //   rtTexture = rtTexture2;
    //   rtTexture2 = buffer;

    window[`rtTexture`] = this.rtTexture;
    this.renderer.setRenderTarget(this.rtTexture);
    this.renderer.render(this.scene, this.camera, this.rtTexture, true);

    const buffer = this.rtTexture;
    this.rtTexture = this.rtTexture2;
    this.rtTexture2 = buffer;

    // uniforms.u_buff.value = ov;

    this.uniforms.u_buffer.value = this.rtTexture.texture;
    this.uniforms.u_resolution.value = odims;
    this.uniforms.u_renderpass.value = false;
  };

  private renderToCanvas = (delta?: number) => {
    requestAnimationFrame(this.renderToCanvas);
    this.uniforms.u_frame.value++;

    this.uniforms.u_mouse.value.x += (this.newmouse.x - this.uniforms.u_mouse.value.x) * this.divisor;
    this.uniforms.u_mouse.value.y += (this.newmouse.y - this.uniforms.u_mouse.value.y) * this.divisor;

    this.uniforms.u_time.value = this.beta + (delta || 0) * 0.0005;
    this.renderer.render(this.scene, this.camera);
    this.renderTexture();

    if (this._isCapturing) this.capturer.capture(this.renderer.domElement);
  };

  private getNewWebGLRenderTarget(): THREE.WebGLRenderTarget {
    const options = { type: THREE.FloatType, minFilter: THREE.NearestMipMapNearestFilter };
    return new THREE.WebGLRenderTarget(Math.floor(this.width), Math.floor(this.height), options);
  }

  render() {
    return <canvas className={this.props.className} style={this.props.style} ref={this.setCanvasRef} />;
  }
}
