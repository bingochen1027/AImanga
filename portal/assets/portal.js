const SAMPLE = {
  metrics:{visitors:1284,newUsers:126,projects:48,jobs:17,attention:2},
  yesterday:{visitors:1106,newUsers:98,projects:42,jobs:15},
  projects:[
    {title:'最后一班地铁',user:'138****6688',stage:'剧本策划',progress:36,status:'待确认'},
    {title:'末世便利店',user:'186****1024',stage:'视频生成',progress:72,status:'生成中'},
    {title:'国风修仙录',user:'139****2031',stage:'角色资产',progress:55,status:'需处理'}
  ],
  jobs:[
    {id:'任务-2401',project:'末世便利店',type:'视频生成',status:'生成中',cost:280},
    {id:'任务-2402',project:'最后一班地铁',type:'剧本大纲',status:'待确认',cost:60},
    {id:'任务-2403',project:'国风修仙录',type:'角色资产',status:'失败',cost:0},
    {id:'任务-2404',project:'古城来信',type:'内容审核',status:'待复核',cost:20}
  ]
};

const DEFAULT_USERS=[
  {id:'用户-1001',name:'漫剧创作者',phone:'138****8000',email:'creator@example.cn',role:'创作者',status:'启用',plan:'免费试用',credits:500,projects:1,createdAt:'2026-06-22 09:20',lastActive:'2026-06-22 14:36',source:'首页注册',inviteCode:'ESALES2026'},
  {id:'用户-1002',name:'林夏',phone:'138****6688',email:'linxia@example.cn',role:'创作者',status:'启用',plan:'创作者会员',credits:1320,projects:3,createdAt:'2026-06-18 11:05',lastActive:'2026-06-22 13:42',source:'案例中心',inviteCode:'AIMANGA60'},
  {id:'用户-1003',name:'内容工作室',phone:'186****1024',email:'studio@example.cn',role:'运营管理员',status:'启用',plan:'团队会员',credits:8000,projects:12,createdAt:'2026-06-10 16:40',lastActive:'2026-06-22 12:10',source:'企业咨询',inviteCode:'TEAMTEST'},
  {id:'用户-1004',name:'周宁',phone:'139****2031',email:'zhouning@example.cn',role:'只读运营',status:'启用',plan:'内部账号',credits:0,projects:0,createdAt:'2026-06-08 10:22',lastActive:'2026-06-22 10:18',source:'后台邀请',inviteCode:'TEAMTEST'},
  {id:'用户-1005',name:'测试账号',phone:'137****7732',email:'test@example.cn',role:'创作者',status:'禁用',plan:'免费试用',credits:0,projects:2,createdAt:'2026-06-02 08:31',lastActive:'2026-06-16 17:04',source:'模板中心',inviteCode:'已停用'},
  {id:'用户-0001',name:'系统管理员',phone:'136****0001',email:'admin@example.cn',role:'超级管理员',status:'启用',plan:'内部账号',credits:0,projects:0,createdAt:'2026-06-01 09:00',lastActive:'2026-06-22 14:40',source:'系统创建',inviteCode:'系统'}
];

const INVITE_KEY='md-invite-codes';
const DEFAULT_INVITES=[
  {code:'ESALES2026',label:'第一阶段内测码',status:'启用',maxUses:60,used:0,createdAt:'2026-06-25 10:00',note:'用于首批内测用户注册'},
  {code:'AIMANGA60',label:'15秒分镜视频体验码',status:'启用',maxUses:30,used:0,createdAt:'2026-06-25 10:00',note:'用于体验第一阶段分镜视频生成'},
  {code:'TEAMTEST',label:'团队测试码',status:'启用',maxUses:10,used:0,createdAt:'2026-06-25 10:00',note:'内部团队验证'}
];
const normalizeInvite=value=>String(value||'').trim().toUpperCase().replace(/\s+/g,'');

function readInvites(){
  let invites;
  try{invites=JSON.parse(localStorage.getItem(INVITE_KEY)||'null')}catch(error){invites=null}
  if(!Array.isArray(invites)||!invites.length){
    invites=DEFAULT_INVITES.map(invite=>({...invite}));
    saveInvites(invites);
  }
  let updated=false;
  invites.forEach(invite=>{
    if(normalizeInvite(invite.code)==='AIMANGA60'&&(/60秒|60 秒|短视频/.test(`${invite.label||''}${invite.note||''}`))){
      invite.label='15秒分镜视频体验码';
      invite.note='用于体验第一阶段分镜视频生成';
      updated=true;
    }
  });
  if(updated) saveInvites(invites);
  return invites;
}

function saveInvites(invites){localStorage.setItem(INVITE_KEY,JSON.stringify(invites))}

function renderInviteSummary(invites){
  const active=invites.filter(invite=>invite.status==='启用').length;
  const used=invites.reduce((sum,invite)=>sum+Number(invite.used||0),0);
  const quota=invites.reduce((sum,invite)=>sum+Number(invite.maxUses||0),0);
  document.getElementById('invite-summary').innerHTML=[
    ['启用邀请码',active],
    ['累计注册',used],
    ['总可用次数',quota||'不限']
  ].map(item=>`<div><small>${item[0]}</small><b>${item[1]}</b></div>`).join('');
}

function renderInvites(invites){
  renderInviteSummary(invites);
  document.getElementById('invite-rows').innerHTML=invites.map(invite=>{
    const disabled=invite.status!=='启用';
    return `<tr data-invite-code="${invite.code}"><td><b>${invite.code}</b></td><td>${invite.label||'未命名邀请码'}</td><td><span class="account-status ${disabled?'disabled':'enabled'}">${invite.status}</span></td><td>${Number(invite.used||0)} / ${Number(invite.maxUses||0)||'不限'}</td><td>${invite.lastUsedAt||'-'}</td><td>${invite.lastUser||'-'}</td><td>${invite.note||'-'}</td><td><button class="user-toggle ${disabled?'enable':'disable'}" data-invite-toggle="${invite.code}">${disabled?'启用':'停用'}</button><button class="table-action" data-invite-copy="${invite.code}">复制</button></td></tr>`;
  }).join('');
}

function readConnected(){
  const initial={user:null,credits:0,projects:[],events:[]};
  try{return {...initial,...JSON.parse(localStorage.getItem('md-connected-state')||'{}')}}catch(error){return initial}
}

function statusClass(status){
  return {'生成中':'Running','已完成':'Succeeded','失败':'Failed','需处理':'Failed','待复核':'Manual','待确认':'Manual'}[status]||'';
}

function compare(today,yesterday){
  if(!yesterday)return {text:'与昨天持平',className:'flat'};
  const rate=(today-yesterday)/yesterday*100;
  if(Math.abs(rate)<0.05)return {text:'与昨天持平',className:'flat'};
  return {text:`比昨天${rate>0?'增加':'减少'} ${Math.abs(rate).toFixed(1)}%`,className:rate>0?'up':'down'};
}

function readUsers(connected){
  let users;
  try{users=JSON.parse(localStorage.getItem('md-portal-users')||'null')}catch(error){users=null}
  if(!Array.isArray(users))users=DEFAULT_USERS.map(user=>({...user}));
  if(connected.user&&!users.some(user=>user.phone===connected.user.phone)){
    users.unshift({id:`用户-${Date.now().toString().slice(-4)}`,name:connected.user.name||'漫剧创作者',phone:connected.user.phone,email:'未填写',role:'创作者',status:'启用',plan:connected.user.plan||'免费试用',credits:connected.credits||0,projects:(connected.projects||[]).length,createdAt:new Date().toLocaleString('zh-CN',{hour12:false}),lastActive:new Date().toLocaleString('zh-CN',{hour12:false}),inviteCode:connected.user.inviteCode||'未记录',source:'邀请码注册'});
  }
  return users;
}

function saveUsers(users){localStorage.setItem('md-portal-users',JSON.stringify(users))}
function saveConnected(data){localStorage.setItem('md-connected-state',JSON.stringify(data))}
function syncConnectedCredits(user){
  const connected=readConnected();
  if(connected.user&&connected.user.phone===user.phone){
    connected.credits=Number(user.credits||0);
    saveConnected(connected);
  }
}

function renderUsers(users){
  const roles=['超级管理员','运营管理员','只读运营','创作者'];
  document.getElementById('user-rows').innerHTML=users.map(user=>`<tr data-user-id="${user.id}"><td>${user.id}</td><td><b>${user.name}</b></td><td>${user.phone}</td><td>${user.email}</td><td><select class="role-select" aria-label="${user.name}的角色">${roles.map(role=>`<option ${role===user.role?'selected':''}>${role}</option>`).join('')}</select></td><td><span class="account-status ${user.status==='启用'?'enabled':'disabled'}">${user.status}</span></td><td>${user.plan}</td><td><div class="credit-control"><input data-credit-input="${user.id}" inputmode="numeric" value="${Number(user.credits||0)}"/><button class="table-action" data-credit-save="${user.id}">保存</button></div></td><td>${user.projects}</td><td>${user.createdAt}</td><td>${user.lastActive}</td><td>${user.inviteCode||'未记录'}</td><td>${user.source}</td><td><button class="user-toggle ${user.status==='启用'?'disable':'enable'}" data-user-toggle="${user.id}">${user.status==='启用'?'禁用':'启用'}</button></td></tr>`).join('');
}

function xmlEscape(value){return String(value??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

function exportUsersExcel(users){
  const fields=[['用户编号','id'],['用户名称','name'],['手机号','phone'],['邮箱','email'],['用户角色','role'],['账号状态','status'],['当前方案','plan'],['可用积分','credits'],['项目数量','projects'],['注册时间','createdAt'],['最近活跃','lastActive'],['邀请码','inviteCode'],['来源渠道','source']];
  const row=values=>`<Row>${values.map(value=>`<Cell><Data ss:Type="${typeof value==='number'?'Number':'String'}">${xmlEscape(value)}</Data></Cell>`).join('')}</Row>`;
  const sheet=`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="Header"><Font ss:Bold="1"/><Interior ss:Color="#DCE6F5" ss:Pattern="Solid"/></Style></Styles><Worksheet ss:Name="全部用户"><Table><Row ss:StyleID="Header">${fields.map(field=>`<Cell><Data ss:Type="String">${field[0]}</Data></Cell>`).join('')}</Row>${users.map(user=>row(fields.map(field=>user[field[1]]))).join('')}</Table></Worksheet></Workbook>`;
  const blob=new Blob(['\ufeff',sheet],{type:'application/vnd.ms-excel;charset=utf-8'});
  const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=`全部用户_${new Date().toISOString().slice(0,10)}.xls`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}

function loadMvp(){
  const connected=readConnected();
  const metrics={...SAMPLE.metrics};
  if(connected.user) metrics.newUsers+=1;
  metrics.projects+=(connected.projects||[]).length;
  const queued=(connected.events||[]).filter(event=>event.name==='job_queued').length;
  const shortVideos=(connected.events||[]).filter(event=>event.name==='short_video_generated');

  const metricItems=[
    ['今日访问',metrics.visitors,SAMPLE.yesterday.visitors],
    ['新增用户',metrics.newUsers,SAMPLE.yesterday.newUsers],
    ['新建项目',metrics.projects,SAMPLE.yesterday.projects],
    ['生成任务',metrics.jobs+queued+shortVideos.length,SAMPLE.yesterday.jobs]
  ];
  document.getElementById('metrics').innerHTML=metricItems.map(item=>{const change=compare(item[1],item[2]);return `<div class="metric"><small>${item[0]}</small><strong>${item[1]}</strong><span class="metric-compare ${change.className}">${change.text}</span><em>昨天 ${item[2]}</em></div>`}).join('');
  document.getElementById('attention-count').textContent=`${metrics.attention+queued} 项`;

  const latest=(connected.projects||[])[0];
  document.getElementById('live-journey').innerHTML=latest
    ? `<div><h3>最新项目：${latest.title}</h3><p>${connected.user?connected.user.phone:'访客'} · ${latest.stage} · 已完成 ${latest.progress}%</p></div><span class="record-time">最新记录</span>`
    : '<div><h3>等待第一个真实项目</h3><p>用户从前台创建项目后，这里会自动显示最新状态。</p></div><span class="record-time">暂无记录</span>';

  const connectedRows=(connected.projects||[]).slice(0,2).map(project=>({
    title:project.title,user:connected.user?connected.user.phone:'访客',stage:project.stage,progress:project.progress,status:'进行中'
  }));
  const projects=[...connectedRows,...SAMPLE.projects].slice(0,5);
  document.getElementById('project-rows').innerHTML=projects.map(project=>`<tr><td><b>${project.title}</b></td><td>${project.user}</td><td>${project.stage}</td><td>${project.progress}%</td><td><span class="status-pill ${statusClass(project.status)}">${project.status}</span></td></tr>`).join('');

  const jobs=[...SAMPLE.jobs];
  if(queued) jobs.unshift({id:'任务-前台',project:latest?latest.title:'新项目',type:'剧本解析',status:'生成中',cost:60});
  shortVideos.slice(-3).reverse().forEach((event,index)=>{
    jobs.unshift({id:`分镜视频-${String(index+1).padStart(2,'0')}`,project:event.meta?.title||latest?.title||'第一条 15 秒分镜视频',type:'15秒分镜视频',status:'已完成',cost:event.meta?.cost||15});
  });
  document.getElementById('job-rows').innerHTML=jobs.map(job=>`<tr><td>${job.id}</td><td>${job.project}</td><td>${job.type}</td><td><span class="status-pill ${statusClass(job.status)}">${job.status}</span></td><td>${job.cost}</td></tr>`).join('');
  document.getElementById('running-total').textContent=jobs.filter(job=>job.status==='生成中').length;
  document.getElementById('failed-total').textContent=jobs.filter(job=>job.status==='失败').length;
  document.getElementById('review-total').textContent=jobs.filter(job=>job.status==='待复核').length;

  if(connected.user){
    document.getElementById('user-name').textContent=connected.user.name||'漫剧创作者';
    document.getElementById('user-contact').textContent=connected.user.phone||'已登录';
    document.getElementById('user-plan').textContent=connected.user.plan||'免费试用';
  }
  document.getElementById('user-credits').textContent=connected.credits||0;

  const labels={page_view:'页面访问',cta_click:'按钮点击',invite_login:'邀请码登录注册',trial_credits_granted:'注册并发放试用积分',project_created:'创建项目',job_queued:'创建生成任务',short_video_generated:'生成 15 秒分镜视频',launch_kit_viewed:'查看投放素材',purchase_completed:'完成购买',account_viewed:'进入个人中心',studio_viewed:'进入工作台'};
  const pages={'index.html':'首页','login.html':'登录注册','wizard.html':'项目向导','creator-studio.html':'引导创作台','studio.html':'创作工作台','launch-kit.html':'投放包','pricing.html':'价格','account.html':'个人中心'};
  const events=[...(connected.events||[])].reverse().slice(0,8);
  document.getElementById('activity-list').innerHTML=events.length
    ? events.map(event=>`<div class="activity-item"><b>${labels[event.name]||'数据记录'}</b><span>${pages[event.path]||'站内页面'}</span><time>${new Date(event.at).toLocaleString('zh-CN',{hour12:false})}</time></div>`).join('')
    : '<div class="empty-state">暂无真实记录。前台产生访问、注册或项目事件后会显示在这里。</div>';

  let users=readUsers(connected);
  renderUsers(users);
  let invites=readInvites();
  renderInvites(invites);
  document.getElementById('user-rows').addEventListener('click',event=>{
    const creditButton=event.target.closest('[data-credit-save]');
    if(creditButton){
      const user=users.find(item=>item.id===creditButton.dataset.creditSave);if(!user)return;
      const input=document.querySelector(`[data-credit-input="${creditButton.dataset.creditSave}"]`);
      const credits=Math.max(0,Math.floor(Number(input?.value||0)));
      user.credits=Number.isFinite(credits)?credits:0;
      saveUsers(users);
      syncConnectedCredits(user);
      renderUsers(users);
      return;
    }
    const button=event.target.closest('[data-user-toggle]');if(!button)return;
    const user=users.find(item=>item.id===button.dataset.userToggle);if(!user)return;
    user.status=user.status==='启用'?'禁用':'启用';saveUsers(users);renderUsers(users);
  });
  document.getElementById('user-rows').addEventListener('change',event=>{
    if(!event.target.classList.contains('role-select'))return;
    const row=event.target.closest('[data-user-id]');const user=users.find(item=>item.id===row.dataset.userId);if(!user)return;
    user.role=event.target.value;saveUsers(users);
  });
  document.getElementById('export-users').addEventListener('click',()=>exportUsersExcel(users));
  document.getElementById('create-invite').addEventListener('click',()=>{
    const message=document.getElementById('invite-message');
    const code=normalizeInvite(document.getElementById('invite-code').value);
    const quota=Number(document.getElementById('invite-quota').value||0);
    const note=document.getElementById('invite-note').value.trim();
    if(!/^[A-Z0-9_-]{4,24}$/.test(code)){
      message.textContent='请输入 4-24 位邀请码，可使用大写字母、数字、下划线或短横线。';
      return;
    }
    if(invites.some(invite=>normalizeInvite(invite.code)===code)){
      message.textContent='该邀请码已存在。';
      return;
    }
    invites.unshift({code,label:'运营新增邀请码',status:'启用',maxUses:quota>0?quota:20,used:0,createdAt:new Date().toLocaleString('zh-CN',{hour12:false}),note:note||'后台新增'});
    saveInvites(invites);
    renderInvites(invites);
    document.getElementById('invite-code').value='';
    document.getElementById('invite-note').value='';
    message.textContent=`邀请码 ${code} 已新增。`;
  });
  document.getElementById('invite-rows').addEventListener('click',event=>{
    const toggle=event.target.closest('[data-invite-toggle]');
    const copy=event.target.closest('[data-invite-copy]');
    if(toggle){
      const invite=invites.find(item=>item.code===toggle.dataset.inviteToggle);
      if(!invite)return;
      invite.status=invite.status==='启用'?'停用':'启用';
      saveInvites(invites);
      renderInvites(invites);
      return;
    }
    if(copy){
      navigator.clipboard?.writeText(copy.dataset.inviteCopy);
      document.getElementById('invite-message').textContent=`已复制邀请码 ${copy.dataset.inviteCopy}。`;
    }
  });
}

loadMvp();
