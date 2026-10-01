#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";

const base = path.resolve(import.meta.dirname, "..");
const proof = path.join(base, "projects", "poluren-proof");
const manifestPath = path.join(proof, "generation", "kling-ready-requests.json");
const projectPath = path.join(proof, "project.json");
const arg = (name) => process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const shotId = arg("shot");
const requestFile = arg("request-file");
const runId = arg("run") || `KLING-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}`;
const suppliedTaskTraceId = arg("task-trace-id");
const authorized = process.argv.includes("--authorize");

function fail(message, extra = {}) {
  console.error(JSON.stringify({ status: "blocked", message, ...extra }, null, 2));
  process.exit(2);
}

if (!shotId) fail("必须指定 --shot=S05-P-001|S05-P-002|S05-P-003");
const selectedManifestPath = requestFile ? path.resolve(proof, requestFile) : manifestPath;
if (!fs.existsSync(selectedManifestPath)) fail("缺少 Kling 提交包", { manifestPath: selectedManifestPath });

const manifest = JSON.parse(fs.readFileSync(selectedManifestPath, "utf8"));
const project = JSON.parse(fs.readFileSync(projectPath, "utf8"));
const request = manifest.requests.find((item) => item.shotId === shotId);
if (!request) fail("提交包中不存在该镜头", { shotId });

const imagePath = path.resolve(proof, request.firstImage);
if (!fs.existsSync(imagePath)) fail("首帧文件不存在", { shotId, imagePath });
if (suppliedTaskTraceId && !/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(suppliedTaskTraceId)) {
  fail("--task-trace-id 必须是 RFC 4122 UUID V7", { shotId });
}

if (!authorized) {
  fail("未执行：Kling 生成会消耗额度。需要用户明确授权后再传 --authorize。", {
    shotId,
    model: request.model,
    duration: request.duration,
    resolution: request.resolution,
    projectPolicy: project.evidencePolicy?.allowPaidGeneration,
    next: `node docs/film-engineering/scripts/kling-submit-shot.mjs --shot=${shotId} --authorize`
  });
}

function uuidV7() {
  const bytes = randomBytes(16);
  let time = BigInt(Date.now());
  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = Number(time & 0xffn);
    time >>= 8n;
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function redact(value) {
  return String(value || "").replace(/(access[_-]?token|refresh[_-]?token|api[_-]?key|password|secret)\s*[:=]\s*["']?[^\s,"'}]+/gi, "$1=[REDACTED]");
}

const taskTraceId = suppliedTaskTraceId || uuidV7();
const cliArgs = [
  "image_to_video",
  "--model", request.model,
  "--image", imagePath,
  "--duration", request.duration,
  "--resolution", request.resolution,
  "--imageCount", request.imageCount,
  "--prefer_multi_shots", request.prefer_multi_shots,
  "--enable_audio", request.enable_audio,
  "--poll", "0",
  "--skill-name", "kling-cli",
  "--skill-version", manifest.channelVersion,
  "--task-trace-id", taskTraceId,
  "--rationale", `POLUREN-PROOF ${shotId}: execute the approved cinematic shot request with a locked first frame${request.enable_audio === "true" ? " and native synced audio." : "; keep model audio disabled for the Sound agent."}`,
  request.prompt
];

// On Windows, `kling` resolves to the trusted PowerShell shim. Enable shell
// resolution only for this fixed CLI invocation; credentials remain inside
// the local Kling CLI/OAuth flow and are never passed as arguments.
const result = spawnSync("kling", cliArgs, {
  cwd: path.resolve(base, "../.."),
  encoding: "utf8",
  shell: process.platform === "win32"
});
const stdout = redact(result.stdout || "");
const stderr = redact(result.stderr || "");
let parsed = null;
try { parsed = JSON.parse(stdout.trim()); } catch { /* CLI may return human-readable diagnostics. */ }
const body = parsed?.body || parsed;
const generationId = body?.generationId || body?.generation_id || parsed?.generationId || parsed?.generation_id || null;
const creditsConsumed = body?.creditsConsumed ?? body?.credits_consumed ?? parsed?.creditsConsumed ?? parsed?.credits_consumed ?? null;
const submissionDir = path.join(proof, "runs", runId, "generation-submissions");
fs.mkdirSync(submissionDir, { recursive: true });
const record = {
  shotId,
  runId,
  requestRef: path.relative(proof, selectedManifestPath),
  channel: manifest.channel,
  model: request.model,
  taskTraceId,
  submittedAt: new Date().toISOString(),
  cliExitCode: result.status,
  generationId,
  creditsConsumed,
  status: result.status === 0 && generationId ? "submitted-awaiting-poll" : "submission-failed",
  stdout,
  stderr,
  nextAction: generationId ? `kling query_tasks ${generationId} --skill-name kling-cli --skill-version ${manifest.channelVersion}` : "不要自动重试；先阅读错误并由用户决定。"
};
fs.writeFileSync(path.join(submissionDir, `${shotId}.json`), `${JSON.stringify(record, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...record, recordPath: path.relative(proof, path.join(submissionDir, `${shotId}.json`)) }, null, 2));
if (record.status === "submission-failed") process.exit(result.status || 1);
