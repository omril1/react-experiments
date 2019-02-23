import BLEND_MODE_OPTIONS from './BLEND_MODE_OPTIONS';
import { BlendMode } from 'csstype';
import { GUI } from 'dat.gui';
import { action, computed, observable } from 'mobx';

const mod = (x: number, n: number) => ((x % n) + n) % n;

export default class CombinedState {
  @observable public blendIndex: number = 0;
  @observable public opacity: number = 1;
  private readonly gui = new GUI();

  @computed public get mixBlendMode(): BlendMode {
    return BLEND_MODE_OPTIONS[mod(this.blendIndex, BLEND_MODE_OPTIONS.length)];
  }

  @action public onKeyDown = (event: KeyboardEvent) => {
    event = event || window.event;

    if (event.keyCode == 38) {
      // up arrow
      this.setBlendMode(this.blendIndex + 1);
    } else if (event.keyCode == 40) {
      // down arrow
      this.setBlendMode(this.blendIndex - 1);
    } else if (event.keyCode == 37) {
      // left arrow
      this.setOpacity(this.opacity - 0.01);
    } else if (event.keyCode == 39) {
      // right arrow
      this.setOpacity(this.opacity + 0.01);
    }
  };

  @action public setOpacity = (n: number) => (this.opacity = Math.min(1, Math.max(n, 0)));
  @action public setBlendMode = (n: number) => (this.blendIndex = mod(n, BLEND_MODE_OPTIONS.length));
  public updateGuiDisplay = () => this.gui.updateDisplay();

  public initControls() {
    this.gui.add(this, 'blendIndex', 0, BLEND_MODE_OPTIONS.length).step(1);
    this.gui.add(this, 'opacity', 0, 1).step(0.01);
    this.gui.close();
  }
}
