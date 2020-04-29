import Server from './server';
import { requestConfig } from './methods';

let server = {}; // Singleton RPC server reference

/**
 * Create a new RPC server and pass in a the requestConfig object
 */
function startRpcServer() {
  server = new Server();

  const groupsPromise = new Promise((resolve, reject) => {
    server.resolveGroupFetch = resolve;
    server.rejectGroupFetch = reject;
  });

  const requestGroups = () => groupsPromise;

  server.register('requestConfig', requestConfig);
  server.register('requestGroups', requestGroups);

  return server;
}

/**
 * @typedef {Object} SidebarFrame
 * @prop {Window} frame - A reference to the window containing the sidebar application
 * @prop {string} origin - The sidebar window's origin
 */

/**
 * Gets the last used sidebar frame and origin.
 *
 * @returns {Promise<SidebarFrame>} - The `SidebarFrame`
 */
function getSidebarWindow() {
  return server.sidebarWindow;
}

export { startRpcServer, getSidebarWindow };
