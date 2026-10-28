/* Noble Estates & Motors: site settings. This is the only file you need to edit. */

// Your WhatsApp number: country code first, digits only (no + or spaces).
const WA_NUMBER = '2348026701578';

// Your live PocketBase address on Railway (no trailing slash).
// Paste it after you generate the domain in Railway, e.g. 'https://noble-production.up.railway.app'
const LIVE_PB_URL = 'https://noble-realsestate-production.up.railway.app';

// On your own computer the site talks to a local PocketBase; everywhere else it uses the live one.
const IS_LOCAL = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
const PB_URL = IS_LOCAL ? 'http://127.0.0.1:8090' : LIVE_PB_URL;
