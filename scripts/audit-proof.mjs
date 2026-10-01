#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const base = path.resolve(import.meta.dirname, "..");
const proof = path.join(base, "projects", "poluren-proof");
const errors = [];
const warnings = [];

function json(relativePath) {
  const file = path.join(proof, relativePath);
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
    return null;
  }
}

function requireValue(value, label) {
  if (value === undefined || value === null || value === "") errors.push(`${label}: missing`);
}

const project = json("project.json");
const chars = json("canon/characters.json");
const scenes = json("canon/scenes.json");
const assets = json("assets/asset-records.json");
const prompts = json("prompt-versions.json");
const handoffs = json("handoffs/handoffs.json");
const ledger = json("continuity-ledger.json");
const review = json("reviews/review.json");
const registry = JSON.parse(fs.readFileSync(path.join(base, "agent-registry.json"), "utf8"));

const shotFiles = ["shots/S05-P-001.json", "shots/S05-P-002.json", "shots/S05-P-003.json"];
const shots = shotFiles.map(json).filter(Boolean);
const shotIds = new Set(shots.map((shot) => shot.shotId));
const assetIds = new Set((assets?.assets || []).map((asset) => asset.id));
const agentIds = new Set((registry.agents || []).map((agent) => agent.id));
const realRun = Boolean(project && (project.generationRuns?.length || project.status !== "dry-run"));

if (project) {
  if (project.projectId !== "POLUREN-PROOF") errors.push("project: wrong projectId");
  if (!realRun && project.status !== "dry-run") errors.push("project: dry-run project has a non-dry-run status");
  if (realRun && (project.generationRuns?.length || 0) < shotFiles.length) errors.push("project: real run must have at least " + shotFiles.length + " GenerationRuns");
  for (const id of project.shots || []) if (!shotIds.has(id)) errors.push(`project: missing shot file for ${id}`);
}

if ((chars?.characters || []).length < 3) errors.push("canon: expected at least three characters");
if ((scenes?.scenes || []).length !== 1) errors.push("canon: expected exactly one proof scene");
if ((assets?.assets || []).length < 4) errors.push("assets: expected character, location and prop records");

for (const shot of shots) {
  for (const field of ["projectId", "sceneId", "shotId", "storyIntent", "firstFrame", "performanceBeat", "cameraPlan", "lightingAndSound", "assetRefs", "continuityAnchors", "promptVersionRef"]) {
    requireValue(shot[field], `${shot.shotId}.${field}`);
  }
  if (!realRun && shot.status !== "dry-run") errors.push(`${shot.shotId}: must remain dry-run`);
  if (realRun) {
    if (shot.status !== "real-video-review") errors.push(`${shot.shotId}: real run requires real-video-review status`);
    requireValue(shot.generationRunId, `${shot.shotId}.generationRunId`);
    requireValue(shot.localArtifactPath, `${shot.shotId}.localArtifactPath`);
    if (shot.localArtifactPath && !fs.existsSync(path.join(proof, shot.localArtifactPath))) {
      errors.push(`${shot.shotId}: local artifact missing: ${shot.localArtifactPath}`);
    }
  }
  for (const assetId of shot.assetRefs || []) if (!assetIds.has(assetId)) errors.push(`${shot.shotId}: unknown asset ${assetId}`);
  if (shot.promptVersionRef && !(prompts?.prompts || []).some((prompt) => prompt.id === shot.promptVersionRef)) {
    errors.push(`${shot.shotId}: promptVersionRef not found`);
  }
}

const promptShotIds = new Set();
for (const prompt of prompts?.prompts || []) {
  const superseded = String(prompt.status || "").startsWith("superseded-by");
  const pendingVariant = ["repair-ready", "audio-ready"].includes(prompt.status);
  if (!realRun && prompt.status !== "dry-run") errors.push(`${prompt.id}: must remain dry-run`);
  if (!realRun && prompt.generationRunId !== null) errors.push(`${prompt.id}: generationRunId must be null before generation`);
  if (realRun && !superseded) {
    if (!["generated-unverified", "repair-ready", "audio-ready"].includes(prompt.status)) errors.push(`${prompt.id}: invalid real-run status`);
    if (pendingVariant) {
      if (prompt.generationRunId !== null) errors.push(`${prompt.id}: pending variant must not claim a GenerationRun`);
    } else {
      requireValue(prompt.generationRunId, `${prompt.id}.generationRunId`);
      if (prompt.platformBinding?.status !== "generated") errors.push(`${prompt.id}: platform binding must be generated`);
    }
  }
  if (!shotIds.has(prompt.shotId)) errors.push(`${prompt.id}: unknown shot ${prompt.shotId}`);
  if (!superseded && !pendingVariant && promptShotIds.has(prompt.shotId)) errors.push(`${prompt.shotId}: duplicate active prompt binding`);
  if (!superseded && !pendingVariant) promptShotIds.add(prompt.shotId);
  if (/(verified|final|已生成|通过)/i.test(prompt.text)) warnings.push(`${prompt.id}: prompt text contains a claim-like word; review wording`);
}
if (promptShotIds.size !== shotIds.size) errors.push("prompts: not every shot has exactly one prompt");

for (const handoff of handoffs?.handoffs || []) {
  if (!agentIds.has(handoff.from) || !agentIds.has(handoff.to)) errors.push(`${handoff.id}: unknown agent in handoff`);
  requireValue(handoff.artifact, `${handoff.id}.artifact`);
  requireValue(handoff.acceptance, `${handoff.id}.acceptance`);
}

for (const check of ledger?.adjacentChecks || []) {
  if (!shotIds.has(check.from) || !shotIds.has(check.to)) errors.push(`continuity: unknown adjacent shot ${check.from} -> ${check.to}`);
  if (!realRun) {
    if (check.status === "verified") errors.push(`continuity: ${check.from} -> ${check.to} cannot be verified without artifacts`);
    if (check.notVerifiedByArtifact !== true) errors.push(`continuity: ${check.from} -> ${check.to} must disclose lack of artifact evidence`);
  } else {
    if (!check.realVideoEvidence) errors.push(`continuity: ${check.from} -> ${check.to} missing realVideoEvidence`);
    if (check.notVerifiedByArtifact !== false) errors.push(`continuity: ${check.from} -> ${check.to} must record artifact evidence`);
  }
}

if (!realRun) {
  if (review?.evidenceLevel !== "unverified") errors.push("review: proof review must remain unverified");
  if (!["dry-run-only", "previs-only"].includes(review?.reviewStatus)) errors.push("review: expected dry-run-only or previs-only status");
  if (review?.decision !== "hold") errors.push("review: cannot advance while review has unresolved holds");
} else {
  if (!["real-video-unverified", "real-video-audio-verified", "verified"].includes(review?.evidenceLevel)) {
    errors.push("review: real run requires valid real-video evidence level");
  }
  if (!["real-video-hold", "pass-audio-video", "final"].includes(review?.reviewStatus)) {
    errors.push("review: real run requires valid review status");
  }
  if (!["hold", "approve"].includes(review?.decision)) {
    errors.push("review: decision must be hold or approve");
  }
}

if (errors.length) {
  console.error("proof audit: FAILED");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("proof audit: PASS");
console.log(`- shots audited: ${shots.length}`);
console.log(`- prompt bindings: ${promptShotIds.size}`);
console.log(`- assets referenced: ${assetIds.size}`);
console.log(`- continuity checks: ${ledger?.adjacentChecks?.length || 0}`);
console.log(realRun ? "- evidence boundary: real video present / review hold" : "- evidence boundary: dry-run / unverified");
for (const warning of warnings) console.log(`warning: ${warning}`);
