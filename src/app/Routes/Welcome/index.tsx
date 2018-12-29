import * as React from 'react';
import * as style from './Welcome.scss';

export default function Welcome() {
  return (
    <div className={style.welcome}>
      <h1>Hello world</h1>

      <ul>
        <li>
          <a href="/ParticleSwirl">ParticleSwirl</a>
        </li>
        <li>
          <a href="/NeonHex">NeonHex</a>
        </li>
        <li>
          <a href="/WebGLWater">WebGLWater</a>
        </li>
        <li>
          <a href="/DonutSwirl">DonutSwirl</a>
        </li>
      </ul>
    </div>
  );
}
