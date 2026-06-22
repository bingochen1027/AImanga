# AI 漫剧项目 API Contract 草案

## 1. Core Entities

```json
{
  "User": {"id":"u_001", "name":"Demo Creator", "plan":"creator", "credits_balance":1280},
  "Project": {"id":"p_001", "user_id":"u_001", "title":"重生后我成了首富千金", "stage":"video_ready", "genre":"女频逆袭", "platform":"douyin"},
  "SkillRun": {"id":"sr_001", "project_id":"p_001", "skill":"script_framework", "status":"succeeded", "credits_cost":60},
  "Job": {"id":"job_001", "type":"video_generation", "status":"running", "progress":72},
  "Order": {"id":"o_001", "user_id":"u_001", "plan":"creator", "amount":29, "status":"paid"},
  "JourneyEvent": {"id":"evt_001", "user_id":"u_001", "event":"project_created", "source_page":"wizard.html"}
}
```

## 2. Frontend Events

| Event | Trigger Page | Backend Action |
|---|---|---|
| `cta_start_trial_clicked` | index/templates/showcase | record journey event |
| `user_signed_in` | login | create user / bind identity |
| `trial_credits_granted` | login | credit ledger + account overview |
| `project_created` | wizard | create project + journey state |
| `script_parse_requested` | wizard | call script framework Skill |
| `asset_generation_requested` | editor/studio | call character/scene Skill |
| `storyboard_requested` | editor | call storyboard director Skill |
| `video_generation_requested` | studio | create render job |
| `launch_kit_requested` | launch-kit | call launch creative Skill |
| `checkout_started` | pricing/checkout | create order |
| `payment_success` | payment-success | update order + grant entitlement |
| `license_downloaded` | account | create license record |
| `performance_updated` | launch/account | save performance metrics |

## 3. API Endpoints

```http
POST /api/auth/login
POST /api/credits/grant-trial
GET  /api/account/overview
POST /api/projects
GET  /api/projects
GET  /api/projects/:projectId
PATCH /api/projects/:projectId
POST /api/projects/:projectId/skills/script-framework
POST /api/projects/:projectId/skills/content-fill
POST /api/projects/:projectId/skills/character-assets
POST /api/projects/:projectId/skills/scene-props
POST /api/projects/:projectId/skills/storyboard-director
POST /api/projects/:projectId/skills/video-generation
POST /api/projects/:projectId/skills/launch-kit
POST /api/projects/:projectId/skills/compliance-review
GET  /api/jobs
GET  /api/jobs/:jobId
POST /api/orders
GET  /api/orders
POST /api/payments/callback
POST /api/invoices
POST /api/licenses
POST /api/performance/manual-input
GET  /api/admin/dashboard
GET  /api/admin/customer-journey
GET  /api/admin/skills
GET  /api/admin/jobs
GET  /api/admin/orders
GET  /api/admin/compliance
```

## 4. Neowow Skill Bridge Payload

```json
{
  "skill_key": "storyboard_director",
  "skill_version": "v1.0",
  "project_id": "p_001",
  "episode_id": "ep_001",
  "input": {
    "script_segment": "第1集开场，女主重生回到宴会现场...",
    "characters": ["女主", "反派", "男主"],
    "scene": "豪门宴会厅",
    "style": "国漫写实",
    "platform": "douyin",
    "ratio": "9:16"
  },
  "output_required": ["shot_list", "image_prompts", "negative_prompts", "hook_score"],
  "cost_policy": {"estimate_credits": 120, "refund_on_system_failure": true}
}
```
