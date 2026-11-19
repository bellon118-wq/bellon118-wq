(() => {
  "use strict";
  const script = document.currentScript;
  if (!script) return;
  const root = new URL("../../", script.src);
  const registryUrl = new URL("assets/data/routes.json", root);
  const nav = document.querySelector("nav .nav-inner, nav.nav-links");
  if (!nav || nav.querySelector(".site-nav-menu")) return;

  const makeLink = (route, currentPath, currentHash) => {
    const link = document.createElement("a");
    const target = new URL(route.href, root);
    link.href = target.href;
    link.textContent = route.label;
    link.title = route.description || route.label;
    const isSamePage = target.pathname === currentPath;
    const isActive = isSamePage && (route.activeHash ? currentHash === route.activeHash : !currentHash || route.href.endsWith(".html"));
    if (isActive) link.setAttribute("aria-current", "page");
    return link;
  };

  fetch(registryUrl.href, { credentials: "same-origin" })
    .then(response => {
      if (!response.ok) throw new Error("Navigation registry unavailable");
      return response.json();
    })
    .then(registry => {
      if (!Array.isArray(registry.navigation)) return;
      const menu = document.createElement("details");
      menu.className = "site-nav-menu";
      const summary = document.createElement("summary");
      summary.textContent = "Explore";
      summary.setAttribute("aria-label", "Open Mayflower Sanctuary navigation");
      menu.append(summary);

      const panel = document.createElement("div");
      panel.className = "site-nav-panel";
      panel.setAttribute("aria-label", "Sanctuary destinations");
      const currentPath = window.location.pathname;
      const currentHash = window.location.hash;
      registry.navigation.forEach(route => panel.append(makeLink(route, currentPath, currentHash)));
      menu.append(panel);

      const brand = nav.querySelector(".brand");
      if (brand && brand.parentElement === nav) brand.insertAdjacentElement("afterend", menu);
      else nav.append(menu);
    })
    .catch(() => {
      // The page's existing navigation remains usable if the registry cannot load.
    });
})();
