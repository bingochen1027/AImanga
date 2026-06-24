(function(){
  const root=document.documentElement;
  const saved=localStorage.getItem('md-theme'); if(saved) root.setAttribute('data-theme',saved);
  document.querySelectorAll('[data-theme-toggle]').forEach(btn=>btn.addEventListener('click',()=>{const next=root.getAttribute('data-theme')==='dark'?'light':'dark';root.setAttribute('data-theme',next);localStorage.setItem('md-theme',next);btn.textContent=next==='dark'?'☀️':'🌙';}));
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

// Keep the theme icon in sync with the saved page theme on first paint.
(function(){
  const dark=document.documentElement.getAttribute('data-theme')==='dark';
  document.querySelectorAll('[data-theme-toggle]').forEach(button=>button.textContent=dark?'☀️':'🌙');
})();

// Connected demo: persist a lightweight customer journey across all pages.
(function(){
  const KEY='md-connected-state';
  const initial={user:null,credits:0,projects:[],events:[]};
  const read=()=>{try{return {...initial,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch(e){return {...initial}}};
  const write=(state)=>localStorage.setItem(KEY,JSON.stringify(state));
  const track=(name,meta={})=>{const state=read();state.events=[...(state.events||[]),{name,meta,path:location.pathname.split('/').pop()||'index.html',at:new Date().toISOString()}].slice(-80);write(state)};
  const toast=(title,detail)=>{const node=document.createElement('div');node.className='demo-toast';node.innerHTML=`<b>${title}</b><span>${detail}</span>`;document.body.appendChild(node);setTimeout(()=>node.remove(),2800)};

  track('page_view',{referrer:document.referrer||'direct'});
  document.querySelectorAll('a.btn').forEach(a=>a.addEventListener('click',()=>track('cta_click',{label:a.textContent.trim(),href:a.getAttribute('href')})));

  const login=document.querySelector('[data-demo-login]');
  if(login&&new URLSearchParams(location.search).get('next')==='wizard') login.setAttribute('href','wizard.html');
  if(login) login.addEventListener('click',(event)=>{
    const phone=document.getElementById('login-phone').value.trim();
    const code=document.getElementById('login-code').value.trim();
    if(!/^1\d{10}$/.test(phone)||!/^\d{6}$/.test(code)){
      event.preventDefault();
      document.getElementById('login-message').textContent='请输入有效手机号和 6 位验证码。';
      return;
    }
    const state=read();
    state.user={id:'USR-DEMO-01',phone:phone.slice(0,3)+'****'+phone.slice(-4),name:'漫剧创作者',plan:'免费试用'};
    if(!state.events.some(x=>x.name==='trial_credits_granted')) state.credits=(state.credits||0)+500;
    state.events.push({name:'trial_credits_granted',meta:{credits:500},path:'login.html',at:new Date().toISOString()});
    write(state);
  });

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
      if(!state.events.some(e=>e.name==='job_queued'&&e.meta&&e.meta.projectId===project.id)){state.events.push({name:'job_queued',meta:{projectId:project.id,skill:'script_framework'},path:'studio.html',at:new Date().toISOString()});write(state)}
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
    creator:{name:'创作者会员',category:'订阅会员',price:'¥29',cycle:'1 个月',discount:'首月低门槛体验',desc:'适合个人创作者和副业用户，低成本持续试片、做模板和生成正片草稿。',benefits:[['会员权益','高清导出、去水印、基础商用授权'],['月度积分','每月赠送 500 积分'],['创作能力','剧本框架 技能、角色资产库、标准分镜、基础商用授权'],['到账位置','个人中心 / 当前套餐、钱包、订单、商用授权同步更新']]},
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
        latest.querySelector('h3').textContent=`最新购买：${data.name}`;
        latest.querySelector('p').textContent=`${data.time} 已确认，金额 ${data.price}。权益已同步到当前个人中心示例状态。`;
      }
    }catch(e){}
  }
})();
