(function(){
  const body=document.body;
  const returnButton=document.getElementById('studio-return');
  if(returnButton){
    returnButton.addEventListener('click',()=>{
      if(window.history.length>1) window.history.back();
      else window.location.href='index.html';
    });
  }
  const modeButtons=[...document.querySelectorAll('[data-mode]')];
  const savedMode=localStorage.getItem('md-work-mode')||'basic';
  const modeContent={
    basic:['轻松创作模式','我会替你使用推荐设置，只在关键决策时询问你。'],
    medium:['进阶控制模式','你可以控制大纲、风格规律、版本和关键创作变量。'],
    high:['专业编排模式','你可以查看技能、模型路由、上下文与失败策略。']
  };
  function applyMode(mode){
    body.dataset.experience=mode;
    localStorage.setItem('md-work-mode',mode);
    modeButtons.forEach(button=>button.classList.toggle('active',button.dataset.mode===mode));
    document.getElementById('mode-title').textContent=modeContent[mode][0];
    document.getElementById('mode-copy').textContent=modeContent[mode][1];
  }
  modeButtons.forEach(button=>button.addEventListener('click',()=>applyMode(button.dataset.mode)));
  applyMode(savedMode);

  const steps=[
    {label:'剧本策划 · 核心信息 1/5',title:'你想做多长的作品？',desc:'先确定作品长度，我会自动匹配合适的大纲形式和制作成本。',cost:'0 积分',action:'生成 3 个方向 →',output:'3 个差异化创作方向',time:'约 20 秒',gate:'选择一个方向',guide:'先别急着写剧本',copy:'作品长度会影响大纲结构、镜头数量和视频成本。第一次尝试建议选择 1–3 分钟，先验证故事是否成立。',recommend:'1–3 分钟 · 风险最低',risks:['目标平台','目标受众','核心情绪'],choices:[['快速试想法','30 秒','适合广告、钩子测试'],['推荐新手','1–3 分钟','适合第一集试制'],['完整单集','10–30 分钟','适合系列内容'],['连续项目','多集系列','先规划前 3 集']]},
    {label:'剧本策划 · 发散方向 2/4',title:'选择一个值得继续的方向',desc:'智能助手已根据你的目标生成三种差异明显的方案。每张卡都会诚实说明风险。',cost:'30 积分',action:'比较两版大纲 →',output:'稳健版与大胆版大纲',time:'约 45 秒',gate:'选定或组合方向',guide:'不要只看最刺激的设定',copy:'好方向既要有记忆点，也要能在你的预算和时长内完成。建议先看风险，再看卖点。',recommend:'方向 2 · 差异与可制作性平衡',risks:['主角动机仍需加强','结尾钩子尚未确定'],choices:[['低风险','失踪的信号站','单场景悬疑，制作稳定'],['智能推荐','最后一班地铁','人物目标明确，视觉记忆强'],['高差异','城市在倒放','概念突出，制作难度较高']]},
    {label:'剧本策划 · 大纲对比 3/4',title:'两版大纲，你更相信哪一版？',desc:'共同信息已经对齐，差异部分被高亮。可以整版选择，也可以组合段落。',cost:'60 积分',action:'进入多视角审稿 →',output:'一版可锁定的剧本大纲',time:'约 1 分钟',gate:'确认结构与风险',guide:'大胆版不一定更好',copy:'稳健版更容易控制节奏与成本；大胆版记忆点更强，但需要更多场景和视觉资产。',recommend:'先用稳健结构，保留大胆版结尾',risks:['第二幕节奏偏平','反派行为逻辑需要补证'],choices:[['稳健版','单线追查','结构清楚 · 8 个场景'],['大胆版','双时间线倒叙','记忆点强 · 13 个场景'],['组合方案','稳健结构 + 大胆结尾','推荐 · 成本可控']]},
    {label:'剧本策划 · 审稿与锁定 4/4',title:'修完这些问题，就可以锁定剧本',desc:'四个顾问视角已完成检查。你可以逐条采纳建议，再生成项目档案。',cost:'20 积分',action:'锁定并生成项目档案 →',output:'项目档案 1.0 版',time:'约 30 秒',gate:'解决必改问题',guide:'锁定不等于不能修改',copy:'锁定会创建一个稳定版本供角色、场景和分镜技能使用。之后修改会生成新版本，不会覆盖旧稿。',recommend:'采纳 2 个必改项后锁定',risks:['必改：主角目标出现太晚','必改：平台开场节奏不足'],choices:[['编剧视角','主角目标提前到第 1 场','必改'],['制片视角','合并两个夜景外景','降低成本'],['平台视角','前 3 秒加入明确异常','必改']]}
  ];
  let current=Number(localStorage.getItem('md-work-step')||0);
  const next=document.getElementById('studio-next');
  const back=document.getElementById('studio-back');
  function render(){
    const step=steps[current];
    document.getElementById('micro-label').textContent=step.label;
    document.getElementById('task-title').textContent=step.title;
    document.getElementById('task-desc').textContent=step.desc;
    document.getElementById('studio-cost').textContent=step.cost;
    next.textContent=step.action;
    back.disabled=current===0;
    document.getElementById('output-name').textContent=step.output;
    document.getElementById('output-time').textContent=step.time;
    document.getElementById('output-gate').textContent=step.gate;
    document.getElementById('guide-title').textContent=step.guide;
    document.getElementById('guide-copy').textContent=step.copy;
    document.getElementById('guide-recommendation').textContent=step.recommend;
    document.getElementById('guide-risks').innerHTML=step.risks.map(item=>`<li>${item}</li>`).join('');
    document.getElementById('question-progress-bar').style.width=((current+1)/steps.length*100)+'%';
    document.getElementById('choice-grid').innerHTML=step.choices.map((choice,index)=>`<button class="choice-card ${index===1?'selected':''}" data-value="${choice[1]}"><span>${choice[0]}</span><b>${choice[1]}</b><small>${choice[2]}</small></button>`).join('');
    bindChoices();
    document.querySelector('.production-stages [data-stage="1"] small').textContent=`进行中 · ${current+1}/4`;
  }
  function bindChoices(){
    document.querySelectorAll('.choice-card').forEach(card=>card.addEventListener('click',()=>{
      document.querySelectorAll('.choice-card').forEach(item=>item.classList.remove('selected'));
      card.classList.add('selected');
    }));
  }
  next.addEventListener('click',()=>{
    if(current<steps.length-1){current+=1;localStorage.setItem('md-work-step',current);render();}
    else{next.textContent='项目档案已生成 ✓';next.disabled=true;document.querySelector('.production-stages [data-stage="1"] small').textContent='已锁定';document.querySelector('.production-stages [data-stage="1"]').classList.add('done');}
  });
  back.addEventListener('click',()=>{
    if(current>0){current-=1;localStorage.setItem('md-work-step',current);next.disabled=false;render();}
  });
  document.querySelectorAll('.production-stages button').forEach(button=>button.addEventListener('click',()=>{
    if(button.dataset.stage!=='1') document.querySelector('.ai-guide-panel').classList.add('stage-hint');
  }));
  render();
})();
