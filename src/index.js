export { Scenario1 } from './scenarios/getPublicCros.js'
export { Scenario2 } from './scenarios/getUserRegisterLoginLogoutFlow.js'
export { webserviceTest } from './ws/wssScenario.js'

// Sleep ("think-time") min/max values in seconds:
globalThis.PAUSE_MIN = __ENV.PAUSE_MIN || 1;
globalThis.PAUSE_MAX = __ENV.PAUSE_MAX || 4;

// HOST name
globalThis.HOST = __ENV.HOST || 'test-api.k6.io';

// Application Backend URL
globalThis.BACKEND_URL = __ENV.BACKEND_URL || 'https://test-api.k6.io';

// Location of the config file to run:
const CONFIG_FILE = __ENV.CONFIG_FILE || '../src/config/smoke_load_config.json';

const testConfig = JSON.parse(open(CONFIG_FILE))


export const options = Object.assign({
  insecureSkipTlsVerify: false,
}, testConfig);

export default function () {
  console.log("no scenarios to run...");
}