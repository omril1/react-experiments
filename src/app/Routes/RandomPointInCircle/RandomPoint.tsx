import { random } from 'lodash';

namespace RandomPoint {
  export const negativeOrPositive = () => (Math.random() > 0.5 ? -1 : 1);

  export const getRandomAngle = () => Math.random() * 2 * Math.PI;

  export const getRandomPoint = () => {
    const angle = getRandomAngle();
    const x = Math.cos(angle) * Math.random();
    const y = Math.sin(angle) * Math.random();
    return new Vector2(x, y);
  };

  export const getRandomPointUniform = () => {
    const angle = getRandomAngle();
    const x = Math.cos(angle) * Math.sqrt(Math.random());
    const y = Math.sin(angle) * Math.sqrt(Math.random());
    return new Vector2(x, y);
  };

  export const getRandomPointDror = () => {
    const xQuarter = Math.random();
    // x ** 2 + y ** 2 = 1
    // y = sqrt(1 - (x ** 2))
    const yDistance = Math.sqrt(1 - xQuarter ** 2);
    const yQuarter = Math.random() * yDistance;
    const x = xQuarter * negativeOrPositive();
    const y = yQuarter * negativeOrPositive();
    return new Vector2(x, y);
  };

  export const getRandomPointInChord = () => {
    const angle1 = getRandomAngle();
    const angle2 = getRandomAngle();
    const p1 = new Vector2(Math.cos(angle1), Math.sin(angle1));
    const p2 = new Vector2(Math.cos(angle2), Math.sin(angle2));
    return new Vector2((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  };

  export const getMidpointOfRandomChords = () => {
    const chordLength = Math.random() * 2; // from 0 to 2
    // 2 = PI rad, 1 = 0.5PI rad
    const twoThirdsPI = (2 / 3) * Math.PI;

    // from 0 to PI radians (180 degrees) with 50% chance to be negative
    const angle1 = getRandomAngle();
    const angle2 = angle1 + random(twoThirdsPI, twoThirdsPI * 2, true) * Math.random();
    const p1 = new Vector2(Math.cos(angle1), Math.sin(angle1));
    const p2 = new Vector2(Math.cos(angle2), Math.sin(angle2));
    return new Vector2((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
  };

  /**
   * @description True random distribution
   */
  export const getRandomPointWhile = () => {
    while (true) {
      const x = random(-1, 1, true);
      const y = random(-1, 1, true);
      if (x ** 2 + y ** 2 <= 1) {
        const x2 = x;
        const y2 = y;
        return new Vector2(x2, y2);
      }
    }
  };

  // prettier-ignore
  export const all: ReadonlyArray<{method: () => Vector2, description: string}> = [
    { method: getRandomPoint           , description: 'getRandomPoint \n(Random angle scaled uniformly between 0 and 1)'               ,},
    { method: getRandomPointUniform    , description: 'getRandomPointUniform \n(same as above, but scaled as Math.sqrt(Math.random()))',},
    { method: getRandomPointDror       , description: "getRandomPointDror \n(Dror's solution)"                                         ,},
    { method: getRandomPointInChord    , description: 'getRandomPointInChord'                                                          ,},
    { method: getMidpointOfRandomChords, description: 'getMidpointOfRandomChords'                                                      ,},
    { method: getRandomPointWhile      , description: 'getRandomPointWhile \n(keep generating points in square until they fit)'        ,},
  ];

  export class Vector2 {
    constructor(public x: number, public y: number) {}

    private toString = () => `${this.x},${this.y}`;

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
