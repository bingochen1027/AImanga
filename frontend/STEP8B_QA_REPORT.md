# Step 8B QA Report

## 检查结果

- 图片资源缺失：0
- 内部 HTML 链接缺失：0
- 订单方案参数：creator, credits, credits-large, credits-mini, launchpack, pilot, pro, series10, team
- 未在 `assets/app.js` 中配置的方案：无

## Review 重点

1. `pricing.html` 是否符合 NeoTV 风格低门槛价格方案。
2. `checkout.html?plan=creator / pro / team / credits / launchpack` 是否能正确切换。
3. `showcase.html` 是否呈现 NeoTV 作品墙与案例拆解。
4. `templates.html` 是否同时覆盖题材模板和技能工作流模板。
5. `launch-kit.html` 是否将投放包表达为可购买的投放技能包。
