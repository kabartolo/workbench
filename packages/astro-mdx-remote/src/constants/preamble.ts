// Preamble script to be injected as <script type="module">
// Required because Vite will not detect React components in remote MDX
// so it won't inject his preamble for us.
export const preamble = `
import RefreshRuntime from '/@react-refresh';

RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
`;
