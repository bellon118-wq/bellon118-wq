// Mayflower Sanctuary — modal pop-ups only. No external requests, no tracking.
// Project cards on the home page open the same content as the dedicated
// project pages (projects/myblin9.html, projects/sweeteez.html).
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dlg = document.getElementById(btn.getAttribute("data-modal"));
      if (dlg && typeof dlg.showModal === "function") dlg.showModal();
    });
  });
  document.querySelectorAll("dialog .close").forEach((btn) => {
    btn.addEventListener("click", () => btn.closest("dialog").close());
  });
  document.querySelectorAll("dialog").forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      const r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dlg.close();
    });
  });
});
