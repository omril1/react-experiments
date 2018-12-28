import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from 'app';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import './global-styles.scss';

// prepare MobX stores
const history = createBrowserHistory();

// render react DOM
ReactDOM.render(
  <Provider>
    <App history={history} />
  </Provider>,
  document.getElementById('root'),
);
