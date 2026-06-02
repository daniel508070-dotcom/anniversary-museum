import fs from "node:fs";
import path from "node:path";

const dataPath = path.resolve("data/generated/relationship.json");
const raw = fs.readFileSync(dataPath, "utf8");
const data = JSON.parse(raw);
const required = ["generatedAt", "source", "people", "chapters", "milestones", "totals", "activity", "phrases", "emoji", "firsts", "hallOfFame", "funFacts", "evolution", "monthlyMemories"];

for (const key of required) {
  if (!(key in data)) {
    throw new Error(`Missing relationship data key: ${key}`);
  }
}

if (!Array.isArray(data.people) || !data.people.includes("Daniel") || !data.people.includes("Isabella")) {
  throw new Error("Relationship data must include Daniel and Isabella.");
}

if (!Array.isArray(data.chapters) || data.chapters.length !== 6) {
  throw new Error("Relationship data must include six relationship chapters.");
}

console.log(`Verified ${data.totals.messages} messages from ${data.source.mode} data.`);
