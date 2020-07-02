import { createContext } from 'preact';

/**
 * Configuration object for the file picker application, read from a JSON
 * script tag injected into the page by the backend.
 */

// This is the place to define the complete set of config properties that the
// backend might set.
//
// For now we just use `any` and don't check this at build time.

/** @type {any} */
const defaultConfig = { api: {} };

export const Config = createContext(defaultConfig);
