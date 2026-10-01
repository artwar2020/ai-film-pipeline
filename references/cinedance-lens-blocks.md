# CINEDANCE 镜头语言成品块（官方增量收编）

> 来源：Higgsfield Hell Grind 开源附件《CINEDANCE HIGGSFIELD SKILL.md》V4（MIT；本机副本：`D:\设计工场\BaiduSyncdisk\南通文创设计\CINEDANCE HIGGSFIELD SKILL.md`）。本文保存 FOV、镜头性格、结果清单和逐镜锁的来源案例。数值和模板用于测试起点，不是跨平台硬规则；冲突时以主 `SKILL.md` 的治理边界和当前平台能力为准。

## 内容-FOV 对齐参考（写前先选镜头性格）

- 人脸肖像类：亲密人脸带环境 → 84°（Cuarón intimate-wide）；中景肖像 → 29°；情绪特写 → 18°；远距偷窥/观察 → 8°（强制前景遮挡）
- 环境动作类：纪实动作 → 47°；宽环境动作 → 84°；大尺度地理 → 107°；极限沉浸 → 135°（仅当整拍都是环境动作）
- 细节/微距类：标准细节 → 29°/18°；宽环境里的细节 → 单独成拍（内切分镜），不与广角动作混装
- 远距观察类：体育/狗仔/野生动物 → 8° + 前景遮挡 + 大气霾
- **一张提示词混装「人脸+地理+微距」必漂移**；要不同内容类就用受控内切，每镜各配镜头性格

## 六段 FOV 示例块（平台支持时作为测试起点）

```text
47° Standard normal
47° diagonal field of view, standard normal lens character, camera 3 to 5 meters from subject, natural human-eye perspective. Zero obvious distortion, natural face and body proportions, comfortable depth of field, background readable but not exaggerated, classic grounded cinema framing.
```

```text
84° Classic wide
84° diagonal field of view, classic wide-angle lens character, camera 1 to 1.5 meters from subject, slight low angle if needed. Wide-angle lens with strong but natural perspective expansion, foreground body presence feels larger and closer, environment remains visible to the frame edges, deep readable spatial context, straight architectural lines stay rectilinear, no fisheye curve.
```

```text
107° Wide rectilinear
107° diagonal field of view, wide rectilinear lens character, camera 0.5 to 0.8 meters from foreground subject. Immediate foreground looms large, surrounding environment spreads wide to all frame edges, deep edge-to-edge focus, straight lines remain straight, subtle chromatic aberration near frame edges, no circular vignette, no fisheye bubble.
```

```text
29° Short telephoto portrait
29° diagonal field of view, short telephoto portrait lens character, camera 4 to 6 meters from subject. Close framing achieved through lens reach, not physical proximity. Subject is razor-sharp, background begins to compress closer behind them, face proportions are flattering and stable, background dissolves into creamy soft bokeh, subject pops clearly from the environment.
```

```text
18° Classic telephoto
18° diagonal field of view, classic telephoto lens character, camera 6 to 8 meters from subject. Strong background compression, distant elements appear stacked closer behind the subject, razor-thin focus isolates the eyes and key facial features, foreground and background melt into soft bokeh, the image feels observed from a distance.
```

```text
8° Super-telephoto observation
8° diagonal field of view, super-telephoto observation lens character, camera 20 to 25 meters from subject. Extreme background compression, background flattened into a soft color wash, only the subject is sharp, everything else dissolves into creamy bokeh. The image feels like distant paparazzi, wildlife documentary, or sports-broadcast observation. Foreground occlusion is mandatory: blurred foreground objects occupy the lower 30 to 45 percent of frame as oversized dark bokeh shapes, framing the subject from far away.
```

（手册只登记了九锚点数字与「段内不漂移」；本文是官方成品层。135°/180° 等极端档无官方成品块，用时可按同一「FOV 度数 + 机距 + 可见光学结果」三件套自制。）

## 视觉结果清单（可数自检）

- 远摄镜头至少含 4 条：background completely blurred into a soft warm color wash / razor focus on the subject / only the subject is sharp, everything else is soft / creamy bokeh wash behind the subject / background compressed flat behind the subject / the subject pops sharply against a dissolved background / close framing achieved through lens reach, not physical proximity / camera positioned far from the subject in physical space / atmospheric haze suspended between camera and subject / foreground occlusion frames the subject as soft dark bokeh
- 广角镜头至少含 3 条：foreground body presence looms larger than natural / environment remains visible around the subject / deep edge-to-edge focus / straight lines stay rectilinear / wide spatial context visible to frame edges / camera physically close to subject / immersive close perspective / no telephoto compression / no creamy portrait bokeh unless explicitly wanted

## 逐镜镜头锁（多镜头防漂移）

- 同镜多段：`LENS IS X° ACROSS ALL SHOTS. NOT NEGOTIABLE.` + 每段开头 `LENS LOCK SHOT A = X°` + 每段收尾 `LENS CHECK SHOT A: X° maintained, no drift.`
- 混合镜：只在内容类变化时换镜头性格；不同镜头性格之间只用硬切；段内禁 FOV 平滑过渡、禁随机漂移；换镜头性格必须等新镜头开始
- 反漂移锁（远摄）：`No part of this shot becomes wide-angle or normal-lens coverage. Wider framing is achieved by the camera being farther away with the same long-lens reach, not by switching lenses. The background remains compressed and dissolved in every frame.`
- 反漂移锁（广角）：`No part of this shot becomes telephoto portrait coverage. The environment stays visible around the subject, the camera remains physically close, and the image keeps wide-angle spatial expansion with deep readable context.`
- 反漂移锁（中性）：`No extreme wide distortion, no telephoto compression. The image stays natural, grounded, and human-eye neutral.`

## 光学反模式

- 「extreme/ultra/super wide-angle lens」类空词当主控
- 「wide shot」「establishing shot」当镜头指令（那是景别，不是光学）
- zoom out + wide-angle 叠加；「tight wide framing」类自相矛盾
- f-stop / ISO / 镜头品牌型号（Cooke S4、Master Prime、Helios…）当主控——可观察光学结果才是主控
- 一镜内复合运镜；一段内混装内容类；纯负面镜头控制（先写正向，再挂局部 no X）

## D2 写前诊断清单（18 项，写提示词前过一遍）

首帧会不会空？必需角色会不会来太晚？会不会开在无用定场？角色会不会离地标太远？视线会不会反向？身体朝向会不会歧义？左右会不会翻？相机会不会选错侧？镜头会不会滑向舒适中焦？会不会变成平光正面打？参考会不会被过度散文覆盖？旧 @tag 会不会混入？会不会加人/复制人？道具会不会落错手？动会不会飘/假？台词会不会起错时？位置参考会不会被当构图而不当地理？内切会不会重置连续性？

→ 任一存在风险：在提示词内加一条**短而直接的内联锁**（放在它保护的正向规则旁边），不堆尾部负面块。与 SKILL.md「迭代纪律」的生成后排查顺序互补：D2 管写前，排查顺序管生成后。

## 内切与连续性（多镜头）

- 切换类型白名单：HARD CUT / SMASH CUT / MATCH CUT / INSERT CUT / REVERSE CUT / WHIP CUT；fade / crossfade / dissolve / 转场特效未经用户要求一律不写（`HARD CUTS only.`）
- 每个内切保持：同角色名单、同地理、同画面方向（除非机位明确变）、同视线目标、同左右关系、同光向、同服装/伤/道具/手持状态、同血雪水泥烟火连续性、同情绪进程
- 切后不重置动作、不瞬移、不无故改变与地标的距离、不加未声明的道具或角色
- 每个内切显式定义：B 段时长 / 机位 / 首帧可见主体 / 空间块 / 动作；`Never let the model invent unspecified cuts.`

## 空间词替换库（弱→强）

near / around / beside / somewhere / in the area / nearby → within 1 meter / touching / boots inside the root circle / hand on the handle / standing directly under the sign / back against the wall / in front of the rear passenger door / at the south kerb edge

## 角色最小锚公式

```text
@TAG: role/body type + current state + critical visible anchors + action-critical prop/body state. Match the supplied reference closely.
```

- 来源模板曾固定包含 age；当前版本是否写年龄取决于任务需要、平台规则和角色设定，不再把“写/不写年龄”设为跨平台硬规则。
- 只写本镜关键锚：不写全脸解剖、不写参考已清楚的服装细节、不写无关旧伤、不写不可见道具
- “matches the reference” 一类收尾句可在当前模型确实响应时使用；不要把“100%”视为可验证保证，身份稳定仍以实际生成结果为准。
