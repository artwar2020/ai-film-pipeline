#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] || path.join(import.meta.dirname, ".."));
const errors = [];
const warnings = [];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${path.relative(root, file)}: invalid JSON (${error.message})`);
    return null;
  }
}

function requireFile(relativePath) {
  const file = path.join(root, relativePath);
  if (!fs.existsSync(file)) errors.push(`missing file: ${relativePath}`);
  return file;
}

const registry = readJson(requireFile("agent-registry.json"));
const manifest = readJson(requireFile("project-manifest.example.json"));

if (registry) {
  const ids = registry.agents?.map((agent) => agent.id) || [];
  if (new Set(ids).size !== ids.length) errors.push("agent-registry.json: duplicate agent id");
  if (!Array.isArray(registry.gates) || registry.gates.length < 3) {
    errors.push("agent-registry.json: expected at least three quality gates");
  }
  for (const agent of registry.agents || []) {
    if (!agent.id || !agent.label || !agent.phase || !Array.isArray(agent.owns)) {
      errors.push(`agent-registry.json: incomplete agent record ${JSON.stringify(agent)}`);
    }
  }
}

if (manifest) {
  for (const key of ["schemaVersion", "projectId", "canon", "agents", "shots", "promptVersions", "generationRuns", "reviews"]) {
    if (!(key in manifest)) errors.push(`project-manifest.example.json: missing ${key}`);
  }
  const enabled = manifest.agents?.enabled || [];
  const registered = new Set((registry?.agents || []).map((agent) => agent.id));
  for (const id of enabled) if (!registered.has(id)) errors.push(`project manifest references unknown agent: ${id}`);
}

const agentDir = path.join(root, "agents");
const agentDocs = fs.existsSync(agentDir)
  ? fs.readdirSync(agentDir).filter((file) => file.endsWith(".md") && file !== "README.md")
  : [];
if (agentDocs.length < 6) errors.push("agents/: expected at least six independent agent contracts");

const template = path.join(root, "projects", "_template");
for (const relativePath of [
  "projects/_template/project.json",
  "projects/_template/continuity-ledger.example.json",
  "projects/_template/README.md",
  "projects/_template/canon/README.md",
  "projects/_template/assets/README.md",
  "projects/_template/shots/README.md",
  "projects/_template/shots/SHOT-001.example.json",
  "projects/_template/handoffs/README.md",
  "projects/_template/handoffs/SHOT-001_acting_to_cinedance_v0.json",
  "projects/_template/reviews/SHOT-001_review_v0.json",
  "projects/_template/reviews/README.md"
]) requireFile(relativePath);

if (template && fs.existsSync(path.join(template, "project.json"))) {
  const project = readJson(path.join(template, "project.json"));
  if (project && project.projectId !== "PROJECT-TEMPLATE") {
    warnings.push("projects/_template/project.json: projectId is not PROJECT-TEMPLATE");
  }
}

const handoffExample = readJson(path.join(template, "handoffs", "SHOT-001_acting_to_cinedance_v0.json"));
if (handoffExample) {
  for (const key of ["fromAgent", "toAgent", "status", "change", "preserve", "unknowns", "acceptance"]) {
    if (!(key in handoffExample)) errors.push(`handoff example: missing ${key}`);
  }
}

const proof = path.join(root, "projects", "poluren-proof");
for (const relativePath of [
  "projects/poluren-proof/project.json",
  "projects/poluren-proof/canon/characters.json",
  "projects/poluren-proof/canon/scenes.json",
  "projects/poluren-proof/assets/asset-records.json",
  "projects/poluren-proof/technique-decisions.json",
  "projects/poluren-proof/shots/S05-P-001.json",
  "projects/poluren-proof/shots/S05-P-002.json",
  "projects/poluren-proof/shots/S05-P-003.json",
  "projects/poluren-proof/prompt-versions.json",
  "projects/poluren-proof/handoffs/handoffs.json",
  "projects/poluren-proof/sound-plan.json",
  "projects/poluren-proof/continuity-ledger.json",
  "projects/poluren-proof/reviews/review.json"
]) requireFile(relativePath);

requireFile("projects/poluren-proof/generation/paid-generation-authorization.json");
requireFile("projects/poluren-proof/generation/sound-finalization-blocker.json");
requireFile("projects/poluren-proof/generation/kling-audio-requests.json");

if (fs.existsSync(proof)) {
  const proofProject = readJson(path.join(proof, "project.json"));
  const proofPrompts = readJson(path.join(proof, "prompt-versions.json"));
  const proofReview = readJson(path.join(proof, "reviews", "review.json"));
  if (proofProject && proofProject.shots?.length !== 3) errors.push("poluren-proof: expected exactly three proof shots");
  if (proofPrompts && (proofPrompts.prompts?.length || 0) < 3) errors.push("poluren-proof: expected at least three prompt records");
  if (proofReview && proofReview.evidenceLevel === "verified") errors.push("poluren-proof: dry-run review cannot be verified");
}

if (errors.length) {
  console.error("film-engineering check: FAILED");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("film-engineering check: PASS");
console.log(`- agents: ${agentDocs.length}`);
console.log(`- gates: ${registry?.gates?.length || 0}`);
console.log(`- template: ${fs.existsSync(template) ? "present" : "missing"}`);
for (const warning of warnings) console.log(`warning: ${warning}`);
