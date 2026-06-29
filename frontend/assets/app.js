(function(){
  const root=document.documentElement;
  root.setAttribute('data-theme','light');
  localStorage.removeItem('md-theme');
  document.querySelectorAll('[data-theme-toggle]').forEach(btn=>btn.remove());
  document.querySelectorAll('[data-tabs]').forEach(group=>{group.querySelectorAll('[data-target]').forEach(btn=>btn.addEventListener('click',()=>{group.querySelectorAll('[data-target]').forEach(b=>b.classList.remove('active'));group.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');const panel=group.querySelector(btn.dataset.target);if(panel)panel.classList.add('active');}));});
  document.querySelectorAll('[data-filter-group]').forEach(group=>{const target=group.dataset.target;group.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{group.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll(target).forEach(card=>{const cat=card.dataset.category||'';card.style.display=(f==='all'||cat.includes(f))?'':'none';});}));});
  document.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);btn.textContent='已复制';setTimeout(()=>btn.textContent='复制',1300)}catch(e){btn.textContent='复制失败'}}));
  document.querySelectorAll('.coupon-line button').forEach(btn=>btn.addEventListener('click',event=>{
    event.preventDefault();
    const input=btn.closest('.coupon-line')?.querySelector('input');
    const code=(input?.value||'').trim();
    btn.textContent=code?'已应用':'请输入优惠码';
    setTimeout(()=>{btn.textContent='使用'},1500);
  }));

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

// Connected demo: shared localStorage data layer for invite, user and point flows.
(function(){
  const KEYS={
    connected:'md-connected-state',
    invites:'md-invite-codes',
    users:'md-admin-users',
    points:'md-point-records',
    logs:'md-admin-logs',
    tasks:'md-admin-tasks',
    currentUser:'md-current-user'
  };
  const connectedInitial={user:null,credits:0,projects:[],events:[]};
  const escapeHtml=value=>String(value||'').replace(/[&<>"']/g,match=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[match]));
  const normalizeInvite=value=>String(value||'').trim().toUpperCase().replace(/\s+/g,'');
  const normalizeContact=value=>String(value||'').trim();
  const isContact=value=>/^1\d{10}$/.test(normalizeContact(value))||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeContact(value));
  const maskPhone=value=>/^1\d{10}$/.test(value)?value.slice(0,3)+'****'+value.slice(-4):value;
  const formatNumber=value=>Number(value||0).toLocaleString('zh-CN');
  const pad=value=>String(value).padStart(2,'0');
  const formatDateTime=(date=new Date())=>{
    const d=date instanceof Date?date:new Date(date);
    if(Number.isNaN(d.getTime())) return formatDateTime(new Date());
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  const dateInputValue=(days=30)=>{
    const d=new Date();
    d.setDate(d.getDate()+days);
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  };
  const inputDateToDateTime=value=>value?`${value} 23:59:59`:formatDateTime(new Date(Date.now()+30*86400000));
  const isExpired=value=>{
    if(!value) return false;
    const normalized=String(value).replace(/-/g,'/');
    const time=new Date(normalized).getTime();
    return !Number.isNaN(time)&&time<Date.now();
  };
  const readJson=(key,fallback)=>{
    try{
      const value=JSON.parse(localStorage.getItem(key)||'null');
      if(Array.isArray(fallback)) return Array.isArray(value)?value:fallback.map(item=>({...item}));
      return {...fallback,...(value&&typeof value==='object'?value:{})};
    }catch(e){
      return Array.isArray(fallback)?fallback.map(item=>({...item})):{...fallback};
    }
  };
  const writeJson=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const toast=(title,detail='')=>{
    const node=document.createElement('div');
    node.className='demo-toast';
    node.innerHTML=`<b>${escapeHtml(title)}</b>${detail?`<span>${escapeHtml(detail)}</span>`:''}`;
    document.body.appendChild(node);
    setTimeout(()=>node.remove(),2600);
  };

  const defaultInvites=[
    {code:'ESSTART2026',status:'未使用',createdAt:'2026-06-29 09:00:00',expiredAt:'2026-07-29 23:59:59',initialCredits:500,userType:'测试用户',note:'演示注册邀请码',usedByUserId:'',usedByName:'',usedByPhone:'',usedAt:''},
    {code:'ESALES2026',status:'已使用',createdAt:'2026-06-25 10:00:00',expiredAt:'2026-07-25 23:59:59',initialCredits:500,userType:'测试用户',note:'首批内测用户注册',usedByUserId:'U1001',usedByName:'漫剧创作者',usedByPhone:'13800138000',usedAt:'2026-06-25 10:18:00'},
    {code:'AIMANGA60',status:'未使用',createdAt:'2026-06-25 10:00:00',expiredAt:'2026-07-25 23:59:59',initialCredits:500,userType:'普通用户',note:'15秒分镜视频体验码',usedByUserId:'',usedByName:'',usedByPhone:'',usedAt:''},
    {code:'TEAMTEST',status:'已禁用',createdAt:'2026-06-25 10:00:00',expiredAt:'2026-07-25 23:59:59',initialCredits:800,userType:'企业用户',note:'内部团队验证',usedByUserId:'',usedByName:'',usedByPhone:'',usedAt:''}
  ];
  const defaultUsers=[
    {id:'U1001',name:'漫剧创作者',phone:'13800138000',email:'',userType:'测试用户',status:'正常',inviteCode:'ESALES2026',credits:1320,registeredAt:'2026-06-25 10:18:00',lastLoginAt:'2026-06-29 10:20:00'},
    {id:'U1002',name:'团队测试账号',phone:'13900132108',email:'',userType:'企业用户',status:'正常',inviteCode:'TEAMTEST',credits:860,registeredAt:'2026-06-26 11:05:00',lastLoginAt:'2026-06-28 16:10:00'},
    {id:'U1003',name:'渠道内测账号',phone:'13700006621',email:'',userType:'渠道用户',status:'待激活',inviteCode:'AIMANGA60',credits:240,registeredAt:'2026-06-27 09:30:00',lastLoginAt:''}
  ];
  const defaultTasks=[
    {id:'T-2401',user:'漫剧创作者',type:'分镜视频',project:'月台第九分钟',cost:48,status:'排队中',time:'刚刚'},
    {id:'T-2398',user:'团队测试账号',type:'角色场景道具',project:'星潮档案短片',cost:120,status:'已完成',time:'12 分钟前'},
    {id:'T-2395',user:'渠道内测账号',type:'剧本生成',project:'赤线追踪试制',cost:15,status:'失败返还',time:'1 小时前'}
  ];

  const normalizeInviteItem=(item,index=0)=>{
    const rawStatus=String(item.status||'未使用');
    let status=rawStatus;
    if(rawStatus==='启用') status='未使用';
    if(rawStatus==='停用') status='已禁用';
    if(Number(item.used||0)>=1||rawStatus==='已使用') status='已使用';
    const createdAt=item.createdAt||formatDateTime(new Date(Date.now()-index*86400000));
    const expiredAt=item.expiredAt||formatDateTime(new Date(Date.now()+30*86400000));
    if(status==='未使用'&&isExpired(expiredAt)) status='已过期';
    const usage=Array.isArray(item.usageLog)&&item.usageLog.length?item.usageLog[item.usageLog.length-1]:{};
    const creditMatch=String(item.note||'').match(/(\d+)\s*积分/);
    return {
      code:normalizeInvite(item.code)||`ES${String(100000+index)}`,
      status:['未使用','已使用','已过期','已禁用'].includes(status)?status:'未使用',
      createdAt,
      expiredAt,
      initialCredits:Number(item.initialCredits??item.credit??item.credits??(creditMatch&&creditMatch[1])??500),
      userType:item.userType||item.label||'测试用户',
      note:item.note||item.label||'内测邀请',
      usedByUserId:item.usedByUserId||'',
      usedByName:item.usedByName||'',
      usedByPhone:item.usedByPhone||item.lastUser||usage.phone||'',
      usedAt:item.usedAt||item.lastUsedAt||usage.usedAt||''
    };
  };
  const normalizeUserItem=(item,index=0)=>({
    id:item.id||`U${1001+index}`,
    name:item.name||'漫剧创作者',
    phone:normalizeContact(item.phone||item.mobile||''),
    email:item.email||'',
    userType:item.userType||'测试用户',
    status:['正常','禁用','待激活'].includes(item.status)?item.status:'正常',
    inviteCode:normalizeInvite(item.inviteCode||item.invite||''),
    credits:Number(item.credits||0),
    registeredAt:item.registeredAt||item.createdAt||formatDateTime(new Date(Date.now()-index*86400000)),
    lastLoginAt:item.lastLoginAt||''
  });
  const defaultPointRecords=users=>users.filter(user=>Number(user.credits||0)>0).map((user,index)=>({
    id:`P20260629${String(index+1).padStart(4,'0')}`,
    userId:user.id,
    userName:user.name,
    phone:user.phone||user.email,
    type:'注册赠送',
    source:'邀请码注册',
    change:Number(user.credits||0),
    before:0,
    after:Number(user.credits||0),
    operator:'system',
    reason:index===0?'初始演示积分':'初始演示积分',
    inviteCode:user.inviteCode||'',
    note:'',
    createdAt:user.registeredAt||formatDateTime()
  }));
  const readInvites=()=>readJson(KEYS.invites,defaultInvites).map(normalizeInviteItem);
  const saveInvites=invites=>writeJson(KEYS.invites,invites.map(normalizeInviteItem));
  const readUsers=()=>readJson(KEYS.users,defaultUsers).map(normalizeUserItem);
  const saveUsers=users=>{
    const normalized=users.map(normalizeUserItem);
    writeJson(KEYS.users,normalized);
    const current=readCurrentUser();
    if(current){
      const fresh=normalized.find(user=>user.id===current.id||normalizeContact(user.phone)===normalizeContact(current.phone));
      if(fresh) syncConnectedState(fresh);
    }
  };
  const readPointRecords=()=>{
    const users=readUsers();
    const fallback=defaultPointRecords(users);
    const records=readJson(KEYS.points,fallback);
    if(!Array.isArray(records)||!records.length){
      writeJson(KEYS.points,fallback);
      return fallback;
    }
    return records;
  };
  const savePointRecords=records=>writeJson(KEYS.points,records);
  const readAdminLogs=()=>readJson(KEYS.logs,[{time:formatDateTime(),operator:'system',action:'初始化演示数据',detail:'本地静态后台已准备好'}]);
  const saveAdminLogs=logs=>writeJson(KEYS.logs,logs);
  const readTasks=()=>readJson(KEYS.tasks,defaultTasks);
  const saveTasks=tasks=>writeJson(KEYS.tasks,tasks);
  const readConnected=()=>readJson(KEYS.connected,connectedInitial);
  const writeConnected=state=>writeJson(KEYS.connected,{...connectedInitial,...state});
  const read=readConnected;
  const write=writeConnected;
  const readCurrentUser=()=>{
    try{return JSON.parse(localStorage.getItem(KEYS.currentUser)||'null')}catch(e){return null}
  };
  const setCurrentUser=user=>{
    if(!user){localStorage.removeItem(KEYS.currentUser);return}
    localStorage.setItem(KEYS.currentUser,JSON.stringify({id:user.id,name:user.name,phone:user.phone,email:user.email||'',inviteCode:user.inviteCode||''}));
    syncConnectedState(user);
  };
  const findUserByPhone=phone=>readUsers().find(user=>normalizeContact(user.phone)===normalizeContact(phone)||normalizeContact(user.email)===normalizeContact(phone));
  const generateUserId=()=>{
    const users=readUsers();
    let id=`U${Date.now().toString().slice(-6)}`;
    while(users.some(user=>user.id===id)) id=`U${Math.floor(100000+Math.random()*900000)}`;
    return id;
  };
  const generatePointRecordId=()=>`P${Date.now()}${Math.floor(Math.random()*90+10)}`;
  const generateInviteCode=(prefix='ES')=>{
    const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const safePrefix=normalizeInvite(prefix||'ES').slice(0,6)||'ES';
    let code=safePrefix;
    for(let i=0;i<8;i+=1) code+=alphabet[Math.floor(Math.random()*alphabet.length)];
    return code;
  };
  const addAdminLog=(action,detail='',operator='admin')=>{
    const logs=readAdminLogs();
    logs.unshift({time:formatDateTime(),operator,action,detail});
    saveAdminLogs(logs.slice(0,120));
  };
  const addPointRecord=record=>{
    const records=readPointRecords();
    records.unshift({id:generatePointRecordId(),createdAt:formatDateTime(),operator:'admin',note:'',...record});
    savePointRecords(records.slice(0,500));
  };
  const syncConnectedState=userArg=>{
    const user=userArg||readCurrentUser();
    const users=readUsers();
    const fresh=user&&users.find(item=>item.id===user.id||normalizeContact(item.phone)===normalizeContact(user.phone));
    const state=readConnected();
    if(fresh){
      state.user={id:fresh.id,phone:fresh.phone,name:fresh.name,plan:'免费试用',inviteCode:fresh.inviteCode,status:fresh.status};
      state.credits=Number(fresh.credits||0);
    }else{
      state.user=null;
      state.credits=0;
    }
    writeConnected(state);
    return state;
  };
  const track=(name,meta={})=>{
    const state=readConnected();
    state.events=[...(state.events||[]),{name,meta,path:location.pathname.split('/').pop()||'index.html',at:new Date().toISOString()}].slice(-100);
    writeConnected(state);
  };
  const validateInviteForRegister=code=>{
    const invite=readInvites().find(item=>normalizeInvite(item.code)===normalizeInvite(code));
    if(!normalizeInvite(code)) return {ok:false,message:'请输入邀请码。'};
    if(!invite) return {ok:false,message:'邀请码不存在，请联系管理员获取新的邀请码。'};
    const status=normalizeInviteItem(invite).status;
    if(status==='已使用') return {ok:false,message:'该邀请码已被使用，请联系管理员获取新的邀请码。'};
    if(status==='已禁用') return {ok:false,message:'该邀请码已禁用，请联系管理员。'};
    if(status==='已过期') return {ok:false,message:'该邀请码已过期，请联系管理员获取新的邀请码。'};
    if(status!=='未使用') return {ok:false,message:'该邀请码当前不可用。'};
    return {ok:true,invite};
  };
  const registerUser=formData=>{
    const phone=normalizeContact(formData.phone);
    const name=String(formData.name||'').trim()||'漫剧创作者';
    if(!isContact(phone)) return {ok:false,message:'请输入有效手机号或邮箱。'};
    if(findUserByPhone(phone)) return {ok:false,message:'该账号已注册，请直接登录。'};
    const inviteResult=validateInviteForRegister(formData.inviteCode);
    if(!inviteResult.ok) return inviteResult;
    const now=formatDateTime();
    const invite=inviteResult.invite;
    const before=0;
    const credits=Number(invite.initialCredits||0);
    const user={id:generateUserId(),name,phone,email:/@/.test(phone)?phone:'',userType:invite.userType||'测试用户',status:'正常',inviteCode:invite.code,credits,registeredAt:now,lastLoginAt:now};
    const users=readUsers();
    users.unshift(user);
    writeJson(KEYS.users,users.map(normalizeUserItem));
    const invites=readInvites().map(item=>{
      if(normalizeInvite(item.code)!==normalizeInvite(invite.code)) return item;
      return {...item,status:'已使用',usedByUserId:user.id,usedByName:user.name,usedByPhone:user.phone||user.email,usedAt:now};
    });
    saveInvites(invites);
    if(credits>0){
      addPointRecord({userId:user.id,userName:user.name,phone:user.phone||user.email,type:'注册赠送',source:'邀请码注册',change:credits,before,after:credits,operator:'system',reason:'邀请码注册赠送',inviteCode:user.inviteCode,note:''});
    }
    addAdminLog('用户注册成功',`${user.name} 使用邀请码 ${user.inviteCode} 注册`, 'system');
    setCurrentUser(user);
    track('invite_register',{inviteCode:user.inviteCode,userId:user.id});
    return {ok:true,message:'注册成功，已发放初始积分。',user};
  };
  const loginUser=phone=>{
    if(!isContact(phone)) return {ok:false,message:'请输入有效手机号或邮箱。'};
    const users=readUsers();
    const index=users.findIndex(user=>normalizeContact(user.phone)===normalizeContact(phone)||normalizeContact(user.email)===normalizeContact(phone));
    if(index<0) return {ok:false,message:'账号不存在，请先使用邀请码注册。'};
    if(users[index].status==='禁用') return {ok:false,message:'账号已禁用，请联系管理员。'};
    users[index]={...users[index],lastLoginAt:formatDateTime()};
    saveUsers(users);
    setCurrentUser(users[index]);
    addAdminLog('用户登录',`${users[index].name} 登录前台`, 'system');
    track('user_login',{userId:users[index].id});
    return {ok:true,message:'登录成功。',user:users[index]};
  };
  const updateUserCredits=(userId,type,amount,reason,source,note='',operator='admin')=>{
    const users=readUsers();
    const index=users.findIndex(user=>user.id===userId);
    if(index<0) return {ok:false,message:'用户不存在。'};
    const delta=type==='扣减'?-Math.abs(Number(amount||0)):Math.abs(Number(amount||0));
    if(!Math.abs(delta)) return {ok:false,message:'请输入积分数量。'};
    const before=Number(users[index].credits||0);
    const after=before+delta;
    if(after<0) return {ok:false,message:'扣减积分不能超过当前积分。'};
    users[index]={...users[index],credits:after};
    saveUsers(users);
    addPointRecord({userId:users[index].id,userName:users[index].name,phone:users[index].phone||users[index].email,type:delta<0?'扣减':'增加',source,change:delta,before,after,operator,reason,inviteCode:users[index].inviteCode||'',note});
    return {ok:true,user:users[index],before,after,delta};
  };
  const updateUserStatus=(userId,status)=>{
    const users=readUsers();
    const index=users.findIndex(user=>user.id===userId);
    if(index<0) return {ok:false,message:'用户不存在。'};
    users[index]={...users[index],status};
    saveUsers(users);
    addAdminLog(status==='禁用'?'用户禁用':'用户启用',`${users[index].name} -> ${status}`);
    return {ok:true,user:users[index]};
  };
  const ensureData=()=>{
    saveInvites(readInvites());
    saveUsers(readUsers());
    if(!localStorage.getItem(KEYS.points)||!readPointRecords().length) savePointRecords(defaultPointRecords(readUsers()));
    if(!localStorage.getItem(KEYS.logs)) saveAdminLogs([{time:formatDateTime(),operator:'system',action:'初始化演示数据',detail:'本地静态后台已准备好'}]);
    if(!localStorage.getItem(KEYS.tasks)) saveTasks(defaultTasks);
    syncConnectedState();
  };

  window.AITVData={
    keys:KEYS,escapeHtml,normalizeInvite,normalizeContact,maskPhone,formatNumber,isContact,formatDateTime,dateInputValue,inputDateToDateTime,isExpired,
    readJson,writeJson,toast,readConnected,writeConnected,track,
    readInvites,saveInvites,validateInviteForRegister,generateInviteCode,
    readUsers,saveUsers,findUserByPhone,generateUserId,loginUser,registerUser,updateUserCredits,updateUserStatus,
    readPointRecords,savePointRecords,addPointRecord,generatePointRecordId,
    readAdminLogs,saveAdminLogs,addAdminLog,readTasks,saveTasks,readCurrentUser,setCurrentUser,syncConnectedState,ensureData
  };
  ensureData();

  track('page_view',{referrer:document.referrer||'direct'});
  document.querySelectorAll('a.btn').forEach(a=>a.addEventListener('click',()=>track('cta_click',{label:a.textContent.trim(),href:a.getAttribute('href')})));

  document.querySelectorAll('[data-auth-tab]').forEach(button=>button.addEventListener('click',()=>{
    const tab=button.dataset.authTab;
    document.querySelectorAll('[data-auth-tab]').forEach(item=>item.classList.toggle('active',item.dataset.authTab===tab));
    document.querySelectorAll('[data-auth-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.authPanel===tab));
    const message=document.getElementById('login-message');
    if(message) message.textContent='';
  }));
  const nextUrl=()=>{
    const next=new URLSearchParams(location.search).get('next');
    if(next==='studio'||next==='creator-studio'||next==='wizard') return 'creator-studio.html';
    return 'account.html';
  };
  document.querySelector('[data-login-submit]')?.addEventListener('click',event=>{
    event.preventDefault();
    const phone=document.getElementById('login-phone')?.value.trim()||'';
    const code=document.getElementById('login-code')?.value.trim()||'';
    const message=document.getElementById('login-message');
    if(!/^\d{4,8}$/.test(code)){if(message) message.textContent='请输入验证码或密码。';return}
    const result=loginUser(phone);
    if(!result.ok){if(message) message.textContent=result.message;return}
    toast('登录成功','已同步个人中心积分。');
    location.href=nextUrl();
  });
  document.querySelector('[data-register-submit]')?.addEventListener('click',event=>{
    event.preventDefault();
    const agreement=document.getElementById('register-agreement');
    const message=document.getElementById('login-message');
    if(agreement&&!agreement.checked){if(message) message.textContent='请先阅读并同意用户协议和隐私政策。';return}
    const code=document.getElementById('register-code')?.value.trim()||'';
    if(!/^\d{4,8}$/.test(code)){if(message) message.textContent='请输入验证码或密码。';return}
    const result=registerUser({
      phone:document.getElementById('register-phone')?.value.trim()||'',
      name:document.getElementById('register-name')?.value.trim()||'',
      code,
      inviteCode:document.getElementById('register-invite')?.value.trim()||''
    });
    if(!result.ok){if(message) message.textContent=result.message;return}
    toast('注册成功',`已发放 ${Number(result.user.credits||0)} 积分`);
    location.href=nextUrl();
  });

  function renderAccountPage(){
    if(document.body.dataset.page!=='account') return;
    const current=readCurrentUser();
    const fresh=current?readUsers().find(user=>user.id===current.id||normalizeContact(user.phone)===normalizeContact(current.phone)):null;
    const set=(selector,value)=>{const node=document.querySelector(selector);if(node) node.textContent=value;};
    const initial=name=>(name||'访').trim().slice(0,1).toUpperCase();
    if(!fresh){
      set('#account-name','未登录用户');
      set('#account-meta','请先登录或使用邀请码注册。');
      set('#account-avatar','访');
      set('#account-nav-avatar','访');
      set('#account-nav-credits','0');
      set('#account-credits','0');
      set('#account-wallet-note','登录后查看后台分配的积分余额。');
      const profile=document.getElementById('account-profile-grid');
      if(profile) profile.innerHTML=`<div><span>账号</span><b>未登录</b></div><div><span>状态</span><b>待登录</b></div><div><span>邀请码</span><b>-</b></div><div><span>最近登录</span><b>-</b></div>`;
      const records=document.getElementById('account-records');
      if(records) records.innerHTML=`<div class="account-simple-record-title">最近记录</div><div class="account-empty-state"><b>暂无积分记录</b><span>登录后将展示注册赠送、后台发放、扣减和失败返还记录。</span><a class="btn secondary small" href="login.html">去登录</a></div>`;
      return;
    }
    setCurrentUser(fresh);
    set('#account-name',fresh.name);
    set('#account-meta',`${fresh.userType||'内测用户'} · ${fresh.status} · ${maskPhone(fresh.phone||fresh.email)}`);
    set('#account-avatar',initial(fresh.name));
    set('#account-nav-avatar',initial(fresh.name));
    set('#account-nav-credits',formatNumber(fresh.credits));
    set('#account-credits',formatNumber(fresh.credits));
    set('#account-wallet-note',`来自邀请码 ${fresh.inviteCode||'-'}，积分由后台管理员统一分配。`);
    const profile=document.getElementById('account-profile-grid');
    if(profile) profile.innerHTML=[
      ['账号',fresh.phone||fresh.email||'-'],
      ['状态',fresh.status],
      ['邀请码',fresh.inviteCode||'-'],
      ['注册时间',fresh.registeredAt||'-'],
      ['最近登录',fresh.lastLoginAt||'-'],
      ['用户类型',fresh.userType||'-']
    ].map(([label,value])=>`<div><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`).join('');
    const userRecords=readPointRecords().filter(record=>record.userId===fresh.id||normalizeContact(record.phone)===normalizeContact(fresh.phone)).slice(0,12);
    const records=document.getElementById('account-records');
    if(records){
      records.innerHTML=`<div class="account-simple-record-title">最近记录</div>${(userRecords.length?userRecords:[{reason:'暂无积分记录',source:'后台还没有为该账号产生流水',change:0,createdAt:'-'}]).map((record,index)=>`<div class="account-simple-record ${index>2?'is-more':''}"><div><b>${escapeHtml(record.reason||record.type||record.source||'积分记录')}</b><span>${escapeHtml(record.source||record.note||record.createdAt||'')}</span></div><strong class="${Number(record.change||0)>=0?'pos':'neg'}">${Number(record.change||0)>0?'+':''}${formatNumber(record.change||0)}</strong></div>`).join('')}${userRecords.length>3?'<button class="account-more-btn" id="account-more-btn" type="button" aria-expanded="false" aria-controls="account-records"><span>查看更多</span><i>⌄</i></button>':''}`;
    }
  }
  renderAccountPage();

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

  if(document.getElementById('invite-portal-root')){
    const host=document.getElementById('invite-portal-root');
    host.innerHTML=`<section class="portal-hero"><div><span class="page-kicker">后台管理</span><h1>邀请码管理已合并</h1><p>请在统一后台中生成邀请码、查看使用状态并分配积分。</p></div><a class="btn primary" href="admin.html#invites">进入后台</a></section>`;
    setTimeout(()=>{location.href='admin.html#invites'},900);
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
    state.events.push({name:'project_created',meta:{projectId:project.id,title:project.title},path:'creator-studio.html',at:new Date().toISOString()});
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
