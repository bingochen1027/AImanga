# 漫剧工场｜Connected Customer Journey Demo

本包基于上传附件整理，新增了后台 Portal Demo 和连接方案文档。

## 本地预览

在项目目录启动任意静态文件服务，例如：

```bash
python3 -m http.server 4173
```

- 站点入口：`http://localhost:4173/`
- 创作者前台：`http://localhost:4173/frontend/`
- 运营 Portal：`http://localhost:4173/portal/`
- 产品方案：`docs/customer_journey_portal_plan.md`
- API 草案：`docs/api_contract.md`

建议通过本地服务预览，不要直接双击 HTML；这样前台和 Portal 才能稳定共享演示状态。

## 推荐演示路径

```text
首页 → 登录领取 500 积分 → 剧本向导创建项目 → 工作台查看任务
→ 编辑器 / 投放包 → 价格与支付 → 个人中心 → Portal 查看完整事件
```

前台事件、用户、积分、项目和购买状态保存在浏览器本地，仅用于交互演示。

## 本包解决的问题

- 保留现有 AI 漫剧前台 Demo。
- 新增后台 Portal，用于演示用户、项目、Skill、任务、订单、积分、合规、投放数据如何承接。
- 用 Customer Journey 方式把前台页面和后台功能串起来。
- 用 Neowow Skill Bridge 把 AI 能力产品化为可配置、可追踪、可计费的后台模块。

## Demo 性质

这是带本地状态的静态可点击 Demo，不包含真实后端、支付或模型调用。后续可按照 `docs/api_contract.md` 进入真实 MVP 开发。
