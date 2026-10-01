#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const base = path.resolve(import.meta.dirname, "..");
const projectDir = path.join(base, "projects", "poluren-proof");
const runId = process.argv.find((arg) => arg.startsWith("--run="))?.split("=")[1] || "RUN-017";
const runDir = path.join(projectDir, "runs", runId);
fs.mkdirSync(runDir, { recursive: true });

const read = (relativePath) => JSON.parse(fs.readFileSync(path.join(projectDir, relativePath), "utf8"));
const project = read("project.json");
const registry = JSON.parse(fs.readFileSync(path.join(base, "agent-registry.json"), "utf8"));
const prompts = read("prompt-versions.json");
const assets = read("assets/asset-records.json");
const ledger = read("continuity-ledger.json");
const soundPlan = read("sound-plan.json");
const soundBlocker = read("generation/sound-finalization-blocker.json");
const paidAuthorization = read("generation/paid-generation-authorization.json");
const review = read("reviews/review.json");
const workflowPath = path.join(runDir, "workflow-report.json");
const orchestrationPath = path.join(runDir, "run-report.json");
const workflow = fs.existsSync(workflowPath) ? JSON.parse(fs.readFileSync(workflowPath, "utf8")) : { steps: [], pendingStages: [] };
const orchestration = fs.existsSync(orchestrationPath) ? JSON.parse(fs.readFileSync(orchestrationPath, "utf8")) : { status: "missing" };
const shotFiles = ["shots/S05-P-001.json", "shots/S05-P-002.json", "shots/S05-P-003.json"];
const shots = shotFiles.map(read);

const checks = [];
function check(id, requirement, passed, evidence, blocker = null) {
  checks.push({ id, requirement, status: passed ? "pass" : "blocked", evidence, blocker });
}

const agentDocs = fs.readdirSync(path.join(base, "agents")).filter((file) => file.endsWith(".md") && file !== "README.md");
check("independent-agents", "9个独立职责均有注册和契约", registry.agents?.length === 9 && agentDocs.length === 9, {
  registered: registry.agents?.map((agent) => agent.id) || [],
  contractCount: agentDocs.length
});
check("canon", "项目正典、角色、场景和镜头输入存在", Boolean(project.canon?.sceneId && project.canon?.characters?.length && project.canon?.sourceFacts?.length), {
  sceneId: project.canon?.sceneId,
  characters: project.canon?.characters?.length || 0,
  sourceFacts: project.canon?.sourceFacts?.length || 0
});
const verifiedAssets = assets.assets.filter((asset) => asset.status === "verified");
check("assets", "核心视觉资产已生成并完成本证明场景的连续性验证", verifiedAssets.length >= 5, {
  verified: verifiedAssets.map((asset) => asset.id),
  scope: "POLUREN-PROOF SC05 only"
});
const activePrompts = prompts.prompts.filter((prompt) => !String(prompt.status || "").startsWith("superseded-by") && !["repair-ready", "audio-ready"].includes(prompt.status));
check("shot-compile", "3个当前镜头都有可追溯Prompt绑定", activePrompts.length === 3 && activePrompts.every((prompt) => prompt.generationRunId), {
  activePromptIds: activePrompts.map((prompt) => prompt.id)
});
const localVideos = shots.filter((shot) => shot.status === "real-video-review" && shot.localArtifactPath && fs.existsSync(path.join(projectDir, shot.localArtifactPath)));
check("real-video", "真实视频已逐镜导入并可探针验证", localVideos.length === 3 && project.generationRuns.length >= 3, {
  localVideoCount: localVideos.length,
  generationRunCount: project.generationRuns.length
});
const totalCredits = (project.generationRuns || []).reduce((sum, run) => sum + (run.creditsConsumed || 0), 0);
check("generation-authorization", "真实额度消耗有范围、模型、运行数和证据引用", paidAuthorization.status === "scoped-authorized" && paidAuthorization.generationRuns === project.generationRuns.length && (paidAuthorization.creditsConsumed === totalCredits || totalCredits === 0), {
  authorizationRef: "generation/paid-generation-authorization.json",
  generationRuns: paidAuthorization.generationRuns,
  creditsConsumed: paidAuthorization.creditsConsumed,
  model: paidAuthorization.model
});
const continuityPass = ledger.adjacentChecks.length === 2 && ledger.adjacentChecks.every((checkItem) => checkItem.status === "pass-by-real-video");
check("continuity", "相邻镜头连续性通过真实视频证据", continuityPass, {
  checks: ledger.adjacentChecks.map((checkItem) => ({ from: checkItem.from, to: checkItem.to, status: checkItem.status }))
});
check("orchestration", "验证、审计、编排器均已运行", workflow.steps?.every((step) => step.status === "pass") && ["completed", "completed-with-blockers"].includes(orchestration.status), {
  workflowStatus: workflow.status,
  orchestrationStatus: orchestration.status
});
const finalAudio = (soundPlan.audioAssets || []).some((asset) => ["verified", "final"].includes(asset.status));
check("sound-final", "至少一条真实/最终声音资产通过验证", finalAudio, {
  soundPlanStatus: soundPlan.status,
  audioAssets: soundPlan.audioAssets || [],
  blocker: soundBlocker
}, finalAudio ? null : (soundBlocker?.status || "真实声音来源缺失"));
check("edit-review", "P6/P7整片审片通过并可标记verified/final", review.decision === "approve" && review.reviewStatus === "final", {
  decision: review.decision,
  reviewStatus: review.reviewStatus,
  workflowPending: workflow.pendingStages
}, review.decision === "approve" ? null : "声音最终化和声画/J-L-cut审片尚未完成");

const blockers = checks.filter((item) => item.status === "blocked").map((item) => ({ id: item.id, blocker: item.blocker }));
const result = {
  auditVersion: "0.1",
  runId,
  projectId: project.projectId,
  status: blockers.length ? "incomplete-with-evidence" : "complete",
  completedRequirements: checks.filter((item) => item.status === "pass").map((item) => item.id),
  blockedRequirements: blockers.map((item) => item.id),
  blockers,
  checks,
  evidenceBoundary: blockers.length === 0
    ? "全流程9个职责闭环；真实音画视频、连续性、声音设计与粗剪审片均已通过真实产物验证"
    : "真实视频与连续性已验证；声音和最终审片未验证，不得宣称成片final"
};

fs.writeFileSync(path.join(runDir, "completion-audit.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
const markdown = [
  `# Completion Audit: ${runId}`,
  "",
  `- status: **${result.status}**`,
  `- completed requirements: ${result.completedRequirements.join(", ")}`,
  `- blocked requirements: ${result.blockedRequirements.join(", ")}`,
  "",
  "## Checks",
  "",
  ...checks.map((item) => `- ${item.status === "pass" ? "PASS" : "BLOCKED"} **${item.id}** — ${item.requirement}\n  - evidence: ${JSON.stringify(item.evidence, null, 0)}${item.blocker ? `\n  - blocker: ${item.blocker}` : ""}`),
  "",
  `Evidence boundary: ${result.evidenceBoundary}`
].join("\n");
fs.writeFileSync(path.join(runDir, "completion-audit.md"), `${markdown}\n`, "utf8");
console.log(JSON.stringify(result, null, 2));
