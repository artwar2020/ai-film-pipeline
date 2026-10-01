#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const base = path.resolve(import.meta.dirname, "..");
const proof = path.join(base, "projects", "poluren-proof");
const manifestPath = path.join(proof, "generation", "kling-ready-requests.json");
const projectPath = path.join(proof, "project.json");
const promptPath = path.join(proof, "prompt-versions.json");
const arg = (name) => process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const shotId = arg("shot");
const generationId = arg("generation");
const runId = arg("run");
const requestFile = arg("request-file");

function fail(message, extra = {}) {
  console.error(JSON.stringify({ status: "blocked", message, ...extra }, null, 2));
  process.exit(2);
}

if (!shotId || !generationId || !runId) {
  fail("必须指定 --shot=S05-P-001 --generation=<generationId> --run=<runId>");
}
if (!/^S05-P-00[1-3]$/.test(shotId)) fail("shot 不在 POLUREN-PROOF 三镜范围内", { shotId });
if (!/^[A-Za-z0-9._:-]+$/.test(generationId)) fail("generationId 含有非法字符", { shotId });
if (!/^[A-Za-z0-9._-]+$/.test(runId)) fail("runId 含有非法字符", { runId });

const selectedManifestPath = requestFile ? path.resolve(proof, requestFile) : manifestPath;
if (!fs.existsSync(selectedManifestPath)) fail("缺少结果对应的提交包", { manifestPath: selectedManifestPath });
const manifest = JSON.parse(fs.readFileSync(selectedManifestPath, "utf8"));
const project = JSON.parse(fs.readFileSync(projectPath, "utf8"));
const prompts = JSON.parse(fs.readFileSync(promptPath, "utf8"));
const request = manifest.requests.find((item) => item.shotId === shotId);
if (!request) fail("提交包中不存在该镜头", { shotId });

const submissionPath = path.join(proof, "runs", runId, "generation-submissions", `${shotId}.json`);
if (!fs.existsSync(submissionPath)) fail("缺少该镜头的提交记录，拒绝凭空创建 GenerationRun", { submissionPath });
const submission = JSON.parse(fs.readFileSync(submissionPath, "utf8"));
if (submission.generationId !== generationId) {
  fail("命令中的 generationId 与提交记录不一致", {
    shotId,
    expected: submission.generationId,
    received: generationId
  });
}

function redact(value) {
  return String(value || "").replace(/(access[_-]?token|refresh[_-]?token|api[_-]?key|password|secret)\s*[:=]\s*["']?[^\s,"'}]+/gi, "$1=[REDACTED]");
}

const cliArgs = [
  "query_tasks",
  generationId,
  "--poll", "0",
  "--skill-name", "kling-cli",
  "--skill-version", manifest.channelVersion
];
const result = spawnSync("kling", cliArgs, {
  cwd: path.resolve(base, "../.."),
  encoding: "utf8",
  shell: process.platform === "win32"
});
const stdout = redact(result.stdout || "");
const stderr = redact(result.stderr || "");
let parsed = null;
try { parsed = JSON.parse(stdout.trim()); } catch { /* preserve diagnostics below */ }
const body = parsed?.body || parsed || {};
// `query_tasks --poll` returns the terminal task inside
// body.generations[0].result, while the non-polled response exposes body
// directly. Normalize both shapes before applying the evidence gate.
const generation = Array.isArray(body.generations) ? body.generations[0] : null;
const resultBody = generation?.result || body.result || body;
const statusValue = resultBody.status ?? generation?.status ?? body.status ?? body.taskStatus ?? body.state ?? parsed?.status ?? "unknown";
const normalizedStatus = String(statusValue).toLowerCase();
const works = resultBody.works || body.works || resultBody.data?.works || body.data?.works || parsed?.works || [];
const safeWorks = Array.isArray(works) ? works.map((work) => ({
  url: work?.url || null,
  urlWithoutWatermark: work?.urlWithoutWatermark || null,
  cover: work?.cover || work?.coverUrl || null
})) : [];
const terminalFailure = ["failed", "error", "cancelled", "canceled", "timeout"].includes(normalizedStatus);
const completed = ["completed", "succeeded", "success", "finished", "done"].includes(normalizedStatus) || safeWorks.some((work) => work.url || work.urlWithoutWatermark);
const status = result.status !== 0 ? "query-failed" : terminalFailure ? "generation-failed" : completed ? "completed-with-artifact-url" : "pending";

const resultDir = path.join(proof, "runs", runId, "generation-results");
fs.mkdirSync(resultDir, { recursive: true });
const resultRecord = {
  shotId,
  runId,
  generationId,
  queriedAt: new Date().toISOString(),
  cliExitCode: result.status,
  status,
  platformStatus: statusValue,
  works: safeWorks,
  stdout,
  stderr,
  nextAction: status === "completed-with-artifact-url"
    ? "立即保存 works[].url 到本地媒体资产，再运行 P4-P7；不要把 URL 存活期当作永久存档。"
    : status === "pending"
      ? "稍后用同一个 generationId 再查询；不要重新提交。"
      : "不要自动重试；先读取平台错误并由用户决定。"
};
fs.writeFileSync(path.join(resultDir, `${shotId}.json`), `${JSON.stringify(resultRecord, null, 2)}\n`, "utf8");

if (status !== "completed-with-artifact-url") {
  console.log(JSON.stringify({ ...resultRecord, recordPath: path.relative(proof, path.join(resultDir, `${shotId}.json`)) }, null, 2));
  process.exit(status === "pending" ? 3 : 1);
}

const prompt = prompts.prompts.find((item) => item.id === request.promptVersionRef);
if (!prompt) fail("找不到对应 PromptVersion，拒绝写入 GenerationRun", { promptVersionRef: request.promptVersionRef });
const generationRunId = `GR-${shotId}-${generationId}`;
const generationRunsDir = path.join(proof, "runs", runId, "generation-runs");
fs.mkdirSync(generationRunsDir, { recursive: true });
const generationRun = {
  id: generationRunId,
  shotId,
  platform: "kling-cli",
  model: request.model,
  generationId,
  taskTraceId: submission.taskTraceId,
  promptVersionRef: request.promptVersionRef,
  input: { firstImage: request.firstImage },
  parameters: {
    duration: request.duration,
    resolution: request.resolution,
    imageCount: request.imageCount,
    prefer_multi_shots: request.prefer_multi_shots,
    enable_audio: request.enable_audio
  },
  submittedAt: submission.submittedAt,
  completedAt: resultRecord.queriedAt,
  creditsConsumed: submission.creditsConsumed,
  status: "completed-unverified",
  artifacts: safeWorks,
  artifactEvidence: "platform works[].url returned by query_tasks; local media import still required",
  continuityVerification: "pending",
  soundVerification: "pending",
  reviewStatus: "pending"
};
fs.writeFileSync(path.join(generationRunsDir, `${shotId}.json`), `${JSON.stringify(generationRun, null, 2)}\n`, "utf8");

const existingRun = project.generationRuns.find((item) => item.id === generationRunId);
if (!existingRun) project.generationRuns.push(generationRun);
project.status = "generated-unverified";
project.currentStage = "P5-generated-awaiting-local-artifact-import";
project.currentOwner = "continuity";
fs.writeFileSync(projectPath, `${JSON.stringify(project, null, 2)}\n`, "utf8");

prompt.status = "generated-unverified";
prompt.generationRunId = generationRunId;
prompt.platformBinding.status = "generated";
fs.writeFileSync(promptPath, `${JSON.stringify(prompts, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  ...resultRecord,
  generationRunId,
  generationRunPath: path.relative(proof, path.join(generationRunsDir, `${shotId}.json`)),
  projectUpdated: true,
  promptVersionUpdated: request.promptVersionRef,
  recordPath: path.relative(proof, path.join(resultDir, `${shotId}.json`))
}, null, 2));
