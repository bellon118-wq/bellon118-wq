import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = relative => JSON.parse(readFileSync(resolve(root, relative), "utf8").replace(/^\uFEFF/, ""));
const fail = message => { console.error("✖ " + message); process.exitCode = 1; };
const pass = message => console.log("✔ " + message);
const validId = value => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

function validateCatalogue(path, collectionName, requiredFields) {
  const data = readJson(path);
  if (typeof data.schemaVersion !== "string") fail(path + ": missing schemaVersion");
  const records = data[collectionName];
  if (!Array.isArray(records)) { fail(path + ": missing " + collectionName + " array"); return []; }
  const ids = new Set();
  for (const [index, record] of records.entries()) {
    for (const field of requiredFields) {
      if (typeof record[field] !== "string" || !record[field].trim()) fail(path + ": record " + index + " missing " + field);
    }
    if (typeof record.id === "string") {
      if (!validId(record.id)) fail(path + ": invalid stable id " + record.id);
      if (ids.has(record.id)) fail(path + ": duplicate id " + record.id);
      ids.add(record.id);
    }
  }
  pass(path + ": " + records.length + " records checked");
  return records;
}

const routes = readJson("assets/data/routes.json");
if (typeof routes.schemaVersion !== "string") fail("assets/data/routes.json: missing schemaVersion");
if (!Array.isArray(routes.navigation) || !Array.isArray(routes.routes)) fail("routes.json must include navigation and routes arrays");
for (const item of [...(routes.navigation || []), ...(routes.routes || [])]) {
  if (!validId(item.id)) fail("routes.json: invalid or missing ID");
}
for (const route of routes.routes || []) {
  if (!existsSync(resolve(root, route.path))) fail("routes.json: route target does not exist: " + route.path);
}
for (const item of routes.navigation || []) {
  const path = new URL(item.href, "https://mayflower.invalid/").pathname.replace(/^\//, "");
  if (!existsSync(resolve(root, path))) fail("routes.json: navigation target does not exist: " + item.href);
}
pass("assets/data/routes.json: route targets checked");

const characters = validateCatalogue("assets/data/characters.json", "characters", ["id","name","role","status","faction"]);
validateCatalogue("assets/data/games.json", "games", ["id","name","genre"]);
const locations = validateCatalogue("assets/data/locations.json", "locations", ["id","name","locationType","status","description"]);
const quests = validateCatalogue("assets/data/quests.json", "quests", ["id","title","category","status"]);

const characterIds = new Set(characters.map(x => x.id));
const locationIds = new Set(locations.map(x => x.id));
const questIds = new Set(quests.map(x => x.id));
const mapMarkerIds = new Set();
const mapHtml = readFileSync(resolve(root, "index.html"), "utf8");

for (const location of locations) {
  if (location.mapMarkerId) {
    if (mapMarkerIds.has(location.mapMarkerId)) fail("locations.json: duplicate mapMarkerId " + location.mapMarkerId);
    mapMarkerIds.add(location.mapMarkerId);
    if (!mapHtml.includes('data-map="' + location.mapMarkerId + '"')) fail("locations.json: mapMarkerId has no matching index.html marker: " + location.mapMarkerId);
  }
  if (location.parentLocationId && !locationIds.has(location.parentLocationId)) fail("locations.json: " + location.id + " has unknown parentLocationId " + location.parentLocationId);
  for (const id of location.characterIds || []) if (!characterIds.has(id)) fail("locations.json: " + location.id + " references unknown character " + id);
  for (const id of location.questIds || []) if (!questIds.has(id)) fail("locations.json: " + location.id + " references unknown quest " + id);
}
for (const character of characters) {
  if (character.homeLocationId && !locationIds.has(character.homeLocationId)) fail("characters.json: " + character.id + " has unknown homeLocationId " + character.homeLocationId);
  if (character.homeLocationId) {
    const home = locations.find(location => location.id === character.homeLocationId);
    if (home && !(home.characterIds || []).includes(character.id)) fail("characters.json: " + character.id + " homeLocationId is not reciprocated by location " + home.id);
  }
  for (const id of character.locationIds || []) if (!locationIds.has(id)) fail("characters.json: " + character.id + " references unknown location " + id);
  for (const id of character.questIds || []) if (!questIds.has(id)) fail("characters.json: " + character.id + " references unknown quest " + id);
}
const questCategories = new Set(["main","side","character","exploration","collection"]);
for (const quest of quests) {
  if (!questCategories.has(quest.category)) fail("quests.json: " + quest.id + " has invalid category " + quest.category);
  if (!Array.isArray(quest.objectives) || quest.objectives.length < 1) fail("quests.json: " + quest.id + " must define at least one objective");
  const objectiveIds = new Set();
  for (const objective of quest.objectives || []) {
    if (!validId(objective.id)) fail("quests.json: " + quest.id + " has invalid objective ID");
    if (objectiveIds.has(objective.id)) fail("quests.json: " + quest.id + " has duplicate objective ID " + objective.id);
    objectiveIds.add(objective.id);
    if (!["discover","interact","collect","visit","complete"].includes(objective.type)) fail("quests.json: " + quest.id + " has invalid objective type " + objective.type);
  }
  for (const id of quest.prerequisiteQuestIds || []) if (!questIds.has(id)) fail("quests.json: " + quest.id + " references unknown prerequisite quest " + id);
  for (const id of quest.characterIds || []) if (!characterIds.has(id)) fail("quests.json: " + quest.id + " references unknown character " + id);
  for (const id of quest.locationIds || []) if (!locationIds.has(id)) fail("quests.json: " + quest.id + " references unknown location " + id);
  for (const id of quest.rewardItemIds || []) if (typeof id !== "string" || !validId(id)) fail("quests.json: " + quest.id + " has invalid reward item ID " + id);
}
const visiting = new Set(), visited = new Set();
function checkQuestCycle(id) {
  if (visiting.has(id)) { fail("quests.json: prerequisite cycle detected at " + id); return; }
  if (visited.has(id)) return;
  visiting.add(id);
  const quest = quests.find(item => item.id === id);
  for (const dependency of (quest && quest.prerequisiteQuestIds) || []) if (questIds.has(dependency)) checkQuestCycle(dependency);
  visiting.delete(id); visited.add(id);
}
quests.forEach(quest => checkQuestCycle(quest.id));
pass("quests.json: categories, objectives and prerequisite graph checked");

const sourceMap = readJson("assets/data/source-map.json");
for (const [name, path] of Object.entries(sourceMap.canonical || {})) {
  if (!existsSync(resolve(root, path))) fail("source-map: canonical " + name + " file missing: " + path);
}
for (const [legacyPath, entry] of Object.entries(sourceMap.legacy || {})) {
  if (!existsSync(resolve(root, legacyPath))) fail("source-map: expected legacy compatibility file missing: " + legacyPath);
  if (!entry.replacedBy) fail("source-map: legacy mapping missing replacement for " + legacyPath);
}
pass("source-map: canonical and legacy compatibility paths checked");

if (process.exitCode === 1) console.error("\nContent validation failed.");
else console.log("\nMayflower Sanctuary content and relationship validation passed.");
