#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const base = path.resolve(import.meta.dirname, "..");
const projectArg = process.argv.find((arg) => arg.startsWith("--project="))?.split("=")[1] || "poluren-proof";
const runId = process.argv.find((arg) => arg.startsWith("--run="))?.split("=")[1] || "WORKFLOW-RUN";
const projectDir = path.join(base, "projects", projectArg);
const runDir = path.join(projectDir, "runs", runId);
fs.mkdirSync(runDir, { recursive: true });
const projectState = JSON.parse(fs.readFileSync(path.join(projectDir, "project.json"), "utf8"));
const realRun = projectState.generationRuns?.length > 0;
const roughcutExists = Boolean(projectState.realRoughcut && fs.existsSync(path.join(projectDir, projectState.realRoughcut)));

const steps = [];
function runStep(id, command, args) {
  const result = spawnSync(command, args, { cwd: path.resolve(base, "../.."), encoding: "utf8" });
  const ok = result.status === 0;
  steps.push({
    id,
    command: [command, ...args].join(" "),
    status: ok ? "pass" : "fail",
    exitCode: result.status,
    stdout: (result.stdout || "").trim(),
    stderr: (result.stderr || "").trim()
  });
  return ok;
}

const root = path.resolve(base, "../..");
const baseOk = runStep("base-validation", "node", ["docs/film-engineering/scripts/validate.mjs", "docs/film-engineering"]);
const auditOk = runStep("proof-audit", "node", ["docs/film-engineering/scripts/audit-proof.mjs"]);
const orchestrationOk = runStep("agent-orchestration", "node", ["docs/film-engineering/scripts/run-proof.mjs", `--run=${runId}`]);
const completionAuditOk = runStep("completion-audit", "node", ["docs/film-engineering/scripts/completion-audit.mjs", `--run=${runId}`]);

const reportPath = path.join(projectDir, "runs", runId, "run-report.json");
let orchestration = null;
if (fs.existsSync(reportPath)) orchestration = JSON.parse(fs.readFileSync(reportPath, "utf8"));

const blockers = orchestration?.blocking || [];
const completedStages = realRun && roughcutExists && blockers.length === 0
  ? ["P0", "P1", "P2", "P3", "P4", "P5", "P6", "P7"]
  : (realRun && roughcutExists ? ["P0", "P1", "P2", "P3", "P4", "P5"] : ["P0", "P1", "P2", "P3", "P4"]);
const pendingStages = realRun && roughcutExists && blockers.length === 0
  ? []
  : (realRun && roughcutExists ? ["P6", "P7"] : ["P5", "P6", "P7"]);
const result = {
  workflowVersion: "0.1",
  runId,
  project: projectArg,
  status: baseOk && auditOk && orchestrationOk && completionAuditOk
    ? (pendingStages.length === 0 ? "completed-verified" : (realRun && roughcutExists ? "blocked-at-audio-finalization-gate" : "blocked-at-real-evidence-gate"))
    : "failed",
  completedStages,
  pendingStages,
  steps,
  blockers,
  evidenceBoundary: {
    generatedArtifacts: orchestration?.generatedArtifacts ?? 0,
    generatedImageAssets: orchestration?.generatedImageAssets ?? [],
    generatedVideoRuns: orchestration?.generatedVideoRuns ?? 0,
    previsArtifacts: orchestration?.previsArtifacts ?? [],
    externalBlocker: null,
    verified: blockers.length === 0,
    reason: orchestration?.evidenceBoundary?.reason || "当前没有可核验的生成产物"
  },
  nextAction: pendingStages.length === 0
    ? "已通过全流程验证，交付最终成片与复盘报告"
    : (realRun && roughcutExists ? "接入最终声音，完成声画审片与版本复盘，再执行P6-P7" : "获得明确额度授权后...")
};

fs.writeFileSync(path.join(runDir, "workflow-report.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
const markdown = [
  `# Workflow Report: ${runId}`,
  "",
  `- status: **${result.status}**`,
  `- completed: ${result.completedStages.join(", ")}`,
  `- pending: ${result.pendingStages.join(", ")}`,
  `- generated artifacts: ${result.evidenceBoundary.generatedArtifacts} (${result.evidenceBoundary.generatedImageAssets.length} image assets, ${result.evidenceBoundary.generatedVideoRuns} video runs)`,
  `- previs artifacts: ${result.evidenceBoundary.previsArtifacts.length}`,
  "",
  "## Steps",
  "",
  ...steps.map((step) => `- ${step.id}: **${step.status}**`),
  "",
  "## Blockers",
  "",
  ...blockers.map((blocker) => `- ${blocker.agent}: ${blocker.reason}`),
  "",
  `Next action: ${result.nextAction}`,
  "",
  "本报告不把 dry-run、Prompt 通过或图像参考资产当作真实成片证据。"
].join("\n");
fs.writeFileSync(path.join(runDir, "workflow-report.md"), `${markdown}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
