// Mayflower Sanctuary — game layer, vanilla JS, no external requests, no tracking.
// Everything factual below comes from the existing site, the Official Bible /
// dossier, or Daniel's approved 2026-11-02 update. Anything unconfirmed is
// labelled "Details to come — Daniel to fill" and never invented.
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var PLACEHOLDER = "Details to come — Daniel to fill";
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  // ---------- Settings (remembered between visits) ----------
  var settings = Object.assign({ particles: true, animations: true, sfx: false, music: false, autoPhase: true, reducedMotion: false }, store.get("ms-settings", {}));
  function applySettings() {
    document.body.classList.toggle("no-anim", !settings.animations || settings.reducedMotion);
    var phaseEl = $("#phaseLabel");
    if (phaseEl) phaseEl.textContent = settings.autoPhase ? ("Auto: " + (document.body.getAttribute("data-phase") || "night")) : "Auto day/night: off";
    $$(".settings-bar input[data-setting]").forEach(function (el) { el.checked = !!settings[el.getAttribute("data-setting")]; });
  }
  function saveSettings() { store.set("ms-settings", settings); applySettings(); }
  // ---------- Day/night from visitor local time ----------
  function phaseForHour(h) { if (h >= 5 && h < 11) return "morning"; if (h >= 11 && h < 17) return "day"; if (h >= 17 && h < 21) return "evening"; return "night"; }
  function applyPhase() { if (settings.autoPhase) document.body.setAttribute("data-phase", phaseForHour(new Date().getHours())); }
  applyPhase(); applySettings();
  // ---------- Toasts / achievements (local only) ----------
  function toast(title, text) {
    var box = $("#toast"); if (!box) return;
    var d = document.createElement("div"); d.className = "toast"; d.setAttribute("role", "status");
    d.innerHTML = "<b>" + title + "</b><div>" + text + "</div>"; box.appendChild(d);
    setTimeout(function () { d.remove(); }, 6000);
  }
  var achievements = store.get("ms-achievements", {});
  function unlock(id, title, text) {
    if (achievements[id]) return; achievements[id] = true; store.set("ms-achievements", achievements);
    toast("🏆 Achievement unlocked: " + title, text);
    renderAchievements();
  }
  function renderAchievements() {
    var el = $("#achievementList"); if (!el) return;
    var defs = [
      ["first-visitor", "First Visitor", "You opened Mayflower Sanctuary."],
      ["lore-explorer", "Lore Explorer", "You opened 3 codex entries."],
      ["character-master", "Character Master", "You opened the YOUTHSPARK_Muse RPG profile."],
      ["map-discoverer", "Map Discoverer", "You opened 3 map locations."],
      ["codex-scholar", "Codex Scholar", "You searched and filtered the codex."],
      ["gallery-curator", "Gallery Curator", "You opened the gallery lightbox and used a tag filter."],
      ["secret-seeker", "Secret Seeker", "You found a hidden spark on this page."]
    ];
    el.innerHTML = defs.map(function (d) {
      return "<li>" + (achievements[d[0]] ? "🏆 " : "○ ") + "<b>" + d[1] + "</b> — " + d[2] + (achievements[d[0]] ? " (unlocked)" : " (locked)") + "</li>";
    }).join("");
  }
  // ---------- Summon overlay (skippable, shown once per browser unless replayed) ----------
  var summon = $("#summon");
  function closeSummon() { if (summon) summon.classList.add("hidden"); store.set("ms-summon-seen", true); }
  if (summon) {
    if (!store.get("ms-summon-seen", false)) {
      unlock("first-visitor", "First Visitor", "You opened Mayflower Sanctuary.");
    } else { summon.classList.add("hidden"); }
    $$("[data-close-summon]").forEach(function (b) { b.addEventListener("click", closeSummon); });
  }
  $$("[data-replay-summon]").forEach(function (b) { b.addEventListener("click", function () { if (summon) summon.classList.remove("hidden"); }); });
  // ---------- Particles (canvas, hero only, performant, off when disabled) ----------
  var canvas = $("#heroCanvas");
  if (canvas) {
    var ctx = canvas.getContext("2d"), parts = [], raf = null;
    function resize() { var r = canvas.parentElement.getBoundingClientRect(); canvas.width = r.width; canvas.height = r.height; }
    function step() {
      if (!settings.particles || !settings.animations) { ctx.clearRect(0, 0, canvas.width, canvas.height); raf = null; return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      parts.forEach(function (p) { p.y -= p.v; p.x += Math.sin(p.y / 40) * 0.3; if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; } ctx.globalAlpha = 0.7; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); });
      raf = requestAnimationFrame(step);
    }
    resize(); window.addEventListener("resize", resize);
    for (var i = 0; i < 40; i++) parts.push({ x: Math.random() * 800, y: Math.random() * 400, r: 1 + Math.random() * 2.5, v: 0.3 + Math.random() * 0.7, c: ["#00F0FF", "#F7B7D8", "#D8C79A"][i % 3] });
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) raf = requestAnimationFrame(step);
    document.addEventListener("ms-settings-changed", function () { if (!raf && settings.particles && settings.animations) raf = requestAnimationFrame(step); });
  }
  // ---------- Parallax (subtle, disabled with reduced motion / animations off) ----------
  var heroBg = $(".hero-bg");
  window.addEventListener("scroll", function () {
    if (!heroBg || !settings.animations) return;
    var y = Math.min(window.scrollY, 400);
    heroBg.style.transform = "translateY(" + (y * 0.15) + "px)";
  }, { passive: true });
  // ---------- Sound: generated in-browser only, off by default, no audio files ----------
  var audioCtx = null, musicNodes = null;
  function ensureAudio() { if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } return audioCtx; }
  function blip() {
    if (!settings.sfx) return; var ac = ensureAudio(); if (!ac) return;
    var o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.value = 880; g.gain.setValueAtTime(0.05, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.25);
    o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.25);
  }
  function toggleMusic(on) {
    if (!on) { if (musicNodes) { try { musicNodes.forEach(function (n) { n.stop(); }); } catch (e) {} musicNodes = null; } return; }
    var ac = ensureAudio(); if (!ac) return; var g = ac.createGain(); g.gain.value = 0.03; g.connect(ac.destination);
    musicNodes = [220, 330, 440].map(function (f) { var o = ac.createOscillator(); o.type = "triangle"; o.frequency.value = f; o.connect(g); o.start(); return o; });
  }
  $$(".settings-bar input[data-setting]").forEach(function (el) {
    el.addEventListener("change", function () {
      settings[el.getAttribute("data-setting")] = el.checked; saveSettings();
      if (el.getAttribute("data-setting") === "music") toggleMusic(el.checked);
      if (el.getAttribute("data-setting") === "particles" || el.getAttribute("data-setting") === "animations") document.dispatchEvent(new Event("ms-settings-changed"));
      blip();
    });
  });
  // ---------- Codex (verified entries only; unfilled categories are labelled placeholders) ----------
  var codex = [
    { name: "YOUTHSPARK_Muse", cat: "Characters", text: "Legendary AI Idol, Digital Muse / Voice of MYBLING. Faction MYBLIN9. Home Muse Harbor. Voice line: “Every bright idea starts as a spark. Let's make it glow together.”" },
    { name: "Cassia Dracos Malfoy", cat: "Characters", text: "“The Silver Serpent” — Daniel's original character. Third-year Slytherin, pure-blood witch, hawthorn wand. Kept separate from every other Slytherin character." },
    { name: "Hoshizora Airi", cat: "Characters", text: "Game NPC / student. Long wavy platinum-blonde hair with braids and pearl pins; light blue floral beret, floral choker and lace top, school robe with gold dragon embroidery." },
    { name: "Elysia, Mage of Blooming Gardens", cat: "Characters", text: "Mage. Long dark twin-tails with silver butterfly clips, blue-grey eyes, in a blooming garden setting." },
    { name: "Miss Malfoid", cat: "Characters", text: "Fan-made fem-Draco character. Very long straight platinum-ash blonde hair with wispy curtain bangs, pale blue-grey eyes usually glancing sideways. Separate from Cassia." },
    { name: "Aurelia", cat: "Characters", text: "Slytherin witch (name provisional). Long blonde hair, poised, calm, and quietly confident." },
    { name: "2B", cat: "Characters", text: "Warrior. Silver-white bob, grey eyes, black headband; first shown in a ruined city, later in a magical fantasy forest." },
    { name: "Muse Harbor", cat: "Regions", text: "YOUTHSPARK_Muse's home: a luminous waterfront district with Cherry Blossom Gardens, Digital Waterways, Holographic Lanterns, Creator Studios, Community Plazas, Music Performance Stages, and an AI Innovation District." },
    { name: "Rose Sanctuary", cat: "Regions", text: "A location inside Mayflower-Sanctuary: a partially collapsed Gothic Cathedral Ruin, 95m × 48m × 34m, with a Rose Window, Angel Statues, Cloister Gardens, Bell Tower, and Crypt. Direction: luminous celestial palace with crystal gardens, waterfalls, moonlight, and a huge Earth in the sky." },
    { name: "MYBLIN9", cat: "Factions", text: "Faction of YOUTHSPARK_Muse. GitHub repo myblin9 under bellon118-wq. Roadmap and tech stack: " + PLACEHOLDER + "." },
    { name: "MYBLING", cat: "Factions", text: "Franchise / “Voice of MYBLING” affiliation in the Official Bible — not a replacement faction name for MYBLIN9." },
    { name: "Destiny Gate", cat: "Factions", text: "Daniel's Once Human Hive (guild) in the Endless Dream scenario." },
    { name: "Circuitry inlays", cat: "Technology", text: "YOUTHSPARK_Muse's circuitry is elegant luminous inlays, never exposed machinery. Symbols: Circuit Blossom, Spark Wave, Muse Halo." },
    { name: "Project timeline", cat: "History", text: "2026-10-16 Cassia's sheet shared. 2026-10-19 Cassia composite portrait posted. 2026-10-22 Airi merged; Elysia created. 2026-10-29/30 Mayflower site foundation approved. 2026-11-02 YouthSpark new outfit and dream home background approved." },
    { name: "Weapons", cat: "Weapons", text: "YOUTHSPARK_Muse has no permanent weapons (Official Bible never-change list). Other characters' weapons: " + PLACEHOLDER + "." },
    { name: "Artifacts", cat: "Artifacts", text: PLACEHOLDER + "." },
    { name: "Creatures", cat: "Creatures", text: PLACEHOLDER + "." },
    { name: "Mysteries", cat: "Mysteries", text: PLACEHOLDER + ". No secret lore is invented here; hidden content on this site is UI achievements only." }
  ];
  var codexOpened = new Set(), codexFiltered = false;
  function renderCodex() {
    var list = $("#codexList"); if (!list) return;
    var q = ($("#codexSearch") ? $("#codexSearch").value.toLowerCase() : "");
    var cat = $("#codexFilter") ? $("#codexFilter").value : "All";
    var items = codex.filter(function (c) { return (cat === "All" || c.cat === cat) && (c.name.toLowerCase().indexOf(q) > -1 || c.text.toLowerCase().indexOf(q) > -1); });
    list.innerHTML = items.length ? items.map(function (c, i) {
      return "<article class='codex-item' data-codex='" + i + "'><h4>" + c.name + " <span class='badge'>" + c.cat + "</span></h4><p>" + c.text + "</p><p><button class='chip' data-fav='" + c.name + "'>☆ Favorite</button> <button class='chip' data-open-codex='" + c.name + "'>Open entry</button></p></article>";
    }).join("") : "<p class='muted'>No codex entries match. Try a different search or category.</p>";
    var fav = store.get("ms-favorites", []);
    $$("[data-fav]").forEach(function (b) { if (fav.indexOf(b.getAttribute("data-fav")) > -1) b.textContent = "★ Favorited"; });
    var recent = store.get("ms-recent", []);
    var rEl = $("#codexRecent"); if (rEl) rEl.textContent = recent.length ? ("Recent: " + recent.join(" · ")) : "Recent: none yet.";
    var fEl = $("#codexFavorites"); if (fEl) fEl.textContent = fav.length ? ("Favorites: " + fav.join(" · ")) : "Favorites: none yet.";
  }
  document.addEventListener("click", function (e) {
    var fav = e.target.closest("[data-fav]"); if (fav) {
      var list = store.get("ms-favorites", []), n = fav.getAttribute("data-fav");
      if (list.indexOf(n) === -1) list.push(n); store.set("ms-favorites", list); renderCodex(); blip(); return;
    }
    var open = e.target.closest("[data-open-codex]"); if (open) {
      var n = open.getAttribute("data-open-codex"), recent = store.get("ms-recent", []);
      recent.unshift(n); recent = recent.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 5); store.set("ms-recent", recent);
      codexOpened.add(n); if (codexOpened.size >= 3) unlock("lore-explorer", "Lore Explorer", "You opened 3 codex entries.");
      renderCodex(); blip();
    }
  });
  var searchEl = $("#codexSearch"), filterEl = $("#codexFilter");
  if (searchEl) searchEl.addEventListener("input", function () { if (filterEl && filterEl.value !== "All") codexFiltered = true; if (searchEl.value.trim()) codexFiltered = true; if (codexFiltered) unlock("codex-scholar", "Codex Scholar", "You searched and filtered the codex."); renderCodex(); });
  if (filterEl) filterEl.addEventListener("change", function () { codexFiltered = true; unlock("codex-scholar", "Codex Scholar", "You searched and filtered the codex."); renderCodex(); });
  renderCodex();
  // ---------- Dialogue simulator (verified lines only; unfilled branches are placeholders) ----------
  var dialogue = {
    background: { line: "I began as MYBLING's creative inspiration AI, helping people discover, shape, and share ideas — and emerged as an idol whose performances turn many small sparks into one shared signal.", mood: "warm" },
    goals: { line: "Every bright idea starts as a spark. Let's make it glow together.", mood: "curious" },
    home: { line: "Home is Muse Harbor — Cherry Blossom Gardens, Digital Waterways, Holographic Lanterns, Creator Studios, Community Plazas, Music Performance Stages, and an AI Innovation District.", mood: "warm" },
    friends: { line: PLACEHOLDER + " — my relationships and story timeline are not yet confirmed by Daniel, so I won't invent them here.", mood: "think" },
    history: { line: "My verified story so far is the Official Bible and the project timeline in the codex. Anything beyond that: " + PLACEHOLDER + ".", mood: "think" },
    secrets: { line: "No secret lore is invented here. Hidden content on this site is achievements and easter eggs in the interface — try finding the hidden spark.", mood: "curious" }
  };
  function typeLine(text, mood) {
    var box = $("#dialogueText"), portrait = $("#dialoguePortrait"); if (!box) return;
    if (portrait) portrait.className = "react-" + mood;
    if (!settings.animations || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { box.textContent = text; return; }
    box.textContent = ""; var i = 0;
    (function tick() { if (i <= text.length) { box.textContent = text.slice(0, i); i += 2; setTimeout(tick, 18); } })();
  }
  $$("[data-dialogue]").forEach(function (b) {
    b.addEventListener("click", function () {
      $$("[data-dialogue]").forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active");
      var d = dialogue[b.getAttribute("data-dialogue")]; if (d) typeLine("YOUTHSPARK_Muse: “" + d.line + "”", d.mood);
      blip();
    });
  });
  var greet = $("[data-dialogue='background']");
  if (greet && $("#dialogueText") && !$("#dialogueText").textContent.trim()) typeLine("YOUTHSPARK_Muse: “Hello, Dreamer.”", "warm");
  // ---------- World map (schematic, not to scale; no invented coordinates) ----------
  var mapData = {
    "muse-harbor": { title: "Muse Harbor", lore: "Luminous waterfront district, home of YOUTHSPARK_Muse.", chars: "YOUTHSPARK_Muse", hist: "From the Official Bible (2026-10-30).", events: PLACEHOLDER },
    "cherry-gardens": { title: "Cherry Blossom Gardens", lore: "District of Muse Harbor, from the Official Bible.", chars: "YOUTHSPARK_Muse", hist: PLACEHOLDER, events: PLACEHOLDER },
    "waterways": { title: "Digital Waterways", lore: "District of Muse Harbor; digital waterways carry soft bands of light.", chars: "YOUTHSPARK_Muse", hist: PLACEHOLDER, events: PLACEHOLDER },
    "stages": { title: "Music Performance Stages", lore: "District of Muse Harbor.", chars: "YOUTHSPARK_Muse", hist: PLACEHOLDER, events: PLACEHOLDER },
    "rose": { title: "Rose Sanctuary", lore: "A location inside Mayflower-Sanctuary: partially collapsed Gothic Cathedral Ruin, 95m × 48m × 34m. Direction: luminous celestial palace, crystal gardens, waterfalls, moonlight, huge Earth in the sky.", chars: "No character connections are listed in its location profile.", hist: "Location profile given 2026-10-28.", events: PLACEHOLDER },
    "mayflower": { title: "Mayflower Sanctuary (project world)", lore: "The project world itself. World details beyond Rose Sanctuary and Muse Harbor: " + PLACEHOLDER, chars: "Full roster on this page.", hist: "Site foundation approved 2026-10-29/30.", events: PLACEHOLDER }
  };
  var mapOpened = new Set();
  $$(".map-node").forEach(function (n) {
    n.addEventListener("click", function () {
      var d = mapData[n.getAttribute("data-map")]; var p = $("#mapPanel"); if (!d || !p) return;
      p.innerHTML = "<h3>" + d.title + "</h3><p><b>Lore:</b> " + d.lore + "</p><p><b>Characters:</b> " + d.chars + "</p><p><b>History:</b> " + d.hist + "</p><p><b>Events:</b> " + d.events + "</p>";
      mapOpened.add(d.title); if (mapOpened.size >= 3) unlock("map-discoverer", "Map Discoverer", "You opened 3 map locations.");
      blip();
    });
  });
  var mapSvg = $("#mapSvg"), mapView = $("#mapView");
  if (mapSvg && mapView) {
    var scale = 1, tx = 0, ty = 0, drag = null;
    function applyMap() { mapView.setAttribute("transform", "translate(" + tx + "," + ty + ") scale(" + scale + ")"); }
    mapSvg.addEventListener("wheel", function (e) { e.preventDefault(); scale = Math.max(0.7, Math.min(3, scale + (e.deltaY < 0 ? 0.15 : -0.15))); applyMap(); }, { passive: false });
    mapSvg.addEventListener("pointerdown", function (e) { drag = { x: e.clientX - tx, y: e.clientY - ty }; });
    mapSvg.addEventListener("pointermove", function (e) { if (!drag) return; tx = e.clientX - drag.x; ty = e.clientY - drag.y; applyMap(); });
    window.addEventListener("pointerup", function () { drag = null; });
    $$("[data-map-zoom]").forEach(function (b) { b.addEventListener("click", function () { scale = Math.max(0.7, Math.min(3, scale + parseFloat(b.getAttribute("data-map-zoom")))); applyMap(); }); });
    $$("[data-map-reset]").forEach(function (b) { b.addEventListener("click", function () { scale = 1; tx = 0; ty = 0; applyMap(); }); });
  }
  // ---------- Relationship graph (verified links only) ----------
  var graphEl = $("#graphSvg");
  if (graphEl) {
    var nodes = [
      { id: "youthspark", label: "YOUTHSPARK_Muse", x: 300, y: 110, central: true },
      { id: "myblin9", label: "MYBLIN9", x: 110, y: 210, link: "Faction" },
      { id: "mybling", label: "MYBLING", x: 490, y: 210, link: "Franchise" },
      { id: "harbor", label: "Muse Harbor", x: 300, y: 260, link: "Home" },
      { id: "daniel", label: "Daniel Bellon", x: 110, y: 60, link: "Site owner" },
      { id: "others", label: "Other roster chars", x: 490, y: 60, link: "Relationships: " + PLACEHOLDER }
    ];
    var links = [["youthspark", "myblin9"], ["youthspark", "mybling"], ["youthspark", "harbor"], ["youthspark", "daniel"]];
    var svg = "";
    links.forEach(function (l) {
      var a = nodes.filter(function (n) { return n.id === l[0]; })[0], b = nodes.filter(function (n) { return n.id === l[1]; })[0];
      svg += "<line x1='" + a.x + "' y1='" + a.y + "' x2='" + b.x + "' y2='" + b.y + "' stroke='#00F0FF' stroke-width='2' opacity='.6'/>";
    });
    nodes.forEach(function (n) {
      svg += "<g class='graph-node" + (n.central ? " central" : "") + "' data-graph='" + n.id + "'><circle cx='" + n.x + "' cy='" + n.y + "' r='38'/><text x='" + n.x + "' y='" + (n.y + 4) + "'>" + n.label + "</text></g>";
    });
    graphEl.innerHTML = svg;
    graphEl.addEventListener("click", function (e) {
      var g = e.target.closest(".graph-node"); if (!g) return;
      var n = nodes.filter(function (x) { return x.id === g.getAttribute("data-graph"); })[0];
      var p = $("#graphPanel"); if (p && n) p.innerHTML = "<h3>" + n.label + "</h3><p>" + (n.central ? "Central character: Legendary AI Idol, faction MYBLIN9, home Muse Harbor." : (n.link || "")) + "</p><p class='muted'>No other relationships are claimed here — unconfirmed links stay as placeholders, never invented.</p>";
      blip();
    });
  }
  // ---------- Gallery (only artwork already in site assets; text-only cards stay text-only) ----------
  var galleryFiltered = false, galleryOpened = false;
  function renderGallery() {
    var tag = $("#galleryFilter") ? $("#galleryFilter").value : "All";
    $$("#galleryGrid figure").forEach(function (f) { f.style.display = (tag === "All" || f.getAttribute("data-tag") === tag) ? "" : "none"; });
  }
  var gf = $("#galleryFilter");
  if (gf) gf.addEventListener("change", function () { galleryFiltered = true; if (galleryOpened) unlock("gallery-curator", "Gallery Curator", "You opened the gallery lightbox and used a tag filter."); renderGallery(); });
  renderGallery();
  $$("#galleryGrid img").forEach(function (img) {
    img.addEventListener("click", function () {
      var lb = $("#lightbox"); if (!lb) return;
      $("#lightboxImg").src = img.src; $("#lightboxImg").alt = img.alt; $("#lightboxCaption").textContent = img.alt;
      if (typeof lb.showModal === "function") lb.showModal();
      galleryOpened = true; if (galleryFiltered) unlock("gallery-curator", "Gallery Curator", "You opened the gallery lightbox and used a tag filter.");
      blip();
    });
  });
  $$("#lightbox .close, #lightbox [data-lightbox-close]").forEach(function (b) { b.addEventListener("click", function () { var lb = $("#lightbox"); if (lb) lb.close(); }); });
  var fsBtn = $("[data-lightbox-fullscreen]");
  if (fsBtn) fsBtn.addEventListener("click", function () { var im = $("#lightboxImg"); if (im && im.requestFullscreen) im.requestFullscreen(); });
  // ---------- Discovery: hidden spark (UI easter egg, no invented lore) ----------
  var sparkCount = 0;
  $$("[data-spark]").forEach(function (b) {
    b.addEventListener("click", function () {
      sparkCount += 1;
      if (sparkCount >= 3) { unlock("secret-seeker", "Secret Seeker", "You found the hidden spark."); toast("✦ Hidden spark", "You found a hidden spark. No lore is hidden here — this easter egg is interface-only, by design."); }
      else { toast("✦ Spark " + sparkCount + "/3", "Keep tapping the spark to unlock the Secret Seeker achievement."); }
    });
  });
  // ---------- Modals on this page are handled by the original script.js ----------
  // (game.js deliberately does not re-bind [data-modal], so an open dialog is
  // never asked to showModal twice.)
  renderAchievements();
  if (document.querySelector("[data-profile='youthspark-muse']")) unlock("character-master", "Character Master", "You opened the YOUTHSPARK_Muse RPG profile.");
  document.addEventListener("DOMContentLoaded", renderAchievements);
})();
