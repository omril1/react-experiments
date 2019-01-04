import * as React from 'react';
import NeonHex from '../NeonHex';
import RippleMousePlasma from '../RippleMousePlasma';

export default function Combined() {
  return (
    <div>
      <NeonHex style={{ position: 'absolute', top: 0 }} />
      <RippleMousePlasma style={{ position: 'absolute', top: 0, mixBlendMode: 'soft-light' }} />
    </div>
  );
}
