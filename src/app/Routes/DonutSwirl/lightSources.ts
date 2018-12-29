import { PointLight } from 'three';

const lightSources = [
  new PointLight(0xffffff, 1.25, 0, 100),
  new PointLight(0xffffff, 1.5, 0, 100),
  new PointLight(0xffffff, 1.35, 0, 100),
];

lightSources[0].position.set(0, 0, 0);
lightSources[1].position.set(0, 0, 300);
lightSources[2].position.set(-100, -200, -100);

export default lightSources;
