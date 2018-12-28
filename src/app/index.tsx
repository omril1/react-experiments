import * as React from 'react';
import NeonHex from './Routes/NeonHex';
import ParticleSwirl from './Routes/ParticleSwirl';
import Welcome from 'app/Routes/Welcome';
import { History } from 'history';
import { hot } from 'react-hot-loader';
import { Route, Router, Switch } from 'react-router';

// render react DOM
export const App = hot(module)(({ history }: { history: History }) => (
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={Welcome} />
      <Route path="/ParticleSwirl" component={ParticleSwirl} />
      <Route path="/NeonHex" component={NeonHex} />
    </Switch>
  </Router>
));
