//@ts-check
const puppeteer = require('puppeteer');

/* 
  Taking a screen shot of all the screens with puppeteer
*/

const ROUTES = [
  'ParticleSwirl',
  'NeonHex',
  'WebGLWater',
  'DonutSwirl',
  'RotatingParticleMesh',
  'WebGLFluid',
  'Shaders',
  'RippleMousePlasma',
  'Combined',
  'CirclesPattern',
  'RandomPointInCircle',
];

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const route of ROUTES) {
    try {
      const page = await browser.newPage();
      await page.goto('http://localhost:3000/' + route);
      await sleep(200);
      await page.screenshot({
        path: `images/${route}.jpg`,
        type: 'jpeg',
        quality: 100,
        fullPage: true,
      });
      await page.close();
      console.log(`${route} done!`);
    } catch (error) {
      console.error(error);
    }
  }

  await browser.close();
})().catch(console.error);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
