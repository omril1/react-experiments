import { random } from 'lodash';

namespace RandomPoint {
  export const negativeOrPositive = () => (Math.random() > 0.5 ? -1 : 1);

  export const getRandomPoint = () => {
    const angle = Math.random() * 2 * Math.PI;
    const x = (Math.cos(angle) * Math.random()) / 2 + 0.5;
    const y = (Math.sin(angle) * Math.random()) / 2 + 0.5;
    return new Vector2(x, y);
  };

  export const getRandomPointUniform = () => {
    const angle = Math.random() * 2 * Math.PI;
    const x = (Math.cos(angle) * Math.sqrt(Math.random())) / 2 + 0.5;
    const y = (Math.sin(angle) * Math.sqrt(Math.random())) / 2 + 0.5;
    return new Vector2(x, y);
  };

  export const getRandomPointDror = () => {
    const xQuarter = Math.random();
    // x ** 2 + y ** 2 = 1
    // y = sqrt(1 - (x ** 2))
    const yDistance = Math.sqrt(1 - xQuarter ** 2);
    const yQuarter = Math.random() * yDistance;
    const x = (xQuarter / 2) * negativeOrPositive() + 0.5;
    const y = (yQuarter / 2) * negativeOrPositive() + 0.5;
    return new Vector2(x, y);
  };

  export const getRandomPointAllOfTheAbove = () => {
    return [getRandomPoint, getRandomPointUniform, getRandomPointDror][random(0, 2, false)]();
  };

  /**
   * @description True random distribution
   */
  export const getRandomPointWhile = () => {
    while (true) {
      const x = random(-1, 1, true);
      const y = random(-1, 1, true);
      if (x ** 2 + y ** 2 <= 1) {
        const x2 = x / 2 + 0.5;
        const y2 = y / 2 + 0.5;
        return new Vector2(x2, y2);
      }
    }
  };

  export class Vector2 {
    constructor(public x: number, public y: number) {}

    public getNewRotatedVector(center: Vector2, angle: number) {
      const c = Math.cos(angle);
      const s = Math.sin(angle);

      const x = this.x - center.x;
      const y = this.y - center.y;

      return new Vector2(x * c - y * s + center.x, x * s + y * c + center.y);
    }
  }
}

export default RandomPoint;
