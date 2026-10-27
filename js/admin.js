/* Admin dashboard: sign in with your PocketBase superuser account. */
const $ = id => document.getElementById(id);
const yr = new Date().getFullYear();
const SPEC = {
  property: [
    { k: 'title', l: 'Title', t: 'text', req: 1, w: 2, ph: 'e.g. 4-Bedroom Detached House' },
    { k: 'houseType', l: 'House type', t: 'select', o: OPT.houseType },
    { k: 'status', l: 'Listing', t: 'select', o: OPT.status },
    { k: 'price', l: 'Price (₦)', t: 'number', req: 1, ph: '85000000' },
    { k: 'location', l: 'Location', t: 'text', req: 1, ph: 'Lekki, Lagos' },
    { k: 'beds', l: 'Beds', t: 'number', d: 3 }, { k: 'baths', l: 'Baths', t: 'number', d: 3 },
    { k: 'area', l: 'Area (m²)', t: 'number', d: 200 },
    { k: 'description', l: 'Description', t: 'area', req: 1, w: 2, ph: 'Describe the property, its features and surroundings' },
  ],
  car: [
    { k: 'title', l: 'Title', t: 'text', req: 1, w: 2, ph: 'e.g. 2019 Toyota Camry SE' },
    { k: 'make', l: 'Make', t: 'text', req: 1, list: 'makes', ph: 'Toyota' },
    { k: 'model', l: 'Model', t: 'text', req: 1, ph: 'Camry' },
    { k: 'year', l: 'Year', t: 'number', req: 1, d: yr },
    { k: 'price', l: 'Price (₦)', t: 'number', req: 1, ph: '18500000' },
    { k: 'condition', l: 'Condition', t: 'select', o: OPT.condition },
    { k: 'bodyType', l: 'Body type', t: 'select', o: OPT.bodyType },
    { k: 'transmission', l: 'Gearbox', t: 'select', o: OPT.transmission },
    { k: 'fuel', l: 'Fuel', t: 'select', o: OPT.fuel },
    { k: 'mileage', l: 'Mileage (km)', t: 'number', d: 0 },
    { k: 'color', l: 'Colour', t: 'text', ph: 'Black' },
    { k: 'location', l: 'Location', t: 'text', req: 1, w: 2, ph: 'Ikeja, Lagos' },
    { k: 'description', l: 'Description', t: 'area', req: 1, w: 2, ph: 'Condition, service history, features, papers' },
  ],
};

const U = i => `https://images.unsplash.com/photo-${i}?auto=format&fit=crop&w=1200&q=70`;
const DEMO = {
  property: [
    { title: 'Contemporary 5-Bedroom Duplex', houseType: 'Duplex', status: 'Sale', price: 285000000, location: 'Lekki Phase 1, Lagos', beds: 5, baths: 6, area: 420, description: 'A striking duplex with double-height living spaces, a fitted kitchen, boys quarters and a private garden. Gated estate with 24/7 power backup and security.', i: ['1613490493576-7fde63acd811', '1600596542815-ffad4c1539a9', '1600585154340-be6161a56a0c'] },
    { title: 'Luxury Villa with Pool', houseType: 'Villa', status: 'Sale', price: 520000000, location: 'Banana Island, Ikoyi', beds: 6, baths: 7, area: 780, description: 'Waterfront villa with a private pool, cinema room, smart-home wiring and a three-car garage.', i: ['1512917774080-9991f1c4c750', '1564013799919-ab600027ffc6'] },
    { title: 'Cozy 3-Bedroom Bungalow', houseType: 'Bungalow', status: 'Sale', price: 78000000, location: 'Magodo Phase 2, Lagos', beds: 3, baths: 3, area: 230, description: 'Well-kept bungalow on a quiet street with a spacious compound, tiled floors, ample parking and a boys quarters.', i: ['1570129477492-45c003edd2be', '1568605114967-8130f3a36994'] },
    { title: 'Serviced 2-Bedroom Apartment', houseType: 'Apartment', status: 'Rent', price: 6500000, location: 'Victoria Island, Lagos', beds: 2, baths: 2, area: 120, description: 'Bright serviced apartment with a gym, pool, concierge and reliable power. Walking distance to restaurants and offices.', i: ['1502672260266-1c1ef2d93688', '1545324418-cc1a3fa10c00'] },
  ],
  car: [
    { title: '2020 Porsche 911 Carrera', make: 'Porsche', model: '911 Carrera', year: 2020, bodyType: 'Coupe', condition: 'Foreign used', transmission: 'Automatic', fuel: 'Petrol', mileage: 21000, color: 'Silver', price: 165000000, location: 'Lekki, Lagos', description: 'Clean foreign-used 911 with full service history, customs papers and one careful owner.', i: ['1503376780353-7e6692767b70'] },
    { title: '2018 Ford Mustang GT', make: 'Ford', model: 'Mustang GT', year: 2018, bodyType: 'Coupe', condition: 'Foreign used', transmission: 'Automatic', fuel: 'Petrol', mileage: 38000, color: 'Red', price: 48000000, location: 'Ikeja, Lagos', description: '5.0 V8 with a clean interior, fresh tyres and complete papers.', i: ['1494976388531-d1058494cdd8'] },
    { title: '2021 BMW M4 Competition', make: 'BMW', model: 'M4 Competition', year: 2021, bodyType: 'Coupe', condition: 'Foreign used', transmission: 'Automatic', fuel: 'Petrol', mileage: 15000, color: 'Green', price: 92000000, location: 'Victoria Island, Lagos', description: 'Low mileage, carbon trim and a full dealer service record.', i: ['1555215695-3004980ad54e'] },
  ],
};

let tab = 'property', editing = null, keep = [], added = [], items = [], enqCount = 0;
const K = () => KIND[tab];

/* ---------- sign in ---------- */
function gate() {
  const on = pb.isAdmin();
  $('login').classList.toggle('hidden', on); $('app').classList.toggle('hidden', !on);
  if (on) show(tab);
}
$('loginForm').onsubmit = async e => {
  e.preventDefault(); const b = e.target.querySelector('button'); b.disabled = true; $('loginErr').textContent = '';
  try { await pb.login(e.target.email.value.trim(), e.target.password.value); e.target.reset(); gate(); }
  catch (err) { $('loginErr').textContent = err.offline ? 'Cannot reach PocketBase. Check that it is running.' : 'Wrong email or password.'; }
  b.disabled = false;
};
$('logout').onclick = () => { pb.logout(); gate(); };
function expired() { pb.logout(); gate(); toast('Session expired. Sign in again.', false); }

/* ---------- tabs ---------- */
document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => show(b.dataset.tab));
function show(t) {
  tab = t; resetForm(false);
  document.querySelectorAll('[data-tab]').forEach(b => {
    const on = b.dataset.tab === t; b.setAttribute('aria-selected', on);
    b.className = `px-4 py-2 rounded-full text-sm font-semibold transition ${on ? 'bg-ink text-bg' : 'text-mute hover:text-ink'}`;
  });
  $('work').className = t === 'enq' ? 'mt-8' : 'grid lg:grid-cols-[480px_1fr] gap-8 mt-8 items-start';
  $('form').classList.toggle('hidden', t === 'enq');
  if (t !== 'enq') renderForm();
  load();
}

/* ---------- form ---------- */
function field(f) {
  const id = 'f_' + f.k, c = f.t === 'select' ? `<select id="${id}" class="inp">${oh(f.o)}</select>`
    : f.t === 'area' ? `<textarea id="${id}" rows="5" class="inp" ${f.req ? 'required' : ''} placeholder="${esc(f.ph || '')}"></textarea>`
    : `<input id="${id}" type="${f.t}" class="inp" ${f.req ? 'required' : ''} ${f.t === 'number' ? 'min="0"' : ''} ${f.list ? `list="${f.list}"` : ''} placeholder="${esc(f.ph || '')}">`;
  return `<div class="${f.w === 2 ? 'col-span-2' : ''}"><label class="lbl" for="${id}">${f.l}</label>${c}</div>`;
}
function renderForm() {
  const noun = tab === 'car' ? 'car' : 'property';
  $('form').innerHTML = `<h2 class="font-display text-2xl font-bold">${editing ? 'Edit' : 'Add a'} ${noun}</h2>
<datalist id="makes">${MAKES.map(m => `<option value="${m}">`).join('')}</datalist>
<div class="grid grid-cols-2 gap-3">${SPEC[tab].map(field).join('')}</div>
<div><span class="lbl">Pictures <span id="imgCount" class="text-mute font-normal"></span></span>
<label for="files" class="block rounded-xl border-2 border-dashed border-line p-6 text-center cursor-pointer hover:border-${K().acc} transition"><span class="font-medium">Choose pictures</span><br><span class="text-sm text-mute">JPG or PNG, up to 5. The first one is the cover.</span></label>
<input id="files" type="file" accept="image/*" multiple class="sr-only"><div id="previews" class="grid grid-cols-5 gap-2 mt-3"></div></div>
<div class="flex gap-3"><button id="saveBtn" class="flex-1 rounded-xl py-3 font-semibold bg-${K().acc} text-onacc hover:opacity-90 transition">${editing ? 'Save changes' : 'Publish ' + noun}</button>
${editing ? '<button type="button" id="cancel" class="rounded-xl px-5 py-3 font-semibold border border-line hover:bg-bg">Cancel</button>' : ''}</div>`;
  SPEC[tab].forEach(f => { const v = editing ? editing[f.k] : f.d; if (v !== undefined && v !== null) $('f_' + f.k).value = v; });
  $('files').onchange = onFiles;
  if ($('cancel')) $('cancel').onclick = () => resetForm(true);
  previews();
}
function resetForm(redraw = true) {
  added.forEach(a => URL.revokeObjectURL(a.url)); editing = null; keep = []; added = [];
  if (redraw && tab !== 'enq') renderForm();
}
const shrink = f => new Promise((res, rej) => {
  const u = URL.createObjectURL(f), i = new Image();
  i.onload = () => { const s = Math.min(1, 1600 / Math.max(i.width, i.height)), c = document.createElement('canvas');
    c.width = Math.round(i.width * s); c.height = Math.round(i.height * s); c.getContext('2d').drawImage(i, 0, 0, c.width, c.height);
    URL.revokeObjectURL(u); c.toBlob(b => b ? res(b) : rej(), 'image/jpeg', .8); };
  i.onerror = () => { URL.revokeObjectURL(u); rej(); }; i.src = u;
});
async function onFiles(e) {
  const room = 5 - keep.length - added.length, fs = [...e.target.files];
  if (fs.length > room) toast(`Only 5 pictures allowed. Added ${Math.max(room, 0)}.`, false);
  for (const f of fs.slice(0, Math.max(room, 0))) {
    try { const blob = await shrink(f); added.push({ blob, url: URL.createObjectURL(blob) }); } catch (x) { toast(`${f.name} is not a usable image`, false); }
  }
  e.target.value = ''; previews();
}
function previews() {
  $('imgCount').textContent = `(${keep.length + added.length} of 5)`;
  const all = [...keep.map((f, k) => ['k', k, pb.file(editing, f, '160x120')]), ...added.map((a, k) => ['a', k, a.url])];
  $('previews').innerHTML = all.map(([t, k, s], n) => `<div class="relative aspect-square rounded-lg overflow-hidden bg-bg"><img src="${esc(s)}" alt="Picture ${n + 1}" class="w-full h-full object-cover">${n === 0 ? '<span class="absolute bottom-1 left-1 px-1.5 rounded bg-black/70 text-white text-[10px]">Cover</span>' : ''}<button type="button" data-t="${t}" data-k="${k}" aria-label="Remove picture ${n + 1}" class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs">✕</button></div>`).join('');
  $('previews').querySelectorAll('button').forEach(b => b.onclick = () => {
    const k = +b.dataset.k; if (b.dataset.t === 'k') keep.splice(k, 1); else { URL.revokeObjectURL(added[k].url); added.splice(k, 1); }
    previews();
  });
}
$('form').onsubmit = async e => {
  e.preventDefault();
  if (!keep.length && !added.length && !(editing && editing.imageUrls)) return toast('Add at least one picture', false);
  const fd = new FormData();
  SPEC[tab].forEach(f => fd.append(f.k, $('f_' + f.k).value.trim()));
  added.forEach((a, i) => fd.append(editing ? 'images+' : 'images', a.blob, `photo-${Date.now()}-${i}.jpg`));
  if (editing) editing.images.filter(x => !keep.includes(x)).forEach(x => fd.append('images-', x));
  const b = $('saveBtn'); b.disabled = true;
  try { const was = !!editing; await pb.save(K().coll, editing && editing.id, fd); toast(was ? 'Changes saved' : 'Published'); resetForm(); await load(); }
  catch (err) { if (err.status === 401 || err.status === 403) return expired(); toast(err.message, false); }
  const nb = $('saveBtn'); if (nb) nb.disabled = false;
};

/* ---------- lists ---------- */
async function load() {
  $('list').innerHTML = '<p class="text-mute py-10 text-center">Loading…</p>';
  try {
    if (tab === 'enq') { const d = await pb.list('enquiries', { perPage: 200 }); items = d.items; enqCount = d.totalItems; }
    else {
      const [d, e] = await Promise.all([pb.list(K().coll, { perPage: 200 }), pb.list('enquiries', { perPage: 1 })]);
      items = d.items; enqCount = e.totalItems;
    }
  } catch (err) {
    if (err.status === 401 || err.status === 403) return expired();
    $('list').innerHTML = `<p class="text-red-600 py-10 text-center">${err.offline ? 'Cannot reach PocketBase. Check that it is running.' : esc(err.message)}</p>`; return;
  }
  stats(); draw();
}
function stats() {
  const sold = items.filter(r => r.sold).length;
  const s = tab === 'enq' ? [['Enquiries', items.length]] : [['Listings', items.length], ['Available', items.length - sold], ['Sold or let', sold], ['Enquiries', enqCount]];
  $('stats').innerHTML = s.map(([l, v]) => `<div class="rounded-2xl p-5 bg-surface border border-line"><p class="text-sm text-mute">${l}</p><p class="font-display text-3xl font-bold mt-1">${v}</p></div>`).join('');
  $('listTitle').textContent = tab === 'enq' ? 'Customer enquiries' : tab === 'car' ? 'All cars' : 'All properties';
}
const phoneWa = p => { let d = String(p).replace(/\D/g, ''); if (d.startsWith('0')) d = '234' + d.slice(1); return `https://wa.me/${d}`; };
function draw() {
  if (tab === 'enq') {
    $('list').innerHTML = items.length ? items.map(r => {
      const page = r.listingType ? KIND[r.listingType].page : '';
      return `<div class="rounded-2xl p-4 bg-surface border border-line flex flex-wrap gap-3 items-center justify-between">
<div class="min-w-0"><p class="font-semibold">${esc(r.name)} <span class="text-sm font-normal text-mute">${new Date(r.created.replace(' ', 'T')).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span></p>
<p class="text-sm text-mute truncate">${esc(r.message || '')}${r.listingId ? ` about <a class="underline" href="${page}?id=${esc(r.listingId)}">${esc(r.listingTitle)}</a>` : ''}</p></div>
<div class="flex gap-2 text-sm font-medium"><a class="px-3 py-2 rounded-lg border border-line hover:bg-bg" href="tel:${esc(r.phone)}">${esc(r.phone)}</a><a class="px-3 py-2 rounded-lg border border-line hover:bg-bg" target="_blank" rel="noopener" href="${phoneWa(r.phone)}">WhatsApp</a><button data-del="${r.id}" class="px-3 py-2 rounded-lg text-red-600 hover:bg-red-500/10">Delete</button></div></div>`;
    }).join('') : '<p class="text-mute py-10 text-center">No enquiries yet. Call back requests from listing pages appear here.</p>';
  } else {
    $('list').innerHTML = items.length ? items.map(r => {
      const im = imgs(r, '160x120')[0], car = tab === 'car';
      return `<div class="flex gap-4 items-center rounded-2xl p-3 bg-surface border border-line ${r.sold ? 'opacity-70' : ''}">
<img src="${esc(im || '')}" alt="" class="w-24 h-20 rounded-xl object-cover bg-line shrink-0" onerror="this.style.opacity=0">
<div class="min-w-0 flex-1"><p class="font-semibold truncate">${esc(r.title)}${r.sold ? ' <span class="ml-1 px-2 py-0.5 rounded-full text-xs bg-line">Sold</span>' : ''}</p>
<p class="text-sm text-mute truncate">${esc(car ? r.condition : r.houseType)}, ${esc(r.location)}</p>
<p class="text-sm font-medium text-${K().acc}">${money(r.price)}${car ? '' : ' for ' + r.status.toLowerCase()}</p></div>
<div class="flex flex-wrap gap-1 justify-end text-sm font-medium"><a href="${K().page}?id=${r.id}" class="px-3 py-2 rounded-lg hover:bg-bg">View</a><button data-edit="${r.id}" class="px-3 py-2 rounded-lg hover:bg-bg">Edit</button><button data-sold="${r.id}" class="px-3 py-2 rounded-lg hover:bg-bg">${r.sold ? 'Reopen' : 'Mark sold'}</button><button data-del="${r.id}" class="px-3 py-2 rounded-lg text-red-600 hover:bg-red-500/10">Delete</button></div></div>`;
    }).join('') : `<div class="text-center py-10"><p class="text-mute">Nothing here yet. Add your first one with the form, or fill the site with sample listings to see how it looks.</p><button id="demo" class="mt-4 px-5 py-2.5 rounded-xl font-semibold border border-line hover:bg-bg">Load sample listings</button></div>`;
  }
}
$('list').onclick = async e => {
  const b = e.target.closest('button'); if (!b) return;
  try {
    if (b.id === 'demo') {
      b.disabled = true; b.textContent = 'Adding…';
      for (const { i, ...r } of DEMO[tab]) await pb.save(K().coll, null, { ...r, imageUrls: i.map(U).join('\n') });
      toast('Sample listings added'); return load();
    }
    if (b.dataset.edit) {
      editing = items.find(r => r.id === b.dataset.edit); keep = [...(editing.images || [])]; added = [];
      renderForm(); $('form').scrollIntoView({ behavior: 'smooth', block: 'start' }); return;
    }
    if (b.dataset.sold) { const r = items.find(x => x.id === b.dataset.sold); await pb.save(K().coll, r.id, { sold: !r.sold }); toast(r.sold ? 'Listing reopened' : 'Marked as sold'); return load(); }
    if (b.dataset.del && confirm('Delete this permanently?')) {
      await pb.del(tab === 'enq' ? 'enquiries' : K().coll, b.dataset.del); toast('Deleted'); if (editing && editing.id === b.dataset.del) resetForm(); return load();
    }
  } catch (err) { if (err.status === 401 || err.status === 403) return expired(); toast(err.message, false); }
};

gate();
