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
const itemData = readJson("assets/data/items.json");
if (typeof itemData.schemaVersion !== "string") fail("items.json: missing schemaVersion");
const items = validateCatalogue("assets/data/items.json", "items", ["id","name","category","rarity","description"]);
const currencies = validateCatalogue("assets/data/items.json", "currencies", ["id","name","description"]);
const collections = validateCatalogue("assets/data/items.json", "collections", ["id","name"]);
const discoveryData = readJson("assets/data/discoveries.json");
const locationDiscoveries = validateCatalogue("assets/data/discoveries.json", "locations", ["id","locationId"]);
const collectibleDiscoveries = validateCatalogue("assets/data/discoveries.json", "collectibles", ["id","itemId"]);

const relationshipData = readJson("assets/data/relationships.json");
if (typeof relationshipData.schemaVersion !== "string" || !Array.isArray(relationshipData.relationships)) fail("relationships.json: missing schemaVersion or relationships array");
const relationshipIds = new Set();
for (const relationship of relationshipData.relationships || []) {
  if (!validId(relationship.id) || relationshipIds.has(relationship.id)) fail("relationships.json: invalid or duplicate relationship ID " + relationship.id);
  relationshipIds.add(relationship.id);
  if (!characters.some(character => character.id === relationship.characterId)) fail("relationships.json: " + relationship.id + " references unknown character " + relationship.characterId);
  if (!["visitor-prototype","canonical-profile"].includes(relationship.mode)) fail("relationships.json: " + relationship.id + " has invalid mode");
  if (typeof relationship.profileHref !== "string" || !existsSync(resolve(root, relationship.profileHref))) fail("relationships.json: " + relationship.id + " has missing profileHref");
}
pass("relationships.json: character references and profile routes checked");
const museCoreProfile = readJson("assets/data/muse-core-profile.json");
if (typeof museCoreProfile.schemaVersion !== "string" || !Array.isArray(museCoreProfile.memoryArchitecture?.categories)) fail("muse-core-profile.json: missing version or memory categories");
if (!characters.some(character => character.id === museCoreProfile.characterId)) fail("muse-core-profile.json: unknown characterId " + museCoreProfile.characterId);
const expectedMemoryCategories = ["core","relationship","episodic","symbolic"];
if (expectedMemoryCategories.some(category => !museCoreProfile.memoryArchitecture.categories.includes(category)) || museCoreProfile.memoryArchitecture.categories.length !== 4) fail("muse-core-profile.json: all four unique memory categories are required");
const weights = museCoreProfile.memoryArchitecture.memoryScore?.weights || {};
const weightTotal = ["emotionalIntensity","personalRelevance","novelty","repetitionValue"].reduce((sum,key)=>sum+(Number(weights[key])||0),0);
if (Math.abs(weightTotal-1)>0.000001) fail("muse-core-profile.json: memory score weights must total 1");
if (museCoreProfile.memoryArchitecture.captureMode !== "explicit-player-authored" || museCoreProfile.memoryArchitecture.reviewRequired !== true) fail("muse-core-profile.json: explicit player capture and review are required");
pass("muse-core-profile.json: character reference, memory layers and scoring weights checked");
const dialogueProfile = readJson("assets/data/youthspark-dialogue-profile.json");
if (dialogueProfile.schemaVersion !== "1.0.0" || dialogueProfile.characterId !== "youthspark-muse") fail("youthspark-dialogue-profile.json: invalid version or character reference");
if (!characters.some(character => character.id === dialogueProfile.characterId)) fail("youthspark-dialogue-profile.json: unknown characterId");
if (dialogueProfile.dialogue?.engine !== "local-rule-prototype" || dialogueProfile.dialogue?.networkRequests !== false || dialogueProfile.dialogue?.conversationPersistence !== "none") fail("youthspark-dialogue-profile.json: prototype must remain local and non-persistent");
if (dialogueProfile.dialogue?.memoryContext?.defaultEnabled !== false || dialogueProfile.dialogue?.memoryContext?.perReplyOptIn !== true || dialogueProfile.dialogue?.memoryContext?.eligibleStatus !== "retained" || dialogueProfile.dialogue?.memoryContext?.automaticCapture !== false) fail("youthspark-dialogue-profile.json: memory context must be opt-in and retained-only");
if (dialogueProfile.voice?.enabled !== false || dialogueProfile.voice?.consentRequired !== true) fail("youthspark-dialogue-profile.json: voice must remain disabled and consent-gated");
for (const key of ["liveLanguageModel","cloudMemory","voiceSynthesis","speechRecognition","backend"]) if (dialogueProfile.integrationStatus?.[key] !== "not-connected") fail("youthspark-dialogue-profile.json: "+key+" must remain marked not-connected");
pass("youthspark-dialogue-profile.json: local dialogue, memory consent and voice boundaries checked");
const aiRuntime = readJson("assets/data/youthspark-ai-runtime.json");
if (aiRuntime.schemaVersion !== "1.0.0" || aiRuntime.enabled !== false || aiRuntime.endpoint !== null || aiRuntime.requireExplicitConsent !== true) fail("youthspark-ai-runtime.json: gateway must remain disabled with no endpoint and explicit consent required");
if (JSON.stringify(aiRuntime).match(/(api[_-]?key|secret|bearer|token)\\s*["']?\\s*:/i)) fail("youthspark-ai-runtime.json: public runtime config must not contain credentials");
for (const path of ["schemas/youthspark-chat-request.schema.json","schemas/youthspark-chat-response.schema.json","assets/js/youthspark-ai-gateway.js","docs/PHASE_2_7_YOUTHSPARK_AI_GATEWAY.md"]) if (!existsSync(resolve(root,path))) fail("Phase 2.7 required file missing: "+path);
pass("youthspark-ai-runtime.json: disabled-by-default gateway and public-config boundaries checked");


const characterIds = new Set(characters.map(x => x.id));
const locationIds = new Set(locations.map(x => x.id));
const questIds = new Set(quests.map(x => x.id));
const itemIds = new Set(items.map(x => x.id));
const currencyIds = new Set(currencies.map(x => x.id));
const collectionIds = new Set(collections.map(x => x.id));
for (const entry of locationDiscoveries) if (!locationIds.has(entry.locationId)) fail("discoveries.json: "+entry.id+" references unknown location "+entry.locationId);
for (const entry of collectibleDiscoveries) if (!itemIds.has(entry.itemId)) fail("discoveries.json: "+entry.id+" references unknown item "+entry.itemId);
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
for (const item of items) {
  if (!["material","consumable","equipment","collectible","quest","cosmetic","other"].includes(item.category)) fail("items.json: "+item.id+" has invalid category "+item.category);
  if (!["common","uncommon","rare","epic","legendary","mythic","unclassified"].includes(item.rarity)) fail("items.json: "+item.id+" has invalid rarity "+item.rarity);
  for (const id of item.sourceQuestIds || []) if (!questIds.has(id)) fail("items.json: "+item.id+" references unknown source quest "+id);
  for (const id of item.characterIds || []) if (!characterIds.has(id)) fail("items.json: "+item.id+" references unknown character "+id);
  for (const id of item.locationIds || []) if (!locationIds.has(id)) fail("items.json: "+item.id+" references unknown location "+id);
}
for (const collection of collections) {
  for (const id of collection.itemIds || []) if (!itemIds.has(id)) fail("items.json: collection "+collection.id+" references unknown item "+id);
  for (const id of collection.completionRewardIds || []) if (!itemIds.has(id)) fail("items.json: collection "+collection.id+" references unknown reward item "+id);
}
for (const quest of quests) for (const id of quest.rewardItemIds || []) if (!itemIds.has(id)) fail("quests.json: "+quest.id+" references unknown reward item "+id);
pass("items.json: item, currency and collection references checked");
pass("discoveries.json: location and collectible references checked");
pass("relationships.json: relationship catalogue checked");
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
if (!itemData.items || !Array.isArray(itemData.items) || !Array.isArray(itemData.currencies) || !Array.isArray(itemData.collections)) fail("items.json must include items, currencies and collections arrays");

if (process.exitCode === 1) console.error("\nContent validation failed.");
else console.log("\nMayflower Sanctuary content and relationship validation passed.");
