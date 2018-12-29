import * as THREE from 'three';

export default class Controls {
  radius = 40;
  tube = 28.2;
  radialSegments = 600;
  tubularSegments = 12;
  p = 5;
  q = 4;
  heightScale = 3;
  asParticles = true;
  rotate = true;
  knot!: THREE.Object3D;
  redraw = () => {
    // remove the old plane
    if (this.knot) this.scene.remove(this.knot);
    // create a new one
    const geom = new THREE.TorusKnotGeometry(
      this.radius,
      this.tube,
      Math.round(this.radialSegments),
      Math.round(this.tubularSegments),
      Math.round(this.p),
      Math.round(this.q),
    );
    geom.scale(this.heightScale / 3, this.heightScale / 3, this.heightScale / 3);
    this.knot = this.asParticles ? createParticleSystem(geom) : createMesh(geom);
    // add it to the scene.
    this.scene.add(this.knot);
  };
  constructor(private scene: THREE.Scene) {}
}

function generateSprite() {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;

  const context = canvas.getContext('2d')!;
  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2,
  );
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
  gradient.addColorStop(1, 'rgba(0,0,0,1)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createParticleSystem(geom: THREE.TorusKnotGeometry) {
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 3,
    transparent: true,
    blending: THREE.AdditiveBlending,
    map: generateSprite(),
  });

  return new THREE.Points(geom, material);
}

function createMesh(geom: THREE.TorusKnotGeometry) {
  // assign two materials
  const meshMaterial = new THREE.MeshNormalMaterial({});
  meshMaterial.side = THREE.DoubleSide;

  // create a multimaterial
  const group = new THREE.Group();
  group.add(new THREE.Mesh(geom, meshMaterial));
  return group;
}
