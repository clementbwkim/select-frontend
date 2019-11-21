import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { ConnectedRoutes } from 'app/routes';
import { store } from 'app/store';

import { loadFonts } from 'app/config/fonts';
import { Actions } from 'app/services/user';
import { fetchUserInfo } from 'app/services/user/helper';

import { ConnectedEnvBadge } from 'app/components/EnvBadge';
import setTabKeyFocus from 'app/config/setTabKeyFocus';
import { sendPostRobotSetBlacklistOfOutlink, setSendPostRobotEvent } from 'app/utils/inAppMessageEvents';
import { initializeScrollEnd } from 'app/utils/onWindowScrollEnd';

// Show browser input focused outline when tab key is pressed
setTabKeyFocus();

// initialize ScrollEnd Event listener for imperssion tracking
initializeScrollEnd();

setSendPostRobotEvent();

class App extends React.Component {
  public componentDidMount() {
    fetchUserInfo().then((user) => {
      store.dispatch(Actions.initializeUser({ userDTO: user }));
    }).finally(() => {
      store.dispatch(Actions.fetchUserInfo({ isFetching: false }));
    });
    loadFonts();
    sendPostRobotSetBlacklistOfOutlink([
      '//ridibooks.com',
      '//library.ridibooks.com',
      '//outstanding.kr/premium-membership/',
      '//outstanding.kr/register/',
      '//outstanding.kr/login/',
    ]);
  }

  public render() {
    return (
      <Provider store={store}>
        <>
          <ConnectedEnvBadge />
          <ConnectedRoutes />
        </>
      </Provider>
    );
  }
}

render(
  <App />,
  document.getElementById('app'),
);
