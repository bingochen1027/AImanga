from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)


OUTPUT = "output/pdf/entity-usecase-data-model.pdf"
FONT_PATH = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"


pdfmetrics.registerFont(TTFont("CN", FONT_PATH))
pdfmetrics.registerFont(TTFont("CN-Bold", FONT_PATH))


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="CoverKicker",
    fontName="CN-Bold",
    fontSize=11,
    leading=16,
    textColor=colors.HexColor("#2563EB"),
    alignment=TA_LEFT,
))
styles.add(ParagraphStyle(
    name="CoverTitle",
    fontName="CN-Bold",
    fontSize=30,
    leading=38,
    textColor=colors.HexColor("#111827"),
    spaceAfter=12,
))
styles.add(ParagraphStyle(
    name="SubtitleCN",
    fontName="CN",
    fontSize=12,
    leading=20,
    textColor=colors.HexColor("#64748B"),
))
styles.add(ParagraphStyle(
    name="H2CN",
    fontName="CN-Bold",
    fontSize=18,
    leading=24,
    textColor=colors.HexColor("#111827"),
    spaceBefore=10,
    spaceAfter=10,
))
styles.add(ParagraphStyle(
    name="H3CN",
    fontName="CN-Bold",
    fontSize=13,
    leading=18,
    textColor=colors.HexColor("#111827"),
    spaceBefore=6,
    spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="BodyCN",
    fontName="CN",
    fontSize=9.2,
    leading=14,
    textColor=colors.HexColor("#334155"),
))
styles.add(ParagraphStyle(
    name="SmallCN",
    fontName="CN",
    fontSize=8,
    leading=12,
    textColor=colors.HexColor("#64748B"),
))
styles.add(ParagraphStyle(
    name="CellCN",
    fontName="CN",
    fontSize=7.2,
    leading=10,
    textColor=colors.HexColor("#334155"),
))
styles.add(ParagraphStyle(
    name="CellBoldCN",
    fontName="CN-Bold",
    fontSize=7.5,
    leading=10.5,
    textColor=colors.HexColor("#111827"),
))


def p(text, style="BodyCN"):
    return Paragraph(str(text).replace("\n", "<br/>"), styles[style])


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFont("CN", 8)
    canvas.setFillColor(colors.HexColor("#94A3B8"))
    canvas.drawString(18 * mm, 11 * mm, "智能漫剧三端功能清单与数据模型")
    canvas.drawRightString(192 * mm, 11 * mm, f"第 {doc.page} 页")
    canvas.restoreState()


def make_table(rows, widths, header=True, font_size=7.2):
    converted = []
    for r_i, row in enumerate(rows):
        style_name = "CellBoldCN" if header and r_i == 0 else "CellCN"
        converted.append([p(cell, style_name) for cell in row])
    table = Table(converted, colWidths=widths, repeatRows=1 if header else 0)
    base = [
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#DBE7FF")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    if header:
        base += [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#EEF4FF")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#1E3A8A")),
        ]
    table.setStyle(TableStyle(base))
    return table


entities = [
    ["官网", "面向创作者的前台产品", "访问、理解、注册、模板/案例浏览、创作、购买、个人中心。", "P0 转化闭环"],
    ["Portal", "面向内部运营的后台", "只读数据看板、今日对比、用户启禁用、权限和用户导出。", "P0 运营可见"],
    ["NeoTV&Neowow", "内容案例与能力供给端", "NeoTV 提供案例和内容样本；Neowow 提供技能、工作流、生成任务和结果回传。", "P0 技能调用"],
]

features = [
    ["官网", "理解产品价值", "首页、产品功能、案例中心、价格页、抖音投放包入口", "P0", "访客能理解从故事到成片，并进入注册或工作台"],
    ["官网", "浏览案例", "NeoTV 案例中心，展示题材、制作重点、适合人群", "P0", "至少 6 个案例卡片，图片、标题、标签齐全"],
    ["官网", "模板开始", "题材模板 + 创作指引，模板筛选与做同款入口", "P0", "选择模板后进入创建项目或工作台"],
    ["官网", "注册登录", "领取试用积分，记录来源渠道", "P0", "创建用户、积分钱包和事件记录"],
    ["官网", "免费生成第一集", "项目向导、成本预估、创建项目、进入创作台", "P0", "发起一个剧本策划任务"],
    ["官网", "引导式创作", "三种控制深度、七阶段导航、步骤回退、成本与产物提示", "P0", "剧本策划阶段完整可用，其余阶段可占位"],
    ["官网", "购买与权益到账", "价格、订单、支付成功、权益同步", "P0", "订单、积分、会员状态进入个人中心和后台"],
    ["官网", "个人中心", "项目、资产、积分、订单、发票、商用授权", "P0", "查看项目进度、积分、订单和授权"],
    ["官网", "投放素材增长", "标题、封面、钩子、投放素材包、复盘建议", "P1", "基于项目生成投放包草稿并记录消耗"],
    ["官网", "团队协作", "团队空间、成员权限、共享积分、审核流", "P2", "后续团队版实现"],
    ["Portal", "经营数据", "只读看板，访问、新增用户、项目、生成任务，今日对比昨日", "P0", "按当天聚合并显示昨天对比"],
    ["Portal", "项目与任务", "项目记录、生成任务、失败与待复核状态", "P0", "只读展示，不做工单处理"],
    ["Portal", "用户与权限", "角色切换、启用/禁用用户、导出全部用户字段", "P0", "禁用后前台接口拦截；导出字段完整"],
    ["Portal", "内容与模板管理", "案例上下架、模板排序、价格展示配置", "P1", "MVP 可先静态配置"],
    ["Portal", "风控与合规", "敏感内容记录、版权授权查看、合规材料下载", "P1", "优先记录状态，人工处理后置"],
    ["Portal", "工单处理", "用户问题、失败任务补偿、退款申请", "P2", "第一阶段不做"],
    ["NeoTV&Neowow", "案例内容供给", "NeoTV 案例库、封面图、题材标签、案例拆解字段", "P0", "官网案例中心可读取固定案例数据"],
    ["NeoTV&Neowow", "创作技能调用", "剧本策划技能、输入结构、输出结构、版本与失败策略", "P0", "跑通剧本策划技能；任务有状态、成本、结果"],
    ["NeoTV&Neowow", "资产与结果回传", "项目档案、角色设定、分镜、视频、封面、投放素材", "P1", "优先回传文本与图片资产"],
    ["NeoTV&Neowow", "工作流编排", "技能组合、模型路由、成本预估、重试策略", "P1", "先固定流程，后续开放可配置"],
    ["NeoTV&Neowow", "能力市场", "更多技能、版本订阅、收益分成", "P2", "不进入 MVP"],
]

schemas = [
    ["users", "用户主表", "id, phone, email, name, status, source_channel, created_at, last_active_at", "P0"],
    ["roles / user_roles", "权限表", "role_id, permission_keys, user_id, assigned_by, assigned_at", "P0"],
    ["projects", "项目表", "id, owner_user_id, title, synopsis, source_type, current_stage, progress, status", "P0"],
    ["project_steps", "阶段步骤表", "project_id, stage_key, step_key, input_snapshot, output_artifact_id, status", "P0"],
    ["creative_jobs", "生成任务表", "id, project_id, user_id, skill_id, workflow_id, status, credit_cost, error_code", "P0"],
    ["artifacts / assets", "产物资产表", "artifact_id, project_id, type, content_url, json_payload, version, source_job_id", "P0/P1"],
    ["credit_wallets / credit_ledger", "积分表", "wallet_id, user_id, balance, ledger_type, amount, related_order_id, job_id", "P0"],
    ["orders / products", "交易表", "product_id, order_id, user_id, amount, status, entitlement_snapshot, invoice_status", "P0"],
    ["cases / templates", "案例模板表", "case_id, template_id, title, category, cover_url, method_summary, source, status", "P0"],
    ["skills / workflows", "技能流程表", "skill_id, version, input_schema, output_schema, cost_rule, status", "P0/P1"],
    ["events / audit_logs", "事件日志表", "event_id, user_id, session_id, event_name, payload, created_at", "P0"],
    ["exports", "导出记录表", "export_id, operator_user_id, export_type, field_scope, file_url, created_at", "P0"],
]

flows = [
    ["官网 → Portal", "访问与转化事件", "页面访问、按钮点击、注册、模板选择、案例点击、价格点击"],
    ["官网 → Portal", "用户与权益数据", "用户信息、来源渠道、会员状态、积分余额、禁用状态同步"],
    ["官网 → Portal", "项目与任务状态", "项目创建、当前阶段、生成任务、失败/待复核状态"],
    ["官网 ↔ NeoTV&Neowow", "案例与模板读取", "案例图片、题材、创作方法、模板预设"],
    ["官网 ↔ NeoTV&Neowow", "技能任务请求", "项目上下文、用户选择、目标平台、预算与输出要求"],
    ["官网 ↔ NeoTV&Neowow", "任务状态回传", "排队、运行、成功、失败、预计耗时、积分消耗"],
    ["Portal ↔ NeoTV&Neowow", "能力健康状态", "技能可用性、失败率、平均耗时、队列积压"],
    ["Portal ↔ NeoTV&Neowow", "异常记录查看", "失败任务、待复核任务、失败原因和重试次数"],
]

interfaces = [
    ["用户注册/登录", "官网", "Portal / 用户服务", "phone, email, source_channel, consent", "P0"],
    ["创建项目", "官网", "项目服务 / Portal", "user_id, source_type, template_id, case_id, story_input", "P0"],
    ["发起生成任务", "官网工作台", "Neowow", "project_id, skill_id, input_snapshot, estimated_cost", "P0"],
    ["生成任务状态回传", "Neowow", "官网 / Portal", "job_id, status, progress, actual_cost, error_code", "P0"],
    ["产物保存", "Neowow", "项目服务", "project_id, artifact_type, content_url, json_payload, version", "P0"],
    ["积分扣减/返还", "任务服务", "钱包服务 / Portal", "user_id, job_id, amount, ledger_type", "P0"],
    ["订单支付成功", "官网支付", "订单/权益/Portal", "order_id, product_id, amount, entitlement_snapshot", "P0"],
    ["用户禁用/启用", "Portal", "用户服务 / 官网", "user_id, status, operator_id, reason", "P0"],
    ["导出用户字段", "Portal", "导出服务", "operator_id, field_scope, filter, file_format", "P0"],
    ["案例/模板同步", "NeoTV&Neowow", "官网 / Portal", "case_id, template_id, cover_url, tags, status", "P1"],
    ["投放包生成", "官网", "Neowow", "project_id, asset_ids, platform, material_count", "P1"],
    ["工单/补偿", "Portal", "客服/订单/钱包", "ticket_id, user_id, job_id, compensation", "P2"],
]


doc = BaseDocTemplate(
    OUTPUT,
    pagesize=A4,
    leftMargin=16 * mm,
    rightMargin=16 * mm,
    topMargin=16 * mm,
    bottomMargin=18 * mm,
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="normal")
doc.addPageTemplates([PageTemplate(id="default", frames=[frame], onPage=on_page)])

story = []
story.append(p("产品规划底稿｜三端实体 + 最小闭环", "CoverKicker"))
story.append(p("官网、Portal、NeoTV&Neowow 的功能清单与数据模型", "CoverTitle"))
story.append(p("目标是先拆出最小可上线单元：官网负责获客与创作入口，Portal 负责数据查看与用户权限，NeoTV&Neowow 负责案例内容、技能能力与生成服务供给。", "SubtitleCN"))
story.append(Spacer(1, 8))
story.append(make_table([["优先级", "含义"], ["P0", "必须上线，形成闭环"], ["P1", "上线后增强转化与效率"], ["P2", "锦上添花或后续商业化"]], [32 * mm, 116 * mm]))
story.append(Spacer(1, 14))
story.append(p("一、三个实体的边界", "H2CN"))
story.append(make_table([["实体", "定位", "范围", "优先级"]] + entities, [28 * mm, 42 * mm, 80 * mm, 30 * mm]))
story.append(Spacer(1, 10))
story.append(p("最小可上线闭环", "H2CN"))
story.append(p("官网访问 → 注册登录 → 创建项目 → 调用剧本策划技能 → 返回结果与消耗 → Portal 可见数据与用户状态。", "BodyCN"))
story.append(PageBreak())

story.append(p("二、使用场景与功能优先级", "H2CN"))
story.append(make_table([["实体", "使用场景", "功能点", "优先级", "验收标准"]] + features, [22 * mm, 28 * mm, 68 * mm, 16 * mm, 46 * mm]))
story.append(PageBreak())

story.append(p("三、核心数据表结构", "H2CN"))
story.append(make_table([["表名", "用途", "关键字段", "优先级"]] + schemas, [38 * mm, 38 * mm, 88 * mm, 16 * mm]))
story.append(Spacer(1, 10))
story.append(p("四、主要表关系", "H2CN"))
relations = [
    ["users", "1:N", "projects"],
    ["projects", "1:N", "project_steps"],
    ["projects", "1:N", "creative_jobs"],
    ["creative_jobs", "1:N", "artifacts / assets"],
    ["skills / workflows", "1:N", "creative_jobs"],
    ["users", "1:1", "credit_wallets"],
    ["credit_wallets", "1:N", "credit_ledger"],
    ["users", "1:N", "orders"],
    ["products", "1:N", "orders"],
    ["users / portal users", "1:N", "audit_logs / exports"],
]
story.append(make_table([["源表", "关系", "目标表"]] + relations, [58 * mm, 24 * mm, 58 * mm]))
story.append(PageBreak())

story.append(p("五、三个实体的数据传输模型", "H2CN"))
story.append(make_table([["数据方向", "数据包", "内容"]] + flows, [42 * mm, 44 * mm, 94 * mm]))
story.append(Spacer(1, 10))
story.append(p("六、接口与数据事件建议", "H2CN"))
story.append(make_table([["事件/接口", "发起实体", "接收实体", "关键字段", "优先级"]] + interfaces, [34 * mm, 28 * mm, 38 * mm, 66 * mm, 14 * mm]))
story.append(PageBreak())

story.append(p("七、开发拆分建议", "H2CN"))
mvp = [
    ["阶段", "范围"],
    ["P0 第一阶段", "用户注册登录、状态启禁用；官网页面与创建项目入口；剧本策划技能任务调用；项目档案与任务结果保存；积分发放、扣减、失败返还；Portal 只读看板、用户管理、导出。"],
    ["P1 第二阶段", "案例与模板后台配置；投放包生成与项目资产关联；视觉、资产、分镜等更多阶段接入；内容合规记录与授权材料下载；能力健康看板。"],
    ["P2 后续增强", "团队空间与多人协作审核；工单、退款、补偿后台；技能市场与工作流编排器；投放数据回流；企业级私有资产库和接口对接。"],
]
story.append(make_table(mvp, [38 * mm, 132 * mm]))
story.append(Spacer(1, 18))
story.append(p("说明：这份 PDF 与 HTML 规划页内容保持一致，作为产品与后端、NeoTV、Neowow 沟通的阅读版。", "SmallCN"))

doc.build(story)
