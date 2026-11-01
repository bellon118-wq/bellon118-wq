(() => {
  'use strict';
  const one = (selector, root = document) => root.querySelector(selector);
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const initials = value => value.split(/\s+/).map(word => word[0]).join('').slice(0, 3);
  const art = (name, label = 'Artwork pending', image = '') => image ? `<img class="character-art" src="${escapeHTML(image)}" alt="${escapeHTML(name)} - ${escapeHTML(label)}" loading="lazy">` : `<div class="art-placeholder" role="img" aria-label="${escapeHTML(label)} for ${escapeHTML(name)}"><span>${escapeHTML(initials(name))}</span><small>${escapeHTML(label)}</small></div>`;
  const pills = values => (values || []).map(value => `<span class="pill">${escapeHTML(value)}</span>`).join('');
  const target = one('[data-content]') || one('[data-status]') || one('[data-grid]');
  async function load(file) { const response = await fetch(`assets/data/${file}`); if (!response.ok) throw Error(`${file}: HTTP ${response.status}`); return response.json(); }
  async function roster() {
    const data = await load('characters.json'), search = one('[data-search]'), filter = one('[data-filter]'), grid = one('[data-grid]'), status = one('[data-status]');
    [...new Set(data.characters.map(item => item.faction).filter(Boolean))].forEach(faction => filter.insertAdjacentHTML('beforeend', `<option>${escapeHTML(faction)}</option>`));
    const draw = () => { const query = search.value.toLowerCase(), faction = filter.value; const items = data.characters.filter(item => (!faction || item.faction === faction) && `${item.name} ${item.role} ${item.faction} ${(item.tags || []).join(' ')}`.toLowerCase().includes(query)); grid.innerHTML = items.map(item => `<article class="card">${art(item.name, item.imageLabel || item.placeholder || 'Character art pending', item.image)}<div class="card-body"><p class="meta">${escapeHTML(item.role)} · ${escapeHTML(item.faction)}</p><h3><a href="character.html?id=${encodeURIComponent(item.id)}">${escapeHTML(item.name)}</a></h3><p>${escapeHTML(item.description || 'Profile details pending.')}</p>${pills(item.tags)}<p>${escapeHTML(item.rarity || '')} - ${escapeHTML(item.status)}${item.publicationStatus ? ` - Publication ${escapeHTML(item.publicationStatus.toLowerCase())}` : ''}</p></div></article>`).join(''); status.textContent = `${items.length} of ${data.characters.length} entries shown.`; };
    search.addEventListener('input', draw); filter.addEventListener('change', draw); draw();
  }
  async function games() {
    const data = await load('games.json'), search = one('[data-search]'), grid = one('[data-grid]'), status = one('[data-status]');
    const draw = () => { const items = data.games.filter(item => `${item.name} ${item.genre} ${item.why}`.toLowerCase().includes(search.value.toLowerCase())); grid.innerHTML = items.map(item => `<article class="card">${art(item.name, 'Unofficial mood-art placeholder · not game artwork')}<div class="card-body"><p class="meta">${escapeHTML(item.genre)}</p><h3>${escapeHTML(item.name)}</h3><p>${escapeHTML(item.why)}</p><p class="muted">${escapeHTML(item.description)}</p></div></article>`).join(''); status.textContent = `${items.length} of ${data.games.length} favorite worlds shown.`; };
    search.addEventListener('input', draw); draw();
  }
  async function character() {
    const data = await load('characters.json'), id = new URLSearchParams(location.search).get('id') || 'daniel-bellon', item = data.characters.find(entry => entry.id === id);
    if (!item) { target.innerHTML = '<h2>Character not found</h2><a class="button" href="roster.html">Return to roster</a>'; return; }
    const facts = [['Faction', item.faction], ['Rarity', item.rarity], ['Status', item.status], ['Publication', item.publicationStatus]].filter(([, value]) => value).map(([label, value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('');
    const section = (title, content) => content ? `<section><h3>${escapeHTML(title)}</h3>${content}</section>` : '';
    target.innerHTML = `<div class="grid"><section class="panel">${art(item.name, item.imageLabel || (item.id === 'daniel-bellon' ? 'Portrait not supplied' : 'Character portrait pending'), item.image)}<p class="meta">${escapeHTML(item.role)} | ${escapeHTML(item.status)}</p><h1>${escapeHTML(item.name)}</h1>${item.extendedRole ? `<p>${escapeHTML(item.extendedRole)}</p>` : ''}<dl class="facts">${facts}${item.specialties?.length ? `<div><dt>Specialties</dt><dd>${escapeHTML(item.specialties.join(' | '))}</dd></div>` : ''}</dl>${item.factionNote ? `<p class="muted">${escapeHTML(item.factionNote)}</p>` : ''}${item.publicationStatus ? `<p class="muted">Publication status has not been confirmed.</p>` : ''}${item.stats ? `<p class="muted">Playful self-ratings, not measured performance.</p>${item.stats.map(stat => `<p>${escapeHTML(stat.name)} ${stat.value}/100</p><progress max="100" value="${stat.value}" aria-label="${escapeHTML(stat.name)} self-rating ${stat.value} of 100"></progress>`).join('')}` : ''}</section><section class="panel"><h2>${item.id === 'daniel-bellon' ? 'Creator dossier' : 'Character dossier'}</h2>${item.description ? `<p>${escapeHTML(item.description)}</p>` : ''}${section('Lore', item.lore ? `<p>${escapeHTML(item.lore)}</p>` : '')}${section('Personality', item.personality ? `<p>${escapeHTML(item.personality)}</p>` : '')}${section('Values', item.values?.length ? `<ul class="list">${item.values.map(value => `<li>${escapeHTML(value)}</li>`).join('')}</ul>` : '')}${section('Voice', item.voiceLine ? `<blockquote>"${escapeHTML(item.voiceLine)}"</blockquote>` : '')}${section('Home setting', item.homeSetting ? `<p>${escapeHTML(item.homeSetting)}</p>` : '')}${section('Visual canon', item.visualCanon?.length ? `<ul class="list">${item.visualCanon.map(value => `<li>${escapeHTML(value)}</li>`).join('')}</ul>` : '')}${item.equipment?.length ? `<h3>Equipment</h3>${pills(item.equipment)}` : ''}${item.quests?.length ? `<h3>Current focus</h3>${pills(item.quests)}` : ''}<p><a class="button" href="roster.html">Browse roster</a></p></section></div>`;
  }
  function projects() { const items = [['MYBLIN9','AI entertainment platform','An evolving platform exploring virtual idols and immersive fan interaction.','https://myblin9.com/'],['SweeTeez','Virtual idol project','A five-member AI idol group on MyBlin9.','https://myblin9.com/artists/sweeteez.html'],['AI Workbench','Personal concept','AI agents, creative personas, and repeatable workflows; not a released product.',''],['GitHub repositories','Open-source learning','Public projects and forks, with upstream authorship credited.','https://github.com/bellon118-wq?tab=repositories']]; target.innerHTML = items.map(item => `<article class="card">${art(item[0])}<div class="card-body"><p class="meta">${escapeHTML(item[1])}</p><h2>${escapeHTML(item[0])}</h2><p>${escapeHTML(item[2])}</p>${item[3] ? `<a class="button" href="${item[3]}" target="_blank" rel="noopener">Explore ↗</a>` : ''}</div></article>`).join(''); }
  function dragon() { target.innerHTML = `<div class="grid">${[['AI experiments','Explore how creative AI tools support useful workflows.'],['Worldbuilding','Collect ideas for places, characters, and stories.'],['Future concepts','Early ideas, clearly marked as concepts.'],['Creative articles','Published posts live on the DragonAI7 blog.'],['Character development','Developing character ideas; profiles remain concepts until confirmed.']].map(item => `<article class="panel"><p class="meta">${item[0]}</p><h2>DragonAI7</h2><p>${item[1]}</p></article>`).join('')}</div><p><a class="button" href="https://dragonai7.blogspot.com/" target="_blank" rel="noopener">Visit DragonAI7 ↗</a></p>`; }
  function contact() { target.innerHTML = '<section class="panel"><h2>Connect with Daniel</h2><p>Follow the projects, visit the blog, or join the YouTube Community. No private email or contact form is published here.</p><p class="actions"><a class="button" href="https://github.com/bellon118-wq">GitHub ↗</a><a class="button" href="https://youtube.com/@DanielBellon108/community">YouTube Community ↗</a><a class="button" href="https://myblin9.com/">MYBLIN9 ↗</a><a class="button" href="https://dragonai7.blogspot.com/">DragonAI7 ↗</a><a class="button" href="https://www.linkedin.com/in/danielbellon" target="_blank" rel="noopener noreferrer">LinkedIn</a></p></section>'; }
  const view = document.body.dataset.view;
  const actions = {home: () => {}, roster, games, character, projects, dragonai7: dragon, contact};
  if (actions[view]) Promise.resolve(actions[view]()).catch(error => { if (target) target.textContent = `Content could not load. Refresh to try again. ${error.message}`; });
  const year = one('[data-year]'); if (year) year.textContent = new Date().getFullYear();
  const current = location.pathname.split('/').pop() || 'index.html'; document.querySelectorAll('.nav-links a').forEach(link => { if (link.getAttribute('href') === current) link.setAttribute('aria-current', 'page'); });
})();



(() => {
  const gallery = document.querySelector('[data-gallery-grid]');
  if (!gallery) return;
  const search = document.querySelector('[data-gallery-search]');
  const filter = document.querySelector('[data-gallery-filter]');
  const status = document.querySelector('[data-gallery-status]');
  const dialog = document.querySelector('[data-lightbox]');
  const draw = () => {
    const query = search.value.toLowerCase(), category = filter.value;
    let shown = 0;
    gallery.querySelectorAll('[data-category]').forEach(card => {
      const matches = (!category || card.dataset.category === category) && card.textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      if (matches) shown++;
    });
    status.textContent = `${shown} of ${gallery.querySelectorAll('[data-category]').length} artworks shown.`;
  };
  search.addEventListener('input', draw);
  filter.addEventListener('change', draw);
  gallery.addEventListener('click', event => {
    const trigger = event.target.closest('[data-lightbox-open]');
    if (!trigger) return;
    const image = trigger.dataset.image;
    document.querySelector('[data-lightbox-art]').innerHTML = image ? `<img src="${image}" alt="${trigger.dataset.title}">` : '<div class="art-placeholder"><span>DB</span><small>Portrait not supplied</small></div>';
    document.querySelector('[data-lightbox-title]').textContent = trigger.dataset.title;
    document.querySelector('[data-lightbox-description]').textContent = trigger.dataset.description;
    dialog.showModal();
    dialog.dataset.returnFocus = 'true';
    dialog._trigger = trigger;
  });
  document.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => dialog._trigger?.focus());
  draw();
})();
