/* Minimal PocketBase client (REST, no dependencies). Needs PocketBase v0.23 or newer. */
const pb = (() => {
  const KEY = 'noble_auth';
  let auth = null;
  try { auth = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}

  const clear = () => { auth = null; try { localStorage.removeItem(KEY); } catch (e) {} };
  const expiry = t => {
    try { return JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000; }
    catch (e) { return 0; }
  };
  if (auth && expiry(auth.token) < Date.now()) clear();

  async function req(path, { method = 'GET', body, params } = {}) {
    const url = new URL(PB_URL + '/api/' + path, location.href);
    for (const [k, v] of Object.entries(params || {})) if (v !== '' && v != null) url.searchParams.set(k, v);
    const headers = {};
    if (auth) headers.Authorization = auth.token;
    const opt = { method, headers };
    if (body instanceof FormData) opt.body = body;
    else if (body) { headers['Content-Type'] = 'application/json'; opt.body = JSON.stringify(body); }

    let res;
    try { res = await fetch(url, opt); }
    catch (e) { throw Object.assign(new Error('Cannot reach the server.'), { offline: true }); }
    if (res.status === 204) return null;

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (auth && (res.status === 401 || res.status === 403)) clear();
      const first = Object.values(data.data || {})[0];
      throw Object.assign(new Error((first && first.message) || data.message || 'Request failed.'), { status: res.status });
    }
    return data;
  }

  return {
    // Escape a value for use inside a PocketBase filter string.
    q: s => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'),
    isAdmin: () => !!auth,
    async login(email, password) {
      clear();
      const d = await req('collections/_superusers/auth-with-password', { method: 'POST', body: { identity: email, password } });
      auth = { token: d.token };
      try { localStorage.setItem(KEY, JSON.stringify(auth)); } catch (e) {}
    },
    logout: clear,
    list: (c, o = {}) => req(`collections/${c}/records`, {
      params: { filter: o.filter, sort: o.sort || '-created', page: o.page || 1, perPage: o.perPage || 12 } }),
    get: (c, id) => req(`collections/${c}/records/${encodeURIComponent(id)}`),
    // body can be a plain object (JSON) or FormData (needed when uploading pictures)
    save: (c, id, body) => req(`collections/${c}/records${id ? '/' + id : ''}`, { method: id ? 'PATCH' : 'POST', body }),
    del: (c, id) => req(`collections/${c}/records/${id}`, { method: 'DELETE' }),
    file: (r, name, thumb) => `${PB_URL}/api/files/${r.collectionId}/${r.id}/${encodeURIComponent(name)}${thumb ? '?thumb=' + thumb : ''}`,
  };
})();
