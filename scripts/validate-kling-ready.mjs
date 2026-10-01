#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const base = path.resolve(import.meta.dirname, "..");
const proof = path.join(base, "projects", "poluren-proof");
const requestFile = process.argv.find((value) => value.startsWith("--request-file="))?.split("=").slice(1).join("=") || "generation/kling-ready-requests.json";
const manifestPath = path.resolve(proof, requestFile);
const runId = process.argv.find((value) => value.startsWith("--run="))?.split("=")[1] || "READY-CHECK-001";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const errors = [];
const warnings = [];

// On Windows, `kling` resolves to the trusted PowerShell shim. Node's
// spawnSync needs shell resolution enabled to invoke that shim; the arguments
// here are fixed/manifest-controlled CLI flags, and no credentials are passed.
const result = spawnSync("kling", ["who_am_i", "--quiet", "--skill-name", "kling-cli", "--skill-version", manifest.channelVersion], {
  encoding: "utf8",
  shell: process.platform === "win32"
});
let response = null;
try { response = JSON.parse((result.stdout || "").trim()); } catch { errors.push("kling who_am_i 未返回可解析 JSON"); }
const available = response?.body?.availableModels?.image_to_video;
if (!available) errors.push("当前 Kling 响应没有 image_to_video 能力声明");
const models = Array.isArray(available?.models) ? available.models : [];
const selected = models.find((model) => model.model === "kling-video-v3_0");
if (!selected) errors.push("当前 Kling 能力声明中没有 kling-video-v3_0");
const declaredArgs = new Map((selected?.arguments || []).map((argument) => [argument.name, argument]));

for (const request of manifest.requests) {
  const firstImage = path.resolve(proof, request.firstImage);
  if (!fs.existsSync(firstImage)) errors.push(`${request.shotId}: 首帧不存在 ${request.firstImage}`);
  if (request.model !== selected?.model) errors.push(`${request.shotId}: request model 与当前能力声明不一致`);
  for (const name of ["duration", "resolution", "imageCount", "prefer_multi_shots", "enable_audio"]) {
    const declaration = declaredArgs.get(name);
    if (!declaration) errors.push(`${request.shotId}: 当前模型未声明参数 ${name}`);
    else if (Array.isArray(declaration.allowedValues) && !declaration.allowedValues.map(String).includes(String(request[name]))) {
      errors.push(`${request.shotId}: ${name}=${request[name]} 不在当前模型允许值内`);
    }
  }
  if (!["awaiting-authorization", "awaiting-explicit-audio-generation-authorization"].includes(request.submissionStatus)) warnings.push(`${request.shotId}: submissionStatus 不是待授权状态`);
}

const report = {
  runId,
  checkedAt: new Date().toISOString(),
  status: errors.length ? "failed" : "ready-awaiting-authorization",
  requestFile,
  channel: manifest.channel,
  model: selected?.model || null,
  modelDescription: selected?.description || null,
  requests: manifest.requests.map((request) => ({ shotId: request.shotId, firstImage: request.firstImage, model: request.model, duration: request.duration, resolution: request.resolution, enable_audio: request.enable_audio })),
  errors,
  warnings,
  nextAction: errors.length ? "修正提交包后重跑检查" : "获得明确额度授权后，逐镜运行 kling-submit-shot.mjs --authorize；然后用 query_tasks 逐次轮询"
};

const runDir = path.join(proof, "runs", runId);
fs.mkdirSync(runDir, { recursive: true });
fs.writeFileSync(path.join(runDir, "kling-ready-check.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
