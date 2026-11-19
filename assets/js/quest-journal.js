(() => {
  "use strict";
  const script = document.currentScript;
  const root = script && script.src ? new URL("../../", script.src) : new URL("../../", window.location.href);
  const STORAGE_KEY = "mayflower-player-progression-v1";
  const $ = id => document.getElementById(id);
  const list = $("questList");
  const statusLine = $("questLoadStatus");
  const saveLine = $("questSaveStatus");
  const search = $("questSearch");
  const category = $("questCategory");
  const progressFilter = $("questStatus");
  let quests = [];
  let characters = [];
  let locations = [];
  let save = {schemaVersion:"1.0.0",playerId:"local-player",updatedAt:new Date().toISOString(),quests:{}};
  let storageAvailable = true;

  function readSave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.quests && typeof parsed.quests === "object" && !Array.isArray(parsed.quests)) {
        save = {...save,...parsed,quests:parsed.quests};
      }
    } catch (error) {
      storageAvailable = false;
      saveLine.textContent = "Local storage unavailable · session only";
      console.warn("Could not read Mayflower quest progress:", error);
    }
  }
  function persist() {
    save.updatedAt = new Date().toISOString();
    if (!storageAvailable) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
      saveLine.textContent = "Progress saved in this browser";
    } catch (error) {
      storageAvailable = false;
      saveLine.textContent = "Storage unavailable · session only";
      console.warn("Could not save Mayflower quest progress:", error);
    }
    render();
  }
  function stateFor(quest) {
    return save.quests[quest.id] || {status:"not-started",objectives:{}};
  }
  function prerequisitesMet(quest) {
    return (quest.prerequisiteQuestIds || []).every(id => save.quests[id] && save.quests[id].status === "completed");
  }
  function categoryLabel(value) {
    return ({main:"Main Story",side:"Side Story",character:"Character Quest",exploration:"Exploration",collection:"Collection"})[value] || "Quest";
  }
  function statusLabel(value) {
    return ({available:"Available",active:"In Progress",completed:"Completed",abandoned:"Abandoned",locked:"Locked · prerequisites", "not-started":"Available"})[value] || value;
  }
  function relatedNames(ids, records) {
    const index = Object.fromEntries(records.map(item => [item.id,item.name]));
    return (ids || []).map(id => index[id] || id);
  }
  function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function questProgress(quest, state) {
    const objectives = quest.objectives || [];
    const total = objectives.length;
    const done = objectives.filter(o => Number(state.objectives && state.objectives[o.id] || 0) >= Number(o.requiredCount || 1)).length;
    return {total,done,percent:total ? Math.round(done / total * 100) : 0};
  }
  function updateOverview() {
    let available=0,active=0,completed=0,locked=0;
    quests.forEach(quest => {
      if (quest.status !== "available") return;
      const state = stateFor(quest);
      if (state.status === "completed") completed++;
      else if (state.status === "active") active++;
      else if (prerequisitesMet(quest)) available++;
      else locked++;
    });
    $("availableCount").textContent = available;
    $("activeCount").textContent = active;
    $("completedCount").textContent = completed;
    $("lockedCount").textContent = locked;
  }
  function makeQuestCard(quest) {
    const state = stateFor(quest);
    const progress = questProgress(quest,state);
    const card = make("article","quest-card");
    const top = make("div","quest-card-top");
    top.append(make("span","quest-category",categoryLabel(quest.category)));
    const locked = state.status !== "active" && state.status !== "completed" && !prerequisitesMet(quest);
    const visibleStatus = locked ? "locked" : (state.status === "not-started" ? "available" : state.status);
    top.append(make("span","quest-status",statusLabel(visibleStatus)));
    card.append(top,make("h3","",quest.title),make("p","",quest.summary || "Quest details will be added to the world journal."));
    const meta = make("div","quest-meta");
    (quest.recommendedLevel ? ["Recommended level "+quest.recommendedLevel] : []).forEach(t=>meta.append(make("span","",t)));
    meta.append(make("span","",progress.done+" / "+progress.total+" objectives"));
    card.append(meta);
    const chars = relatedNames(quest.characterIds,characters);
    const places = relatedNames(quest.locationIds,locations);
    if(chars.length) card.append(make("p","quest-related","Characters: "+chars.join(", ")));
    if(places.length) card.append(make("p","quest-related","Locations: "+places.join(", ")));
    const bar = make("div","quest-progress-line");
    const fill = make("span"); fill.style.width=progress.percent+"%"; bar.append(fill); card.append(bar);
    if(state.status === "active" || state.status === "completed") {
      const section=make("div","quest-objectives");
      section.append(make("h4","","Objectives"));
      (quest.objectives || []).forEach(objective=>{
        const label=make("label","quest-objective");
        const input=document.createElement("input"); input.type="checkbox";
        input.checked=Number(state.objectives[objective.id] || 0)>=Number(objective.requiredCount || 1);
        input.disabled=state.status==="completed";
        input.addEventListener("change",()=>{
          const next=stateFor(quest);
          next.objectives=next.objectives || {};
          next.objectives[objective.id]=input.checked?Number(objective.requiredCount || 1):0;
          const updated=questProgress(quest,next);
          if(updated.total && updated.done===updated.total){next.status="completed";next.completedAt=new Date().toISOString();}
          save.quests[quest.id]=next;persist();
        });
        label.append(input,make("span","",objective.description));
        if(input.checked) label.classList.add("done");
        section.append(label);
      });
      card.append(section);
    }
    if(Array.isArray(quest.rewards) && quest.rewards.length) {
      card.append(make("p","quest-rewards","Rewards: "+quest.rewards.map(r=>r.description).join(" · ")));
    } else if(Array.isArray(quest.rewardItemIds) && quest.rewardItemIds.length) {
      card.append(make("p","quest-rewards","Reward records: "+quest.rewardItemIds.join(", ")));
    }
    const actions=make("div","quest-card-actions");
    if(state.status==="not-started" || state.status==="abandoned") {
      if (locked) {
        const needed=(quest.prerequisiteQuestIds || []).filter(id=>!save.quests[id] || save.quests[id].status!=="completed").map(id=>quests.find(item=>item.id===id)?.title || id);
        card.append(make("p","quest-related","Complete first: "+needed.join(", ")));
      } else {
        const start=make("button","btn","Begin quest");
        start.type="button";start.addEventListener("click",()=>{
          const next=stateFor(quest);next.status="active";next.startedAt=next.startedAt||new Date().toISOString();next.objectives=next.objectives||{};
          save.quests[quest.id]=next;persist();
        });actions.append(start);
      }
    } else if(state.status==="active") {
      const abandon=make("button","chip","Abandon quest");
      abandon.type="button";abandon.addEventListener("click",()=>{
        const next=stateFor(quest);next.status="abandoned";save.quests[quest.id]=next;persist();
      });actions.append(abandon);
    }
    if(actions.childNodes.length) card.append(actions);
    return card;
  }
  function render() {
    updateOverview();
    const term=(search.value||"").trim().toLowerCase();
    const selectedCategory=category.value;
    const selectedStatus=progressFilter.value;
    const visible=quests.filter(quest=>{
      if(quest.status!=="available") return false;
      const state=stateFor(quest);
      const actual=(state.status==="not-started" || state.status==="abandoned") && !prerequisitesMet(quest) ? "locked" : (state.status==="not-started" || state.status==="abandoned" ? "available" : state.status);
      if(selectedCategory!=="all" && quest.category!==selectedCategory) return false;
      if(selectedStatus!=="all" && actual!==selectedStatus) return false;
      const haystack=[quest.title,quest.summary,...relatedNames(quest.characterIds,characters),...relatedNames(quest.locationIds,locations)].join(" ").toLowerCase();
      return !term || haystack.includes(term);
    });
    $("questResultsTitle").textContent=term||selectedCategory!=="all"||selectedStatus!=="all"?"Filtered quests":"Quest board";
    $("questResultCount").textContent=visible.length+" "+(visible.length===1?"quest":"quests");
    list.replaceChildren();
    if(!visible.length){
      const empty=make("article","panel-card quest-empty");
      empty.append(make("span","empty-sigil","✧"));
      empty.append(make("h3","",quests.length?"No quests match these filters":"The story begins when you are ready"));
      empty.append(make("p","muted",quests.length?"Try another category, progress filter or search term.":"No canonical in-game quests have been published yet. The journal is ready for main stories, side adventures, character journeys, exploration and collections. We have kept it empty rather than inventing quests or rewards."));
      list.append(empty);
    } else visible.forEach(quest=>list.append(makeQuestCard(quest)));
  }
  async function load() {
    readSave();
    try {
      const [q,c,l]=await Promise.all([
        fetch(new URL("assets/data/quests.json",root)),
        fetch(new URL("assets/data/characters.json",root)),
        fetch(new URL("assets/data/locations.json",root))
      ]);
      if(!q.ok||!c.ok||!l.ok) throw new Error("A game catalogue could not be loaded.");
      const [qd,cd,ld]=await Promise.all([q.json(),c.json(),l.json()]);
      quests=Array.isArray(qd.quests)?qd.quests:[];
      characters=Array.isArray(cd.characters)?cd.characters:[];
      locations=Array.isArray(ld.locations)?ld.locations:[];
      statusLine.textContent="World catalogues connected · "+quests.length+" published quests";
      render();
    } catch(error) {
      statusLine.textContent="Quest catalogue unavailable";
      list.replaceChildren();
      const empty=make("article","panel-card quest-empty");
      empty.append(make("h3","","The journal could not connect"),make("p","muted","Please refresh when the world catalogues are available. Your existing local progress has not been cleared."));
      list.append(empty);
      console.error("Mayflower quest journal failed to load:",error);
    }
  }
  [search,category,progressFilter].forEach(el=>el.addEventListener(el===search?"input":"change",render));
  $("exportProgress").addEventListener("click",()=>{
    const backup={...save,exportedAt:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(backup,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const link=document.createElement("a");
    link.href=url;link.download="mayflower-quest-progress.json";document.body.append(link);link.click();link.remove();URL.revokeObjectURL(url);
    saveLine.textContent="Progress backup exported";
  });
  $("resetProgress").addEventListener("click",()=>{
    if(!window.confirm("Reset all quest progress saved in this browser? This cannot be undone unless you exported a backup.")) return;
    save={schemaVersion:"1.0.0",playerId:"local-player",updatedAt:new Date().toISOString(),quests:{}};
    try{localStorage.removeItem(STORAGE_KEY);storageAvailable=true;saveLine.textContent="Quest progress reset";}
    catch(error){saveLine.textContent="Could not clear local storage";}
    render();
  });
  load();
})();
