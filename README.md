# AI-Film Pipeline (AI 电影工程生产系统)

> 🎬 工业级多-Agent AI电影生产系统与影视提示词编译管线。
> 基于 9 大独立专业 Agent 分工协作，深度整合 Méliès 视听图典（380+ 种视听技法）、LIRA 资产先行与三视图规范、ACTING 压力下行为表演公理、CINEDANCE 六重时空物理锁定，提供从剧本立项、资产重绘、跨模型（Kling、Seedance、MiniMax H3）提示词编译、连续性把关到真实音画生产与 10 项严苛门禁的完整工业化闭环。

---

## 🌟 核心架构与九大专业 Agent

不同于传统“单一段落大杂烩 Prompt 碰运气”的生成方式，本系统将电影制作拆解为 **9 个权责绝对独立的 Agent**：

1. **Producer (制片总控)**：项目范围、画幅时长、算力池额度对账单 (`paid-generation-authorization.json`) 与十项验收门禁 (`completion-audit.json`)；
2. **Story (故事正典)**：提取物理事实清单，标记衍生镜头 (`derivedShot`)，独占对白正典冻结权；
3. **LIRA-Image (美术资产)**：中性背景无手三视图资产先行、场景地标母盘与最小化变更的手术级修复（Surgical Inpainting）；
4. **Acting (表演总监)**：坚守“表演是压力下的行为，而非抽象情绪”公理，规划五大支柱（目标/阻碍/利害/策略/可见节拍）与眼神生活（注视点/微跳/眨眼抑制）；
5. **Cinematic-Technique (视听技法)**：内化 [melies.co](https://melies.co) 380 种视听语言，掌控机位、运镜动势、180° 轴线定律与景深焦距（24mm-135mm）；
6. **CineDance (编译总监)**：执行六重时空物理锁定（首帧、阻挡、视线、地标、光学、动量），将导演意图自适应转译为目标模型的专有提示词形状；
7. **Continuity (连续性总监)**：审查跨镜头动作因果、服装破损、道具接触、光向与视线轴线，因果不成立直接一票否决；
8. **Sound (声学工程)**：原生音画音轨治理、环境底噪、动作拟音 Foley、生理呼吸声、J/L-cut 剪辑声桥与 EBU R128 标准响度平衡；
9. **Edit-Review (剪辑终审)**：基于媒体探针与 15-20 帧全片联系表，排查 AI 伪影、穿模与肢体畸变，核销 10 项 Completion Audit 并签署最终裁决。

---

## 📚 视听技法与知识库全典 (`references/`)

- `melies-techniques-bible.json`：Méliès 380 种专业电影技法机器可读知识库（覆盖机位、运镜、构图、焦段、布光、影调、剪辑等 12 大领域）；
- `melies-grammar.md`：Méliès 视听语言完整中文详解手册；
- `acting-performance-bible.md`：ACTING 压力下行为表演公理与坏表演避坑图鉴；
- `lira-asset-architecture.md`：LIRA 视觉资产三视图与局部微创修复规范；
- `cinedance-director-system.md`：CINEDANCE 六重时空物理锁定与跨模型转译指南；
- `ai-cinema-os-vault.md`：本地 55 维电影导演 OS 知识库与两阶段 Prompt 编译器规范；
- `chinese-cinematic-prompts.md`：中文电影提示词万能公式与六大专业镜头预设全典；
- `film-aesthetic-styles.md`：全年代流派、胶片质感与机型布光参数库；
- `mythology-cinematic-prompts.md`：东方神话与西游题材大场面场景库。

---

## 🛠️ 工具链与运行指令

### 1. 跨模型提示词编译器
```bash
python scripts/compile-shot-prompt.py   --character "主角站在雨中"   --scene "夏日日本郊区老店屋檐下"   --emotion "紧张"   --technique "中景微推镜头"
```
自动生成 **Kling 3.0**（原生音画）、**Seedance 2.5/2.0**（时空阻挡与动量）、**MiniMax H3**（分段动词流）三套模型专属提示词。

### 2. 流水线与十项验收门禁
```bash
# 基础架构校验
node scripts/validate.mjs

# 证明片结构审计
node scripts/audit-proof.mjs

# 自动化流水线执行与终局十项验收核销
node scripts/run-workflow.mjs --project=<project-name> --run=<RUN-ID>
```

---

## 📦 Codex / Claude 安装与使用

作为 Codex Skill 安装：
```bash
codex skill install https://github.com/artwar2020/ai-film-pipeline
```
在对话中只要提到“做电影”、“AI电影”、“电影提示词”、“影视管线”等即可直接唤醒 9-Agent 流水线！

---

## 📄 License

MIT License © 2026 ARTwar
