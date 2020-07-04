// Polyfills.
import 'focus-visible';

// Setup app.
import { createElement, render } from 'preact';

import { Config } from './config';
import BasicLtiLaunchApp from './components/BasicLtiLaunchApp';
import FilePickerApp from './components/FilePickerApp';
import { startRpcServer } from '../postmessage_json_rpc/server';

// Create an RPC Server and start listening to postMessage calls.
const rpcServer = startRpcServer();

const rootEl = /** @type {HTMLElement} */ (document.querySelector('#app'));
const configEl = /** @type {HTMLElement} */ (document.querySelector(
  '.js-config'
));
const config = JSON.parse(/** @type {string} */ (configEl.textContent));

render(
  <Config.Provider value={config}>
    {config.mode === 'basic-lti-launch' && (
      <BasicLtiLaunchApp rpcServer={rpcServer} />
    )}
    {config.mode === 'content-item-selection' && <FilePickerApp />}
  </Config.Provider>,
  rootEl
);
