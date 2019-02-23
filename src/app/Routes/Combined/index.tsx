import * as React from 'react';
import CombinedState from './CombinedState';
import NeonHex from '../NeonHex';
import RippleMousePlasma from '../RippleMousePlasma';
import { observer } from 'mobx-react';

@observer
export default class Combined extends React.Component {
  private combinedState = new CombinedState();

  componentDidMount() {
    document.addEventListener('keydown', this.combinedState.onKeyDown, true);
    this.combinedState.initControls();
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.combinedState.onKeyDown, true);
  }
  componentDidUpdate() {
    this.combinedState.updateGuiDisplay();
  }

  render() {
    const { opacity, mixBlendMode } = this.combinedState;
    return (
      <div>
        <NeonHex style={{ position: 'absolute', top: 0, opacity }} />
        <RippleMousePlasma style={{ position: 'absolute', top: 0, mixBlendMode }} />
      </div>
    );
  }
}
