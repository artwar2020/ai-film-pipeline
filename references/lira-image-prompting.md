# LIRA 图像提示词层（官方增量收编）

> 来源：Higgsfield Hell Grind 开源附件《LIRA SKILL.md》（MIT；本机副本：`D:\设计工场\BaiduSyncdisk\南通文创设计\LIRA SKILL.md`）。本文保存图像提示词、编辑和模型路由的来源经验；平台专名只按职责理解。固定模型、字数、比例、调色比例和模板均需在当前工具上验证，与主 `SKILL.md` 冲突时以后者为准。

## 模型路由：按职责，不按名字

| 任务 | 官方路由 | 国内按职责映射 |
|---|---|---|
| 角色表 / 肖像 / 一致性角色 | Soul 2.0（Soul ID 锁脸）或 Cinema Studio AI Cast | 即梦/小云雀人物参考 + 参考图 |
| 场景 / 环境 / 电影静帧 | Soul Cinema（支持 21:9） | 场景生图能力 |
| 道具表 / 产品感物体 | NBP / GPT Image 2（写实产品语境） | 写实产品照能力强的生图模型 |
| 成品帧点编辑（永远首选） | NBP（原图打底，最小变更） | 即梦/小云雀图像编辑 |
| AI 糊纹理修复（唯一职责） | Seedream 4.5 纹理 pass | 纹理增强能力；不做点编辑 |
| 最细小局部微修 + 场景反打角度 | GPT Image 2（全局脏、局部强） | 局部重绘能力强的模型 |

- 编辑通道固定顺序：点编辑 → 纹理修复 → 局部手术；一个工具管一段职责，不混用
- 用编辑「重建整个画面」= 违规操作——那是重新生成，回生图通道

## 负面词使用经验（图像侧）

部分来源模型没有独立负面提示词参数，且大量 NOT 叠堆可能引入不需要的概念。优先正向描述目标；当前平台若明确支持负面提示词，则按其实际机制使用：

- 干净皮肤 → 写「clean dry skin」，不写「no acne」
- 空街道 → 「empty deserted street, bare walls, still air」——空旷是场景的正向属性
- 无 Logo → 「plain unbranded wrapper, blank matte surface」，且全程不提品牌名
- 防插画感 → 加强正向写实锚（胶片、镜头、真实材质、「cinematic film still」），不是 NOT 叠堆
- 唯一例外：编辑提示词里「Remove the lamppost」是合法操作——但必须配补全（「continuous brick wall behind」）

## 插画漂移触发词（写实角色保命）

- 「character reference sheet」「painterly」会触发概念画/插画感 → 写实角色表改用「film character sheet」「studio photographs」「cinematic film still」
- 漂移修法 = 加强正向写实锚，不是 NOT 叠堆

## 手术式编辑模板（整条编辑通道通用）

```text
Edit the image: [一行目标].

CHANGE: [只写这一个变更，描述精确].

PRESERVE EXACTLY:
- [穷举一切必须原样保留的：脸、服装、道具、位置、墙地、机位、全部既有阴影]
- 调色、色板、对比、颗粒、光衰减

ONLY CHANGE: [复述那一个变更]. 100% identical otherwise.
```

- 一次只改一处；用户说「改过头了」= 锁更多、改更少
- 纹理修复 pass：CHANGE 只列表面（皮肤毛孔/织物纹/地面污渍），PRESERVE 锁构图、身份、光、调色
- 局部手术：CHANGE 越小越干净（模型全局都脏，靠小切口取胜）

## 场景反打角度：镜像排列必须逐物点名

图像模型出反打机位时，必须逐个重大物体写明新方位（「主视图沙发在右 → 反打视图沙发在左，门口在画面前方」）；不点名则几何必乱。国内映射：反打优先走「空场景慢走视频截图」路线（见 SKILL.md 资产先行），图像模型反打为备选。

## 调色比例经验

- 百分比色彩语言可作为一种结构化表达，例如「60% warm ochre, 30% deep charcoal, 10% rust-red」；是否有效取决于当前模型。
- 60/30/10 只是来源案例中的配色方法；应从用户指令、场景语境或参考图推导，不作为所有项目固定比例。

## 画面内文字

- 引号内逐字文案 + 字体/字重/颜色：「Write 'GENUINE' in bold red serif on the sign」
- 模糊的「加个文字」必糊

## 其他来源经验（需按当前模型验证）

- 比例/分辨率/一致性参数是平台参数，设在 UI，不进正文（无 `--ar`、无「16:9」进散文）
- 真人一律转译为特征描述（脸型、体格、气质、年代），不写真名；不写 IP/品牌名
- 纹身写具体图案（「classic swallow」「old-school dagger」）+「clean line-work」；模糊的「有纹身」必糊
- 道具易触发安全旗时，用中性材质+功能描述（「retro industrial electronic prop assembly, numerical readout」），不用武器/爆炸词；多状态道具单状态单资产（与 SKILL.md 资产先行一致）
- 场景相机锚用大白话（「high angle three-quarter wide shot, camera high above the room looking diagonally down at 45 degrees」），CCTV/鱼眼类术语易翻车；frame-within-frame 借门洞/窗（前景废墟剪影 + Tarkovsky 式纵深）；光学/景深语言属于角色，不进场景
- 胶片颗粒不过量堆——部分模型自带，tech block 一句即可
- 提示词长度以信息密度和当前模型上下文为准；来源中的 80–150 词、1500–2000 字符只作经验参考。
- 三分法是可选构图方法，不要求进入每条提示词；按镜头叙事和用户风格选择。

## 官方 tech block 登记（口径参考，按职责借用）

- 胶片颗粒 register：`Photorealistic ARRI Alexa LF anamorphic Cooke S4 lens at T2.0, organic 35mm Kodak Vision3 250D film grain, soft cinematic falloff, cinematic film still aesthetic`（配低饱和调色 + 摄影指导 mood）
- 现代干净数字 register：`Shot on ARRI Alexa Mini LF with ARRI Signature Prime lens, clean modern digital cinematic capture, crisp natural detail, minimal fine grain, soft cinematic falloff, modern cinematic film still quality, hyperrealistic photographic detail`
- 摄影指导参照（一两个就够，不堆长串）：Deakins（自然光控剪影）/ Lubezki（自然光广角）/ Pawlikowski（清冷机构室内）/ Tarkovsky（框中框）/ Kurosawa（静）等

## 图像预发送自检

模型按职责选了？比例/分辨率在 UI 不在正文？散文自然（CAPS 块只在编辑）？正向 > 负面？技术布光（key light、光比、falloff）+ 真实材质+饰面？60/30/10 有出处？角色一致性靠参考参数 + 散文锚双保险？三分法（角色表除外）？无品牌/IP/真人名？不臃肿？
