# ACTING 表演系统全典 (Character Performance Bible)

基于用户提供的《ACTING SKILL.md》深度提炼，专为 AI 视频生成（Kling、Seedance、MiniMax H3 等）打造的影视级表演行为指导系统。

## 核心公理 (The Core Axiom)

> **表演是压力下的行为（Behavior under pressure），而不是情绪的展示（Display of emotion）。**

角色想要某种东西（目标），某种障碍挡在面前（阻碍），他们采取实际行动去争取（策略）。情绪只是这一斗争的自然副产物，绝不能在提示词中直接堆砌抽象情绪形容词（如 "looks angry", "feels sad", "screams emotionally"）。

## 表演五大支柱 (The Five Pillars)

每个镜头内的角色动作必须拆解为以下五大要素：

1. **目标 (Objective)**：角色此刻在物理上想达成什么？（例如：稳住摇晃的自行车；掩饰自己发抖的手指；避免被对方看穿）。
2. **阻碍 (Obstacle)**：什么物理或心理阻力在阻挠目标？（例如：泥地打滑；恐惧触发的肌肉痉挛；对方直视的目光）。
3. **利害 (Stakes)**：如果此刻失败，立即面临什么后果？（例如：孩子再次摔倒；威信荡然无存；创伤记忆失控）。
4. **策略 (Tactic)**：角色采取什么具体的身体行动？（例如：用过重的力气抓住手臂；视线移向远方假装平静；短促咬住下唇）。
5. **可见变化 (Visible Change / Beat)**：镜头内必须发生什么摄影机可捕捉到的状态跃迁？（例如：从紧握突然转为脱力微颤；急促呼吸在半拍后强制收敛）。

## 眼神生命 (Eye Life - 强制约束)

AI 视频中最容易出现“假人感”的是死凝视（Dead Stare）。每个主要角色的提示词必须声明眼神动态：

- **注视目标 (Gaze Target)**：明确视线落在具体物理对象上（例如：孩子的擦伤处、弯曲的车把、石桥桥拱、对方的右手），严禁泛泛的 "looking around"。
- **视线转移 (Eye Shift)**：在特定节拍发生的微跳视线（Micro-saccades），伴随头部转动或脱节迟滞。
- **眨眼与眼眶张力 (Blink & Orbit Tension)**：压力下的快速眨眼抑制，或者肌肉僵直造成的下眼睑收紧（Squint of concern）。

## 身体的物理生命 (The Body's Physical Life)

- **重心与承重 (Weight & Balance)**：身体重量在双脚或接触面上的真实转移。下坡时的身体后仰或前倾配重。
- **触觉与摩擦 (Contact & Friction)**：手指抓握布料时的褶皱挤压；脚掌踩入湿泥时的微小下陷与阻力拔出。
- **生理性微反应 (Involuntary Micro-reactions)**：吞咽口水、下颌咬紧、手指非自主痉挛微颤、胸口起伏的呼吸频率突变。

## 倾听与反应 (Listening & Reaction)

- 反应发生在台词与动作的间隙，绝不在同一微秒内机械同步爆发。
- 当对方行动时，观察者必须先经历“看见 → 动作停顿半拍（Processing Pause） → 微表情变化或重心调整”的生理时间线。

## 坏表演避坑图鉴 (Atlas of Bad Acting to Avoid)

| 劣质 AI 表演套路 | 为什么被否决 | 工业级提示词替代方案 |
|---|---|---|
| "cries sorrowfully" | 抽象形容词，模型只会生成假笑哭面具 | "eyes well up, blinks hard to suppress tears, lower lip tightens into a flat line" |
| "shouts angrily" | 模型容易造成夸张张嘴与口型崩坏 | "veins on neck tighten, leans forward abruptly, breath short and rigid, sharp jaw set" |
| "looks around nervously" | 相机无法识别随机转头，造成头部旋转扭曲 | "darts eyes twice toward the slope ridge, shoulders held high and defensive, quick shallow breath" |
| "shows affection" | 产生含糊黏合肢体变形 | "places steady hand firmly on the child's upper shoulder, thumb pressing lightly into fabric" |
