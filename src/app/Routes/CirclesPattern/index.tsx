import * as React from 'react';
import * as style from './style.scss';
import { times } from 'lodash';

// Forked from https://codepen.io/rthavi/pen/QgEwYY

const rows = 20;
const orbs = 25;
const pattern = 5;

export default function CirclesPattern() {
  return (
    <div className={style.root}>
      {times(rows).map(i => (
        <OrbRow key={i} />
      ))}
    </div>
  );
}

function OrbRow() {
  return (
    <div className={style.orbRow}>
      {times(orbs).map(i => (
        <Orbs key={i} />
      ))}
    </div>
  );
}

function Orbs() {
  return (
    <div className={style.orbs}>
      {times(pattern).map(i => (
        <Orb key={i} />
      ))}
    </div>
  );
}

function Orb() {
  return <div className={style.orb} />;
}
