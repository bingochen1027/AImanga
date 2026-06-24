(function(){
  const STORAGE_KEY = 'md-easy-edits';
  const MODE_KEY = 'md-easy-edit-mode';
  const page = location.pathname.split('/').pop() || 'index.html';

  const cases = [
    '星潮档案','雾港来信','山海旧约','赤线追踪',
    '冰原回声','月台第九分钟','空城拾光','归墟电台'
  ];

  const registry = [
    item('home.hero.kicker','index.html','.home-eyebrow','html','首页：主视觉上方短句'),
    item('home.hero.title','index.html','.home-hero-copy h1','html','首页：主标题'),
    item('home.hero.subtitle','index.html','.home-hero-copy p','text','首页：主标题说明'),
    item('home.hero.ctaPrimary','index.html','.home-actions .btn.primary','html','首页：主按钮'),
    item('home.hero.ctaSecondary','index.html','.home-actions .btn.secondary','text','首页：次按钮'),
    item('home.works.title','index.html','.works-section .works-heading h2','text','首页：作品区标题'),
    item('home.works.subtitle','index.html','.works-section .works-heading p','text','首页：作品区说明'),
    item('home.process.title','index.html','.home-process .works-heading h2','text','首页：流程区标题'),
    item('home.process.step1.title','index.html','.simple-step:nth-child(1) h3','text','首页：流程步骤一标题'),
    item('home.process.step1.copy','index.html','.simple-step:nth-child(1) p','text','首页：流程步骤一说明'),
    item('home.process.step2.title','index.html','.simple-step:nth-child(2) h3','text','首页：流程步骤二标题'),
    item('home.process.step2.copy','index.html','.simple-step:nth-child(2) p','text','首页：流程步骤二说明'),
    item('home.process.step3.title','index.html','.simple-step:nth-child(3) h3','text','首页：流程步骤三标题'),
    item('home.process.step3.copy','index.html','.simple-step:nth-child(3) p','text','首页：流程步骤三说明'),
    item('home.final.title','index.html','.process-cta h2','text','首页：底部转化标题'),

    item('showcase.hero.title','showcase.html','.case-index-copy h1','html','案例中心：主标题'),
    item('showcase.hero.subtitle','showcase.html','.case-index-copy > p','text','案例中心：主说明'),
    item('showcase.final.title','showcase.html','.case-final-cta h2','html','案例中心：底部标题'),
    item('showcase.final.cta','showcase.html','.case-final-cta .btn.primary','text','案例中心：底部按钮'),

    item('pricing.hero.title','pricing.html','.section-head .copy h1','text','价格页：主标题'),
    item('pricing.hero.subtitle','pricing.html','.section-head .copy p','text','价格页：主说明'),
    item('pricing.hero.cta','pricing.html','.section-head > .btn.primary','text','价格页：顶部按钮'),
    item('pricing.creator.name','pricing.html','.neo-price-card:nth-child(2) h3','text','价格页：创作者会员名称'),
    item('pricing.creator.price','pricing.html','.neo-price-card:nth-child(2) .neo-price','html','价格页：创作者会员价格'),
    item('pricing.creator.copy','pricing.html','.neo-price-card:nth-child(2) p','text','价格页：创作者会员说明'),
    item('pricing.pro.name','pricing.html','.neo-price-card:nth-child(3) h3','text','价格页：专业会员名称'),
    item('pricing.pro.price','pricing.html','.neo-price-card:nth-child(3) .neo-price','html','价格页：专业会员价格'),
    item('pricing.team.name','pricing.html','.neo-price-card:nth-child(4) h3','text','价格页：团队会员名称'),
    item('pricing.team.price','pricing.html','.neo-price-card:nth-child(4) .neo-price','html','价格页：团队会员价格'),

    item('features.hero.title','features.html','.section-head .copy h1','text','产品功能：主标题'),
    item('features.hero.subtitle','features.html','.section-head .copy p','text','产品功能：主说明'),
    item('features.hero.cta','features.html','.section-head .btn.primary','text','产品功能：主按钮'),
    item('features.pipeline.1','features.html','.cn-pipeline-visual div:nth-of-type(1) span','text','产品功能：阶段一'),
    item('features.pipeline.2','features.html','.cn-pipeline-visual div:nth-of-type(2) span','text','产品功能：阶段二'),
    item('features.pipeline.3','features.html','.cn-pipeline-visual div:nth-of-type(3) span','text','产品功能：阶段三'),
    item('features.pipeline.4','features.html','.cn-pipeline-visual div:nth-of-type(4) span','text','产品功能：阶段四'),
    item('features.pipeline.5','features.html','.cn-pipeline-visual div:nth-of-type(5) span','text','产品功能：阶段五'),
    item('features.pipeline.6','features.html','.cn-pipeline-visual div:nth-of-type(6) span','text','产品功能：阶段六'),
    item('features.pipeline.7','features.html','.cn-pipeline-visual div:nth-of-type(7) span','text','产品功能：阶段七'),

    item('templates.hero.title','templates.html','.section-head .copy h1','text','模板中心：主标题'),
    item('templates.hero.subtitle','templates.html','.section-head .copy p','text','模板中心：主说明'),
    item('templates.hero.cta','templates.html','.section-head .btn.primary','text','模板中心：主按钮'),
    item('templates.hero.image','templates.html','.page-banner img','src','模板中心：横幅图片路径'),

    item('editor.hero.title','editor-guide.html','.hero-copy h1','text','创作说明：主标题'),
    item('editor.hero.subtitle','editor-guide.html','.hero-copy p','text','创作说明：主说明'),
    item('editor.hero.ctaPrimary','editor-guide.html','.hero-actions .btn.primary','text','创作说明：主按钮'),
    item('editor.hero.ctaSecondary','editor-guide.html','.hero-actions .btn.secondary','text','创作说明：次按钮'),

    item('login.hero.title','login.html','.login-art h1','text','登录页：左侧标题'),
    item('login.form.title','login.html','.login-card h2','text','登录页：表单标题'),
    item('login.form.primary','login.html','[data-demo-login]','text','登录页：主按钮'),

    item('wizard.hero.title','wizard.html','.app-head h1','text','向导页：主标题'),
    item('wizard.hero.subtitle','wizard.html','.app-head p','text','向导页：主说明'),
    item('wizard.story.default','wizard.html','#story-input','value','向导页：默认故事'),
    item('wizard.cta.primary','wizard.html','[data-create-project]','text','向导页：创建按钮'),

    item('account.hero.name','account.html','.account-identity h1','text','个人中心：用户名'),
    item('account.hero.plan','account.html','.account-identity p','text','个人中心：身份说明'),
    item('account.continue.title','account.html','.continue-copy h2','text','个人中心：继续项目标题'),
    item('account.continue.copy','account.html','.continue-copy > p','text','个人中心：继续项目说明')
  ];

  for(let n=1;n<=6;n++){
    registry.push({
      key:`template.${n}.title`,
      pages:['templates.html'],
      selectors:[`.template-card:nth-child(${n}) h3`],
      mode:'text',
      label:`模板 ${n}：标题`
    });
    registry.push({
      key:`template.${n}.description`,
      pages:['templates.html'],
      selectors:[`.template-card:nth-child(${n}) .template-body > p`],
      mode:'text',
      label:`模板 ${n}：说明`
    });
    registry.push({
      key:`template.${n}.image`,
      pages:['templates.html'],
      selectors:[`.template-card:nth-child(${n}) img`],
      mode:'src',
      label:`模板 ${n}：图片路径`
    });
  }

  cases.forEach((name,index)=>{
    const n = index + 1;
    registry.push({
      key:`case.${n}.title`,
      pages:['index.html','showcase.html'],
      selectors:[`.home-case-card:nth-child(${n}) h3`, `.demo-case-feature:nth-of-type(${n}) h2`],
      mode:'text',
      label:`案例 ${n}：标题`
    });
    registry.push({
      key:`case.${n}.category`,
      pages:['index.html','showcase.html'],
      selectors:[`.home-case-card:nth-child(${n}) .home-case-info > span`, `.demo-case-feature:nth-of-type(${n}) .case-type`],
      mode:'text',
      label:`案例 ${n}：分类/类型`
    });
    registry.push({
      key:`case.${n}.author`,
      pages:['index.html','showcase.html'],
      selectors:[`.home-case-card:nth-child(${n}) p`, `.demo-case-feature:nth-of-type(${n}) .case-author`],
      mode:'text',
      label:`案例 ${n}：作者`
    });
    registry.push({
      key:`case.${n}.description`,
      pages:['showcase.html'],
      selectors:[`.demo-case-feature:nth-of-type(${n}) .case-lead`],
      mode:'text',
      label:`案例 ${n}：案例说明`
    });
    registry.push({
      key:`case.${n}.image`,
      pages:['index.html','showcase.html'],
      selectors:[`.home-case-card:nth-child(${n}) img`, `.demo-case-feature:nth-of-type(${n}) img`],
      mode:'src',
      label:`案例 ${n}：图片路径`
    });
  });

  function item(key, pages, selector, mode, label){
    return {key, pages:[pages].flat(), selectors:[selector], mode, label};
  }

  function readJson(key){
    try { return JSON.parse(localStorage.getItem(key) || '{}') || {}; }
    catch(error) { return {}; }
  }

  function writeJson(key, value){
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalize(value, mode){
    if(value == null) return null;
    if(typeof value === 'object') return value;
    if(mode === 'html') return {html:String(value)};
    if(mode === 'src') return {src:String(value)};
    if(mode === 'href') return {href:String(value)};
    if(mode === 'value') return {value:String(value)};
    return {text:String(value)};
  }

  function applies(entry){
    return !entry.pages || entry.pages.includes(page);
  }

  function getElements(entry){
    return (entry.selectors || [entry.selector]).flatMap(selector => [...document.querySelectorAll(selector)]);
  }

  function currentValue(element, mode){
    if(mode === 'html') return element.innerHTML.trim();
    if(mode === 'src') return element.getAttribute('src') || '';
    if(mode === 'href') return element.getAttribute('href') || '';
    if(mode === 'value') return element.value || '';
    return element.textContent.trim();
  }

  function applyValue(element, entry, raw){
    const value = normalize(raw, entry.mode);
    if(!value) return;
    if(value.html != null) element.innerHTML = value.html;
    if(value.text != null) element.textContent = value.text;
    if(value.value != null) element.value = value.value;
    if(value.src != null) element.setAttribute('src', value.src);
    if(value.href != null) element.setAttribute('href', value.href);
    if(value.alt != null) element.setAttribute('alt', value.alt);
  }

  function allOverrides(){
    return {
      ...(window.MD_SITE_OVERRIDES || {}),
      ...readJson(STORAGE_KEY)
    };
  }

  function applyAll(){
    const overrides = allOverrides();
    registry.filter(applies).forEach(entry=>{
      if(!(entry.key in overrides)) return;
      getElements(entry).forEach(element=>applyValue(element, entry, overrides[entry.key]));
    });
  }

  function injectStyle(){
    if(document.getElementById('easy-edit-style')) return;
    const style = document.createElement('style');
    style.id = 'easy-edit-style';
    style.textContent = `
      [data-easy-edit-key]{outline:2px dashed rgba(37,99,235,.72);outline-offset:4px;cursor:pointer;position:relative}
      [data-easy-edit-key]:hover{outline-color:#f59e0b;background:rgba(245,158,11,.08)}
      .easy-edit-toolbar{position:fixed;z-index:9999;right:18px;bottom:18px;display:flex;gap:8px;flex-wrap:wrap;max-width:min(520px,calc(100vw - 36px));padding:12px;border:1px solid #dbe7ff;border-radius:18px;background:rgba(255,255,255,.96);box-shadow:0 18px 54px rgba(15,23,42,.18);backdrop-filter:blur(16px)}
      .easy-edit-toolbar b{width:100%;font-size:13px;color:#1e3a8a}
      .easy-edit-toolbar button,.easy-edit-toolbar a{border:1px solid #dbe7ff;border-radius:999px;background:#fff;color:#0f172a;padding:8px 11px;font:600 12px/1.1 -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;text-decoration:none;cursor:pointer}
      .easy-edit-toolbar .primary{background:#2563eb;color:#fff;border-color:#2563eb}
    `;
    document.head.appendChild(style);
  }

  function exportEdits(){
    const data = JSON.stringify(readJson(STORAGE_KEY), null, 2);
    if(navigator.clipboard){
      navigator.clipboard.writeText(data).then(()=>alert('已复制修改 JSON。可以把它交给我，或粘贴到 site-overrides.js。')).catch(()=>showExport(data));
    }else{
      showExport(data);
    }
  }

  function showExport(data){
    const area = document.createElement('textarea');
    area.value = data;
    area.style.cssText = 'position:fixed;z-index:10000;inset:20px;width:calc(100% - 40px);height:calc(100% - 40px);padding:20px;font:14px monospace;';
    document.body.appendChild(area);
    area.select();
  }

  function enableEditMode(){
    localStorage.setItem(MODE_KEY, '1');
    injectStyle();
    registry.filter(applies).forEach(entry=>{
      getElements(entry).forEach(element=>{
        element.dataset.easyEditKey = entry.key;
        element.title = `${entry.label}\n${entry.key}`;
        element.addEventListener('click', event=>{
          event.preventDefault();
          event.stopPropagation();
          const edits = readJson(STORAGE_KEY);
          const next = prompt(`${entry.label}\n键名：${entry.key}`, currentValue(element, entry.mode));
          if(next == null) return;
          edits[entry.key] = normalize(next, entry.mode);
          writeJson(STORAGE_KEY, edits);
          getElements(entry).forEach(target=>applyValue(target, entry, edits[entry.key]));
        }, {capture:true});
      });
    });

    const toolbar = document.createElement('div');
    toolbar.className = 'easy-edit-toolbar';
    toolbar.innerHTML = `
      <b>界面编辑模式：点击虚线区域即可临时修改</b>
      <button class="primary" type="button" data-action="export">导出修改</button>
      <button type="button" data-action="clear-page">清空本页修改</button>
      <button type="button" data-action="exit">退出编辑模式</button>
      <a href="界面修改说明.md" target="_blank">说明</a>
    `;
    toolbar.addEventListener('click', event=>{
      const action = event.target && event.target.dataset.action;
      if(!action) return;
      if(action === 'export') exportEdits();
      if(action === 'clear-page'){
        const edits = readJson(STORAGE_KEY);
        registry.filter(applies).forEach(entry=>delete edits[entry.key]);
        writeJson(STORAGE_KEY, edits);
        location.reload();
      }
      if(action === 'exit'){
        localStorage.removeItem(MODE_KEY);
        location.href = location.pathname;
      }
    });
    document.body.appendChild(toolbar);
  }

  function start(){
    applyAll();
    const params = new URLSearchParams(location.search);
    if(params.has('edit') || localStorage.getItem(MODE_KEY) === '1') enableEditMode();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
