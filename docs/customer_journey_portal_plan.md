# AI 漫剧项目｜前台 Demo + 后台 Portal + Neowow Skill 连接方案

## 1. 对上传附件的学习结论

附件是一个较完整的 AI 漫剧产品原型包，核心由三类内容组成：

1. **前台 HTML Demo**：已经包含首页、产品功能、模板中心、案例中心、价格页、登录页、个人中心、创作工作台、剧本向导、编辑器 Guide、抖音投放包、订单确认、支付成功等页面。
2. **产品设计与竞品文档**：已经定义产品应从“AI 漫剧生成工具”升级为“从故事到抖音投放素材的一站式 AI 漫剧生产与增长工作台”。
3. **迭代说明与 QA 文档**：已经完成中文化、付费路径、NamiStory 分阶段流水线、Neowow Skill 化机制、NeoTV 风格案例中心和价格体系的前台原型表达。

当前前台 Demo 的主线已经基本成立：

```text
首页 / 案例 / 模板 / 价格
→ 登录注册
→ 剧本生成向导
→ 创作工作台 / 编辑器 Guide
→ 抖音投放包
→ 价格 / 订单 / 支付成功
→ 个人中心承接会员、积分、项目、订单、授权
```

但它目前仍以**静态前台体验**为主，真正缺少的是：

- 后台 Portal：运营、项目、用户、订单、积分、技能、任务队列、合规、投放数据的统一管理后台。
- Neowow 连接层：把前台页面动作映射到后台功能和 Skill 编排能力。
- Customer Journey 数据闭环：用户从访问、注册、创作、生成、付费、投放、复盘、复购的全链路状态没有统一沉淀。

---

## 2. 建议产品形态

本项目建议做成三层：

```text
A. 前台官网 / 创作者端 Demo
   负责获客、转化、创作入口、价格转化、个人中心留存

B. 后台 Admin Portal
   负责用户/项目/订单/积分/资产/Skill/任务/合规/投放数据管理

C. Neowow Skill Bridge
   负责把前台动作转成后台可执行任务，并调用剧本、角色、分镜、视频、投放、合规等技能
```

一句话定位：

> 前台让用户看懂、试用、付费、创作；后台让运营团队看得见、管得住、交付得了；Neowow Skill 负责把每一步 AI 能力产品化、可配置、可追踪。

---

## 3. 前台 Demo 页面清单与职责

| 页面 | 当前附件文件 | 页面职责 | 需要连接的后台能力 |
|---|---|---|---|
| 首页 | `frontend/index.html` | 产品定位、CTA、用户进入第一步 | CMS、活动配置、来源追踪、转化漏斗 |
| 产品功能页 | `frontend/features.html` | 展示七阶段产线和 Skill 能力 | Skill 配置、能力开关、套餐权限 |
| 模板中心 | `frontend/templates.html` | 题材模板 + 技能工作流模板 | 模板 CMS、模板上下架、模板使用数据 |
| 案例中心 | `frontend/showcase.html` | NeoTV 风格作品墙、案例拆解 | 案例 CMS、授权素材、案例数据 |
| 价格页 | `frontend/pricing.html` | 会员、积分、项目包、投放包 | 商品配置、价格策略、优惠券、权益规则 |
| 登录注册 | `frontend/login.html` | 手机/微信/抖音授权入口 | 用户中心、OAuth、试用积分发放 |
| 剧本向导 | `frontend/wizard.html` | 一句话/剧本/模板进入创作 | 项目创建、剧本解析 Skill、成本预估 |
| 编辑器 Guide | `frontend/editor-guide.html` | 七阶段明盒式编辑流程 | 阶段状态、任务队列、资产确认点 |
| 工作台 | `frontend/studio.html` | 项目看板、生成状态、风险提醒 | 项目管理、任务队列、资产库、通知 |
| 抖音投放包 | `frontend/launch-kit.html` | 标题、封面、Hook、A/B 素材 | 投放素材 Skill、AB测试、数据回填 |
| 订单确认 | `frontend/checkout.html` | 方案确认、支付、发票信息 | 订单、支付、发票、合同 |
| 支付成功 | `frontend/payment-success.html` | 权益到账和下一步引导 | 权益发放、积分入账、订单状态 |
| 个人中心 | `frontend/account.html` | 会员、积分、项目、资产、订单、授权 | 用户资产、钱包、订单、授权、合规 |

---

## 4. 后台 Portal 模块设计

### 4.1 Portal 首页 Dashboard

目标：让运营/交付团队一眼看到今天平台运行状态。

核心卡片：

- 今日新增用户
- 今日新建项目
- 生成中任务数
- 失败任务数
- 今日支付金额
- 积分消耗
- 待审核合规项目
- 投放包导出数

### 4.2 Customer Journey 看板

按用户全流程阶段展示：

```text
访问 → 注册 → 领取试用积分 → 创建项目 → 剧本解析 → 资产确认 → 分镜生成
→ 视频生成 → 投放包生成 → 付费 → 导出授权 → 投放复盘 → 复购/升级
```

每个用户/项目要能看到：

- 当前所处阶段
- 最近一次动作
- 卡点原因
- 下一步推荐动作
- 是否需要人工介入

### 4.3 用户与组织管理

- 个人用户
- 团队用户
- 企业客户
- 会员套餐
- Credits 余额
- 账号绑定：手机、微信、抖音、邮箱
- 风险标签：高消耗、支付失败、合规风险、生成失败多

### 4.4 项目管理

- 项目列表
- 项目阶段：概念、剧本、资产、分镜、视频、后期、投放
- 已生成集数
- 已导出素材
- Credits 消耗
- 项目风险
- 交付状态
- 负责人/客户成功人员

### 4.5 Neowow Skill 管理

把 AI 能力产品化为可配置 Skill：

| Skill | 前台触发点 | 后台作用 |
|---|---|---|
| 剧本框架 Skill | Wizard | 从一句话/长文本生成故事结构、人物关系、分集大纲 |
| 内容填充 Skill | Wizard / Editor | 扩写剧情、强化爽点、生成钩子 |
| 角色资产 Skill | Editor / Studio | 生成角色三视图、表情、服装、配音设定 |
| 场景道具 Skill | Editor / Studio | 生成场景四视图、关键道具和复用规则 |
| 分镜导演 Skill | Editor | 生成分镜、镜头语言、Prompt、负向 Prompt |
| 视频生成 Skill | Studio | 编排视频模型、生成队列、失败补偿 |
| 投放素材 Skill | Launch Kit | 生成标题、封面、前3秒 Hook、A/B 组合 |
| 合规审核 Skill | Account / Portal | 生成备案材料、版权声明、AI生成说明、风险等级 |

后台需要支持：

- Skill 开关
- Skill 版本
- Skill 可用套餐
- Skill 消耗积分
- Skill 失败率
- Skill 平均生成耗时
- Skill 输出物模板
- Skill Prompt 配置
- Skill 模型路由配置

### 4.6 任务队列 / 生成任务中心

所有生成动作都进入任务中心：

- 剧本解析任务
- 角色生成任务
- 场景生成任务
- 分镜任务
- 视频任务
- 封面任务
- Hook 任务
- 合规任务

任务字段：

- Job ID
- User ID
- Project ID
- Skill Type
- Model Provider
- Status：Queued / Running / Succeeded / Failed / Refunded / Manual Review
- Credits Cost
- Retry Count
- Error Reason
- Created At / Finished At

### 4.7 模板 / 案例 / CMS

后台要能维护前台内容：

- 首页 Banner
- 模板分类
- 模板卡片
- Skill 工作流模板
- 案例中心作品墙
- 案例拆解
- 价格页套餐
- FAQ
- 活动/优惠

### 4.8 订单 / 支付 / 积分 / 发票

- 订单查询
- 会员订阅
- 积分充值
- 项目包
- 投放包
- 企业版咨询
- 支付状态
- 权益到账
- 退款/补偿
- 发票申请
- 合同/授权文件下载

### 4.9 合规与商用授权

- 项目合规风险
- AI 生成说明
- 分集梗概
- 角色设定
- 版权声明
- 商用授权书
- 去水印记录
- 备案材料包
- 人工审核记录

### 4.10 投放与数据复盘

第一阶段可以手动录入：

- 平台：抖音/快手/红果/TikTok
- 播放量
- 完播率
- 点击率
- 付费转化
- 素材成本
- ROI
- 最佳标题/封面/Hook
- 下一轮优化建议

---

## 5. Customer Journey 打通方案

### 5.1 用户路径总览

```text
1. 看到内容/广告
   → 前台首页、案例、模板
   → 后台记录来源、活动、访问事件

2. 产生兴趣
   → 浏览功能、价格、案例拆解
   → 后台记录页面行为、CTA点击、模板偏好

3. 注册登录
   → 登录页领取免费积分
   → 后台创建用户、发放试用权益、建立 Journey ID

4. 创建项目
   → 剧本向导选择“一句话/上传剧本/模板做同款”
   → 后台创建 Project，调用剧本框架 Skill

5. 生成资产
   → 编辑器 Guide 确认角色/场景/道具
   → 后台创建 Asset，调用角色资产 Skill 和场景道具 Skill

6. 生成分镜与视频
   → Studio / Editor 进入分镜和视频阶段
   → 后台生成 Job，消耗 Credits，记录失败补偿

7. 生成投放包
   → Launch Kit 输出标题、封面、Hook、A/B 组合
   → 后台记录素材包、投放建议、导出记录

8. 付费升级
   → Pricing / Checkout / Payment Success
   → 后台生成订单、支付记录、发票信息、权益到账

9. 个人中心留存
   → Account 查看项目、积分、订单、授权、合规
   → 后台触发续费、补充积分、生成下一集建议

10. 复盘与复购
   → 手动/接口回填投放数据
   → 后台输出复盘建议，推动下一集、连载包、投放包购买
```

### 5.2 Journey 状态枚举

| 状态 | 含义 | 下一步动作 |
|---|---|---|
| Visitor | 访客 | 引导看案例/模板 |
| Trial User | 已注册试用 | 引导创建第一集 |
| Project Created | 已创建项目 | 引导完成剧本解析 |
| Script Parsed | 剧本已解析 | 引导确认角色/场景 |
| Asset Ready | 资产已就绪 | 引导生成分镜 |
| Storyboard Ready | 分镜已就绪 | 引导生成视频 |
| Video Ready | 视频已生成 | 引导生成投放包 |
| Launch Kit Ready | 投放包已生成 | 引导导出/购买高清 |
| Paid User | 已付费 | 引导继续生成和复盘 |
| At Risk | 有风险/卡点 | 人工介入或提示修正 |
| Retained | 复购/持续使用 | 推荐升级/团队版 |

---

## 6. Neowow 连接方式

由于前台页面是 HTML 静态原型，建议先用“事件 + API + Skill 编排”的方式连接。

### 6.1 前台事件

| 前台动作 | Event Name | 需要传的数据 |
|---|---|---|
| 点击免费生成第一集 | `cta_start_trial_clicked` | source_page, campaign_id |
| 完成登录 | `user_signed_in` | user_id, channel |
| 创建项目 | `project_created` | user_id, input_type, genre, platform |
| 点击剧本解析 | `script_parse_requested` | project_id, text, genre, episode_count |
| 确认角色资产 | `asset_confirmed` | project_id, asset_ids |
| 生成分镜 | `storyboard_requested` | project_id, episode_id, mode |
| 生成视频 | `video_generation_requested` | project_id, episode_id, quality_mode |
| 生成投放包 | `launch_kit_requested` | project_id, video_id, package_type |
| 进入支付 | `checkout_started` | user_id, plan_id, price |
| 支付成功 | `payment_success` | order_id, plan_id, amount |

### 6.2 后台 API 建议

```http
POST /api/auth/login
POST /api/users/trial-credits
POST /api/projects
GET  /api/projects/:id
POST /api/projects/:id/skills/script-framework
POST /api/projects/:id/skills/character-assets
POST /api/projects/:id/skills/storyboard-director
POST /api/projects/:id/skills/video-generation
POST /api/projects/:id/skills/launch-kit
POST /api/projects/:id/skills/compliance-review
GET  /api/jobs/:id
POST /api/orders
POST /api/payments/callback
GET  /api/account/overview
GET  /api/admin/journey
GET  /api/admin/jobs
GET  /api/admin/skills
```

### 6.3 数据对象

核心数据对象：

- User
- Organization
- Project
- Episode
- ScriptParseResult
- CharacterAsset
- SceneAsset
- StoryboardShot
- VideoRenderJob
- LaunchCreative
- Skill
- SkillRun
- CreditLedger
- Order
- Payment
- Invoice
- License
- ComplianceRecord
- JourneyEvent

---

## 7. Demo 开发建议

### 7.1 第一阶段：Clickable Demo

目标：对外演示完整客户旅程。

范围：

- 保留现有前台 HTML 页面
- 新增后台 Portal 静态页面
- 所有数据用 Mock JSON
- 前后台通过“查看后台记录”“查看前台页面”的链接串起来
- 不接真实支付、不接真实模型

### 7.2 第二阶段：半动态 Demo

目标：让客户感觉数据真的在流转。

范围：

- 使用 LocalStorage 或轻量 Node 服务保存用户状态
- 剧本向导创建模拟项目
- 支付成功写入模拟订单
- 后台 Portal 读取模拟用户、项目、订单、任务
- Skill Run 用模拟任务状态呈现 Queued / Running / Success / Failed

### 7.3 第三阶段：真实 MVP

目标：真正连接 Neowow 后台能力。

范围：

- 用户登录
- 项目创建
- Skill 调用
- 任务队列
- 积分扣减
- 支付回调
- 资产存储
- 合规记录
- 投放数据回填

---

## 8. 建议交付物

本轮建议交付以下内容：

1. 前台 Demo：沿用附件中的 `frontend/` 页面。
2. 后台 Portal Demo：新增 `portal/index.html`。
3. Customer Journey Map：在 Portal 中可视化展示从访问到复购的全链路。
4. Neowow Skill Bridge Map：前台动作与后台 Skill 的映射表。
5. API Contract：供后端评估接口和数据对象。
6. 页面-后台功能矩阵：供产品、前端、后端统一范围。

---

## 9. P0 开发范围建议

第一版必须做：

- 前台页面串联：首页 → 登录 → 剧本向导 → 工作台 → 投放包 → 价格 → 支付成功 → 个人中心
- 后台 Portal 首页
- Customer Journey 看板
- 用户管理
- 项目管理
- Skill 管理
- 生成任务中心
- 订单/积分/发票基础管理
- 合规/授权基础管理
- 投放数据手动录入

暂时不做：

- 复杂团队权限
- 创作者收益分账
- 派单市场
- 多平台真实投放接口
- 复杂财务系统对账
- 大规模多租户私有部署

---

## 10. 最终建议

当前附件已经能支撑“前台创作者端 Demo”。下一步不应该继续只打磨官网页面，而应该马上补齐：

1. **后台 Portal**：把用户、项目、订单、积分、生成任务、合规、投放数据全部接住。
2. **Neowow Skill Bridge**：把所有 AI 能力拆成可配置、可追踪、可计费的 Skill。
3. **Customer Journey**：用 JourneyEvent 串起前台行为、后台状态、付费转化和复购运营。

这样客户看到的就不是“一个AI漫剧网页”，而是一个完整的 AI 漫剧 SaaS / AIGC 内容生产平台。 
