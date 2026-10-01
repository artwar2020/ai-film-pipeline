---
name: ai-film-pipeline
description: 工业级多-Agent AI电影生产系统（AI-Film Pipeline System）：基于9大独立专业Agent（Producer, Story, LIRA, Acting, Cinematic-Technique, CineDance, Continuity, Sound, Edit-Review）的完整电影工程管线。深度内化 melies.co 视听技法全典（380+种运镜、机位、构图、焦段光学、布光影调与剪辑语法）、LIRA 资产先行与三视图规范、ACTING 压力下行为表演公理、CINEDANCE 六重时空物理锁定，提供从剧本立项、资产重绘、提示词编译、连续性把关到多平台（可灵/即梦/海螺）真实音画调度与严苛质检的端到端影视工业方案。当用户提到“AI电影”、“电影工程”、“电影提示词”、“影视管线”、“AI-film”、“分镜连续性”、“分镜生成”时使用。
---

# AI 电影工程生产系统 (AI-Film Pipeline System)

这是一个真正工业级、模型无关（Model-Agnostic）、分工严密的多 Agent AI 电影生产管线。它彻底摒弃了传统“把所有要求塞进一段冗长 Prompt 碰运气”的作坊式生成，将电影制作拆解为 **9 个专业 Agent 协同执行的工程化流程**，严格贯彻 **真实证据、物理自洽与质量门禁**。

---

## 一、 核心公理与工程底座

1. **九大 Agent 职责绝对独立，严禁单体杂糅**：
   - 每一个 Agent 拥有不可侵犯的读写范围与管辖权。Story 管剧本事实，LIRA 管视觉资产，Acting 管行为表演，Cinematic Technique 管视听语言，CineDance 管跨模型编译，Continuity 管跨镜头接戏，Sound 管声学架构，Edit Review 管终审一票否决，Producer 管成本与进度。
2. **表演是压力下的行为，而非抽象情绪**：
   - 严禁在提示词中堆砌 `looks angry`, `cries sorrowfully` 等抽象词。严格按《ACTING SKILL》执行五大支柱（目标、阻碍、利害、策略、可见节拍变化）与眼神生活（注视目标、微跳视线、眨眼抑制）。
3. **资产先行，无图不生视**：
   - 贯彻《LIRA SKILL》哲学。角色必须有中性灰底/白底无手三视图，场景必须有带地标几何与主光向的母盘，道具必须有尺度参照。状态变化（如干衣 vs 湿泥衣）独立设卡。
4. **六重时空物理锁定 (The Six Physical Locks)**：
   - 贯彻《CINEDANCE》与《Méliès》电影语法：首帧占位锁、时空阻挡锁、视线与身体矢量锁、地标轴线锁、光学景深锁（24mm-135mm）、物理动量与反作用力锁。
5. **真实产物为唯一证据边界**：
   - 没有本地落盘的媒体文件与探针数据，永远处于 `unverified` 或 `hold`；绝不把 Dry-run、Prompt 编译成功或静帧预演冒充为成片交付。

---

## 二、 九大 Agent 独立职责与执行图谱

| 阶段 | 负责 Agent | 核心输入 | 交付产物 | 核心管辖权与硬纪律 |
|---|---|---|---|---|
| **P0** | **Producer (制片总控)** | 故事 Brief、算力池状态 | `project.json`、额度授权单、范围锁定单 | 锁死预算、规格与交付标准；未获授权绝不扣费提交 |
| **P1** | **Story (故事正典)** | 剧本/小说原文、导演意向 | `canon/scenes.json`、`characters.json`、对白正典 | 提取物理事实，衍生镜头必标 `derivedShot`；独占对白字句管辖权 |
| **P1** | **LIRA-Image (美术资产)** | 正典角色/场景描述、LIRA规范 | `assets/asset-records.json`、角色三视图、场景地标图 | 资产先行；中性背景避免污染；手术级局部修复（最小改动、穷尽保留） |
| **P2** | **Acting (表演总监)** | 场次正典、角色心理冲突 | `PerformanceBeat`、微表情、眼神生活、触觉动作 | 压力下物理行为；严禁抽象情绪词；反应错落发生在台词间隙 |
| **P2** | **Cinematic-Technique (视听技法)** | 场次情绪、Méliès 380 技法库 | `technique-decisions.json`、机位与焦段方案 | 运镜必有叙事动机；严格遵守 180° 轴线定律；景别与戏剧功能咬合 |
| **P3** | **CineDance (编译总监)** | 镜头规格、表演、技法、资产图 | `prompt-versions.json`、平台就绪请求包 | 贯彻六重物理锁定；单镜头禁止模型随机跳切；跨平台语法转译 |
| **P4** | **Continuity (连续性总监)** | 相邻镜头产物、历史抽帧表 | `continuity-ledger.json`、连续性故障诊断单 | 审查跨镜头动作因果、空间方位、服装破损与光向；因果不成立一票否决 |
| **P5** | **Platform Runtime (生成调度)** | 就绪请求包、额度授权 | Kling CLI / Seedance / H3 真实媒体与探针数据 | 逐镜轮询，验证生成文件完整性；提取双声道音频与视频元数据 |
| **P6** | **Sound (声学工程)** | 故事对白、动作拟音、视频探针 | `sound-plan.json`、`sound-takes.json`、J/L-cut 声桥 | 双声道音轨治理；消除切点爆音；EBU R128 标准广播级响度均衡 |
| **P7** | **Edit-Review (剪辑终审)** | 拼接粗剪、15 帧全片联系表 | `reviews/review.json`、10 项审计报告、复盘手记 | 资深剪辑师标准终审；核销 10 项 Completion Audit，决定通过或返工 |

---

## 三、 Méliès 视听语言核心分类（380+ 种技法速查）

管线底层内置完整的 [melies.co/cinematic-techniques](https://melies.co/cinematic-techniques) 分类体系，存储于 `references/melies-techniques-bible.json`：

1. **机位视角 (Camera Angles - 19种)**：`birds-eye`, `dutch-angle`, `eye-level`, `ground-level`, `high-angle`, `low-angle`, `over-the-shoulder`, `pov`, `worms-eye` 等；
2. **摄影机运动 (Camera Movement - 86种)**：`dolly-in`, `dolly-zoom (Vertigo)`, `crane-up`, `tracking-shot`, `whip-pan`, `hero-orbit`, `pedestal`, `steadicam` 等；
3. **景别构景 (Framing - 25种)**：`extreme-wide-shot`, `full-shot`, `cowboy-shot`, `medium-shot`, `choker`, `extreme-close-up`, `insert-shot` 等；
4. **构图几何 (Composition - 32种)**：`rule-of-thirds`, `leading-lines`, `frame-within-a-frame`, `one-point-perspective`, `dirty-single`, `negative-space` 等；
5. **光学与景深 (Lenses - 17种)**：`24mm-wide`, `35mm-moderate`, `50mm-normal`, `85mm-portrait`, `135mm-telephoto`, `anamorphic`, `shallow-depth-of-field` 等；
6. **电影布光 (Lighting - 41种)**：`three-point-lighting`, `rembrandt-lighting`, `chiaroscuro`, `backlight`, `golden-hour`, `practical-light`, `silhouette` 等；
7. **色彩方案 (Color - 19种)**：`bleach-bypass`, `orange-and-teal`, `desaturated`, `day-for-night`, `technicolor` 等；
8. **环境物理介质 (Atmosphere - 13种)**：`fog`, `haze`, `rain`, `dust-motes`, `smoke`, `wet-down` 等；
9. **时间流速动力学 (Time & Motion - 21种)**：`slow-motion`, `speed-ramp`, `bullet-time`, `freeze-frame`, `time-lapse` 等；
10. **剪辑语法 (Editing - 23种)**：`match-cut`, `axial-cut`, `smash-cut`, `cross-cut`, `j-cut`, `l-cut` 等。

---

## 四、 工程自动化工作流与运行命令

系统提供全套确定性校验与自动化流水线脚本，位于工程 `scripts/`：

```powershell
# 1. 基础架构合规校验（Agent 契约与质量门）
node docs/film-engineering/scripts/validate.mjs

# 2. 证明片内容与数据结构审计
node docs/film-engineering/scripts/audit-proof.mjs

# 3. 运行九大 Agent 编排流水线与 10 项终局指标审计
node docs/film-engineering/scripts/run-workflow.mjs --project=<project-name> --run=<RUN-ID>
```

### 十项终局验收门禁 (The 10-Point Completion Audit)
必须 10 项全绿方可签署交付：
1. `independent-agents`：9 个独立职责注册齐备，契约完备；
2. `canon`：故事正典、角色档案与不可改变事实锁定；
3. `assets`：核心角色/场景/道具完成参考图落盘与多角度验证；
4. `shot-compile`：所有当前镜头具备可追溯的 Prompt 编译版本；
5. `real-video`：真实模型任务生成完毕，媒体下载并通过 ffmpeg 探针；
6. `generation-authorization`：真实额度消耗有明确范围与成本台账对账；
7. `continuity`：相邻镜头通过真实画面因果与空间几何复核；
8. `orchestration`：基础校验、审计与流水线编排脚本通过；
9. `sound-final`：具备真实/原生音效音轨，禁止用无声或占位冒充；
10. `edit-review`：粗剪拼接通过审片，声画完全同步，无致命 AI 伪影。

---

## 五、 知识库与参考索引 (References)

- `references/ai-cinema-os-vault.md`：本地 55 维电影导演 OS 知识库与两阶段 Prompt 编译器规范
- `references/chinese-cinematic-prompts.md`：中文电影提示词万能公式与六大专业镜头预设全典
- `references/film-aesthetic-styles.md`：全年代、流派与胶片质感风格档案库 (Film Aesthetic Vault)
- `references/mythology-cinematic-prompts.md`：东方神话与西游专项影视场景与角色提示词库
- `references/melies-techniques-bible.json`：Méliès 380 种视听技法机器可读知识库
- `references/melies-grammar.md`：Méliès 视听语言完整中文详解手册
- `references/acting-performance-bible.md`：ACTING 压力下行为表演公理与五大支柱
- `references/lira-asset-architecture.md`：LIRA 视觉资产三视图与局部微创修复规范
- `references/cinedance-director-system.md`：CINEDANCE 镜头编译与六重物理锁定规范
- `agents/*.md`：九大专业 Agent 独立执行契约与进出口门禁
- `templates/project-scaffold/`：工业级项目标准化脚手架模板
