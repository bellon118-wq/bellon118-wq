(() => {
  "use strict";
  const KEY = "mayflower-command-quests-v1";
  const boxes = [...document.querySelectorAll("[data-quest]")];
  const count = document.getElementById("questCount");
  const percent = document.getElementById("questPercent");
  const bar = document.getElementById("questProgressBar");
  const status = document.getElementById("saveStatus");
  const defaults = Object.fromEntries(boxes.map(box => [box.dataset.quest, false]));
  let state = {...defaults};
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (saved && typeof saved === "object" && !Array.isArray(saved)) {
      state = Object.fromEntries(Object.keys(defaults).map(key => [key, saved[key] === true]));
    }
  } catch (_) {
    if (status) status.textContent = "Storage unavailable · session only";
  }
  function render() {
    const complete = boxes.filter(box => state[box.dataset.quest]).length;
    const total = boxes.length;
    const value = total ? Math.round(complete / total * 100) : 0;
    boxes.forEach(box => { box.checked = !!state[box.dataset.quest]; });
    if (count) count.textContent = complete + " / " + total;
    if (percent) percent.textContent = value + "%";
    if (bar) bar.style.width = value + "%";
  }
  boxes.forEach(box => box.addEventListener("change", () => {
    state[box.dataset.quest] = box.checked;
    try { localStorage.setItem(KEY, JSON.stringify(state)); if (status) status.textContent = "Saved in this browser"; }
    catch (_) { if (status) status.textContent = "Storage unavailable · session only"; }
    render();
  }));
  const reset = document.getElementById("resetQuests");
  if (reset) reset.addEventListener("click", () => {
    state = {...defaults};
    try { localStorage.setItem(KEY, JSON.stringify(state)); if (status) status.textContent = "Checklist reset"; }
    catch (_) { if (status) status.textContent = "Storage unavailable · session only"; }
    render();
  });
  render();
})();