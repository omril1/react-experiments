import * as Loadable_ from 'react-loadable';
import * as React from 'react';
import { History } from 'history';
import { hot } from 'react-hot-loader';
import { Route, Router, Switch } from 'react-router';

const Loadable = (loader: () => Promise<{ default: React.ComponentType<any> }>) => {
  return Loadable_({ loader, loading: () => <div>Loading...</div> });
};

const NeonHex = Loadable(() => import('./Routes/NeonHex'));
const ParticleSwirl = Loadable(() => import('./Routes/ParticleSwirl'));
const Welcome = Loadable(() => import('app/Routes/Welcome'));
const WebGLWater = Loadable(() => import('app/Routes/WebGLWater'));
const DonutSwirl = Loadable(() => import('app/Routes/DonutSwirl'));
const RotatingParticleMesh = Loadable(() => import('app/Routes/RotatingParticleMesh'));
const WebGLFluid = Loadable(() => import('app/Routes/WebGLFluid'));
const Shaders = Loadable(() => import('app/Routes/Shaders'));
const RippleMousePlasma = Loadable(() => import('app/Routes/RippleMousePlasma'));
const Combined = Loadable(() => import('app/Routes/Combined'));
const CirclesPattern = Loadable(() => import('app/Routes/CirclesPattern'));

// render react DOM
export const App = hot(module)(({ history }: { history: History }) => (
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={Welcome} />
      <Route path="/ParticleSwirl" component={ParticleSwirl} />
      <Route path="/NeonHex" component={NeonHex} />
      <Route path="/WebGLWater" component={WebGLWater} />
      <Route path="/DonutSwirl" component={DonutSwirl} />
      <Route path="/RotatingParticleMesh" component={RotatingParticleMesh} />
      <Route path="/WebGLFluid" component={WebGLFluid} />
      <Route path="/Shaders" component={Shaders} />
      <Route path="/RippleMousePlasma" component={RippleMousePlasma} />
      <Route path="/Combined" component={Combined} />
      <Route path="/CirclesPattern" component={CirclesPattern} />
    </Switch>
  </Router>
));
