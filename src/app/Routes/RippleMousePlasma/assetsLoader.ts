import * as THREE from 'three';
import * as noisePng from './noise.png';
import * as envLatLonPng from './env_lat-lon.png';
import * as tilingMosaic from './tiling-mosaic.jpg';

const loader = new THREE.TextureLoader();
// loader.setCrossOrigin('anonymous');

function setWrappingPropertiesOnTexture(texture: THREE.Texture, minFilter: THREE.TextureFilter) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = minFilter;
  return texture;
}

export function loadAsset(url: string, minFilter: THREE.TextureFilter) {
  return new Promise<THREE.Texture>((resolve, reject) => {
    loader.load(
      url,
      texture => resolve(setWrappingPropertiesOnTexture(texture, minFilter)),
      undefined,
      reject,
    );
  });
}

export function loadAllAssets() {
  return Promise.all([
    loadAsset(noisePng, THREE.LinearFilter),
    loadAsset(envLatLonPng, THREE.NearestMipMapNearestFilter),
    loadAsset(tilingMosaic, THREE.NearestMipMapNearestFilter),
  ]);
}
