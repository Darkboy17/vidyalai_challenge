import React from 'react';
import { WindowSizeProvider } from '../components/hooks/useWindowWidth';

// Declared the ContextAPI globally. This makes isSmallerDevice available throughout the app.
const App = ({ Component, pageProps }) => (
  <WindowSizeProvider>
    <Component {...pageProps} />
  </WindowSizeProvider>
);

export default App;
