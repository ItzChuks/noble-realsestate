/* Noble Estates & Motors: shared UI. Homes and cars share the same code, driven by KIND below. */

/* ---------- theme ---------- */
tailwind.config = {
  darkMode: 'class',
  theme: { extend: {
    fontFamily: { display: ['"Bricolage Grotesque"', 'sans-serif'], sans: ['Figtree', 'sans-serif'] },
    colors: { bg: 'var(--bg)', surface: 'var(--surface)', ink: 'var(--ink)', mute: 'var(--mute)', line: 'var(--line)',
      home: 'var(--home)', motor: 'var(--motor)', brass: 'var(--brass)', onacc: 'var(--onacc)' } } }
};
(() => {
  let t = null; try { t = localStorage.getItem('noble_theme'); } catch (e) {}
  if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches)) document.documentElement.classList.add('dark');
})();
const sty = document.createElement('style');
sty.textContent = `
:root{--bg:#f0f3f1;--surface:#fff;--ink:#12201b;--mute:#56655e;--line:#dae1dd;--home:#0f6b57;--motor:#2a4d86;--brass:#8f6a2c;--onacc:#fff}
.dark{--bg:#0a1210;--surface:#111c18;--ink:#e8eeea;--mute:#93a39c;--line:#23332d;--home:#4fd1a8;--motor:#86b0f2;--brass:#d4a85a;--onacc:#07130f}
html{scroll-behavior:smooth}
:focus-visible{outline:2px solid var(--home);outline-offset:2px}
.inp{width:100%;border-radius:.75rem;padding:.7rem 1rem;background:var(--surface);color:var(--ink);border:1px solid var(--line);outline:none}
.inp:focus-visible{outline:none;box-shadow:0 0 0 2px var(--home)}
.lbl{display:block;font-size:.875rem;font-weight:500;margin-bottom:.375rem}
.shimmer{background:linear-gradient(90deg,var(--line) 25%,transparent 50%,var(--line) 75%);background-size:200% 100%;animation:sh 1.4s linear infinite}
@keyframes sh{to{background-position:-200% 0}}
@keyframes rise{from{opacity:0;transform:translateY(18px)}}
.rise{animation:rise .7s cubic-bezier(.2,.7,.2,1) both}
@media(prefers-reduced-motion:reduce){.rise,.shimmer{animation:none}html{scroll-behavior:auto}}`;
document.head.append(sty);

/* ---------- data shape ---------- */
const MAKES = ['Toyota', 'Lexus', 'Mercedes-Benz', 'BMW', 'Honda', 'Ford', 'Hyundai', 'Kia', 'Nissan', 'Land Rover', 'Volkswagen', 'Porsche', 'Peugeot'];
const OPT = {
  houseType: ['Duplex', 'Villa', 'Bungalow', 'Apartment', 'Terrace', 'Penthouse'],
  status: [['Sale', 'For sale'], ['Rent', 'For rent (per year)']],
  bodyType: ['SUV', 'Sedan', 'Hatchback', 'Coupe', 'Pickup', 'Bus/Van'],
  condition: ['Brand new', 'Foreign used', 'Nigerian used'],
  transmission: ['Automatic', 'Manual'],
  fuel: ['Petrol', 'Diesel', 'Hybrid', 'Electric'],
};
const KIND = {
  property: {
    coll: 'properties', page: 'property.html', list: 'properties.html', acc: 'home', plural: 'homes', cap: 'Home',
    ph: 'Search by name or area', search: ['title', 'location'],
    filters: [{ k: 'houseType', all: 'All house types', o: OPT.houseType }, { k: 'status', all: 'Sale and rent', o: [['Sale', 'For sale'], ['Rent', 'For rent']] }],
    sorts: [['-created', 'Newest first'], ['price', 'Price: low to high'], ['-price', 'Price: high to low']],
  },
  car: {
    coll: 'cars', page: 'car.html', list: 'cars.html', acc: 'motor', plural: 'cars', cap: 'Car',
    ph: 'Search by make, model or area', search: ['title', 'make', 'model', 'location'],
    filters: [{ k: 'make', all: 'All makes', o: MAKES }, { k: 'bodyType', all: 'All body types', o: OPT.bodyType }, { k: 'condition', all: 'Any condition', o: OPT.condition }],
    sorts: [['-created', 'Newest first'], ['price', 'Price: low to high'], ['-price', 'Price: high to low'], ['-year', 'Year: newest']],
  },
};

/* ---------- helpers ---------- */
const money = n => '₦' + Number(n || 0).toLocaleString('en-NG');
const km = n => Number(n || 0).toLocaleString('en-NG') + ' km';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wa = t => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(t)}`;
const oh = o => o.map(x => { const [v, l] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(v)}">${esc(l)}</option>`; }).join('');
const imgs = (r, thumb) => [
  ...(r.images || []).map(f => pb.file(r, f, thumb)),
  ...String(r.imageUrls || '').split('\n').map(s => s.trim()).filter(Boolean),
];
const I = {
  bed: '<path d="M3 18v-7a2 2 0 012-2h14a2 2 0 012 2v7M3 15h18M7 9V6h4v3"/>',
  bath: '<path d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM6 12V6a2 2 0 014 0"/>',
  area: '<path d="M4 4h16v16H4zM4 12h8v8"/>',
  pin: '<path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  gauge: '<path d="M4 17a8 8 0 1116 0"/><path d="M12 17l4-5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
};
const ico = (k, c = 'w-4 h-4') => `<svg class="${c} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[k]}</svg>`;
const WA_ICON = '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 01-13.4 7.8L3 21l1.3-4.4A9 9 0 1121 12z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-.8.8c-1-.4-1.8-1.2-2.2-2.2l.8-.8-1-2z"/></svg>';

function toast(m, ok = true) {
  const t = document.createElement('div');
  t.setAttribute('role', 'status');
  t.className = `fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${ok ? 'bg-home text-onacc' : 'bg-red-600 text-white'}`;
  t.textContent = m; document.body.append(t); setTimeout(() => t.remove(), 3200);
}
const notice = (title, msg) => `<div class="col-span-full text-center py-16"><p class="font-display text-2xl">${title}</p><p class="text-mute mt-2 max-w-md mx-auto">${msg}</p></div>`;
const failView = () => notice('We could not load the listings', 'Refresh the page, or message us on WhatsApp and we will send you what is available.');
const skeleton = n => Array(n).fill('<div class="rounded-2xl bg-surface border border-line overflow-hidden"><div class="aspect-[4/3] shimmer"></div><div class="p-5 space-y-3"><div class="h-6 w-1/2 shimmer rounded"></div><div class="h-4 w-3/4 shimmer rounded"></div></div></div>').join('');

/* ---------- listing card (homes and cars) ---------- */
function card(kind, r) {
  const K = KIND[kind], car = kind === 'car', im = imgs(r, '640x480')[0];
  const tag = car ? r.condition : `For ${r.status}`;
  const spec = car ? [['cal', r.year], ['gauge', km(r.mileage)], ['gear', r.transmission]]
                   : [['bed', `${r.beds || 0} beds`], ['bath', `${r.baths || 0} baths`], ['area', `${r.area || 0} m²`]];
  const per = !car && r.status === 'Rent' ? '<span class="text-sm font-sans text-mute"> / year</span>' : '';
  return `<a href="${K.page}?id=${esc(r.id)}" class="group block rounded-2xl overflow-hidden bg-surface border border-line hover:border-${K.acc} transition-colors">
<div class="relative aspect-[4/3] overflow-hidden bg-line">${im ? `<img src="${esc(im)}" alt="" loading="lazy" onerror="this.style.opacity=0" class="w-full h-full object-cover transition duration-500 group-hover:scale-105">` : ''}
<span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-${K.acc} text-onacc">${esc(tag)}</span>
<span class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-slate-800">${esc(car ? r.bodyType : r.houseType)}</span></div>
<div class="p-5"><p class="font-display text-2xl text-${K.acc}">${money(r.price)}${per}</p>
<h3 class="font-semibold text-lg mt-1">${esc(r.title)}</h3>
<p class="flex items-center gap-1.5 text-sm text-mute mt-1">${ico('pin')}${esc(r.location)}</p>
<div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-mute mt-4 pt-4 border-t border-line">${spec.map(([i, t]) => `<span class="flex items-center gap-1.5">${ico(i)}${esc(t)}</span>`).join('')}</div></div></a>`;
}

/* ---------- header and footer ---------- */
function chrome(active) {
  const L = [['index.html', 'Home'], ['properties.html', 'Homes'], ['cars.html', 'Cars']];
  const links = c => L.map(([h, n]) => `<a href="${h}" ${active === h ? 'aria-current="page"' : ''} class="${c} ${active === h ? 'text-ink font-semibold' : 'text-mute'} hover:text-ink transition">${n}</a>`).join('');
  document.getElementById('nav').innerHTML = `<header class="sticky top-0 z-50 backdrop-blur bg-bg/80 border-b border-line">
<div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
<a href="index.html" class="flex items-center gap-3" aria-label="Noble Estates and Motors, home">
<span class="flex" aria-hidden="true"><i class="w-4 h-4 rounded-full bg-home"></i><i class="w-4 h-4 rounded-full bg-motor -ml-1.5"></i></span>
<span class="font-display text-xl font-bold tracking-tight">Noble <span class="font-medium text-mute text-base">Estates &amp; Motors</span></span></a>
<div class="flex items-center gap-1"><nav class="hidden md:flex items-center gap-8 text-sm font-medium mr-4" aria-label="Main">${links('')}</nav>
<button id="themeBtn" aria-label="Switch between light and dark theme" class="w-10 h-10 rounded-full grid place-items-center hover:bg-line transition"></button>
<button id="menuBtn" aria-label="Open menu" aria-expanded="false" class="md:hidden w-10 h-10 rounded-full grid place-items-center hover:bg-line"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div></div>
<div id="mobileMenu" class="hidden md:hidden border-t border-line"><nav class="flex flex-col gap-1 px-4 py-3 text-sm font-medium" aria-label="Mobile">${links('py-2')}</nav></div></header>`;
  const tb = document.getElementById('themeBtn'),
    sun = '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon = '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>';
  const paint = () => tb.innerHTML = document.documentElement.classList.contains('dark') ? sun : moon; paint();
  tb.onclick = () => { const d = document.documentElement.classList.toggle('dark'); try { localStorage.setItem('noble_theme', d ? 'dark' : 'light'); } catch (e) {} paint(); };
  const mb = document.getElementById('menuBtn');
  mb.onclick = () => { const h = document.getElementById('mobileMenu').classList.toggle('hidden'); mb.setAttribute('aria-expanded', String(!h)); };
  document.getElementById('footer').innerHTML = `<footer class="border-t border-line mt-24"><div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3 text-sm text-mute">
<p><span class="font-display text-lg font-bold text-ink">Noble Estates &amp; Motors</span><br>Homes and cars from one trusted team.</p>
<nav class="flex flex-col gap-2" aria-label="Footer"><a class="hover:text-ink" href="properties.html">Homes for sale and rent</a><a class="hover:text-ink" href="cars.html">Cars for sale</a><a class="hover:text-ink" href="${wa('Hello Noble, I would like to make an enquiry.')}" target="_blank" rel="noopener">Chat on WhatsApp</a></nav>
<p>© ${new Date().getFullYear()} Noble Estates &amp; Motors<br><a class="hover:text-ink" href="admin.html">Staff login</a></p></div></footer>`;
}

/* ---------- homepage ---------- */
async function latest(kind, elId, countId) {
  const K = KIND[kind], el = document.getElementById(elId);
  el.innerHTML = skeleton(3);
  try {
    const d = await pb.list(K.coll, { filter: 'sold=false', perPage: 3 });
    el.innerHTML = d.items.length ? d.items.map(r => card(kind, r)).join('')
      : notice(`No ${K.plural} listed yet`, 'New listings are added regularly. Check back soon, or message us on WhatsApp.');
    if (countId) document.getElementById(countId).textContent = `${d.totalItems} available`;
  } catch (e) { console.error(e); el.innerHTML = failView(); }
}

/* ---------- browse page (properties.html and cars.html) ---------- */
function browse(kind) {
  const K = KIND[kind], $ = id => document.getElementById(id), P = new URLSearchParams(location.search);
  $('bar').innerHTML = `<input id="q" class="inp" placeholder="${K.ph}" aria-label="Search" autocomplete="off">` +
    K.filters.map(f => `<select id="${f.k}" class="inp" aria-label="${f.all}"><option value="">${f.all}</option>${oh(f.o)}</select>`).join('') +
    `<select id="sort" class="inp" aria-label="Sort">${oh(K.sorts)}</select>`;
  K.filters.forEach(f => $(f.k).value = P.get(f.k) || '');
  $('q').value = P.get('q') || '';
  let page = 1, pages = 1, seq = 0;

  async function load(more) {
    const my = ++seq;
    if (!more) { page = 1; $('grid').innerHTML = skeleton(6); $('more').classList.add('hidden'); }
    const q = $('q').value.trim(), f = ['sold=false'];
    if (q) f.push('(' + K.search.map(s => `${s}~"${pb.q(q)}"`).join('||') + ')');
    K.filters.forEach(x => { const v = $(x.k).value; if (v) f.push(`${x.k}="${pb.q(v)}"`); });
    try {
      const d = await pb.list(K.coll, { filter: f.join('&&'), sort: $('sort').value, page, perPage: 12 });
      if (my !== seq) return;
      pages = d.totalPages;
      const html = d.items.map(r => card(kind, r)).join('');
      if (more) $('grid').insertAdjacentHTML('beforeend', html);
      else $('grid').innerHTML = html || notice(`No ${K.plural} match those filters`, 'Clear a filter or search a different area.');
      $('count').textContent = `${d.totalItems} ${K.plural} found`;
      $('more').classList.toggle('hidden', page >= pages);
    } catch (e) { if (my === seq) { console.error(e); $('grid').innerHTML = failView(); } }
  }
  let t; $('q').addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => load(), 300); });
  [...K.filters.map(f => f.k), 'sort'].forEach(i => $(i).addEventListener('change', () => load()));
  $('more').onclick = () => { page++; load(true); };
  load();
}

/* ---------- detail page (property.html and car.html) ---------- */
async function detail(kind) {
  const K = KIND[kind], root = document.getElementById('detail'), car = kind === 'car';
  const id = new URLSearchParams(location.search).get('id');
  let r = null;
  try { r = id ? await pb.get(K.coll, id) : null; }
  catch (e) { if (e.status !== 404) { console.error(e); root.innerHTML = notice('We could not load this listing', 'Refresh the page and try again.'); return; } }
  if (!r) { root.innerHTML = `<div class="text-center py-24"><p class="font-display text-3xl">${K.cap} not found</p><a href="${K.list}" class="inline-block mt-4 font-semibold text-${K.acc} hover:underline">Back to all ${K.plural}</a></div>`; return; }

  document.title = `${r.title} | Noble Estates & Motors`;
  const ims = imgs(r), n = ims.length, rent = !car && r.status === 'Rent';
  const facts = car ? [['Year', r.year], ['Mileage', km(r.mileage)], ['Gearbox', r.transmission], ['Fuel', r.fuel], ['Body', r.bodyType], ['Colour', r.color || 'Not stated']]
                    : [['Bedrooms', r.beds || 0], ['Bathrooms', r.baths || 0], ['Area', `${r.area || 0} m²`]];
  const msg = wa(car ? `Hello Noble, I am interested in the ${r.title} (${r.year}) listed at ${money(r.price)}. Is it still available?`
                     : `Hello Noble, I am interested in "${r.title}" (${r.location}) listed at ${money(r.price)}. Is it still available?`);
  const gone = r.sold ? `This ${K.cap.toLowerCase()} is no longer available.` : '';

  root.innerHTML = `<a href="${K.list}" class="text-sm font-semibold text-${K.acc} hover:underline">Back to all ${K.plural}</a>
<div class="grid lg:grid-cols-[1fr_380px] gap-8 mt-5"><div class="min-w-0">
${n ? `<div id="car" class="relative rounded-2xl overflow-hidden aspect-[16/10] bg-line select-none"><div id="track" class="flex h-full transition-transform duration-500">${ims.map((s, k) => `<img src="${esc(s)}" alt="${esc(r.title)}, photo ${k + 1}" class="w-full h-full object-cover shrink-0" onerror="this.style.opacity=0">`).join('')}</div>
${n > 1 ? `<button id="prev" aria-label="Previous photo" class="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-slate-800 grid place-items-center shadow hover:bg-white text-xl">‹</button><button id="next" aria-label="Next photo" class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 text-slate-800 grid place-items-center shadow hover:bg-white text-xl">›</button>` : ''}
<span id="ctr" class="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white"></span></div>
<div id="thumbs" class="flex gap-3 mt-3 overflow-x-auto pb-1">${ims.map((s, k) => `<button data-k="${k}" aria-label="Show photo ${k + 1}" class="shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 bg-line"><img src="${esc(s)}" alt="" class="w-full h-full object-cover" onerror="this.style.opacity=0"></button>`).join('')}</div>`
: '<div class="rounded-2xl aspect-[16/10] bg-line grid place-items-center text-mute">No photos yet</div>'}
<h2 class="font-display text-2xl font-bold mt-10">About this ${K.cap.toLowerCase()}</h2>
<p class="mt-3 leading-relaxed text-mute whitespace-pre-line max-w-2xl">${esc(r.description)}</p></div>
<aside class="lg:sticky lg:top-24 self-start rounded-2xl p-6 bg-surface border border-line">
<div class="flex gap-2 flex-wrap"><span class="px-3 py-1 rounded-full text-xs font-semibold bg-${K.acc} text-onacc">${esc(car ? r.condition : 'For ' + r.status)}</span><span class="px-3 py-1 rounded-full text-xs font-medium bg-bg border border-line">${esc(car ? r.bodyType : r.houseType)}</span></div>
<h1 class="font-display text-2xl font-bold mt-3">${esc(r.title)}</h1>
<p class="flex items-center gap-1.5 text-sm text-mute mt-1">${ico('pin')}${esc(r.location)}</p>
<p class="font-display text-3xl font-bold text-${K.acc} mt-4">${money(r.price)}${rent ? '<span class="text-sm font-sans font-normal text-mute"> / year</span>' : ''}</p>
<dl class="grid ${car ? 'grid-cols-2' : 'grid-cols-3'} gap-2 text-sm mt-5">${facts.map(([l, v]) => `<div class="rounded-xl px-3 py-2.5 bg-bg"><dt class="text-xs text-mute">${l}</dt><dd class="font-semibold mt-0.5">${esc(v)}</dd></div>`).join('')}</dl>
${gone ? `<p class="mt-6 rounded-xl px-4 py-3 bg-bg text-sm font-medium">${gone} <a class="text-${K.acc} underline" href="${K.list}">See what else is available.</a></p>` : `
<a href="${msg}" target="_blank" rel="noopener" class="mt-6 flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white bg-[#1a8f4a] hover:bg-[#157a3f] transition">${WA_ICON}Enquire on WhatsApp</a>
<form id="cb" class="mt-6 pt-6 border-t border-line space-y-3"><p class="font-semibold">Prefer a call back?</p>
<input name="name" class="inp" required maxlength="100" placeholder="Your name" aria-label="Your name" autocomplete="name">
<input name="phone" class="inp" required maxlength="30" inputmode="tel" placeholder="Phone number" aria-label="Phone number" autocomplete="tel">
<button class="w-full rounded-xl py-3 font-semibold border border-line hover:bg-bg transition">Request a call back</button></form>`}</aside></div>`;

  if (n) {
    const track = document.getElementById('track'), ths = [...document.querySelectorAll('#thumbs button')]; let i = 0;
    const go = k => { i = (k + n) % n; track.style.transform = `translateX(-${i * 100}%)`; document.getElementById('ctr').textContent = `${i + 1} / ${n}`;
      ths.forEach((t, j) => { t.style.borderColor = j === i ? `var(--${K.acc})` : 'transparent'; t.style.opacity = j === i ? 1 : .6; }); };
    go(0);
    ths.forEach(t => t.onclick = () => go(+t.dataset.k));
    if (n > 1) {
      document.getElementById('prev').onclick = () => go(i - 1);
      document.getElementById('next').onclick = () => go(i + 1);
      document.addEventListener('keydown', e => { if (e.target.closest('input,textarea,select')) return; if (e.key === 'ArrowLeft') go(i - 1); if (e.key === 'ArrowRight') go(i + 1); });
      let x0 = null; const c = document.getElementById('car');
      c.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
      c.addEventListener('touchend', e => { if (x0 === null) return; const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) go(i + (d < 0 ? 1 : -1)); x0 = null; });
    }
  }
  const cb = document.getElementById('cb');
  if (cb) cb.onsubmit = async e => {
    e.preventDefault(); const b = cb.querySelector('button'); b.disabled = true;
    try {
      await pb.save('enquiries', null, { name: cb.name.value.trim(), phone: cb.phone.value.trim(), message: 'Call back request', listingType: kind, listingId: r.id, listingTitle: r.title });
      cb.innerHTML = '<p class="font-semibold">Thank you, we have your number.</p><p class="text-sm text-mute">Someone from our team will call you shortly.</p>';
    } catch (err) { b.disabled = false; toast(err.offline ? 'No connection. Try again, or use WhatsApp.' : err.message, false); }
  };
}
