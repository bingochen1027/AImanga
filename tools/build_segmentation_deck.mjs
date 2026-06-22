import fs from 'node:fs/promises';
import { Presentation, PresentationFile } from 'file:///Users/christinaliu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const OUT='/Users/christinaliu/Documents/AImanga/outputs';
const RENDER='/Users/christinaliu/Documents/AImanga/.deck-render';
const IMG='/Users/christinaliu/Documents/AImanga/frontend/assets/images/neo-cases';
await fs.mkdir(OUT,{recursive:true}); await fs.mkdir(RENDER,{recursive:true});
const cover=await fs.readFile(`${IMG}/yuanqilu.png`);
const deck=Presentation.create({slideSize:{width:1280,height:720}});
const C={navy:'#0F172A',ink:'#172033',muted:'#64748B',line:'#DCE6F5',blue:'#3563E9',purple:'#7C3AED',cyan:'#06B6D4',green:'#16A34A',orange:'#F59E0B',red:'#E14D66',bg:'#F6F9FF',white:'#FFFFFF',soft:'#EEF4FF'};

function box(s,x,y,w,h,fill=C.white,r=20,line=C.line,shadow='shadow-sm'){return s.shapes.add({geometry:'roundRect',position:{left:x,top:y,width:w,height:h},fill,line:{style:'solid',fill:line,width:1},borderRadius:r,shadow});}
function text(s,value,x,y,w,h,size=24,color=C.ink,bold=false,align='left'){const q=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{style:'solid',fill:'none',width:0}});q.text=value;q.text.style={fontSize:size,color,bold,alignment:align};return q;}
function title(s,kicker,heading,sub=''){text(s,kicker,64,40,520,24,13,C.blue,true);text(s,heading,64,72,1130,52,36,C.navy,true);if(sub)text(s,sub,64,130,1130,32,16,C.muted);}
function footer(s,n,dark=false){text(s,'智能漫剧平台｜用户分群与客户旅程',64,686,500,18,10,dark?'#64748B':'#94A3B8');text(s,String(n).padStart(2,'0'),1160,684,50,18,10,dark?'#64748B':'#94A3B8',true,'right');}
function pill(s,value,x,y,w,fill=C.soft,color=C.blue){box(s,x,y,w,34,fill,17,fill,'shadow-none');text(s,value,x,y+7,w,18,12,color,true,'center');}
function card(s,{x,y,w,h,kicker='',heading='',body='',accent=C.blue,fill=C.white,line=C.line,ts=21,bs=14}){box(s,x,y,w,h,fill,22,line);if(kicker)text(s,kicker,x+18,y+16,w-36,18,11,accent,true);if(heading)text(s,heading,x+18,y+(kicker?42:20),w-36,32,ts,C.navy,true);if(body)text(s,body,x+18,y+(kicker?80:60),w-36,h-(kicker?94:72),bs,C.muted);}
function connector(s,x,y,w,h=4,color='#AFC1EB'){s.shapes.add({geometry:'roundRect',position:{left:x,top:y,width:w,height:h},fill:color,line:{style:'solid',fill:color,width:0},borderRadius:2});}

// 1 封面
{
 const s=deck.slides.add();s.background.fill=C.bg;
 text(s,'智能漫剧平台',70,78,430,24,14,C.blue,true);
 text(s,'用户分群与\n客户旅程规划',70,155,550,150,50,C.navy,true);
 text(s,'从“我不会做”到“稳定交付”，用三种创作深度承接同一条项目主线。',70,330,520,70,20,C.muted);
 pill(s,'全中文站点方案',70,430,150);pill(s,'前台与后台串联',232,430,160,'#F1EAFE',C.purple);
 text(s,'2026 年 6 月',70,650,220,20,12,'#94A3B8');
 s.images.add({blob:cover,contentType:'image/png',alt:'东方幻想漫剧案例',fit:'cover',position:{left:740,top:0,width:540,height:720}});
 box(s,700,0,80,720,C.bg,0,C.bg,'shadow-none');
}

// 2 六类人群
{
 const s=deck.slides.add();s.background.fill=C.bg;title(s,'01｜分群总览','六类使用者，共用一条项目状态主线','核心差异不是“个人或企业”，而是熟练度、控制意愿与交付责任。');
 const data=[['轻松创作','初次创作者','先帮我做出第一版','术语、成本、第一版',C.blue],['进阶控制','成长型创作者','我要质量，也要省返工','一致性、局部重做、持续更新',C.purple],['专业编排','专业创作者与工作室','我要稳定复现和批量交付','版本、协作、任务与预算',C.navy],['设定与授权','版权方','设定不能跑，授权要清楚','改编边界、素材权属、交付凭证',C.green],['交付与投放','品牌与内容机构','先试制，再验证传播效果','内容效果、素材规格、复盘',C.orange],['旅程与预警','运营与交付人员','及时发现阻塞并推动完成','任务状态、失败归因、合规风险',C.cyan]];
 data.forEach((d,i)=>card(s,{x:64+(i%3)*382,y:190+Math.floor(i/3)*208,w:356,h:180,kicker:d[0],heading:d[1],body:`“${d[2]}”\n\n关注：${d[3]}`,accent:d[4]}));footer(s,2);
}

// 3 三种深度
{
 const s=deck.slides.add();s.background.fill=C.bg;title(s,'02｜体验分层','三种创作深度，不复制项目','切换模式只改变可见控制项，已确认内容、版本与资产始终保留。');
 const d=[['轻松创作','一次只做一个决定','单题卡片｜推荐答案｜方向卡｜默认规格','隐藏模型、工作流与复杂参数',C.blue],['进阶控制','关键变量可比较、可编辑','风格规律｜段落合并｜多视角审稿｜局部重做','开放版本、逐镜控制与团队评论',C.purple],['专业编排','工作流、成本与批量任务可控','技能组合｜模型路由｜失败策略｜团队审批','开放审计、预算和交付追踪',C.navy]];
 d.forEach((a,i)=>{const y=190+i*150,dark=i===2;box(s,64,y,1152,126,dark?'#111C33':C.white,24,dark?'#111C33':C.line);pill(s,`层级 ${i+1}`,84,y+20,78,dark?'#24324F':C.soft,dark?'#D7E3FF':a[4]);text(s,a[0],182,y+18,205,32,25,dark?C.white:C.navy,true);text(s,a[1],392,y+22,350,28,16,dark?'#D7E3FF':C.muted,true);text(s,a[2],182,y+66,610,28,14,dark?'#CBD5E1':C.muted);text(s,a[3],800,y+42,380,44,15,dark?C.white:a[4],true);});footer(s,3);
}

function personaSlide(num,kicker,heading,sub,leftTitle,leftBody,items,accent,principles){
 const s=deck.slides.add();s.background.fill=C.bg;title(s,kicker,heading,sub);
 card(s,{x:64,y:190,w:300,h:410,kicker:'典型场景',heading:leftTitle,body:leftBody,accent,bs:16});
 items.forEach((a,i)=>{const y=190+i*82;box(s,405,y,500,66,C.white,18,C.line);text(s,String(i+1),423,y+17,34,28,18,accent,true,'center');text(s,a[0],470,y+12,155,24,16,C.navy,true);text(s,a[1],625,y+13,255,34,14,C.muted);});
 card(s,{x:942,y:190,w:274,h:410,kicker:'产品承诺',heading:principles[0],body:principles.slice(1).join('\n\n'),accent,fill:accent===C.green?'#F0FDF4':C.white,line:accent===C.green?'#BBF7D0':C.line,bs:17});footer(s,num);
}

// 4 轻松创作
personaSlide(4,'03｜初次创作者','心态：先让我低成本看见“做得出来”','默认进入轻松创作；所有术语都翻译成结果、风险与下一步。','只有一个想法','“我不懂流程，也不知道该写多长。”\n\n主要焦虑\n• 怕选错\n• 怕超预算\n• 怕生成后不能改\n\n成功时刻\n短时间内看到可比较的创作方向。',[['选择起点','想法／剧本／模板'],['回答单题','每题都有推荐原因'],['选择方向','三张卡同时说明风险'],['确认大纲','推荐版与自选版可对比'],['先出草稿','锁定分镜后再花高成本']],C.blue,['少而确定','一次一题','默认推荐','可随时回退','生成前报成本','完成后提示下一步']);

// 5 进阶控制
personaSlide(5,'04｜成长型创作者','心态：我知道要什么，但不想反复返工','进阶控制把“不可控生成”改成“关键变量可确认、局部问题可修复”。','已有剧本或稳定更新','“我接受智能辅助，但关键创作判断必须由我确认。”\n\n主要焦虑\n• 角色与场景漂移\n• 全篇重做成本高\n• 多版本难比较\n\n成功时刻\n问题能定位到段落、资产或镜头。',[['确认风格规律','逐条保留、修改或删除'],['混合创作方向','收藏局部要素再组合'],['多视角审稿','问题与建议逐条采纳'],['锁定资产','候选对比与缺失检查'],['局部修复','镜头、台词、节奏分别处理']],C.purple,['可控而不繁琐','关键变量同屏','差异明确高亮','局部重做优先','版本自动保留','团队评论可追溯']);

// 6 专业编排
personaSlide(6,'05｜专业创作者与工作室','心态：我要可复现、可协作、可交付','专业编排打开底层控制，但仍沿用同一套阶段、版本与确认门槛。','批量生产与团队交付','“我要知道用了什么上下文、为什么选这个模型、失败如何处理。”\n\n主要焦虑\n• 黑盒不可复现\n• 团队权限混乱\n• 任务和预算失控\n\n成功时刻\n同一工作流可以稳定复用。',[['技能编排','组合、分支、自定义检查点'],['选择上下文','档案、风格规律、资产版本'],['模型路由','质量、速度、成本策略'],['批量任务','并发、重试、人工复核'],['团队治理','权限、审批、审计和预算']],C.navy,['规模化仍可解释','工作流可复用','版本与依赖清楚','失败有策略','成本可预测','交付材料完整']);

// 7 全生命周期
{
 const s=deck.slides.add();s.background.fill=C.bg;title(s,'06｜全生命周期','从发现到下一集：十个连续状态','每个页面只负责一个主要决策，后台持续记录信号并准备下一步。');
 const names=['发现','试用','开始','对齐','决策','生产','审核','发布','转化','留存'];const subs=['案例与模板','登录领积分','选创作起点','确认目标','方向与大纲','资产分镜视频','问题清单修复','投放素材','方案与支付','继续下一集'];
 for(let i=0;i<4;i++)connector(s,256+i*230,261,38);connector(s,1160,306,4,118);for(let i=0;i<4;i++)connector(s,256+i*230,467,38);
 names.forEach((n,i)=>{const x=64+(i%5)*230,y=i<5?218:424;box(s,x,y,192,92,i===9?'#F0FDF4':C.white,20,i===9?'#86EFAC':C.line);text(s,String(i+1),x+12,y+14,36,24,12,i===9?C.green:C.blue,true,'center');text(s,n,x+50,y+12,120,24,18,C.navy,true);text(s,subs[i],x+16,y+50,160,24,12,C.muted,false,'center');});pill(s,'后台持续承接：用户｜项目｜版本｜任务｜积分｜订单｜授权｜复盘',250,566,780,'#E9F2FF',C.blue);footer(s,7);
}

// 8 情绪设计
{
 const s=deck.slides.add();s.background.fill=C.bg;title(s,'07｜创作中的情绪设计','每一种焦虑，都要对应一个可操作的界面反馈','引导不是多写说明，而是在犹豫出现的时刻给出下一步。');
 const e=[['不确定','给三个选项并解释推荐理由'],['兴奋发散','限制三至五个方向，避免无限生成'],['选择困难','亮点、风险、成本同屏对比'],['担心失控','确认即版本，回退不清空'],['担心花费','生成前显示产物、时间和积分'],['发现问题','拆成资产、镜头、台词与节奏修复'],['准备发布','先推荐组合，再开放批量矩阵'],['完成后空窗','直接呈现下一集与可复用资产']];const colors=[C.blue,C.purple,C.cyan,C.green,C.orange,C.red,C.blue,C.purple];
 e.forEach((a,i)=>{const x=64+(i%4)*288,y=192+Math.floor(i/4)*202;box(s,x,y,264,172,C.white,22,C.line);box(s,x+14,y+12,42,42,colors[i],14,colors[i],'shadow-none');text(s,String(i+1),x+14,y+21,42,20,14,C.white,true,'center');text(s,a[0],x+70,y+17,170,28,19,C.navy,true);text(s,a[1],x+18,y+70,225,70,14,C.muted);});footer(s,8);
}

// 9 页面串联
{
 const s=deck.slides.add();s.background.fill=C.bg;title(s,'08｜全站串联','前台完成决策，后台承接状态','首页不堆信息；案例后直接进入创建，创作完成自然进入投放、支付与留存。');
 const site=['首页／案例／模板','登录试用','项目创建向导','引导创作台','创作工作台','抖音投放包','价格与订单','个人中心'];
 for(let i=0;i<3;i++)connector(s,314+i*288,251,38);connector(s,1126,292,4,106);for(let i=0;i<3;i++)connector(s,314+i*288,437,38);
 site.forEach((v,i)=>{const x=64+(i%4)*288,y=i<4?214:400;box(s,x,y,250,78,C.white,20,C.line);text(s,v,x+16,y+20,218,34,15,C.navy,true,'center');});
 box(s,64,532,1152,76,'#111C33',20,'#111C33');text(s,'运营后台',86,554,120,28,16,'#93C5FD',true);text(s,'客户旅程｜项目与版本｜任务与成本｜订单与权益｜合规与授权｜投放复盘',220,551,950,30,15,C.white,true,'center');footer(s,9);
}

// 10 指标与路线图
{
 const s=deck.slides.add();s.background.fill=C.navy;text(s,'09｜指标与实施路线图',64,42,520,24,13,'#93C5FD',true);text(s,'先打通状态，再做深控制，最后规模化',64,76,900,52,38,C.white,true);text(s,'衡量标准不是页面数量，而是用户是否更快完成第一版、更少返工，并愿意继续下一集。',64,136,1080,34,16,'#CBD5E1');
 const phases=[['第一阶段','打通主旅程','首页、登录、向导、引导创作台、工作台、个人中心'],['第二阶段','完善生产控制','角色、场景、分镜、视频的局部重做与版本依赖'],['第三阶段','形成规模化闭环','素材矩阵、数据回流、团队协作与后台预警']];
 phases.forEach((a,i)=>{const x=64+i*392;box(s,x,210,366,190,'#17233C',24,'#2B3A59');pill(s,a[0],x+22,232,92,'#243758','#B8D0FF');text(s,a[1],x+22,286,320,32,23,C.white,true);text(s,a[2],x+22,338,320,44,14,'#C5D0E2');});
 text(s,'关键指标',64,444,220,28,22,C.white,true);const m=[['项目创建率','发现 → 开始'],['大纲锁定率','方向 → 决策'],['首集生成率','锁定 → 成片'],['素材导出率','成片 → 发布'],['支付完成率','方案 → 权益'],['七日继续创作率','完成 → 下一集']];
 m.forEach((a,i)=>{const x=64+i*192;box(s,x,492,168,104,i===5?'#164E3D':'#17233C',18,i===5?'#34D399':'#2B3A59');text(s,a[0],x+12,512,144,22,14,i===5?'#A7F3D0':C.white,true,'center');text(s,a[1],x+12,550,144,20,11,'#AAB8CE',false,'center');});footer(s,10,true);
}

async function writeBlob(path,blob){await fs.writeFile(path,new Uint8Array(await blob.arrayBuffer()));}
for(const [i,s] of deck.slides.items.entries()){
  const stem=`slide-${String(i+1).padStart(2,'0')}`;
  await writeBlob(`${RENDER}/${stem}.png`,await deck.export({slide:s,format:'png',scale:1}));
  await fs.writeFile(`${RENDER}/${stem}.layout.json`,await (await s.export({format:'layout'})).text());
}
await writeBlob(`${RENDER}/总览.webp`,await deck.export({format:'webp',montage:true,scale:1}));
const pptx=await PresentationFile.exportPptx(deck);await pptx.save(`${OUT}/智能漫剧用户分群与客户旅程.pptx`);
await fs.writeFile(`${RENDER}/检查.ndjson`,(await deck.inspect({kind:'slide,textbox,shape,image',maxChars:20000})).ndjson);
console.log(JSON.stringify({slides:deck.slides.items.length,pptx:`${OUT}/智能漫剧用户分群与客户旅程.pptx`,render:RENDER}));
