import * as React from 'react';
import * as style from './Welcome.scss';
import * as ParticleSwirlImg from './images/ParticleSwirl.png';
import * as NeonHexImg from './images/NeonHex.png';
import * as WebGLWaterImg from './images/WebGLWater.png';
import * as DonutSwirlImg from './images/DonutSwirl.png';
import * as RotatingParticleMeshImg from './images/RotatingParticleMesh.png';
import * as WebGLFluidImg from './images/WebGLFluid.png';
import * as ShadersImg from './images/Shaders.png';
import * as RippleMousePlasmaImg from './images/RippleMousePlasma.png';
import * as CombinedImg from './images/Combined.png';
import * as CirclesPatternImg from './images/CirclesPattern.png';

export default function Welcome() {
  return (
    <div className={style.welcome}>
      <h1>React Eperiments</h1>
      <h2>(Mostly from CodePen)</h2>

      <div className={style.grid}>
        <GridItem text="ParticleSwirl" imgSrc={ParticleSwirlImg} />
        <GridItem text="NeonHex" imgSrc={NeonHexImg} />
        <GridItem text="WebGLWater" imgSrc={WebGLWaterImg} />
        <GridItem text="DonutSwirl" imgSrc={DonutSwirlImg} />
        <GridItem text="RotatingParticleMesh" imgSrc={RotatingParticleMeshImg} />
        <GridItem text="WebGLFluid" imgSrc={WebGLFluidImg} />
        <GridItem text="Shaders" imgSrc={ShadersImg} />
        <GridItem text="RippleMousePlasma" imgSrc={RippleMousePlasmaImg} />
        <GridItem text="Combined" imgSrc={CombinedImg} />
        <GridItem text="CirclesPattern" imgSrc={CirclesPatternImg} />
      </div>
    </div>
  );
}

interface GridItemProps {
  text: string;
  imgSrc?: string;
}

function GridItem({ text, imgSrc }: GridItemProps) {
  return (
    <a className={style.gridItem} href={'/' + text}>
      {imgSrc && <img src={imgSrc} alt="" />}

      <span children={text} />
    </a>
  );
}
