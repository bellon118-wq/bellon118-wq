import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const readJson = relative => JSON.parse(readFileSync(resolve(root, relative), "utf8").replace(/^\uFEFF/, ""));
const fail = message => { console.error("✖ " + message); process.exitCode = 1; };
const pass = message => console.log("✔ " + message);

function validateCatalogue(path, collectionName, requiredFields) {
  const data = readJson(path);
  if (typeof data.schemaVersion !== "string") fail(path + ": missing schemaVersion");
  const records = data[collectionName];
  if (!Array.isArray(records)) { fail(path + ": missing " + collectionName + " array"); return; }
  const ids = new Set();
  for (const [index, record] of records.entries()) {
    for (const field of requiredFields) {
      if (typeof record[field] !== "string" || !record[field].trim()) fail(path + ": record " + index + " missing " + field);
    }
    if (typeof record.id === "string") {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.id)) fail(path + ": invalid stable id " + record.id);
      if (ids.has(record.id)) fail(path + ": duplicate id " + record.id);
      ids.add(record.id);
    }
  }
  if (process.exitCode !== 1) pass(path + ": " + records.length + " records, unique stable IDs");
}

const routes = readJson("assets/data/routes.json");
if (typeof routes.schemaVersion !== "string") fail("assets/data/routes.json: missing schemaVersion");
if (!Array.isArray(routes.navigation) || !Array.isArray(routes.routes)) fail("routes.json must include navigation and routes arrays");
for (const item of [...(routes.navigation || []), ...(routes.routes || [])]) {
  if (!item.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) fail("routes.json: invalid or missing ID");
}
for (const route of routes.routes || []) {
  const target = resolve(root, route.path);
  if (!existsSync(target)) fail("routes.json: route target does not exist: " + route.path);
}
for (const item of routes.navigation || []) {
  const path = new URL(item.href, "https://mayflower.invalid/").pathname.replace(/^\//, "");
  if (!existsSync(resolve(root, path))) fail("routes.json: navigation target does not exist: " + item.href);
}
if (process.exitCode !== 1) pass("assets/data/routes.json: " + routes.routes.length + " routes and " + routes.navigation.length + " navigation entries verified");

validateCatalogue("assets/data/characters.json", "characters", ["id","name","role","status","faction"]);
validateCatalogue("assets/data/games.json", "games", ["id","name","genre"]);

const sourceMap = readJson("assets/data/source-map.json");
for (const [name, path] of Object.entries(sourceMap.canonical || {})) {
  if (!existsSync(resolve(root, path))) fail("source-map: canonical " + name + " file missing: " + path);
}
for (const [legacyPath, entry] of Object.entries(sourceMap.legacy || {})) {
  if (!existsSync(resolve(root, legacyPath))) fail("source-map: expected legacy compatibility file missing: " + legacyPath);
  if (!entry.replacedBy) fail("source-map: legacy mapping missing replacement for " + legacyPath);
}
if (process.exitCode !== 1) pass("source-map: canonical and legacy compatibility paths verified");

if (process.exitCode === 1) {
  console.error("\nContent validation failed.");
} else {
  console.log("\nMayflower Sanctuary content validation passed.");
}
