# 电影项目模板

复制整个 `_template` 目录，改名为项目 ID，再从 `project.json` 开始填写。不要把不同 agent 的全文规则复制进项目；项目只保存事实、版本、交接和结果。

推荐顺序：

1. Producer 填写项目目标、交付限制和未知项；
2. Story 建立人物、场景和事件正典；
3. LIRA 建立可用资产；
4. Acting 和 Cinematic Technique 为场次生成交接包；
5. CineDance 编译镜头；
6. Continuity 检查相邻镜头；
7. 生成后由 Edit Review 记录实际结果。

连续性记录从 [continuity-ledger.example.json](continuity-ledger.example.json) 复制；它同时保存镜头起止状态、相邻检查、证据等级以及 CHANGE / PRESERVE。

