import * as React from 'react';
import Welcome from 'app/Routes/Welcome';
import { History } from 'history';
import { hot } from 'react-hot-loader';
import { Route, Router, Switch } from 'react-router';

// render react DOM
export const App = hot(module)(({ history }: { history: History }) => (
  <Router history={history}>
    <Switch>
      <Route path="/" exact component={Welcome} />
    </Switch>
  </Router>
));
