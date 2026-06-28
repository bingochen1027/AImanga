(function(){
  const root=document.documentElement;
  root.setAttribute('data-theme','light');
  localStorage.removeItem('md-theme');
  document.querySelectorAll('[data-theme-toggle]').forEach(btn=>btn.remove());
  document.querySelectorAll('[data-tabs]').forEach(group=>{group.querySelectorAll('[data-target]').forEach(btn=>btn.addEventListener('click',()=>{group.querySelectorAll('[data-target]').forEach(b=>b.classList.remove('active'));group.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');const panel=group.querySelector(btn.dataset.target);if(panel)panel.classList.add('active');}));});
  document.querySelectorAll('[data-filter-group]').forEach(group=>{const target=group.dataset.target;group.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{group.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll(target).forEach(card=>{const cat=card.dataset.category||'';card.style.display=(f==='all'||cat.includes(f))?'':'none';});}));});
  document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);btn.textContent='已复制';setTimeout(()=>btn.textContent='复制',1300)}catch(e){btn.textContent='复制失败'}}));

  const loginModal=document.querySelector('[data-login-modal]');
  const openLoginModal=()=>{if(loginModal){loginModal.classList.add('is-open');loginModal.setAttribute('aria-hidden','false')}};
  const closeLoginModal=()=>{if(loginModal){loginModal.classList.remove('is-open');loginModal.setAttribute('aria-hidden','true')}};
  document.querySelectorAll('[data-login-required]').forEach(trigger=>trigger.addEventListener('click',event=>{event.preventDefault();openLoginModal()}));
  document.querySelectorAll('[data-login-modal-close]').forEach(trigger=>trigger.addEventListener('click',closeLoginModal));
  if(loginModal) loginModal.addEventListener('click',event=>{if(event.target===loginModal) closeLoginModal()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape') closeLoginModal()});

  document.querySelectorAll('[data-mobile-toggle]').forEach(btn=>btn.addEventListener('click',()=>{
    document.body.classList.toggle('nav-open');
    btn.textContent=document.body.classList.contains('nav-open')?'×':'☰';
  }));
  document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{
    document.body.classList.remove('nav-open');
    document.querySelectorAll('[data-mobile-toggle]').forEach(btn=>btn.textContent='☰');
  }));

})();

// Theme switching has been removed from the customer-facing MVP.
(function(){
  document.documentElement.setAttribute('data-theme','light');
})();

// Connected demo: persist a lightweight customer journey across all pages.
(function(){
  const KEY='md-connected-state';
  const INVITE_KEY='md-invite-codes';
  const initial={user:null,credits:0,projects:[],events:[]};
  const defaultInvites=[
    {code:'ESALES2026',label:'第一阶段内测码',status:'启用',maxUses:1,used:0,createdAt:'2026-06-25 10:00',note:'一次性邀请码，用于首批内测用户注册',usageLog:[]},
    {code:'AIMANGA60',label:'15秒分镜视频体验码',status:'启用',maxUses:1,used:0,createdAt:'2026-06-25 10:00',note:'一次性邀请码，用于体验第一阶段分镜视频生成',usageLog:[]},
    {code:'TEAMTEST',label:'团队测试码',status:'启用',maxUses:1,used:0,createdAt:'2026-06-25 10:00',note:'一次性邀请码，用于内部团队验证',usageLog:[]}
  ];
  const read=()=>{try{return {...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {...initial}}};
  const write=(state)=>localStorage.setItem(KEY,JSON.stringify(state));
  const track=(name,meta={})=>{const state=read();state.events=[...(state.events||[]),{name,meta,path:location.pathname.split('/').pop()||'index.html',at:new Date().toISOString()}].slice(-80);write(state)};
  const toast=(title,detail)=>{const node=document.createElement('div');node.className='demo-toast';node.innerHTML=`<b>${title}</b><span>${detail}</span>`;document.body.appendChild(node);setTimeout(()=>node.remove(),2800)};
  const normalizeInvite=value=>String(value||'').trim().toUpperCase().replace(/\s+/g,'');
  const readInvites=()=>{
    let invites;
    try{invites=JSON.parse(localStorage.getItem(INVITE_KEY)||'null')}catch(e){invites=null}
    if(!Array.isArray(invites)||!invites.length){
      invites=defaultInvites.map(item=>({...item}));
      localStorage.setItem(INVITE_KEY,JSON.stringify(invites));
    }
    let updated=false;
    invites.forEach(invite=>{
      invite.maxUses=1;
      invite.used=Number(invite.used||0);
      invite.usageLog=Array.isArray(invite.usageLog)?invite.usageLog:[];
      invite.users=Array.isArray(invite.users)?invite.users:[];
      if(invite.used>=1) invite.status='已使用';
      if(normalizeInvite(invite.code)==='AIMANGA60'&&(/60秒|60 秒|短视频/.test(`${invite.label||''}${invite.note||''}`))){
        invite.label='15秒分镜视频体验码';
        invite.note='一次性邀请码，用于体验第一阶段分镜视频生成';
        updated=true;
      }
      updated=true;
    });
    if(updated) saveInvites(invites);
    return invites;
  };
  const saveInvites=invites=>localStorage.setItem(INVITE_KEY,JSON.stringify(invites));
  const findInvite=code=>readInvites().find(item=>normalizeInvite(item.code)===normalizeInvite(code));
  const validateInvite=code=>{
    const invite=findInvite(code);
    if(!invite) return {ok:false,message:'邀请码不存在，请检查后重新输入。'};
    if(invite.status!=='启用') return {ok:false,message:'该邀请码已使用或已停用，请联系运营重新开通。'};
    if(Number(invite.maxUses||0)>0&&Number(invite.used||0)>=Number(invite.maxUses)) return {ok:false,message:'该邀请码已达到可用次数上限。'};
    return {ok:true,invite};
  };
  const consumeInvite=(code,phone)=>{
    const normalized=normalizeInvite(code);
    const invites=readInvites();
    const invite=invites.find(item=>normalizeInvite(item.code)===normalized);
    if(!invite) return null;
    invite.users=Array.isArray(invite.users)?invite.users:[];
    invite.usageLog=Array.isArray(invite.usageLog)?invite.usageLog:[];
    if(!invite.users.includes(phone)){
      invite.used=Number(invite.used||0)+1;
      invite.users.push(phone);
      invite.usageLog.push({phone,usedAt:new Date().toLocaleString('zh-CN',{hour12:false}),page:location.pathname.split('/').pop()||'index.html'});
    }
    invite.lastUsedAt=new Date().toLocaleString('zh-CN',{hour12:false});
    invite.lastUser=phone;
    if(Number(invite.used||0)>=1) invite.status='已使用';
    saveInvites(invites);
    return invite;
  };

  track('page_view',{referrer:document.referrer||'direct'});
  document.querySelectorAll('a.btn').forEach(a=>a.addEventListener('click',()=>track('cta_click',{label:a.textContent.trim(),href:a.getAttribute('href')})));

  const login=document.querySelector('[data-demo-login]');
  if(login){
    const next=new URLSearchParams(location.search).get('next');
    if(next==='wizard') login.setAttribute('href','wizard.html');
    if(next==='studio'||next==='creator-studio') login.setAttribute('href','creator-studio.html');
  }
  if(login) login.addEventListener('click',(event)=>{
    const phone=document.getElementById('login-phone').value.trim();
    const code=document.getElementById('login-code').value.trim();
    const inviteCode=document.getElementById('login-invite').value.trim();
    const agreement=document.getElementById('login-agreement');
    const inviteResult=validateInvite(inviteCode);
    if(!/^1\d{10}$/.test(phone)||!/^\d{6}$/.test(code)){
      event.preventDefault();
      document.getElementById('login-message').textContent='请输入有效手机号和 6 位验证码。';
      return;
    }
    if(agreement&&!agreement.checked){
      event.preventDefault();
      document.getElementById('login-message').textContent='请先阅读并同意用户协议和隐私政策。';
      return;
    }
    if(!inviteResult.ok){
      event.preventDefault();
      document.getElementById('login-message').textContent=inviteResult.message;
      return;
    }
    const invite=consumeInvite(inviteCode,phone.slice(0,3)+'****'+phone.slice(-4))||inviteResult.invite;
    const state=read();
    state.user={id:'USR-DEMO-01',phone:phone.slice(0,3)+'****'+phone.slice(-4),name:'漫剧创作者',plan:'免费试用',inviteCode:normalizeInvite(invite.code)};
    if(!state.events.some(x=>x.name==='trial_credits_granted')) state.credits=(state.credits||0)+500;
    state.events.push({name:'invite_login',meta:{inviteCode:normalizeInvite(invite.code)},path:'login.html',at:new Date().toISOString()});
    state.events.push({name:'trial_credits_granted',meta:{credits:500,inviteCode:normalizeInvite(invite.code)},path:'login.html',at:new Date().toISOString()});
    write(state);
  });

  document.querySelectorAll('[data-policy-open]').forEach(link=>link.addEventListener('click',event=>{
    event.preventDefault();
    document.querySelector('.policy-modal')?.remove();
    const title=link.dataset.policyOpen==='privacy'?'隐私政策':'用户协议';
    const modal=document.createElement('div');
    modal.className='policy-modal';
    modal.innerHTML=`<div class="policy-card" role="dialog" aria-modal="true" aria-label="${title}">
      <button class="modal-close" type="button" data-policy-close aria-label="关闭">×</button>
      <span class="page-kicker">${title}</span>
      <h2>${title}</h2>
      <p>协议内容由系统自动生成，后续将根据正式业务规则更新文档细节。当前版本仅用于邀请码内测注册、账号登录、项目创建和必要服务通知。</p>
      <button class="btn primary block" type="button" data-policy-close>我已了解</button>
    </div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-policy-close]').forEach(btn=>btn.addEventListener('click',()=>modal.remove()));
    modal.addEventListener('click',e=>{if(e.target===modal) modal.remove()});
  }));

  function renderInvitePortal(){
    const host=document.getElementById('invite-portal-root');
    if(!host) return;
    const invites=readInvites();
    const total=invites.length;
    const active=invites.filter(item=>item.status==='启用').length;
    const used=invites.filter(item=>item.status==='已使用'||Number(item.used||0)>=1).length;
    host.innerHTML=`<section class="portal-hero">
      <div><span class="page-kicker">后台 Portal</span><h1>邀请码管理</h1><p>生成一次性邀请码，查看每个邀请码的启用、已使用、停用状态，并追踪使用人和使用时间。</p></div>
      <div class="portal-stats"><div><span>全部邀请码</span><b>${total}</b></div><div><span>可使用</span><b>${active}</b></div><div><span>已使用</span><b>${used}</b></div></div>
    </section>
    <section class="portal-grid">
      <form class="portal-card" id="invite-create-form">
        <h2>生成邀请码</h2>
        <label><span>用途备注</span><input id="invite-label" maxlength="30" placeholder="例如：渠道内测 / 客户试用"/></label>
        <label><span>说明</span><textarea id="invite-note" maxlength="120" placeholder="选填，便于后续追踪来源"></textarea></label>
        <button class="btn primary block" type="submit">生成一次性邀请码</button>
        <p>每个邀请码只能登录 / 注册一次，使用后自动变为“已使用”。</p>
      </form>
      <div class="portal-card wide">
        <div class="portal-card-head"><h2>邀请码状态</h2><button class="btn secondary small" type="button" data-invite-reset>重置演示数据</button></div>
        <div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>邀请码</th><th>用途</th><th>状态</th><th>使用人</th><th>使用时间</th><th>操作</th></tr></thead><tbody>
          ${invites.map(item=>`<tr>
            <td><button type="button" data-copy="${escapePortal(item.code)}">${escapePortal(item.code)}</button></td>
            <td><b>${escapePortal(item.label||'未命名')}</b><small>${escapePortal(item.note||'一次性邀请码')}</small></td>
            <td><span class="invite-status ${item.status==='启用'?'active':item.status==='已使用'?'used':'off'}">${escapePortal(item.status||'启用')}</span></td>
            <td>${escapePortal(item.lastUser||'-')}</td>
            <td>${escapePortal(item.lastUsedAt||'-')}</td>
            <td><button class="btn secondary small" type="button" data-invite-toggle="${escapePortal(item.code)}">${item.status==='启用'?'停用':'启用'}</button></td>
          </tr>`).join('')}
        </tbody></table></div>
      </div>
    </section>`;
  }
  function escapePortal(value){
    return String(value||'').replace(/[&<>"']/g,match=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[match]));
  }
  function generateInviteCode(){
    const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code='ES';
    for(let i=0;i<8;i+=1) code+=alphabet[Math.floor(Math.random()*alphabet.length)];
    return code;
  }
  if(document.getElementById('invite-portal-root')){
    renderInvitePortal();
    document.addEventListener('submit',event=>{
      if(event.target.id!=='invite-create-form') return;
      event.preventDefault();
      const invites=readInvites();
      let code=generateInviteCode();
      while(invites.some(item=>normalizeInvite(item.code)===code)) code=generateInviteCode();
      invites.unshift({code,label:document.getElementById('invite-label').value.trim()||'运营邀请码',status:'启用',maxUses:1,used:0,createdAt:new Date().toLocaleString('zh-CN',{hour12:false}),note:document.getElementById('invite-note').value.trim()||'后台生成的一次性邀请码',users:[],usageLog:[]});
      saveInvites(invites);
      toast('邀请码已生成',code);
      renderInvitePortal();
    });
    document.addEventListener('click',event=>{
      const toggle=event.target.closest('[data-invite-toggle]');
      if(toggle){
        const code=normalizeInvite(toggle.dataset.inviteToggle);
        const invites=readInvites();
        const invite=invites.find(item=>normalizeInvite(item.code)===code);
        if(invite&&Number(invite.used||0)<1) invite.status=invite.status==='启用'?'停用':'启用';
        saveInvites(invites);
        renderInvitePortal();
      }
      if(event.target.closest('[data-invite-reset]')){
        localStorage.removeItem(INVITE_KEY);
        renderInvitePortal();
      }
    });
  }

  const checkCards=[...document.querySelectorAll('.check-card')];
  checkCards.forEach((card,index)=>{
    card.setAttribute('role','checkbox'); card.setAttribute('tabindex','0');
    if(index<3){card.classList.add('selected');card.setAttribute('aria-checked','true')}
    const toggle=()=>{card.classList.toggle('selected');card.setAttribute('aria-checked',String(card.classList.contains('selected')));updateEstimate()};
    card.addEventListener('click',toggle);card.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();toggle()}});
  });
  function updateEstimate(){
    const count=document.querySelectorAll('.check-card.selected').length;
    const shots=26+count*4, credits=240+count*60, mins=10+count*2;
    const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val};
    set('estimate-shots',shots);set('estimate-credits',credits);set('estimate-time',mins+' 分钟');
  }
  document.querySelectorAll('[data-create-project]').forEach(button=>button.addEventListener('click',()=>{
    const state=read();
    const story=(document.getElementById('story-input')||{}).value||'未命名故事';
    const title=story.includes('重生')?'重生婚礼逆袭':'我的智能漫剧项目';
    const project={id:'项目-'+Date.now().toString().slice(-6),title,stage:'剧本解析',progress:18,platform:(document.getElementById('target-platform')||{}).value||'抖音 9:16',createdAt:new Date().toISOString()};
    state.projects=[project,...(state.projects||[])].slice(0,10);
    state.events.push({name:'project_created',meta:{projectId:project.id,title:project.title},path:'wizard.html',at:new Date().toISOString()});
    write(state);
  }));

  const projectHost=document.getElementById('journey-project-status');
  if(projectHost){
    const state=read(), project=(state.projects||[])[0];
    if(project){
      const displayProjectId=String(project.id||'').replace(/^PRJ-/,'项目-');
      projectHost.innerHTML=`<div class="journey-notice"><div><span class="mini-tag">刚刚创建 · ${displayProjectId}</span><h3>${project.title}</h3><p>项目已准备好。下一步进入引导式创作台，完成剧本方向、大纲审稿和项目档案。</p></div><a class="btn primary" href="creator-studio.html">继续制作</a></div>`;
      if(!state.events.some(e=>e.name==='job_queued'&&e.meta&&e.meta.projectId===project.id)){state.events.push({name:'job_queued',meta:{projectId:project.id,skill:'script_framework'},path:'creator-studio.html',at:new Date().toISOString()});write(state)}
    }
  }

  if(document.body.dataset.page==='launch-kit') track('launch_kit_viewed');
  if(document.body.dataset.page==='studio') track('studio_viewed');
  if(document.body.dataset.page==='account'){track('account_viewed');if(read().user) toast('欢迎回来，'+read().user.name,'试用积分与客户旅程状态已同步。')}
  if(document.getElementById('success-title')){
    const state=read();
    if(!state.events.some(e=>e.name==='purchase_completed')){state.events.push({name:'purchase_completed',meta:{plan:new URLSearchParams(location.search).get('plan')||'creator'},path:'payment-success.html',at:new Date().toISOString()});write(state)}
  }
})();

// Step 4: mark current navigation item for stakeholder review
(function(){
  const file=(location.pathname.split('/').pop()||'index.html');
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href=a.getAttribute('href');
    if(href===file){a.classList.add('is-active');a.setAttribute('aria-current','page');}
  });
})();

// Step 6: pricing and payment business-flow prototype logic
(function(){
  const plans={
    creator:{name:'创作者会员',category:'订阅会员',price:'¥29',cycle:'1 个月',discount:'首月体验',desc:'适合个人创作者和副业用户，持续试片、做模板和生成正片草稿。',benefits:[['会员权益','高清导出、去水印、基础商用授权'],['体验权益','每月基础创作额度'],['创作能力','剧本框架 技能、角色资产库、标准分镜、基础商用授权'],['到账位置','个人中心 / 当前套餐、钱包、订单、商用授权同步更新']]},
    pro:{name:'专业会员',category:'订阅会员',price:'¥99',cycle:'1 个月',discount:'含 2,000 积分',desc:'适合日更、系列化、批量生成和内容团队冷启动，包含高级技能和项目复盘。',benefits:[['会员权益','高清导出、去水印、基础商用授权'],['月度积分','每月赠送 2,000 积分'],['创作能力','剧本扩写、细拆分镜、批量生成、多版本草稿'],['到账位置','个人中心 / 当前套餐、钱包、订单、商用授权同步更新']]},
    team:{name:'团队会员',category:'团队会员',price:'¥299 起',cycle:'1 个月',discount:'团队活动价最高 6.72 折',desc:'适合工作室、内容机构、版权方小团队，多席位协作、共享积分和项目权限管理。',benefits:[['团队权益','5 个团队席位，支持成员权限'],['共享积分','共享 8,000 积分'],['项目能力','项目阶段、审核流、成本测算、订单发票'],['到账位置','个人中心 / 团队空间、订单发票和商用授权同步更新']]},
    credits:{name:'标准积分充值包',category:'积分充值包',price:'¥49',cycle:'长期有效',discount:'600 积分',desc:'适合在会员额度之外按需扩展生成，用于标准视频、批量重试和局部重绘。',benefits:[['积分到账','购买 600 积分，立即到账'],['使用范围','视频镜头、角色场景、批量生成和局部重绘'],['补偿规则','生成失败自动补偿或退回积分'],['到账位置','个人中心 / 我的钱包、消耗记录和订单发票同步更新']]},
    'credits-mini':{name:'小额积分包',category:'积分充值包',price:'¥9.9',cycle:'长期有效',discount:'100 积分',desc:'适合轻量试错，测试标题、封面、少量分镜或局部重绘。',benefits:[['积分到账','购买 100 积分，立即到账'],['使用范围','标题、封面、钩子 预览和少量分镜'],['补偿规则','生成失败自动补偿或退回积分'],['到账位置','个人中心 / 我的钱包和消耗记录同步更新']]},
    'credits-large':{name:'大额积分包',category:'积分充值包',price:'¥299',cycle:'长期有效',discount:'5,000 积分',desc:'适合批量视频、项目试制和多轮多版本测试。',benefits:[['积分到账','购买 5,000 积分，立即到账'],['使用范围','细拆分镜、视频生成、投放素材矩阵和批量重试'],['补偿规则','生成失败自动补偿或退回积分'],['到账位置','个人中心 / 我的钱包、消耗记录和订单发票同步更新']]},
    pilot:{name:'首集试制包',category:'项目包',price:'¥199 起',cycle:'按项目交付',discount:'含 1 集草稿',desc:'适合验证题材吸引力，包含 1 集草稿、角色初设、标准分镜和基础投放素材。',benefits:[['交付范围','1 集草稿、角色初设、标准分镜'],['投放素材','1 套标题、封面和 钩子'],['商业保障','订单、发票和基础商用授权记录'],['到账位置','个人中心 / 我的项目、订单发票和商用授权同步更新']]},
    series10:{name:'10集连载包',category:'项目包',price:'¥999 起',cycle:'按项目交付',discount:'含资产库和分镜',desc:'适合测试题材，包含资产库、分镜、视频和连载规划。',benefits:[['交付范围','10 集连载规划、角色资产、标准分镜'],['项目能力','系列大纲、角色档案和多版本草稿'],['协作能力','项目阶段、团队协作和进度管理'],['到账位置','个人中心 / 我的项目、订单发票和商用授权同步更新']]},
    project:{name:'项目服务',category:'项目包',price:'¥999 起',cycle:'按项目交付',discount:'含交付范围确认',desc:'适合内容机构、工作室、版权方和品牌方，按集数、素材数量和交付范围打包。',benefits:[['交付范围','试制包、连载包和品牌剧情包'],['协作能力','团队权限、项目空间、成本测算和进度管理'],['商业保障','合同、发票、商用授权书和合规材料包'],['到账位置','个人中心 / 我的项目、订单发票和商用授权同步更新']]},
    enterprise:{name:'企业版咨询',category:'企业版',price:'定制报价',cycle:'年度合同',discount:'客户成功顾问跟进',desc:'适合长期合作客户，提供多席位、接口对接、私有资产库、服务保障和专属客户成功支持。',benefits:[['部署方式','企业空间、私有资产库和权限管理'],['系统能力','接口对接、服务保障、数据安全和合规支持'],['服务模式','年度合同、专属客户成功和项目复盘'],['到账位置','个人中心 / 企业合作记录生成，客户成功团队后续跟进']]}
  };
  Object.entries(window.MD_PLAN_OVERRIDES||{}).forEach(([key,value])=>{
    plans[key]={...(plans[key]||{}),...value};
  });
  const params=new URLSearchParams(location.search);
  const current=params.get('plan')||'creator';
  const applyPlan=(key)=>{
    const p=plans[key]||plans.creator;
    const set=(id,val)=>{const el=document.getElementById(id); if(el) el.textContent=val;};
    set('checkout-plan-name',p.name); set('checkout-plan-desc',p.desc); set('checkout-plan-price',p.price);
    set('summary-plan-name',p.name); set('summary-cycle',p.cycle); set('summary-discount',p.discount);
    const benefits=document.getElementById('checkout-plan-benefits');
    if(benefits) benefits.innerHTML=p.benefits.map(([a,b])=>`<tr><td>${a}</td><td>${b}</td></tr>`).join('');
    const payNow=document.getElementById('pay-now');
    if(payNow){ payNow.href=`payment-success.html?plan=${key}`; payNow.dataset.plan=key; }
    const note=document.getElementById('checkout-flow-note');
    if(note) note.textContent= key==='enterprise'?'提交后会生成企业咨询记录，并同步到个人中心，便于后续合同、发票和部署范围确认。':'支付完成后，权益会同步到个人中心，包含会员状态、积分余额、订单发票、商用授权和项目权益。';
    document.querySelectorAll('[data-plan]').forEach(btn=>btn.classList.toggle('active',btn.dataset.plan===key));
  };
  if(document.getElementById('checkout-plan-name')) applyPlan(current);
  document.querySelectorAll('[data-plan-switch] [data-plan]').forEach(btn=>btn.addEventListener('click',()=>applyPlan(btn.dataset.plan)));
  document.querySelectorAll('[data-pay-methods] .pay-method').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-pay-methods] .pay-method').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
  }));
  document.querySelectorAll('#pay-now').forEach(btn=>btn.addEventListener('click',()=>{
    const plan=btn.dataset.plan||current;
    localStorage.setItem('md-last-purchase',JSON.stringify({plan,time:new Date().toLocaleString('zh-CN'),name:(plans[plan]||plans.creator).name,price:(plans[plan]||plans.creator).price}));
  }));
  const successTitle=document.getElementById('success-title');
  if(successTitle){
    const p=plans[current]||plans.creator;
    localStorage.setItem('md-last-purchase',JSON.stringify({plan:current,time:new Date().toLocaleString('zh-CN'),name:p.name,price:p.price}));
    successTitle.textContent=`${p.name}已确认`;
    const desc=document.getElementById('success-desc');
    if(desc) desc.textContent=current==='enterprise'?'企业咨询已提交，客户成功团队将联系你确认合同、发票、部署和服务范围。':'支付已完成，会员、积分、订单、发票和商用授权记录已同步到个人中心。';
    const b1=document.getElementById('success-benefit-1');
    if(b1) b1.textContent=current==='credits'?'积分余额已更新，可立即用于视频生成、角色场景和分镜细化。':current==='project'?'项目包权益已写入项目空间，可开始确认交付范围和下载授权记录。':current==='enterprise'?'企业合作需求已生成记录，可进入个人中心查看跟进状态。':'会员权益和每月积分已更新，可继续生成第一集。';
    const amount=document.getElementById('success-amount'); if(amount) amount.textContent=p.price;
    const order=document.getElementById('success-order'); if(order) order.textContent=`订单号 漫${Date.now().toString().slice(-8)}`;
  }
  const latest=document.getElementById('latest-purchase-alert');
  if(latest){
    try{
      const data=JSON.parse(localStorage.getItem('md-last-purchase')||'null');
      if(data){
        latest.classList.add('show');
        latest.querySelector('h3').textContent=`最新权益记录：${data.name}`;
        latest.querySelector('p').textContent=`${data.time} 已记录。当前阶段客户积分由后台分配管理。`;
      }
    }catch(e){}
  }
})();
