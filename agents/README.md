# Agent Contracts

这些文件是项目编排层的 agent 合约，不是对外部 skill 的全文复制。真正执行时，agent 还需读取自己被授权的本机可信 skill 或用户提供资料，并将实际采用的来源写入交接包。

## 调度规则

1. 先由 Producer 确定项目阶段和当前 owner。
2. 只给 agent 当前任务需要的最小事实包。
3. agent 只能写自己拥有的记录类型。
4. 需要跨职责修改时，创建 handoff，不直接覆盖上游记录。
5. 每个 agent 完成后必须返回 `status`、`change`、`preserve`、`unknowns`、`risks` 和 `acceptance`。

## 独立 agents

- `producer.md`
- `story.md`
- `lira-image.md`
- `acting.md`
- `cinematic-technique.md`
- `cinedance.md`
- `continuity.md`
- `sound.md`
- `edit-review.md`

