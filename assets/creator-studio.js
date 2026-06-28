(function(){
  const STORAGE_KEY='md-nami-workbench';
  const CONNECTED_KEY='md-connected-state';
  const INVITE_KEY='md-invite-codes';
  const MAX_SCRIPT_LENGTH=10000;
  const VIDEO_CREDIT_COST=15;
  const DEFAULT_PROJECT_ID='1729382256911763547';
  const styleVisuals={
    '都市写实':{slug:'urban-realistic',tag:'城市夜景',target:'assets/images/video-styles/style-urban-realistic.jpg',hasImage:true},
    '古风写实':{slug:'ancient-realistic',tag:'古风庭院',target:'assets/images/video-styles/style-ancient-realistic.jpg',hasImage:true},
    '暗黑悬疑':{slug:'dark-suspense',tag:'雨夜线索',target:'assets/images/video-styles/style-dark-suspense.jpg',hasImage:true},
    '国漫现代（2d）':{slug:'modern-guoman-2d',tag:'现代国漫',target:'assets/images/video-styles/style-modern-guoman-2d.jpg',hasImage:true},
    '国漫古风（2d）':{slug:'ancient-guoman-2d',tag:'东方国漫',target:'assets/images/video-styles/style-ancient-guoman-2d.jpg',hasImage:true},
    '赛博朋克':{slug:'cyberpunk',tag:'霓虹未来',target:'assets/images/video-styles/style-cyberpunk.jpg',hasImage:true},
    '3D动漫':{slug:'3d-animation',tag:'3D 动画',target:'assets/images/video-styles/style-3d-animation.jpg',hasImage:true},
    '90年代写实':{slug:'nineties-realistic',tag:'胶片年代',target:'assets/images/video-styles/style-nineties-realistic.jpg',hasImage:true},
    '90年代漫画风':{slug:'nineties-comic',tag:'复古漫画',target:'assets/images/video-styles/style-nineties-comic.jpg',hasImage:true}
  };
  const presetStyleOptions=[
    {value:'都市写实',label:'都市写实',copy:'现代城市、情感、职场和悬疑题材的写实质感。'},
    {value:'古风写实',label:'古风写实',copy:'适合古装、权谋、仙侠和历史感内容。'},
    {value:'暗黑悬疑',label:'暗黑悬疑',copy:'低调光影和强反差，适合反转、惊悚和犯罪题材。'},
    {value:'国漫现代（2d）',label:'国漫现代（2d）',copy:'线条清晰，适合现代连载漫剧和爽文题材。'},
    {value:'国漫古风（2d）',label:'国漫古风（2d）',copy:'国漫线稿与古风服化道结合，适合东方幻想。'},
    {value:'赛博朋克',label:'赛博朋克',copy:'霓虹、高科技和未来都市视觉。'},
    {value:'3D动漫',label:'3D动漫',copy:'角色体积感更强，适合轻喜剧、冒险和儿童向内容。'},
    {value:'90年代写实',label:'90年代写实',copy:'胶片色彩和年代环境，适合怀旧剧情。'},
    {value:'90年代漫画风',label:'90年代漫画风',copy:'复古漫画质感，适合强情绪和风格化叙事。'}
  ];
  const videoModelOptions=[
    {provider:'DOUBAO',name:'Seedance 2.0',value:'neo-video-2-0',supportAudio:1,durationRange:{min:4,max:15,step:1},resolutions:['480p|480p','720p|720p (标清)','1080p|1080p (高清)','4k|4k'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','1:1|方形 (1:1)','21:9|21:9','3:4|3:4','4:3|4:3']},
    {provider:'DOUBAO',name:'Seedance 2.0 fast',value:'neo-video-2-0-fast',supportAudio:1,durationRange:{min:4,max:15,step:1},resolutions:['480p|480p','720p|720p (标清)'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','1:1|方形 (1:1)','3:4|3:4','4:3|4:3','21:9|21:9']},
    {provider:'DOUBAO',name:'Seedance 2.0 Mini',value:'doubao-seedance-2-0-mini-260615',supportAudio:1,durationRange:{min:4,max:15,step:1},resolutions:['480p|480p','720p|720p (标清)'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','1:1|方形 (1:1)','21:9|21:9','3:4|3:4','4:3|4:3']},
    {provider:'DOUBAO',name:'Seedance 1.0 Fast',value:'doubao-seedance-1-0-pro-fast-251015',supportAudio:0,durationRange:{min:3,max:10,step:1},resolutions:['720p|720p (标清)','1080p|1080p (高清)'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','1:1|方形 (1:1)','4:3|4:3','3:4|3:4','21:9|21:9','9:21|9:21','auto|按参考图尺寸']},
    {provider:'DOUBAO',name:'Seedance 1.5 Pro',value:'doubao-seedance-1-5-pro-251215',supportAudio:1,durationRange:{min:4,max:12,step:1},resolutions:['480p|480p','720p|720p (标清)','1080p|1080p (高清)'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','1:1|方形 (1:1)','3:4|3:4','4:3|4:3','21:9|21:9','9:21|9:21','auto|按参考图尺寸']},
    {provider:'DOUBAO',name:'Seedance 1.0 Pro',value:'doubao-seedance-1-0-pro-250528',supportAudio:0,durationRange:{min:2,max:10,step:1},resolutions:['720p|720p (标清)','1080p|1080p (高清)'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','1:1|方形 (1:1)','4:3|4:3','3:4|3:4','21:9|21:9','9:21|9:21','auto|按参考图尺寸']},
    {provider:'KLING',name:'Kling v3',value:'kling-v3',supportAudio:1,durationRange:{min:3,max:15,step:1},resolutions:['720p|720p (标清)','1080p|1080p (高清)','4K|4K (超高清)'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','1:1|方形 (1:1)','auto|按参考图尺寸']},
    {provider:'KLING',name:'Kling v2.6',value:'kling-v2-6',supportAudio:1,durationRange:{min:5,max:10,step:5},resolutions:['1080p|1080p (高清)'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','1:1|方形 (1:1)','auto|按参考图尺寸']},
    {provider:'KLING',name:'Kling v2.5',value:'kling-v2-5',supportAudio:0,durationRange:{min:5,max:10,step:5},resolutions:['720p|720p (标清)','1080p|1080p (高清)'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','1:1|方形 (1:1)','auto|按参考图尺寸']},
    {provider:'KLING',name:'Kling v2.1',value:'kling-v2-1',supportAudio:0,durationRange:{min:5,max:10,step:5},resolutions:['720p|720p (标清)','1080p|1080p (高清)'],aspectRatios:['auto|按参考图尺寸']},
    {provider:'VIDU',name:'Vidu Q3 pro',value:'vidu-q3-pro',supportAudio:1,durationRange:{min:5,max:16,step:1},resolutions:['720p|720p (标清)','1080p|1080p (高清)','2k|2k'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','3:4|3:4','4:3|4:3','1:1|方形 (1:1)','auto|按参考图尺寸']},
    {provider:'VIDU',name:'Vidu Q2 Pro',value:'vidu-q2-pro',supportAudio:0,durationRange:{min:5,max:8,step:3},resolutions:['720p|720p (标清)','1080p|1080p (高清)'],aspectRatios:['auto|按参考图尺寸']},
    {provider:'WAN',name:'Wan 2.7',value:'wan2.7',supportAudio:1,durationRange:{min:2,max:15,step:1},resolutions:['720P|720P','1080P|1080P'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','1:1|方形 (1:1)','4:3|4:3','3:4|3:4','auto|按参考图尺寸']},
    {provider:'MINIMAX',name:'Hailuo 2.3',value:'MiniMax-Hailuo-2.3',supportAudio:0,durationRange:{min:6,max:10,step:4},resolutions:['768p|768p (标清+)','1080p|1080p (高清)'],aspectRatios:['16:9|横屏 (16:9)','auto|按参考图尺寸']},
    {provider:'HAPPY HORSE',name:'HappyHorse 1.0',value:'happyhorse-1.0',supportAudio:0,durationRange:{min:3,max:15,step:1},resolutions:['720P|720P','1080P|1080P'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','1:1|方形 (1:1)','4:3|4:3','3:4|3:4','auto|按参考图尺寸']},
    {provider:'MINIMAX',name:'Hailuo 2.3 Fast',value:'MiniMax-Hailuo-2.3-Fast',supportAudio:0,durationRange:{min:6,max:10,step:4},resolutions:['768p|768p (标清+)','1080p|1080p (高清)'],aspectRatios:['16:9|横屏 (16:9)','auto|按参考图尺寸']},
    {provider:'MINIMAX',name:'Hailuo 02',value:'MiniMax-Hailuo-02',supportAudio:0,durationRange:{min:6,max:10,step:4},resolutions:['768p|768p (标清+)','1080p|1080p (高清)'],aspectRatios:['16:9|横屏 (16:9)','auto|按参考图尺寸']},
    {provider:'VEO',name:'Veo 3.1',value:'veo-3.1-generate-001',supportAudio:1,durationRange:{min:4,max:8,step:2},resolutions:['720p|720p (标清)','1080p|1080p (高清)','4K|4K (超高清)'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)']},
    {provider:'VEO',name:'Veo 3.1 Fast',value:'veo-3.1-fast-generate-001',supportAudio:1,durationRange:{min:4,max:8,step:2},resolutions:['720p|720p (标清)','1080p|1080p (高清)','4K|4K (超高清)'],aspectRatios:['16:9|横屏 (16:9)','9:16|竖屏 (9:16)','auto|按参考图尺寸']}
  ].map(item=>({
    ...item,
    resolutions:item.resolutions.map(optionString=>videoParseOption(optionString)),
    aspectRatios:item.aspectRatios.map(optionString=>videoParseOption(optionString))
  }));
  const videoModelProviders=['DOUBAO','KLING','VIDU','WAN','MINIMAX','HAPPY HORSE','VEO'];
  const assetStudioIcons={
    user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    scene:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 14l5-4 4 3 3-2 6 5"/><circle cx="8" cy="9" r="1.4"/></svg>',
    prop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/></svg>',
    spark:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.6 6.6L21 9l-5 4.4L17.5 21 12 17l-5.5 4L8 13.4 3 9l6.4-.4z"/></svg>',
    mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    del:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg>',
    refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>',
    add:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  const assetStudioData={
    role:{label:'角色',icon:assetStudioIcons.user,views:['正面','侧面','背面','表情'],viewLabel:'人物四视图',
      items:[
        {id:'r1',name:'李明',kind:'主角',main:true,defaultState:'done',voice:'男性-青年-真诚青年',desc:'28 岁程序员，长期加班导致疲惫不堪，面临工作与家庭的抉择，最终选择回家。',attrs:['身份关系','年龄气质','发型服装','表情动作']},
        {id:'r2',name:'王总',kind:'反派 / 上司',main:true,defaultState:'empty',voice:'',desc:'40 岁公司高层，精明强干，对下属严格，追求项目成功，不惜让员工年关加班。',attrs:['身份关系','年龄气质','发型服装','表情动作']},
        {id:'r3',name:'加班同事',kind:'配角',main:false,defaultState:'empty',voice:'',desc:'几位同样深夜加班的同事，长期高压工作导致精神麻木，对现状习以为常。',attrs:['身份关系','发型服装']}
      ]},
    scene:{label:'场景',icon:assetStudioIcons.scene,views:['全景','近景','夜景','细节'],viewLabel:'场景多视图',
      items:[
        {id:'s1',name:'高铁站台',kind:'外景 · 夜',main:true,defaultState:'empty',desc:'核心场景：雨夜的高铁站台，冷色灯光，人流稀疏。倒计时危机的起点。',attrs:['空间结构','时代地点','光线天气','镜头质感']},
        {id:'s2',name:'公司机房',kind:'内景 · 冷光',main:true,defaultState:'empty',desc:'核心场景：深夜机房，蓝白冷光，成排服务器。李明远程修复漏洞的战场。',attrs:['空间结构','光线天气','镜头质感']},
        {id:'s3',name:'出租屋',kind:'内景 · 暖',main:false,defaultState:'empty',desc:'回忆 / 旁白场景：温暖的出租屋，与冷峻的机房形成情绪对照。',attrs:['空间结构','光线天气']}
      ]},
    prop:{label:'道具',icon:assetStudioIcons.prop,views:['正面','侧面','细节','使用状态'],viewLabel:'道具多视图',
      items:[
        {id:'p1',name:'笔记本电脑',kind:'关键道具',main:true,defaultState:'empty',desc:'核心道具：李明远程修复漏洞的工具，需要清晰轮廓与屏幕反光质感。',attrs:['外形材质','尺寸比例','关键纹理','剧情用途']},
        {id:'p2',name:'旧照片',kind:'情感道具',main:false,defaultState:'empty',desc:'承载家庭记忆的旧照片，特写时需材质细节与岁月痕迹。',attrs:['外形材质','关键纹理','剧情用途']}
      ]}
  };
  const assetVoiceOptions={
    Recent:[['男性-青年-真诚青年','Male','中文(普通话)'],['男性-中年-魅力老成','Male','中文'],['女性-少年-温暖少女','Female','中文(普通话)'],['女性-成年-阅历姐姐','Female','中文(普通话)']],
    Male:[['男性-青年-真诚青年','Male','中文(普通话)'],['男性-中年-沉稳上司','Male','中文'],['男性-中年-值得信赖的人','Male','中文'],['男性-青年-热血少年','Male','中文(普通话)']],
    Female:[['女性-少年-温暖少女','Female','中文(普通话)'],['女性-成年-阅历姐姐','Female','中文(普通话)'],['女性-青年-清冷御姐','Female','中文']],
    'My Custom':[['我的音色 · 旁白','Custom','中文(普通话)']]
  };
  const defaultAssetItemStates={r1:'done',r2:'empty',r3:'empty',s1:'empty',s2:'empty',s3:'empty',p1:'empty',p2:'empty'};
  const defaultAssetVoices={r1:'男性-青年-真诚青年'};
  const storyboardIcons={
    film:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 4v5M17 4v5"/></svg>',
    img:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>',
    spark:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.6 6.6L21 9l-5 4.4L17.5 21 12 17l-5.5 4L8 13.4 3 9l6.4-.4z"/></svg>',
    mic:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
    play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    del:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
    refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>',
    expand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
    add:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l5 5 9-11"/></svg>',
    scene:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 14l5-4 4 3 3-2 6 5"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>'
  };
  const defaultInvites=[
    {code:'ESALES2026',label:'第一阶段内测码',status:'启用',maxUses:1,used:0,createdAt:'2026-06-25 10:00',note:'一次性邀请码，用于首批内测用户注册',usageLog:[]},
    {code:'AIMANGA60',label:'15秒分镜视频体验码',status:'启用',maxUses:1,used:0,createdAt:'2026-06-25 10:00',note:'一次性邀请码，用于体验第一阶段分镜视频生成',usageLog:[]},
    {code:'TEAMTEST',label:'团队测试码',status:'启用',maxUses:1,used:0,createdAt:'2026-06-25 10:00',note:'一次性邀请码，用于内部团队验证',usageLog:[]}
  ];
  const body=document.body;
  const state=loadState();
  const initialParams=new URLSearchParams(location.search);
  const currentProjectId=initialParams.get('id')||DEFAULT_PROJECT_ID;
  let currentView=new URLSearchParams(location.search).get('menuKey')==='assets'?'assets':'creator';
  const els={
    back:document.getElementById('studio-back'),
    next:document.getElementById('studio-next'),
    panel:document.getElementById('guided-task'),
    micro:document.getElementById('micro-label'),
    title:document.getElementById('task-title'),
    desc:document.getElementById('task-desc'),
    stageProgress:document.getElementById('stage-progress'),
    railPercent:document.getElementById('rail-percent'),
    railProgress:document.getElementById('rail-progress'),
    outputName:document.getElementById('output-name'),
    outputStatus:document.getElementById('output-time'),
    outputNext:document.getElementById('output-gate'),
    guideTitle:document.getElementById('guide-title'),
    guideCopy:document.getElementById('guide-copy'),
    guideAction:document.getElementById('guide-recommendation'),
    guideRules:document.getElementById('guide-risks'),
    previewImage:document.getElementById('preview-image'),
    previewTitle:document.getElementById('preview-title'),
    previewCopy:document.getElementById('preview-copy'),
    previewList:document.getElementById('preview-list'),
    saveState:document.getElementById('save-state'),
    loginModal:document.getElementById('nami-login-modal')
  };
  const stages=[
    {
      name:'剧本编辑',
      next:'视频设定',
      title:'剧本编辑',
      desc:'粘贴或上传剧本内容。当前版本建议上传单集，生成效果更佳。',
      guideTitle:'请先准备剧本内容',
      guideCopy:'点击下一步时会先校验剧本内容。没有内容时只提示“请输入内容”，不会进入视频设定。',
      action:'粘贴剧本或输入想法',
      status:()=>state.script.trim()?'剧本内容已填写':'待输入内容',
      rules:['剧本内容不能为空','AI 创作需要先输入想法','AI 生成后可继续修改'],
      preview:['剧本输入','AI 帮写','故事可视化'],
      image:'assets/images/story-cases/case-platform-nine.png'
    },
    {
      name:'视频设定',
      next:'场景角色道具',
      title:'视频设定',
      desc:'确认单条分镜视频的画面比例、视觉风格、镜头密度和输出策略，后续阶段会沿用这些设定。',
      guideTitle:'先确定视频基础参数',
      guideCopy:'第一阶段单条分镜视频上限为 15 秒，可选择竖屏 9:16 或横屏 16:9，并选择都市写实、古风写实、赛博朋克等画面风格。',
      action:'确认视频参数',
      status:()=>state.videoConfirmed?`15 秒上限 · ${state.videoRatio} · ${currentVideoStyleLabel()}`:'待确认视频参数',
      rules:['单条分镜视频上限 15 秒','支持 9:16 / 16:9','支持指定视频风格'],
      preview:['15 秒上限','画面比例','视频风格'],
      image:'assets/images/story-cases/case-xingchao-archive.png'
    },
    {
      name:'场景角色道具',
      next:'分镜脚本',
      title:'场景角色道具',
      desc:'根据剧本和视频设定整理角色、场景、道具，确认后进入分镜脚本。',
      guideTitle:'确认资产清单',
      guideCopy:'这一阶段要保证主角、关键场景和核心道具都已列入，否则后续分镜会缺资产。',
      action:'确认角色、场景和道具',
      status:()=>{
        const counts=assetOverallCounts();
        return counts.remaining===0?'全部资产已确认':`待确认资产 ${counts.remaining} 项`;
      },
      rules:['可修改提示词','可重新生成资产','人物资产提供四视图'],
      preview:['角色','场景','道具'],
      image:'assets/images/story-cases/case-fog-harbor-letter.png'
    },
    {
      name:'分镜脚本',
      next:'生成成片',
      title:'分镜脚本',
      desc:'把剧本拆成可生成视频的镜头卡片，确认镜头顺序、画面描述和台词。',
      guideTitle:'检查分镜是否可生成',
      guideCopy:'进入分镜视频之前，需要至少有 3 条分镜。系统会根据剧本自动生成一版示例分镜。',
      action:'确认分镜脚本',
      status:()=>{
        ensureStoryboards();
        const counts=storyboardCounts();
        return counts.confirmed===counts.total?'全部分镜已确认':`已生成 ${counts.generated}/${counts.total} · 已确认 ${counts.confirmed}`;
      },
      rules:['至少 3 条分镜','每条包含画面描述','可返回前一步调整资产'],
      preview:['镜头序号','画面描述','台词旁白'],
      image:'assets/images/story-cases/case-shanhai-oath.png'
    },
    {
      name:'分镜视频',
      next:'',
      title:'分镜视频',
      desc:'逐镜预览画面，调整时长、配音与字幕，确认后生成第一集样片。',
      guideTitle:'视频生成与预览',
      guideCopy:'这一阶段只保留必要控制：预览当前镜头、检查配音字幕、确认视频模型和视频设置，然后生成整片样片。',
      action:'确认生成整片',
      status:()=>state.videoGenerated?'第一集样片已生成':'待生成第一集样片',
      rules:['预览当前镜头','检查配音和字幕','确认后生成整片'],
      preview:['镜头预览','生成设置','导出成片'],
      image:'assets/images/story-cases/case-redline-chase.png'
    }
  ];
  const scriptModelOptions=[
    {value:'Deepseek',label:'Deepseek',copy:'默认模型，适合中文短剧和分镜剧本'},
    {value:'通义千问',label:'通义千问',copy:'适合中文叙事和稳定改写'},
    {value:'Kimi',label:'Kimi',copy:'适合长文本理解和剧本整理'},
    {value:'豆包',label:'豆包',copy:'适合轻量创意和口语化表达'},
    {value:'GPT-4o',label:'GPT-4o',copy:'适合复杂结构和多风格改写'}
  ];
  const assetViewState={folderId:'root',previewId:null,dialog:null};
  const assetSessionMedia={};
  let assetVoiceTarget=null;
  let assetVoiceTab='Recent';
  let pendingAssetVoice=null;
  let storyboardModal=null;
  let storyboardDurationDraft='';
  const assetFolderInfo={
    root:{name:'资产管理',parent:null},
    material:{name:'素材库',parent:'root'},
    scene:{name:'场景资产',parent:'material',upload:'上传场景图',category:'场景资产'},
    role:{name:'人物资产',parent:'material',upload:'上传人物图',category:'人物资产'},
    prop:{name:'道具资产',parent:'material',upload:'上传道具图',category:'道具资产'},
    voice:{name:'配音资产',parent:'material',category:'配音资产'},
    sound:{name:'音效资产',parent:'material',category:'音效资产'},
    voiceYouth:{name:'青年',parent:'voice',category:'配音资产'},
    voiceMiddle:{name:'中年',parent:'voice',category:'配音资产'},
    voiceTeen:{name:'少年',parent:'voice',category:'配音资产'},
    voiceSenior:{name:'老年',parent:'voice',category:'配音资产'},
    voiceChild:{name:'儿童',parent:'voice',category:'配音资产'},
    sfxEvent:{name:'事件音效',parent:'sound',category:'音效库'},
    sfxPerson:{name:'人物音效',parent:'sound',category:'音效库'},
    sfxAnimal:{name:'动物音效',parent:'sound',category:'音效库'},
    sfxBattle:{name:'战斗音效',parent:'sound',category:'音效库'},
    sfxWeapon:{name:'武器音效',parent:'sound',category:'音效库'},
    sfxMood:{name:'氛围音效',parent:'sound',category:'音效库'},
    sfxEnv:{name:'环境音效',parent:'sound',category:'音效库'},
    sfxImpact:{name:'碰撞爆炸音效',parent:'sound',category:'音效库'},
    myWorks:{name:'我的作品',parent:'root'},
    workLinyue:{name:'林玥用倒计时告别三年感情，以“123”密码开启新生活',parent:'myWorks'},
    workUntitledA:{name:'未命名视频',parent:'myWorks'},
    workUntitledB:{name:'未命名视频',parent:'myWorks'},
    workUntitledC:{name:'未命名视频',parent:'myWorks'},
    workUntitledD:{name:'未命名视频',parent:'myWorks'},
    workStartup:{name:'刚毕业创业的最大优势：一无所有所以敢全力投入',parent:'myWorks'}
  };
  const assetMaterialFolders=[
    ['scene','场景资产','2026/06/19 01:47','19项'],
    ['role','人物资产','2026/06/19 01:47','17项'],
    ['prop','道具资产','2026/06/19 01:47','17项'],
    ['voice','配音资产','2026/06/19 01:47','0项'],
    ['sound','音效资产','2026/06/19 01:47','0项']
  ];
  const assetWorkFolders=[
    ['workLinyue','林玥用倒计时告别三年感情，以“123”密码开启新生活','2026/06/24 00:06','13项'],
    ['workUntitledA','未命名视频','2026/06/23 23:21','13项'],
    ['workUntitledB','未命名视频','2026/06/23 22:56','13项'],
    ['workUntitledC','未命名视频','2026/06/19 23:48','13项'],
    ['workUntitledD','未命名视频','2026/06/19 02:07','13项'],
    ['workStartup','刚毕业创业的最大优势：一无所有所以敢全力投入','2026/06/19 01:45','13项']
  ];
  const assetMediaRows={
    scene:[
      ['古代街道_无人_有酒家 _石板路.png','2025/11/07 19:00','https://qcdn2.zhaomi.cn/dr/200_200_/t11de4588168e6c51adc31c62aa.webp'],
      ['仙山景城_有楼房.png','2025/11/07 19:00','https://qcdn5.zhaomi.cn/dr/200_200_/t11de45881653044d83723083a9.webp'],
      ['床_室内设计_现代卧室 _夜晚.png','2025/11/07 19:00','https://qcdn4.zhaomi.cn/dr/200_200_/t11de458816abba6660d40ca8c2.webp'],
      ['家_全景图_写实风格_ 动漫插图风格.png','2025/11/07 19:00','https://qcdn2.zhaomi.cn/dr/200_200_/t11de458816a8022444cf2b14e4.webp'],
      ['粉色卧室_动漫风格.pn g','2025/11/07 19:00','https://qcdn2.zhaomi.cn/dr/200_200_/t11de458816ec8838af062f7f2d.webp'],
      ['古代街道场景.png','2025/11/07 19:00','https://qcdn4.zhaomi.cn/dr/200_200_/t11de458816678927b3b0422146.webp'],
      ['卧室_床位有月亮面.pn g','2025/11/07 19:00','https://qcdn5.zhaomi.cn/dr/200_200_/t11de4588165a7781a09e55fdca.webp'],
      ['古代客房_木质窗棂敞 开_远处山...圆月.png','2025/11/07 19:00','https://qcdn2.zhaomi.cn/dr/200_200_/t11de458816c9fbd5b6b8c97de8.webp'],
      ['海滨城市的夜景_动漫 风格.png','2025/11/07 19:00','https://qcdn1.zhaomi.cn/dr/200_200_/t11de4588169fcc66fdb8fa2369.webp'],
      ['小巧玲珑的厨房_暖黄 灯光温馨.png','2025/11/07 19:00','https://qcdn5.zhaomi.cn/dr/200_200_/t11de458816e09ad8122ae5b8a7.webp'],
      ['公园_阳光柔和地洒在 公园的小径.png','2025/11/07 18:00','https://qcdn1.zhaomi.cn/dr/200_200_/t11de4588165e18bd399bb9efea.webp'],
      ['秋天里的小镇_庭院深 深小屋种满花草.png','2025/11/07 18:00','https://qcdn3.zhaomi.cn/dr/200_200_/t11de45881641eb3f765efb7249.webp'],
      ['地下车库全景_动漫风 格_昏暗.png','2025/11/07 18:00','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816701677b80a45d5b0.webp'],
      ['地下车库全景_动漫风 格_明亮.png','2025/11/07 18:00','https://qcdn5.zhaomi.cn/dr/200_200_/t11de4588162310890249ab83a3.webp'],
      ['公园_朝阳初升.png','2025/11/07 18:00','https://qcdn3.zhaomi.cn/dr/200_200_/t11de458816194455c78ec0e685.webp'],
      ['仙山景城_古代.png','2025/11/07 18:00','https://qcdn4.zhaomi.cn/dr/200_200_/t11de458816da689a4b7ddcdb19.webp'],
      ['正午阳光下上海老街_ 老式6层老楼.png','2025/11/07 18:00','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816b525605de34efbb2.webp'],
      ['大海上有一座海岛_仙 山琼阁_三维古风.png','2025/11/07 18:00','https://qcdn5.zhaomi.cn/dr/200_200_/t11de45881685687c19ddb3731d.webp'],
      ['小城街道_无人','2025/11/06 18:00','https://qcdn2.zhaomi.cn/dr/200_200_/t11de4588165ac6e4e3f1dd7a4a.webp']
    ],
    role:[
      ['女孩_动漫_红裙.png','2025/11/07 20:00','https://qcdn2.zhaomi.cn/dr/200_200_/t11de458816ef9f472618ca63eb.webp'],
      ['少年刘备_2D动漫_绿 色系着装.png','2025/11/07 19:01','https://qcdn1.zhaomi.cn/dr/200_200_/t11de45881687588ae990bd9feb.webp'],
      ['女士_卡通动漫_中式旗 袍.png','2025/11/07 18:01','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816905e54463acc4969.webp'],
      ['李白_动漫_蓝色服装.p ng','2025/11/07 18:01','https://qcdn5.zhaomi.cn/dr/200_200_/t11de458816959968c1fe179ed6.webp'],
      ['古风男性角色_黑长发_ 浅蓝白配色...画风.png','2025/11/07 18:01','https://qcdn4.zhaomi.cn/dr/200_200_/t11de458816f5ad6343b0fb6555.webp'],
      ['儒雅男性青年_二次元_ 休闲穿着.png','2025/11/07 18:00','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816acaa030fb8616648.webp'],
      ['儒雅男青年_戴眼镜_二 次元_休闲穿着.png','2025/11/07 18:20','https://qcdn2.zhaomi.cn/dr/200_200_/t11de4588164f8b7479e36b218e.webp'],
      ['可爱男孩_Q版现代漫 画风格_机...脑袋.png','2025/11/07 18:20','https://qcdn5.zhaomi.cn/dr/200_200_/t11de458816ce6e52c9b8a6226e.webp'],
      ['职场男人_戴眼镜_深蓝 色西装_黑...站立.png','2025/11/07 18:10','https://qcdn5.zhaomi.cn/dr/200_200_/t11de4588169399fee68dc0e6c5.webp'],
      ['白色短裙女生_绿色上 衣_双马尾.png','2025/11/07 18:00','https://qcdn5.zhaomi.cn/dr/200_200_/t11de458816a5ba419867ac6206.webp'],
      ['27 岁男人_黑色衣服.p ng','2025/11/07 18:00','https://qcdn1.zhaomi.cn/dr/200_200_/t11de45881652639dc136dd0dd7.webp'],
      ['Q版女生_可爱的动画 人物_棕色...蝶结.png','2025/11/07 18:00','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816ae160002e751ca9a.webp'],
      ['儒雅男青年_二次元_休 闲穿着.png','2025/11/07 18:00','https://qcdn4.zhaomi.cn/dr/200_200_/t11de458816366ddd95e8ab8d2c.webp'],
      ['探险男孩_橙黄色系服 装_短袖外套短裤.png','2025/11/07 18:00','https://qcdn4.zhaomi.cn/dr/200_200_/t11de458816cbe1b8c3de2949fe.webp'],
      ['甜美女生_日本动漫风 格_长发.png','2025/11/07 18:00','https://qcdn2.zhaomi.cn/dr/200_200_/t11de458816138f7f56c5e305d4.webp'],
      ['古风男性_长发_络腮胡 _国漫风_二...画风.png','2025/11/07 18:00','https://qcdn4.zhaomi.cn/dr/200_200_/t11de4588166fa378792fe0a90e.webp'],
      ['年轻女性_Q版身材_超 写实_3D 风...卡通.png','2025/11/07 18:00','https://qcdn5.zhaomi.cn/dr/200_200_/t11de4588160f3afdfab02fe61a.webp']
    ],
    prop:[
      ['毛裘大氅披肩_古风.pn g','2025/11/07 18:50','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816965cec173cb53ea7.webp'],
      ['毛裘大氅披肩_2D 卡 通.png','2025/11/07 18:50','https://qcdn2.zhaomi.cn/dr/200_200_/t11de458816bdd8b4c4ac474475.webp'],
      ['披肩_3D卡通.png','2025/11/07 18:50','https://qcdn3.zhaomi.cn/dr/200_200_/t11de458816cf728da11f805b1e.webp'],
      ['小熊_毛绒玩具景.png','2025/11/07 18:50','https://qcdn2.zhaomi.cn/dr/200_200_/t11de458816bdd8b4c4ac474475.webp'],
      ['蓝色卡通帽子.png','2025/11/07 18:50','https://qcdn2.zhaomi.cn/dr/200_200_/t11de4588168fd09cadcb771506.webp'],
      ['一把弓箭.png','2025/11/07 18:40','https://qcdn5.zhaomi.cn/dr/200_200_/t11de458816d43c86a703d807eb.webp'],
      ['鲨齿剑.png','2025/11/07 18:40','https://qcdn4.zhaomi.cn/dr/200_200_/t11de458816e4189984e38f97c7.webp'],
      ['单手剑_剑身刻满符文_ 冰蓝色.png','2025/11/07 18:40','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816b871d4d261645e1e.webp'],
      ['改斧刃_双刃_日韩二次 元.png','2025/11/07 18:40','https://qcdn4.zhaomi.cn/dr/200_200_/t11de4588167e09f8cefab32dcf.webp'],
      ['Q版棒棒糖_动画片风 格.png','2025/11/07 18:40','https://qcdn5.zhaomi.cn/dr/200_200_/t11de45881632d626d99cb73b07.webp'],
      ['书_蓝色封面和金色徽 章_东方传...风格.png','2025/11/07 18:40','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816be08415436d15a95.webp'],
      ['如意_东方传统工艺.pn g','2025/11/07 18:40','https://qcdn3.zhaomi.cn/dr/200_200_/t11de4588161d8df683455b8fc2.webp'],
      ['玻璃壶_半透明.png','2025/11/07 18:40','https://qcdn3.zhaomi.cn/dr/200_200_/t11de458816258ceb29fcdd248c.webp'],
      ['白色扇子_中国风_仙侠 _金属花纹装饰.png','2025/11/07 18:40','https://qcdn3.zhaomi.cn/dr/200_200_/t11de4588167ceafa07734c7c7f.webp'],
      ['绿色扇子_中国风_仙侠 _带穗.png','2025/11/07 18:30','https://qcdn1.zhaomi.cn/dr/200_200_/t11de4588169270c8d0c2341284.webp'],
      ['宝石扇子_中国风_仙侠 _金属花纹.png','2025/11/07 18:30','https://qcdn3.zhaomi.cn/dr/200_200_/t11de4588168f73c0ce21663e05.webp'],
      ['红色礼物盒_系着蝴蝶 结.png','2025/11/07 18:30','https://qcdn1.zhaomi.cn/dr/200_200_/t11de4588161c749169bc4ed157.webp']
    ],
    pose:[
      ['摊手','2025/12/31 10:21','https://qcdn3.zhaomi.cn/dr/200_200_/t11de458816bf675dad1aebded5.webp'],
      ['双手环抱','2025/12/31 10:21','https://qcdn1.zhaomi.cn/dr/200_200_/t11de4588163098e53c408b18d3.webp'],
      ['双手叉腰','2025/12/31 10:21','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816d2bed2f8f679585a.webp'],
      ['右手叉腰_左手向前指','2025/12/31 10:21','https://qcdn5.zhaomi.cn/dr/200_200_/t11de45881624693ee7eb78acc7.webp'],
      ['站立','2025/12/31 10:22','https://qcdn4.zhaomi.cn/dr/200_200_/t11de4588163aa9dfe0c04ef20d.webp'],
      ['行走','2025/12/31 10:22','https://qcdn1.zhaomi.cn/dr/200_200_/t11de4588168f8dc434bd8450ef.webp'],
      ['休息','2025/12/31 10:22','https://qcdn1.zhaomi.cn/dr/200_200_/t11de45881643f80d60409e5be6.webp'],
      ['举起双手','2025/12/31 10:22','https://qcdn3.zhaomi.cn/dr/200_200_/t11de458816bb021fa7ee5f9ea7.webp'],
      ['双手插兜','2025/12/31 10:22','https://qcdn1.zhaomi.cn/dr/200_200_/t11de4588169848f305484ae76d.webp'],
      ['双手倒立','2025/12/31 10:23','https://qcdn2.zhaomi.cn/dr/200_200_/t11de458816e6e165820692e3f0.webp'],
      ['双手抱头','2025/12/31 10:23','https://qcdn4.zhaomi.cn/dr/200_200_/t11de458816ffa36af89eae16de.webp']
    ],
    effect:[
      ['透明发光莲花','2025/12/31 10:14','https://qcdn1.zhaomi.cn/dr/200_200_/t11de45881662dba844acc139a1.webp'],
      ['青色闪电','2025/12/31 10:16','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816deaa45fd872ea6e3.webp'],
      ['蓝色水波斩击','2025/12/31 10:16','https://qcdn2.zhaomi.cn/dr/200_200_/t11de4588169ca329c28c1e628a.webp'],
      ['蓝色蝴蝶飞舞','2025/12/31 10:16','https://qcdn3.zhaomi.cn/dr/200_200_/t11de4588163c15589d155ae17b.webp'],
      ['蓝色气场','2025/12/31 10:17','https://qcdn2.zhaomi.cn/dr/200_200_/t11de45881632d4f0064af1f97e.webp'],
      ['修仙法阵','2025/12/31 10:17','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816fe0e74e1272e1338.webp'],
      ['数字流特效','2025/12/31 10:17','https://qcdn1.zhaomi.cn/dr/200_200_/t11de4588162d86f1bf658ae664.webp'],
      ['水墨龙特效','2025/12/31 10:17','https://qcdn4.zhaomi.cn/dr/200_200_/t11de45881662f890014d4ec6ba.webp'],
      ['卢恩魔法法阵','2025/12/31 10:18','https://qcdn2.zhaomi.cn/dr/200_200_/t11de45881617e2da820447bb6b.webp'],
      ['魔法火焰','2025/12/31 10:18','https://qcdn1.zhaomi.cn/dr/200_200_/t11de458816b9be4a8d4511b8f0.webp'],
      ['紫色锁链','2025/12/31 10:19','https://qcdn3.zhaomi.cn/dr/200_200_/t11de458816c13b399baab9c058.webp']
    ],
    expression:[
      ['生气','2025/12/31 10:25','https://qcdn2.zhaomi.cn/dr/200_200_/t11de458816965a194bf3d236d4.webp'],
      ['悲伤','2025/12/31 10:25','https://qcdn5.zhaomi.cn/dr/200_200_/t11de458816386120f467a99394.webp'],
      ['恐惧','2025/12/31 10:25','https://qcdn5.zhaomi.cn/dr/200_200_/t11de458816c33567fea9170799.webp'],
      ['惊讶','2025/12/31 10:25','https://qcdn3.zhaomi.cn/dr/200_200_/t11de458816461628f421d2ae4e.webp'],
      ['疑惑','2025/12/31 10:26','https://qcdn4.zhaomi.cn/dr/200_200_/t11de45881637a4d623602676b4.webp'],
      ['害羞','2025/12/31 10:26','https://qcdn3.zhaomi.cn/dr/200_200_/t11de4588166969b4f6d1ea9bc7.webp'],
      ['尴尬','2025/12/31 10:26','https://qcdn3.zhaomi.cn/dr/200_200_/t11de458816da1241b4ac04377f.webp'],
      ['疲惫','2025/12/31 10:26','https://qcdn5.zhaomi.cn/dr/200_200_/t11de458816d935748d62715f67.webp'],
      ['开心','2025/12/31 10:27','https://qcdn5.zhaomi.cn/dr/200_200_/t11de4588169abac882339e52b4.webp'],
      ['轻蔑','2025/12/31 10:27','https://qcdn3.zhaomi.cn/dr/200_200_/t11de458816179ce866878ec6a0.webp'],
      ['愤怒','2025/12/31 10:27','https://qcdn4.zhaomi.cn/dr/200_200_/t11de458816f31df4d23be9a1ee.webp'],
      ['痛哭','2025/12/31 10:27','https://qcdn5.zhaomi.cn/dr/200_200_/t11de45881610cc066b6e385e1b.webp'],
      ['微笑','2025/12/31 10:27','https://qcdn5.zhaomi.cn/dr/200_200_/t11de4588160791be1200987c05.webp'],
      ['坏笑','2025/12/31 10:28','https://qcdn2.zhaomi.cn/dr/200_200_/t11de458816cfd4867e15696932.webp']
    ]
  };
  const assetLocalMediaMap={
    't11de4588168e6c51adc31c62aa.webp':'00697c639cd08bac.webp',
    't11de45881653044d83723083a9.webp':'00bb34d5b16ac80b.webp',
    't11de458816abba6660d40ca8c2.webp':'ed77e1d3d8ccbef9.webp',
    't11de458816a8022444cf2b14e4.webp':'8fe06bceca10629d.webp',
    't11de458816ec8838af062f7f2d.webp':'dce27b3584fcfa17.webp',
    't11de458816678927b3b0422146.webp':'e7940a5261ee01ba.webp',
    't11de4588165a7781a09e55fdca.webp':'3cf0e19d443b2118.webp',
    't11de458816c9fbd5b6b8c97de8.webp':'a2ec225f3e8123cb.webp',
    't11de4588169fcc66fdb8fa2369.webp':'1b0af195c58e96b1.webp',
    't11de458816e09ad8122ae5b8a7.webp':'dd127c5525bb054b.webp',
    't11de4588165e18bd399bb9efea.webp':'316dfa537c5769bf.webp',
    't11de45881641eb3f765efb7249.webp':'d1495e1bfababab3.webp',
    't11de458816701677b80a45d5b0.webp':'fc442e7bc060be0c.webp',
    't11de4588162310890249ab83a3.webp':'ff0a326d719f5184.webp',
    't11de458816194455c78ec0e685.webp':'f8cfb382dba6c715.webp',
    't11de458816da689a4b7ddcdb19.webp':'b633d844fbee63e5.webp',
    't11de458816b525605de34efbb2.webp':'b96192cf7c5c2d59.webp',
    't11de45881685687c19ddb3731d.webp':'714fed2faff40576.webp',
    't11de4588165ac6e4e3f1dd7a4a.webp':'e97eeb322108b0dc.webp'
  };

  function loadState(){
    const fallback={
      stage:0,
      idea:'',
      script:'',
      scriptModel:'Deepseek',
      videoRatio:'9:16',
      videoModel:'neo-video-2-0',
      videoModelProvider:'DOUBAO',
      videoResolution:'480p',
      videoSettingDuration:'4',
      videoSettingRatio:'16:9',
      videoStyle:'都市写实',
      videoConfirmed:false,
      assetsConfirmed:false,
      assetPrompts:{
        role:'主角：年轻创作者，外冷内热，服装以蓝白为主，需要正面、侧面、背面和表情四视图。',
        scene:'核心场景：雨夜街道、旧照相馆、天桥。保持同一城市、同一光线和同一镜头质感。',
        prop:'核心道具：旧照片、录音笔、门禁卡。需要清晰轮廓、材质细节和可复用视角。'
      },
      assetRegenerated:false,
      assetGenerating:'',
      assetTab:'role',
      assetItemStates:defaultAssetItemStates,
      assetVoices:defaultAssetVoices,
      assetGenerated:{},
      assetUploads:{},
      storyboards:[],
      storyboardFilter:'all',
      clipRegenerated:{},
      videoGenerated:false,
      videoSelectedShotId:'D012',
      videoVoiceEnabled:true,
      videoSubtitleEnabled:true,
      videoVoiceCompleted:false,
      videoModal:null,
      postEdit:{crop:false,subtitle:true,sound:false,stitch:true},
      previewChecked:false,
      lastSaved:'自动保存于刚刚'
    };
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{};
      const merged=Object.assign(fallback,saved,{
        assetPrompts:Object.assign({},fallback.assetPrompts,saved.assetPrompts||{}),
        assetItemStates:Object.assign({},fallback.assetItemStates,saved.assetItemStates||{}),
        assetVoices:Object.assign({},fallback.assetVoices,saved.assetVoices||{}),
        assetGenerated:Object.assign({},fallback.assetGenerated,saved.assetGenerated||{}),
        assetUploads:Object.assign({},fallback.assetUploads,saved.assetUploads||{}),
        clipRegenerated:Object.assign({},fallback.clipRegenerated,saved.clipRegenerated||{}),
        postEdit:Object.assign({},fallback.postEdit,saved.postEdit||{})
      });
      merged.stage=Math.min(Math.max(Number(merged.stage)||0,0),4);
      const allowedStyles=presetStyleOptions.map(item=>item.value);
      if(!allowedStyles.includes(merged.videoStyle)) merged.videoStyle='都市写实';
      if(!['Deepseek','通义千问','Kimi','豆包','GPT-4o'].includes(merged.scriptModel)) merged.scriptModel='Deepseek';
      if(!assetStudioData[merged.assetTab]) merged.assetTab='role';
      Object.keys(defaultAssetItemStates).forEach(id=>{
        if(!['empty','gen','done','confirmed'].includes(merged.assetItemStates[id])) merged.assetItemStates[id]=defaultAssetItemStates[id];
      });
      if(!['all','dialog','pending'].includes(merged.storyboardFilter)) merged.storyboardFilter='all';
      if(typeof merged.videoVoiceEnabled!=='boolean') merged.videoVoiceEnabled=true;
      if(typeof merged.videoSubtitleEnabled!=='boolean') merged.videoSubtitleEnabled=true;
      if(typeof merged.videoVoiceCompleted!=='boolean') merged.videoVoiceCompleted=false;
      ensureVideoModelState(merged);
      return merged;
    }catch(_){
      return fallback;
    }
  }
  function save(){
    state.lastSaved='自动保存于刚刚';
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
    if(els.saveState) els.saveState.textContent=state.lastSaved;
  }
  function currentVideoStyleLabel(){
    return state.videoStyle;
  }
  function currentVideoStylePrompt(){
    return '';
  }
  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g,match=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[match]));
  }
  function toast(message){
    document.querySelector('.nami-toast')?.remove();
    const node=document.createElement('div');
    node.className='nami-toast';
    node.textContent=message;
    document.body.appendChild(node);
    setTimeout(()=>node.remove(),1800);
  }
  function setText(node,value){
    if(node) node.textContent=value;
  }
  function normalizeInvite(value){
    return String(value||'').trim().toUpperCase().replace(/\s+/g,'');
  }
  function maskPhone(phone){
    return phone.slice(0,3)+'****'+phone.slice(-4);
  }
  function readConnected(){
    const initial={user:null,credits:0,projects:[],events:[]};
    try{return {...initial,...JSON.parse(localStorage.getItem(CONNECTED_KEY)||'{}')}}catch(_){return initial}
  }
  function writeConnected(data){
    localStorage.setItem(CONNECTED_KEY,JSON.stringify(data));
  }
  function readInvites(){
    let invites;
    try{invites=JSON.parse(localStorage.getItem(INVITE_KEY)||'null')}catch(_){invites=null}
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
  }
  function saveInvites(invites){
    localStorage.setItem(INVITE_KEY,JSON.stringify(invites));
  }
  function validateInvite(code){
    const normalized=normalizeInvite(code);
    const invite=readInvites().find(item=>normalizeInvite(item.code)===normalized);
    if(!invite) return {ok:false,message:'邀请码不存在，请检查后重新输入。'};
    if(invite.status!=='启用') return {ok:false,message:'该邀请码已使用或已停用，请联系运营重新开通。'};
    if(Number(invite.maxUses||0)>0&&Number(invite.used||0)>=Number(invite.maxUses)) return {ok:false,message:'该邀请码已达到可用次数上限。'};
    return {ok:true,invite};
  }
  function consumeInvite(code,phone){
    const normalized=normalizeInvite(code);
    const invites=readInvites();
    const invite=invites.find(item=>normalizeInvite(item.code)===normalized);
    if(!invite) return null;
    invite.users=Array.isArray(invite.users)?invite.users:[];
    invite.usageLog=Array.isArray(invite.usageLog)?invite.usageLog:[];
    if(!invite.users.includes(phone)){
      invite.used=Number(invite.used||0)+1;
      invite.users.push(phone);
      invite.usageLog.push({phone,usedAt:new Date().toLocaleString('zh-CN',{hour12:false}),page:'creator-studio.html'});
    }
    invite.lastUsedAt=new Date().toLocaleString('zh-CN',{hour12:false});
    invite.lastUser=phone;
    if(Number(invite.used||0)>=1) invite.status='已使用';
    saveInvites(invites);
    return invite;
  }
  function hasInviteSession(){
    const connected=readConnected();
    return Boolean(connected.user&&connected.user.inviteCode);
  }
  function loginWithInvite(){
    const phone=document.getElementById('studio-login-phone')?.value.trim()||'';
    const code=document.getElementById('studio-login-code')?.value.trim()||'';
    const inviteCode=document.getElementById('studio-login-invite')?.value.trim()||'';
    const message=document.getElementById('studio-login-message');
    const setMessage=text=>{if(message) message.textContent=text;};
    if(!/^1\d{10}$/.test(phone)||!/^\d{6}$/.test(code)){
      setMessage('请输入有效手机号和 6 位验证码。');
      return;
    }
    const result=validateInvite(inviteCode);
    if(!result.ok){
      setMessage(result.message);
      return;
    }
    const maskedPhone=maskPhone(phone);
    const invite=consumeInvite(inviteCode,maskedPhone)||result.invite;
    const connected=readConnected();
    connected.user={id:'USR-DEMO-01',phone:maskedPhone,name:'漫剧创作者',plan:'免费试用',inviteCode:normalizeInvite(invite.code)};
    connected.events=[...(connected.events||[]),{name:'invite_login',meta:{inviteCode:normalizeInvite(invite.code)},path:'creator-studio.html',at:new Date().toISOString()}].slice(-80);
    if(!connected.events.some(event=>event.name==='trial_credits_granted')){
      connected.credits=(connected.credits||0)+500;
      connected.events.push({name:'trial_credits_granted',meta:{credits:500,inviteCode:normalizeInvite(invite.code)},path:'creator-studio.html',at:new Date().toISOString()});
    }
    writeConnected(connected);
    closeLogin();
    toast('邀请码登录成功');
  }
  function completeFullVideoGeneration(){
    state.videoGenerated=true;
    state.videoDuration=Math.round(videoTotalDuration());
    state.videoCost=0;
    state.videoGeneratedAt=new Date().toISOString();
    const connected=readConnected();
    const project=(connected.projects&&connected.projects[0])||{
      id:'项目-'+currentProjectId.slice(-6),
      title:'第一集样片',
      stage:'分镜视频',
      progress:100,
      platform:videoDisplayRatio(),
      createdAt:new Date().toISOString()
    };
    if(!connected.projects||!connected.projects.length) connected.projects=[project];
    const already=(connected.events||[]).some(event=>event.name==='full_video_generated'&&event.meta&&event.meta.projectId===project.id);
    if(!already){
      connected.events=[...(connected.events||[]),{
        name:'full_video_generated',
        meta:{projectId:project.id,title:project.title,durationSeconds:state.videoDuration,format:videoDisplayRatio(),model:videoCurrentModel().name,videoSettings:videoSettingSummary(),style:currentVideoStyleLabel(),shots:state.storyboards.length},
        path:'creator-studio.html',
        at:new Date().toISOString()
      }].slice(-80);
      writeConnected(connected);
    }
    save();
  }
  function openLogin(extraMessage){
    if(extraMessage) toast(extraMessage);
    els.loginModal.classList.add('is-open');
    els.loginModal.setAttribute('aria-hidden','false');
  }
  function closeLogin(){
    els.loginModal.classList.remove('is-open');
    els.loginModal.setAttribute('aria-hidden','true');
  }
  function hasScript(){
    return state.script.trim().length>0;
  }
  function ensureStoryboards(){
    const hasFullBoard=state.storyboards.length>=14&&state.storyboards.every(item=>item.id&&item.state&&Array.isArray(item.roles));
    if(hasFullBoard) return;
    const office='科技公司办公区(深夜)';
    state.storyboards=[
      {id:'D001',shot:'D001',roles:['李明'],scene:office,who:'',line:'镜头从办公区缓慢推进，李明独自伏案，神情凝重。',image:'镜头从办公区缓慢推进，李明独自伏案，神情凝重。',dur:'3.0s',state:'done'},
      {id:'D002',shot:'D002',roles:['李明'],scene:office,who:'',line:'特写李明的手指在键盘上飞快敲击，屏幕蓝光映在脸上。',image:'特写李明的手指在键盘上飞快敲击，屏幕蓝光映在脸上。',dur:'2.6s',state:'done'},
      {id:'D003',shot:'D003',roles:['李明'],scene:office,who:'',line:'李明抬头看向墙上的时钟，时间所剩无几。',image:'李明抬头看向墙上的时钟，时间所剩无几。',dur:'2.2s',state:'empty'},
      {id:'D004',shot:'D004',roles:['李明','王总'],scene:office,who:'王总',line:'小李啊！这个支付漏洞必须在天亮前修复！你看看，几百万的交易数据都卡着呢！',image:'王总逼近李明，办公区屏幕和服务器告警光交错。',dur:'5.4s',state:'empty'},
      {id:'D005',shot:'D005',roles:['李明','王总'],scene:office,who:'',line:'李明被上司逼近，下意识后退一步，神情为难。',image:'李明被上司逼近，下意识后退一步，神情为难。',dur:'2.8s',state:'empty'},
      {id:'D006',shot:'D006',roles:['王总','李明'],scene:office,who:'王总',line:'怎么？家里有事？年都快过了，不就差这临门一脚吗？',image:'王总站在冷色灯光下质问，李明攥紧手机。',dur:'4.2s',state:'empty'},
      {id:'D007',shot:'D007',roles:['李明'],scene:office,who:'李明',line:'妈……',image:'李明看着来电显示，欲言又止，背景办公室一片冷清。',dur:'2.0s',state:'empty'},
      {id:'D008',shot:'D008',roles:['李明'],scene:office,who:'画外音',line:'明儿啊！你什么时候回来？你爸包的饺子都凉了，非要等你回来一起吃！',image:'李明低头听电话，手机听筒里传来母亲声音，屏幕蓝光映出犹豫。',dur:'5.2s',state:'empty'},
      {id:'D009',shot:'D009',roles:['李明','王总'],scene:office,who:'李明',line:'王总！这个漏洞，小张也能解决！我今天，必须回家！',image:'李明终于抬头反抗，王总愣住，办公区气氛凝固。',dur:'4.6s',state:'empty'},
      {id:'D010',shot:'D010',roles:['李明'],scene:'高速列车车厢(夜景)',who:'',line:'李明冲出办公楼，奔向最后一班回家的高铁。',image:'李明拖着背包冲向高铁站，城市夜色和车灯拉成光线。',dur:'3.4s',state:'empty'},
      {id:'D011',shot:'D011',roles:['李明'],scene:'高速列车车厢(夜景)',who:'李明',line:'喂？',image:'列车车厢夜景，李明接起陌生号码，表情紧张。',dur:'1.6s',state:'empty'},
      {id:'D012',shot:'D012',roles:[],scene:'高速列车车厢(夜景)',who:'未知号码',line:'李明吗？你家……你家出事了！你快回来！',image:'手机特写显示未知号码，车窗外黑暗高速掠过。',dur:'4.0s',state:'empty'},
      {id:'D013',shot:'D013',roles:['李明'],scene:'高速列车车厢(夜景)',who:'',line:'李明脸色骤变，手机几乎滑落。车窗外灯火飞驰。',image:'李明脸色骤变，手机几乎滑落。车窗外灯火飞驰。',dur:'3.2s',state:'empty'},
      {id:'D014',shot:'D014',roles:['李明'],scene:'高速列车车厢(夜景)',who:'',line:'列车驶入隧道，画面陷入黑暗——第一集钩子收尾。',image:'列车驶入隧道，车厢灯光闪烁后画面陷入黑暗。',dur:'2.4s',state:'empty'}
    ];
  }
  function render(){
    body.dataset.view=currentView;
    if(currentView==='assets'){
      renderAssetsView();
      return;
    }
    if(!Number.isFinite(state.stage)||state.stage<0||state.stage>=stages.length) state.stage=0;
    const stage=stages[state.stage];
    if(state.stage>=3) ensureStoryboards();
    body.dataset.stage=String(state.stage);
    els.micro.textContent=(state.stage+1)+' / '+stages.length+' · '+stage.name;
    els.title.textContent=stage.title;
    els.desc.textContent=stage.desc;
    els.next.textContent=state.stage===4?(state.videoGenerated?'导出成片':'生成整片'):(stage.next?'下一步：'+stage.next:'完成制作');
    els.back.disabled=state.stage===0;
    els.stageProgress.textContent=(state.stage+1)+' / '+stages.length;
    const percent=Math.round((state.stage+1)/stages.length*100);
    els.railPercent.textContent=percent+'%';
    els.railProgress.style.width=percent+'%';
    els.outputName.textContent=stage.name;
    els.outputStatus.textContent=stage.status();
    els.outputNext.textContent=stage.next||'完成';
    setText(els.guideTitle,stage.guideTitle);
    setText(els.guideCopy,stage.guideCopy);
    setText(els.guideAction,stage.action);
    if(els.guideRules) els.guideRules.innerHTML=stage.rules.map(item=>`<li>${escapeHtml(item)}</li>`).join('');
    if(els.previewImage) els.previewImage.src=stage.image;
    setText(els.previewTitle,stage.name+'预览');
    setText(els.previewCopy,stage.desc);
    if(els.previewList) els.previewList.innerHTML=stage.preview.map(item=>`<span>${escapeHtml(item)}</span>`).join('');
    renderStages();
    renderPanel();
    bindPanelEvents();
  }
  function assetUrl(){
    return 'creator-studio.html?menuKey=assets&id='+encodeURIComponent(currentProjectId);
  }
  function renderAssetsView(){
    body.dataset.stage='assets';
    const folder=assetFolderMeta(assetViewState.folderId);
    const items=getAssetFolderItems(assetViewState.folderId);
    els.micro.textContent='';
    els.title.textContent='资产管理';
    els.desc.textContent='';
    els.stageProgress.textContent=folder.name;
    els.outputName.textContent=folder.name;
    els.outputStatus.textContent=items.length?items.length+' 项':'暂无数据';
    els.outputNext.textContent='返回制作大片';
    els.panel.innerHTML=`
      <section class="asset-manager-view asset-reference-view" aria-label="资产管理">
        <aside class="asset-tree-panel">
          <div class="asset-tree-title">资产管理</div>
          ${renderAssetTree()}
        </aside>
        <section class="asset-content-panel">
          <div class="asset-content-head">
            <div class="asset-breadcrumb">${renderAssetBreadcrumb(assetViewState.folderId)}</div>
            <div class="asset-content-actions">
              ${folder.upload?`<button class="asset-primary-action" id="asset-upload-button" type="button">${escapeHtml(folder.upload)}</button>`:''}
            </div>
          </div>
          <div class="asset-content-scroll">
            ${items.length?`<div class="asset-card-grid">${items.map(renderAssetCard).join('')}${renderNewFolderCard()}</div>`:renderAssetEmpty()}
          </div>
        </section>
        <input id="asset-upload-input" type="file" ${folder.upload&&folder.upload!=='上传本地文件'?'accept="image/*"':''} hidden multiple/>
        ${renderAssetPreview()}
        ${renderAssetDialog()}
      </section>
    `;
    bindAssetEvents();
  }
  function assetFolderMeta(folderId){
    if(assetFolderInfo[folderId]) return assetFolderInfo[folderId];
    const customFolders=state.assetCustomFolders||[];
    const match=customFolders.find(item=>item.id===folderId);
    return match?{name:match.name,parent:match.parent,category:match.category}:assetFolderInfo.root;
  }
  function assetRenames(){
    if(!state.assetRenames) state.assetRenames={};
    return state.assetRenames;
  }
  function assetDeleted(){
    if(!state.assetDeleted) state.assetDeleted={};
    return state.assetDeleted;
  }
  function assetCustomItems(){
    if(!state.assetCustomItems) state.assetCustomItems=[];
    return state.assetCustomItems;
  }
  function assetCustomFolders(){
    if(!state.assetCustomFolders) state.assetCustomFolders=[];
    return state.assetCustomFolders;
  }
  function assetDisplayName(item){
    return assetRenames()[item.id]||item.name;
  }
  function assetNow(){
    const date=new Date();
    const pad=value=>String(value).padStart(2,'0');
    return date.getFullYear()+'/'+pad(date.getMonth()+1)+'/'+pad(date.getDate())+' '+pad(date.getHours())+':'+pad(date.getMinutes());
  }
  function localAssetMedia(url){
    const file=String(url||'').split('/').pop();
    return assetLocalMediaMap[file]?'assets/images/nami-assets/'+assetLocalMediaMap[file]:url;
  }
  function makeFolderItem(row,parentId){
    const id=row[0];
    return {id:'folder-'+parentId+'-'+id,type:'folder',kind:'folder',target:id,name:row[1],date:row[2],count:row[3],folderId:parentId};
  }
  function makeImageItem(folderId,row,index){
    return {id:folderId+'-'+index,type:'image',kind:'image',folderId,name:row[0],date:row[1],media:localAssetMedia(row[2]),featured:true};
  }
  function makeAudioFolder(row,parentId){
    const id=row[0];
    return {id:'folder-'+parentId+'-'+id,type:'folder',kind:'audio',target:id,name:row[1],date:row[2],count:row[3],folderId:parentId};
  }
  function makeFileItem(folderId,name,index){
    return {id:folderId+'-work-'+index,type:'file',kind:index>9?'video':'file',folderId,name,date:'2026/06/24 00:06',featured:false};
  }
  function getBaseAssetItems(folderId){
    if(folderId==='root') return assetMaterialFolders.map(row=>makeFolderItem(row,'root')).concat(assetWorkFolders.map(row=>makeFolderItem(row,'root')));
    if(folderId==='material') return assetMaterialFolders.map(row=>makeFolderItem(row,'material'));
    if(folderId==='myWorks') return assetWorkFolders.map(row=>makeFolderItem(row,'myWorks'));
    if(assetMediaRows[folderId]) return assetMediaRows[folderId].map((row,index)=>makeImageItem(folderId,row,index));
    if(folderId==='voice') return [
      ['voiceYouth','青年','2026/06/24 01:17','214项'],
      ['voiceMiddle','中年','2026/06/24 01:17','103项'],
      ['voiceTeen','少年','2026/06/24 01:17','22项'],
      ['voiceSenior','老年','2026/06/24 01:17','15项'],
      ['voiceChild','儿童','2026/06/24 01:17','5项']
    ].map(row=>makeAudioFolder(row,'voice'));
    if(folderId==='sound') return [
      ['sfxEvent','事件音效','2026/06/24 01:17','597项'],
      ['sfxPerson','人物音效','2026/06/24 01:17','438项'],
      ['sfxAnimal','动物音效','2026/06/24 01:17','93项'],
      ['sfxBattle','战斗音效','2026/06/24 01:17','1077项'],
      ['sfxWeapon','武器音效','2026/06/24 01:17','223项'],
      ['sfxMood','氛围音效','2026/06/24 01:17','240项'],
      ['sfxEnv','环境音效','2026/06/24 01:17','123项'],
      ['sfxImpact','碰撞爆炸音效','2026/06/24 01:17','302项']
    ].map(row=>makeAudioFolder(row,'sound'));
    if(folderId==='styleFeatured') return ['国漫写实','现代都市','古风仙侠','Q版治愈','电影分镜','悬疑暗调','日漫清透','水墨留白'].map((name,index)=>makeFileItem(folderId,name,index));
    if(/^voice|^sfx/.test(folderId)) return ['示例音频 01','示例音频 02','示例音频 03','示例音频 04'].map((name,index)=>({...makeFileItem(folderId,name,index),kind:'audio'}));
    if(/^work/.test(folderId)) return ['剧本.txt','视频设定.json','场景库','角色库','道具库','分镜脚本','分镜视频','片头封面.png','音色配置','音效配置','字幕.srt','导出视频.mp4','发布配置.json'].map((name,index)=>makeFileItem(folderId,name,index));
    return [];
  }
  function getAssetFolderItems(folderId){
    const deleted=assetDeleted();
    const custom=assetCustomItems().filter(item=>item.folderId===folderId);
    return getBaseAssetItems(folderId).concat(custom).filter(item=>!deleted[item.id]).map(item=>Object.assign({},item,{name:assetDisplayName(item),media:assetSessionMedia[item.id]||item.media||''}));
  }
  function findAssetItem(itemId){
    const knownIds=Object.keys(assetFolderInfo).concat(assetCustomFolders().map(item=>item.id));
    for(const folderId of knownIds){
      const found=getAssetFolderItems(folderId).find(item=>item.id===itemId);
      if(found) return found;
    }
    return null;
  }
  function assetCrumbs(folderId){
    const crumbs=[];
    let current=assetFolderMeta(folderId);
    let id=folderId;
    while(current){
      crumbs.unshift({id,name:current.name});
      if(!current.parent) break;
      id=current.parent;
      current=assetFolderMeta(id);
    }
    return crumbs;
  }
  function renderAssetBreadcrumb(folderId){
    return assetCrumbs(folderId).map((crumb,index,all)=>`
      <button type="button" data-asset-folder="${escapeHtml(crumb.id)}">${escapeHtml(crumb.name)}</button>${index<all.length-1?'<span>/</span>':''}
    `).join('');
  }
  function renderAssetTree(){
    return `
      <div class="asset-tree-group">
        ${renderTreeRow('material','素材库',0)}
        ${assetMaterialFolders.map(row=>renderTreeRow(row[0],row[1],1)).join('')}
      </div>
      <div class="asset-tree-group">
        ${renderTreeRow('myWorks','我的作品',0)}
        ${assetWorkFolders.map(row=>renderTreeRow(row[0],row[1],1)).join('')}
      </div>
    `;
  }
  function renderTreeRow(folderId,name,level){
    const active=assetViewState.folderId===folderId;
    return `<button class="asset-tree-row ${active?'active':''}" type="button" data-asset-folder="${escapeHtml(folderId)}" style="--level:${level}"><i>${level?'':'⌄'}</i><span>${escapeHtml(name)}</span></button>`;
  }
  function renderAssetCard(item){
    const isFolder=item.type==='folder';
    const action=isFolder?`data-asset-folder="${escapeHtml(item.target)}"`:`data-asset-open="${escapeHtml(item.id)}"`;
    return `
      <button class="asset-file-card ${isFolder?'is-folder':'is-file'}" type="button" ${action} title="${escapeHtml(item.name)}">
        <div class="asset-thumb">
          ${item.featured?'<em>精选</em>':''}
          ${renderAssetThumb(item)}
        </div>
        <span>${escapeHtml(item.name)}</span>
        <small>${escapeHtml(item.date||'')}${item.count?' · '+escapeHtml(item.count):''}</small>
      </button>
    `;
  }
  function renderAssetThumb(item){
    if(item.type==='folder') return `<div class="asset-folder-thumb ${item.kind==='audio'?'is-audio':''}"><b></b></div>`;
    if(item.media) return `<img src="${escapeHtml(item.media)}" alt="" onerror="this.closest('.asset-thumb').classList.add('image-missing');this.remove();"/>`;
    if(item.kind==='audio') return '<div class="asset-audio-thumb"><b></b><b></b><b></b><b></b></div>';
    if(item.kind==='video') return '<div class="asset-video-thumb">▶</div>';
    return '<div class="asset-file-thumb"></div>';
  }
  function renderNewFolderCard(){
    return `<button class="asset-file-card asset-new-card" type="button" id="asset-new-folder"><div class="asset-thumb"><div class="asset-plus-thumb">+</div></div><span>新建文件夹</span><small></small></button>`;
  }
  function renderAssetEmpty(){
    return `
      <div class="asset-empty-state">
        <b>暂无数据</b>
      </div>
      <div class="asset-empty-action">${renderNewFolderCard()}</div>
    `;
  }
  function renderAssetPreview(){
    if(!assetViewState.previewId) return '';
    const item=findAssetItem(assetViewState.previewId);
    if(!item) return '';
    const folder=assetFolderMeta(item.folderId);
    const path=assetCrumbs(item.folderId).map(crumb=>crumb.name).join(' > ');
    return `
      <div class="asset-preview-modal" role="dialog" aria-modal="true">
        <div class="asset-preview-card">
          <button class="asset-modal-close" type="button" data-asset-close-preview aria-label="关闭">×</button>
          <div class="asset-preview-media">${item.media?`<img src="${escapeHtml(item.media)}" alt=""/>`:renderAssetThumb(item)}</div>
          <aside class="asset-preview-info">
            <h3>${escapeHtml(item.name)}</h3>
            <dl>
              <dt>分类</dt><dd>${escapeHtml(folder.category||folder.name)}</dd>
              <dt>位置</dt><dd>${escapeHtml(path)}</dd>
              <dt>最后修改时间</dt><dd>${escapeHtml((item.date||'').replace(/\//g,'-').slice(0,10)||'2026-06-24')}</dd>
            </dl>
            <div class="asset-preview-actions">
              <button type="button" data-asset-download="${escapeHtml(item.id)}">下载</button>
              <button type="button" data-asset-rename="${escapeHtml(item.id)}">重命名</button>
              <button type="button" data-asset-copy="${escapeHtml(item.id)}">复制名称</button>
              <button class="danger" type="button" data-asset-delete="${escapeHtml(item.id)}">删除</button>
            </div>
          </aside>
        </div>
      </div>
    `;
  }
  function renderAssetDialog(){
    if(!assetViewState.dialog) return '';
    const dialog=assetViewState.dialog;
    const item=dialog.itemId?findAssetItem(dialog.itemId):null;
    const title=dialog.type==='rename'?'重命名':'新建文件夹';
    const value=dialog.type==='rename'&&item?item.name:'';
    return `
      <div class="asset-dialog-modal" role="dialog" aria-modal="true">
        <div class="asset-dialog-card">
          <h3>${title}</h3>
          <input id="asset-dialog-input" type="text" value="${escapeHtml(value)}" placeholder="请输入名称"/>
          <div>
            <button type="button" data-asset-dialog-cancel>取消</button>
            <button type="button" data-asset-dialog-submit>确定</button>
          </div>
        </div>
      </div>
    `;
  }
  function bindAssetEvents(){
    els.panel.querySelectorAll('[data-asset-folder]').forEach(button=>{
      button.addEventListener('click',()=>{
        assetViewState.folderId=button.dataset.assetFolder;
        assetViewState.previewId=null;
        assetViewState.dialog=null;
        renderAssetsView();
      });
    });
    els.panel.querySelectorAll('[data-asset-open]').forEach(button=>{
      button.addEventListener('click',()=>{
        assetViewState.previewId=button.dataset.assetOpen;
        assetViewState.dialog=null;
        renderAssetsView();
      });
    });
    els.panel.querySelector('#asset-upload-button')?.addEventListener('click',()=>els.panel.querySelector('#asset-upload-input')?.click());
    els.panel.querySelector('#asset-upload-input')?.addEventListener('change',event=>{
      const files=Array.from(event.target.files||[]);
      if(!files.length) return;
      const custom=assetCustomItems();
      files.forEach(file=>{
        const id='upload-'+Date.now()+'-'+Math.random().toString(16).slice(2);
        const isImage=file.type.startsWith('image/');
        if(isImage) assetSessionMedia[id]=URL.createObjectURL(file);
        custom.push({id,type:isImage?'image':'file',kind:isImage?'image':'file',folderId:assetViewState.folderId,name:file.name,date:assetNow(),media:''});
      });
      save();
      renderAssetsView();
      toast('上传成功');
    });
    els.panel.querySelector('#asset-new-folder')?.addEventListener('click',()=>{
      assetViewState.dialog={type:'folder'};
      renderAssetsView();
    });
    els.panel.querySelector('[data-asset-close-preview]')?.addEventListener('click',()=>{
      assetViewState.previewId=null;
      renderAssetsView();
    });
    els.panel.querySelectorAll('[data-asset-download]').forEach(button=>button.addEventListener('click',()=>toast('已开始下载')));
    els.panel.querySelectorAll('[data-asset-copy]').forEach(button=>button.addEventListener('click',()=>{
      const item=findAssetItem(button.dataset.assetCopy);
      if(item) navigator.clipboard?.writeText(item.name);
      toast('已复制名称');
    }));
    els.panel.querySelectorAll('[data-asset-rename]').forEach(button=>button.addEventListener('click',()=>{
      assetViewState.dialog={type:'rename',itemId:button.dataset.assetRename};
      renderAssetsView();
    }));
    els.panel.querySelectorAll('[data-asset-delete]').forEach(button=>button.addEventListener('click',()=>{
      assetDeleted()[button.dataset.assetDelete]=true;
      assetViewState.previewId=null;
      save();
      renderAssetsView();
      toast('已删除');
    }));
    els.panel.querySelector('[data-asset-dialog-cancel]')?.addEventListener('click',()=>{
      assetViewState.dialog=null;
      renderAssetsView();
    });
    els.panel.querySelector('[data-asset-dialog-submit]')?.addEventListener('click',()=>{
      const input=els.panel.querySelector('#asset-dialog-input');
      const value=(input?.value||'').trim();
      if(!value) return toast('请输入名称');
      if(assetViewState.dialog?.type==='rename'){
        assetRenames()[assetViewState.dialog.itemId]=value;
        assetViewState.dialog=null;
        save();
        renderAssetsView();
        toast('已重命名');
        return;
      }
      const folderId='custom-folder-'+Date.now();
      assetCustomFolders().push({id:folderId,parent:assetViewState.folderId,name:value,category:assetFolderMeta(assetViewState.folderId).category||assetFolderMeta(assetViewState.folderId).name});
      assetCustomItems().push({id:'custom-card-'+folderId,type:'folder',kind:'folder',target:folderId,folderId:assetViewState.folderId,name:value,date:assetNow(),count:'0项'});
      assetViewState.dialog=null;
      save();
      renderAssetsView();
      toast('已新建文件夹');
    });
  }
  function renderStages(){
    document.querySelectorAll('.production-stages [data-stage]').forEach(button=>{
      const index=Number(button.dataset.stage);
      button.classList.toggle('active',index===state.stage);
      button.classList.toggle('done',index<state.stage);
      button.querySelector('small').textContent=index<state.stage?'已完成':(index===state.stage?'进行中':'未开始');
      button.querySelector('i').textContent=index===state.stage?'●':(index<state.stage?'✓':'');
    });
  }
  function renderPanel(){
    const templates=[
      renderScriptPanel,
      renderVideoPanel,
      renderAssetPanel,
      renderStoryboardPanel,
      renderVideoGeneratePanel
    ];
    els.panel.innerHTML=templates[state.stage]();
  }
  function renderScriptPanel(){
    return `
      <div class="nami-script-stage">
        <div class="nami-char-count" id="script-count">${state.script.length}/${MAX_SCRIPT_LENGTH}</div>
        <div class="nami-ai-row">
          <div>
            <div class="nami-ai-toolbar">
              <span>没有剧本？AI帮你写：</span>
              <label class="nami-model-select"><small>大模型</small><select id="script-model">${scriptModelOptions.map(item=>`<option value="${escapeHtml(item.value)}" ${state.scriptModel===item.value?'selected':''}>${escapeHtml(item.label)}</option>`).join('')}</select></label>
            </div>
            <p class="nami-model-copy">${escapeHtml((scriptModelOptions.find(item=>item.value===state.scriptModel)||scriptModelOptions[0]).copy)}</p>
            <textarea id="idea-input" maxlength="10000" placeholder="输入你的想法">${escapeHtml(state.idea)}</textarea>
          </div>
          <button class="nami-green-btn" id="ai-create" type="button" ${state.idea.trim()?'':'disabled'}>帮我创作</button>
        </div>
        <div class="nami-editor-block">
          <div class="nami-editor-title">
            <span>已有剧本，在这里粘贴/上传：</span>
            <div>
              <button type="button" data-editor-action="copy">复制</button>
              <button type="button" data-editor-action="clear">清空</button>
              <button type="button" data-editor-action="upload">上传剧本</button>
            </div>
          </div>
          <textarea id="script-editor" maxlength="${MAX_SCRIPT_LENGTH}" placeholder="粘贴或上传剧本内容。当前版本建议上传单集，生成效果更佳。">${escapeHtml(state.script)}</textarea>
          <input id="script-file" type="file" accept=".txt,.md,.doc,.docx" hidden/>
        </div>
      </div>
    `;
  }
  function renderVideoPanel(){
    return `
      <div class="nami-option-section video-basics">
        <div class="nami-option-heading video-limit-card"><span>单条上限</span><b>15 秒</b><small>单个分镜视频生成时长上限为 15 秒，后续会按分镜逐条生成，方便单条重试和导出。</small></div>
      </div>
      <div class="nami-option-section">
        <h3>画面比例</h3>
        <div class="nami-settings-grid">
          ${settingOption('ratio','9:16','竖屏 9:16','适合抖音、视频号、小红书等竖屏消费场景。')}
          ${settingOption('ratio','16:9','横屏 16:9','适合横屏播放、官网展示和大屏预览。')}
        </div>
      </div>
      <div class="nami-option-section">
        <h3>视频风格</h3>
        <div class="nami-settings-grid style-grid">
          ${presetStyleOptions.map(item=>settingOption('style',item.value,item.label,item.copy)).join('')}
        </div>
      </div>
      <div class="nami-action-row"><button class="nami-green-btn" id="confirm-video" type="button">确认视频设定</button><button type="button" data-stage-reset="video">恢复默认</button></div>
    `;
  }
  function renderAssetPanel(){
    return `
      <section class="nami-rs-stage">
        <div class="nami-rs-head">
          <div>
            <span>第 3 步 / 共 5 步</span>
            <h2>角色 · 场景 · 道具</h2>
            <p>平台已从剧本里识别出需要的素材。逐个生成并确认每个角色、场景和道具，全部确认后才进入分镜脚本，确保后续镜头不换脸、不穿帮。</p>
          </div>
          <em><i></i>自动保存于刚刚</em>
        </div>
        <div class="nami-rs-toolbar">
          <div class="nami-rs-tabs" role="tablist">
            ${renderAssetStudioTabs()}
          </div>
          <button class="nami-rs-batch" type="button" data-asset-generate-current>${assetStudioIcons.spark}一键生成本类未生成项</button>
          <div class="nami-rs-tracker">${renderAssetCurrentTracker()}</div>
        </div>
        <div class="nami-rs-grid">
          ${renderAssetStudioCards()}
        </div>
        ${renderAssetStudioActionBar()}
        ${renderAssetVoiceModal()}
      </section>
    `;
  }
  function renderStoryboardPanel(){
    ensureStoryboards();
    return `
      <section class="nami-board-stage">
        <div class="nami-board-head">
          <div>
            <span>第 4 步 / 共 5 步</span>
            <h2>分镜脚本</h2>
            <p>平台已把剧本自动拆成镜头。逐个生成画面、配上台词配音，确认整套分镜后即可进入成片。每个镜头都会沿用前面确认的角色与场景。</p>
          </div>
          <em><i></i>自动保存于刚刚</em>
        </div>
        <div class="nami-board-toolbar">
          <span class="nami-board-count">${storyboardIcons.film}<b>${state.storyboards.length}</b> 镜头</span>
          <div class="nami-board-filters">
            ${storyboardFilterButton('all','全部')}
            ${storyboardFilterButton('dialog','有台词')}
            ${storyboardFilterButton('pending','未生成')}
          </div>
          <button class="nami-board-batch" type="button" data-board-generate-all>${storyboardIcons.spark}一键生成全部画面</button>
          <div class="nami-board-tracker">${renderStoryboardTracker()}</div>
        </div>
        <div class="nami-board-grid">
          ${renderStoryboardCards()}
        </div>
        ${renderStoryboardActionBar()}
        ${renderStoryboardModal()}
      </section>
    `;
  }
  function storyboardFilterButton(key,label){
    return `<button class="${state.storyboardFilter===key?'on':''}" type="button" data-board-filter="${escapeHtml(key)}">${escapeHtml(label)}</button>`;
  }
  function storyboardVisibleShots(){
    if(state.storyboardFilter==='dialog') return state.storyboards.filter(item=>item.who);
    if(state.storyboardFilter==='pending') return state.storyboards.filter(item=>item.state==='empty'||item.state==='gen');
    return state.storyboards;
  }
  function storyboardCounts(){
    const total=state.storyboards.length;
    const generated=state.storyboards.filter(item=>item.state==='done'||item.state==='confirmed').length;
    const confirmed=state.storyboards.filter(item=>item.state==='confirmed').length;
    const pending=state.storyboards.filter(item=>item.state==='empty').length;
    return {total,generated,confirmed,pending};
  }
  function renderStoryboardTracker(){
    const counts=storyboardCounts();
    return `<span>已生成 <b>${counts.generated}</b> / ${counts.total}</span>`;
  }
  function renderStoryboardCards(){
    const cards=storyboardVisibleShots().map(renderStoryboardCard).join('');
    if(state.storyboardFilter!=='all') return cards;
    return cards+`<button class="nami-board-add" type="button" data-board-add>${storyboardIcons.add}<span>加镜头</span></button>`;
  }
  function renderStoryboardCard(item){
    const status=item.state||'empty';
    const confirmed=status==='confirmed';
    const action=status==='empty'
      ? `<button class="nami-board-go gen" type="button" data-board-generate-one="${escapeHtml(item.id)}">${storyboardIcons.spark}生成画面</button>`
      : status==='gen'
        ? '<button class="nami-board-go busy" type="button">生成中...</button>'
        : status==='done'
          ? `<button class="nami-board-go confirm" type="button" data-board-confirm-one="${escapeHtml(item.id)}">${storyboardIcons.check}确认</button>`
          : `<span class="nami-board-go confirmed-state">${storyboardIcons.check} 已确认</span>`;
    const regen=status==='done'||status==='confirmed'?`<button class="nami-board-vbadge" type="button" data-board-regenerate-one="${escapeHtml(item.id)}" title="重新生成">${storyboardIcons.refresh}</button>`:'';
    const roles=(item.roles||[]).map(role=>`<span class="nami-board-chip role">${escapeHtml(role)}</span>`).join('');
    const dialogue=item.who?`
      <div class="nami-board-dialog">
        <span class="who">${escapeHtml(item.who)}</span>
        <span class="line">${escapeHtml(item.line)}</span>
        <button class="mic ${confirmed?'':'muted'}" type="button" data-board-voice="${escapeHtml(item.id)}">${storyboardIcons.mic}${confirmed?'已配音':'生成配音'}</button>
      </div>`:`<div class="nami-board-dialog"><span class="line">${escapeHtml(item.line||item.image)}</span></div>`;
    return `<article class="nami-board-shot ${status} ${confirmed?'confirmed':''}" id="board-shot-${escapeHtml(item.id)}">
      <div class="nami-board-frame">
        ${regen}
        <span class="nami-board-confirm-tag">${storyboardIcons.check} 已确认</span>
        <div class="empty">${storyboardIcons.img}<span>未生成 · 点击生成画面</span></div>
        <div class="generating"><i></i><span>正在生成画面...</span></div>
        <div class="pic">
          <div class="ph">${storyboardIcons.film}</div>
          <span class="dur">${escapeHtml(item.dur||'3.0s')}</span>
          <div class="tools">
            <button type="button" data-board-regenerate-one="${escapeHtml(item.id)}" title="重新生成">${storyboardIcons.refresh}</button>
            <button type="button" data-board-preview="${escapeHtml(item.id)}" title="预览">${storyboardIcons.expand}</button>
          </div>
        </div>
      </div>
      <div class="nami-board-body">
        <div class="nami-board-chips">${roles}<span class="nami-board-chip scene">${storyboardIcons.scene}${escapeHtml(item.scene)}</span></div>
        ${dialogue}
      </div>
      <div class="nami-board-foot">
        <span class="sid">${escapeHtml(item.id)}</span>
        <button class="mini" type="button" data-board-edit="${escapeHtml(item.id)}" title="编辑镜头">${storyboardIcons.edit}</button>
        <button class="mini del" type="button" data-board-delete="${escapeHtml(item.id)}" title="删除">${storyboardIcons.del}</button>
        <span></span>
        ${action}
      </div>
    </article>`;
  }
  function renderStoryboardActionBar(){
    const counts=storyboardCounts();
    let status='';
    if(counts.confirmed===counts.total) status=`<b>全部 ${counts.total} 个镜头已确认</b>，可以进入成片生成。`;
    else if(counts.generated===counts.total) status=`画面已全部生成，还有 <strong>${counts.total-counts.confirmed} 个镜头</strong> 待确认。`;
    else status=`还有 <strong>${counts.pending} 个镜头</strong> 未生成画面，生成并确认后进入成片。`;
    return `<div class="nami-board-actionbar">
      <p>${status}</p>
      <span class="cost">${storyboardIcons.spark}${counts.pending?counts.pending+' 镜待生成':'已完成'}</span>
      <button class="nami-board-btn ghost" type="button" data-board-prev>上一步</button>
      <button class="nami-board-btn primary" type="button" data-board-next ${counts.confirmed===counts.total?'':'disabled'}>下一步：生成成片${storyboardIcons.arrow}</button>
    </div>`;
  }
  function renderStoryboardModal(){
    if(!storyboardModal) return '';
    if(storyboardModal.type==='cost') return renderStoryboardCostModal();
    if(storyboardModal.type==='edit') return renderStoryboardEditModal(storyboardModal.id);
    return '';
  }
  function renderStoryboardCostModal(){
    const counts=storyboardCounts();
    const n=counts.pending;
    return `<div class="nami-board-scrim" id="board-modal-scrim" role="dialog" aria-modal="true">
      <div class="nami-board-modal cost-modal">
        <div class="cost-icon">${storyboardIcons.spark}</div>
        <h3>批量生成画面</h3>
        <p>将为 ${n} 个未生成的镜头生成画面，已生成的会跳过。完成后逐个确认即可。</p>
        <div class="cost-row"><span>生成镜头</span><b>${n} 个</b></div>
        <div class="cost-row"><span>完成方式</span><b>逐镜确认</b></div>
        <footer><button class="nami-board-btn ghost" type="button" data-board-modal-close>再想想</button><button class="nami-board-btn primary" type="button" data-board-confirm-cost>确认生成 (${n})</button></footer>
      </div>
    </div>`;
  }
  function renderStoryboardEditModal(id){
    const shot=state.storyboards.find(item=>item.id===id);
    if(!shot) return '';
    const active=storyboardDurationDraft||shot.dur||'3.0s';
    return `<div class="nami-board-scrim" id="board-modal-scrim" role="dialog" aria-modal="true">
      <div class="nami-board-modal edit-modal">
        <header><span>${storyboardIcons.edit}</span><div><h3>编辑镜头</h3><small>${escapeHtml(shot.id)} · ${escapeHtml(shot.scene)}</small></div><button type="button" data-board-modal-close>${storyboardIcons.x}</button></header>
        <div class="modal-body">
          <label><span>画面描述</span><textarea id="board-edit-line">${escapeHtml(shot.image||shot.line)}</textarea></label>
          <label><span>台词 / 旁白${shot.who?'（'+escapeHtml(shot.who)+'）':'（无）'}</span><input id="board-edit-dialog" value="${escapeHtml(shot.who?shot.line:'')}" placeholder="该镜头无台词"/></label>
          <label><span>镜头时长</span><div class="duration-seg">
            ${['2.0s','3.0s','5.0s'].map(value=>`<button class="${active===value?'on':''}" type="button" data-board-duration="${escapeHtml(value)}">${value.replace('.0s',' 秒')}</button>`).join('')}
          </div></label>
        </div>
        <footer><button class="nami-board-btn ghost" type="button" data-board-modal-close>取消</button><button class="nami-board-btn primary" type="button" data-board-save-edit="${escapeHtml(shot.id)}">保存修改</button></footer>
      </div>
    </div>`;
  }
  function videoParseOption(optionString){
    const parts=String(optionString).split('|');
    return {value:parts[0],name:parts[1]||parts[0]};
  }
  function videoFindModel(value){
    return videoModelOptions.find(model=>model.value===value)||null;
  }
  function videoModelsByProvider(provider){
    return videoModelOptions.filter(model=>model.provider===provider);
  }
  function videoDurationOptions(model){
    const range=model.durationRange||{min:4,max:15,step:1};
    const min=Number(range.min)||4;
    const max=Number(range.max)||min;
    const step=Number(range.step)||1;
    const options=[];
    for(let value=min;value<=max;value+=step){
      options.push({value:String(value),name:value+'s'});
    }
    return options;
  }
  function ensureVideoModelState(target){
    let model=videoFindModel(target.videoModel);
    if(!model){
      model=videoModelOptions[0];
      target.videoModel=model.value;
    }
    if(!videoModelProviders.includes(target.videoModelProvider)||target.videoModelProvider!==model.provider) target.videoModelProvider=model.provider;
    if(!model.resolutions.some(item=>item.value===target.videoResolution)) target.videoResolution=model.resolutions[0]?.value||'480p';
    const durations=videoDurationOptions(model);
    if(!durations.some(item=>item.value===String(target.videoSettingDuration))) target.videoSettingDuration=durations[0]?.value||'4';
    if(!model.aspectRatios.some(item=>item.value===target.videoSettingRatio)) target.videoSettingRatio=model.aspectRatios[0]?.value||'16:9';
    if(target.videoSettingRatio&&target.videoSettingRatio!=='auto') target.videoRatio=target.videoSettingRatio;
  }
  function videoCurrentModel(){
    ensureVideoModelState(state);
    return videoFindModel(state.videoModel)||videoModelOptions[0];
  }
  function videoCurrentResolution(model=videoCurrentModel()){
    return model.resolutions.find(item=>item.value===state.videoResolution)||model.resolutions[0]||{value:'480p',name:'480p'};
  }
  function videoCurrentDuration(model=videoCurrentModel()){
    const options=videoDurationOptions(model);
    return options.find(item=>item.value===String(state.videoSettingDuration))||options[0]||{value:'4',name:'4s'};
  }
  function videoCurrentAspect(model=videoCurrentModel()){
    return model.aspectRatios.find(item=>item.value===state.videoSettingRatio)||model.aspectRatios[0]||{value:'16:9',name:'横屏 (16:9)'};
  }
  function videoSettingSummary(model=videoCurrentModel()){
    const resolution=videoCurrentResolution(model);
    const duration=videoCurrentDuration(model);
    const aspect=videoCurrentAspect(model);
    return `${resolution.name} · ${duration.name} · ${aspect.name}`;
  }
  function videoDisplayRatio(){
    const aspect=videoCurrentAspect();
    return aspect.value==='auto'?'自动':aspect.value;
  }
  function renderVideoProviderTabs(model){
    const activeProvider=state.videoModelProvider||model.provider;
    return videoModelProviders.map(provider=>{
      const selected=provider===activeProvider;
      const count=videoModelsByProvider(provider).length;
      return `<button class="${selected?'on':''}" type="button" data-video-provider="${escapeHtml(provider)}"><b>${escapeHtml(provider)}</b><small>${count}</small></button>`;
    }).join('');
  }
  function renderVideoModelChoices(model){
    const provider=state.videoModelProvider||model.provider;
    return videoModelsByProvider(provider).map(item=>{
      const selected=item.value===model.value;
      return `<button class="${selected?'on':''}" type="button" data-video-model="${escapeHtml(item.value)}">
        <span>${escapeHtml(item.provider)}</span>
        <b>${escapeHtml(item.name)}</b>
        <small>${item.supportAudio===1?'支持生成音频':'无内置音频'}</small>
      </button>`;
    }).join('');
  }
  function renderVideoSettingChips(label,type,options,selected){
    return `<div class="nami-video-setting-group">
      <span>${escapeHtml(label)}</span>
      <div>${options.map(option=>`<button class="${option.value===selected?'on':''}" type="button" data-video-${escapeHtml(type)}="${escapeHtml(option.value)}">${escapeHtml(option.name)}</button>`).join('')}</div>
    </div>`;
  }
  function renderVideoShotListItem(item,index){
    const active=item.id===state.videoSelectedShotId;
    const label=String(index+1).padStart(2,'0');
    const status=item.state==='confirmed'||item.state==='done'?'已生成':'待生成';
    return `<button class="nami-video-shot-card ${active?'active':''}" type="button" data-video-select-shot="${escapeHtml(item.id)}">
      <span class="nami-video-shot-thumb"><img src="${escapeHtml(videoFrameImage(index))}" alt="分镜 ${escapeHtml(label)} 缩略图"/></span>
      <span class="nami-video-shot-copy">
        <b>分镜 ${escapeHtml(label)}</b>
        <small>${escapeHtml(item.dur||'3.0s')} · ${escapeHtml(status)}</small>
        <em>${item.who?videoSubtitleLine(item):escapeHtml(item.image||item.line||'暂无画面描述')}</em>
      </span>
    </button>`;
  }
  function renderVideoGeneratePanel(){
    ensureStoryboards();
    ensureVideoModelState(state);
    const selected=videoSelectedShot();
    const counts=storyboardCounts();
    const dialogueCount=videoDialogueCount();
    const cost=videoGenerationCost();
    const connected=readConnected();
    const credits=Number(connected.credits||3709);
    const generated=Boolean(state.videoGenerated);
    const shotNumber=selected.id.replace(/^D0*/,'')||selected.id;
    const model=videoCurrentModel();
    const voiceAvailable=model.supportAudio===1;
    const selectedIndex=Math.max(0,state.storyboards.findIndex(item=>item.id===selected.id));
    const promptText=selected.image||selected.line||'暂无镜头描述';
    const promptLength=promptText.length;
    const previewImage=videoFrameImage(selectedIndex);
    const voiceStatus=state.videoVoiceEnabled?(state.videoVoiceCompleted?'配音已完成':'待设置声音'):'配音关闭';
    return `
      <section class="nami-video-stage nami-video-editor-stage">
        <div class="nami-video-head">
          <div>
            <span><b>5</b> 视频生成与预览</span>
            <h2>分镜视频编辑器</h2>
            <p>按分镜逐条检查镜头描述、视频模型、清晰度、配音和字幕，再在底部分镜条预览整片效果。</p>
          </div>
          <em>已自动保存</em>
        </div>

        <div class="nami-video-workspace" aria-label="分镜视频编辑器">
          <aside class="nami-video-shot-panel" aria-label="左侧分镜列表">
            <header class="nami-video-panel-head">
              <div>
                <h3>分镜列表</h3>
                <p>${counts.total} 个镜头 · 当前分镜 ${escapeHtml(String(selectedIndex+1))}</p>
              </div>
              <span>${generated?'已生成':'待生成'}</span>
            </header>
            <div class="nami-video-shot-list">
              ${state.storyboards.map((item,index)=>renderVideoShotListItem(item,index)).join('')}
            </div>
          </aside>

          <main class="nami-video-stage-panel" aria-label="中央预览画布">
            <header class="nami-video-stage-toolbar">
              <div>
                <h3>镜头 ${escapeHtml(shotNumber)} · 视频预览</h3>
                <p>${escapeHtml(selected.dur||'3.0s')} · ${escapeHtml(videoDisplayRatio())} · ${escapeHtml(model.name)}</p>
              </div>
              <div>
                <button class="nami-video-btn ghost" type="button" data-video-prev>上一步</button>
                <button class="nami-video-btn primary" type="button" data-video-open-cost>${generated?'导出成片':'生成整片'}</button>
              </div>
            </header>
            <div class="nami-video-canvas-wrap">
              <div class="nami-video-stage-canvas" style="background-image:linear-gradient(180deg,rgba(7,12,28,.08),rgba(7,12,28,.72)),url('${escapeHtml(previewImage)}')">
                <span>当前镜头 · ${generated?'已生成':'待生成'}</span>
                <button type="button" data-video-play aria-label="预览当前镜头">${assetStudioIcons.play}</button>
                <p>${videoSubtitleLine(selected)}</p>
              </div>
              <div class="nami-video-playbar">
                <button type="button" data-video-play aria-label="播放或暂停">▶</button>
                <div><span style="width:${generated?'100':'42'}%"></span></div>
                <b>${videoTotalDurationLabel()}</b>
              </div>
            </div>
            <footer class="nami-video-stage-footer">
              <div>
                <b>本地功能已保留</b>
                <span>分镜切换、视频模型、清晰度、时长、比例、配音、字幕、预览、生成和导出。</span>
              </div>
            </footer>
          </main>

          <aside class="nami-video-inspector-panel" aria-label="右侧属性面板">
            <header class="nami-video-panel-head">
              <div>
                <h3>属性面板</h3>
                <p>基础、生成、输出</p>
              </div>
              <span>可编辑</span>
            </header>
            <div class="nami-video-inspector-body">
              <details class="nami-video-section" open>
                <summary>镜头基础信息 <span>⌄</span></summary>
                <div>
                  <label class="nami-editor-prompt">
                    <span>镜头描述</span>
                    <textarea readonly aria-label="当前镜头描述">${escapeHtml(promptText)}</textarea>
                    <em>${promptLength}/800</em>
                    <button type="button" data-video-optimize>优化</button>
                  </label>
                  <div class="nami-video-shot-summary">
                    <div><span>片段时长</span><b>${escapeHtml(selected.dur||'3.0s')}</b></div>
                    <div><span>字幕状态</span><b>${state.videoSubtitleEnabled?'开启':'关闭'}</b></div>
                    <div><span>配音状态</span><b>${escapeHtml(voiceStatus)}</b></div>
                  </div>
                </div>
              </details>
              <details class="nami-video-section" open>
                <summary>视频模型 <span>⌄</span></summary>
                <div>
                  <div class="nami-video-block-head"><span>当前模型</span><b>${escapeHtml(model.name)}</b></div>
                  <div class="nami-video-provider-tabs">${renderVideoProviderTabs(model)}</div>
                  <div class="nami-video-model-list">${renderVideoModelChoices(model)}</div>
                </div>
              </details>
              <details class="nami-video-section" open>
                <summary>视频设置 <span>⌄</span></summary>
                <div>
                  ${renderVideoSettingChips('时长','duration',videoDurationOptions(model),String(state.videoSettingDuration))}
                  ${renderVideoSettingChips('清晰度','resolution',model.resolutions,state.videoResolution)}
                  ${renderVideoSettingChips('宽高比','aspect',model.aspectRatios,state.videoSettingRatio)}
                </div>
              </details>
              <details class="nami-video-section" open>
                <summary>配音与字幕 <span>⌄</span></summary>
                <div class="nami-video-audio-grid">
                  <div class="row"><span>生成配音</span><button class="nami-video-switch ${state.videoVoiceEnabled&&voiceAvailable?'':'off'}" type="button" data-video-toggle="voice" aria-label="生成配音开关" ${voiceAvailable?'':'disabled'}></button></div>
                  <div class="row"><span>字幕</span><button class="nami-video-switch ${state.videoSubtitleEnabled?'':'off'}" type="button" data-video-toggle="subtitle" aria-label="字幕开关"></button></div>
                  <small>${voiceAvailable?'当前模型支持生成音频':'当前模型无内置音频，字幕和后期配音仍可保留'}</small>
                </div>
              </details>
              <details class="nami-video-section" open>
                <summary>生成状态 <span>⌄</span></summary>
                <div>
                  <p class="nami-video-status-note">${generated?'第一集样片已就绪，可继续导出成片。':'当前还未生成整片，确认设置后可生成第一集样片。'}</p>
                </div>
              </details>
            </div>
          </aside>

          <section class="nami-video-story-strip" aria-label="底部分镜缩略时间线">
            <div class="nami-video-strip-meta">
              <b>底部分镜条</b>
              <span>点击分镜同步中央预览与右侧参数。</span>
            </div>
            <div class="nami-video-strip-list">
              ${state.storyboards.map((item,index)=>renderVideoFrame(item,index)).join('')}
            </div>
            <div class="nami-video-strip-actions">
              <button class="nami-video-btn ghost" type="button" data-video-play>整片预览</button>
              <button class="nami-video-btn primary" type="button" data-video-open-cost>${generated?'导出成片':'生成整片'}</button>
              <span>${generated?'已生成':'待生成'} · ${videoTotalDurationLabel()}</span>
            </div>
          </section>
        </div>

        <div class="nami-video-mobile-actions">
          <button class="nami-video-btn ghost" type="button" data-video-prev>上一步</button>
          <button class="nami-video-btn primary" type="button" data-video-open-cost>${generated?'导出成片':'生成整片（'+counts.total+' 镜）'} <i>›</i></button>
        </div>

        ${renderVideoGenerationModal(credits,cost)}
      </section>
    `;
  }
  function videoGenerationCost(){
    return Math.max(VIDEO_CREDIT_COST,state.storyboards.length*6);
  }
  function videoDialogueCount(){
    return state.storyboards.filter(item=>item.who).length;
  }
  function videoPendingVoiceCount(){
    if(!state.videoVoiceEnabled||state.videoVoiceCompleted) return 0;
    return Math.min(2,videoDialogueCount());
  }
  function videoSelectedShot(){
    ensureStoryboards();
    let selected=state.storyboards.find(item=>item.id===state.videoSelectedShotId);
    if(!selected){
      selected=state.storyboards.find(item=>item.id==='D012')||state.storyboards[0];
      state.videoSelectedShotId=selected?.id||'';
    }
    return selected||{id:'D001',dur:'3.0s',line:'暂无镜头',who:'',image:'暂无镜头'};
  }
  function videoSubtitleLine(item){
    if(!state.videoSubtitleEnabled) return '字幕已关闭';
    if(item.who) return `${escapeHtml(item.who)}：${escapeHtml(item.line)}`;
    return escapeHtml(item.line||item.image||'');
  }
  function videoTotalDuration(){
    return state.storyboards.reduce((sum,item)=>sum+(parseFloat(item.dur)||3),0);
  }
  function videoTotalDurationLabel(){
    const total=Math.round(videoTotalDuration());
    const minutes=String(Math.floor(total/60)).padStart(2,'0');
    const seconds=String(total%60).padStart(2,'0');
    return `00:00 / ${minutes}:${seconds}`;
  }
  function videoFrameImage(index){
    const images=[
      'assets/images/story-cases/case-platform-nine.png',
      'assets/images/story-cases/case-xingchao-archive.png',
      'assets/images/story-cases/case-fog-harbor-letter.png',
      'assets/images/story-cases/case-redline-chase.png',
      'assets/images/story-cases/case-empty-city-light.png',
      'assets/images/story-cases/case-icefield-echo.png',
      'assets/images/story-cases/case-guixu-radio.png',
      'assets/images/story-cases/case-shanhai-oath.png'
    ];
    return images[index%images.length];
  }
  function renderVideoFrame(item,index){
    const active=item.id===state.videoSelectedShotId;
    return `<button class="nami-video-frame ${active?'on':''}" type="button" data-video-select-shot="${escapeHtml(item.id)}">
      <i>动态</i>
      <img src="${escapeHtml(videoFrameImage(index))}" alt="镜头 ${escapeHtml(item.id)} 画面"/>
      <span><b>分镜${escapeHtml(String(index+1))}</b><small>${escapeHtml(item.dur||'3.0s')}</small></span>
      <em>${item.who?videoSubtitleLine(item):'设置声音'}</em>
    </button>`;
  }
  function renderVideoGenerationModal(credits,cost){
    if(state.videoModal==='export') return `<div class="nami-video-scrim" id="video-modal-scrim" role="dialog" aria-modal="true">
      <div class="nami-video-modal">
        <header><h3>第一集样片已就绪</h3><p>整片 ${videoTotalDurationLabel().split('/ ')[1]}，${state.storyboards.length} 个镜头全部完成，可保存到项目库或导出离线文件。</p></header>
        <div class="body">
          <div><span>片长 / 镜头</span><b>${videoTotalDurationLabel().split('/ ')[1]} · ${state.storyboards.length} 镜</b></div>
          <div><span>视频设置</span><b>${escapeHtml(videoSettingSummary())}</b></div>
          <p>已包含字幕与配音。导出后也可以回到项目库继续调整。</p>
        </div>
        <footer><button class="nami-video-btn ghost" type="button" data-video-modal-close>保存到项目库</button><button class="nami-video-btn primary" type="button" data-video-export>导出成片</button></footer>
      </div>
    </div>`;
    if(state.videoModal!=='cost') return '';
    return `<div class="nami-video-scrim" id="video-modal-scrim" role="dialog" aria-modal="true">
      <div class="nami-video-modal">
        <header><h3>确认生成第一集样片</h3><p>生成开始前再确认一次镜头数量、预计耗时和字幕配音设置。结果仍可继续修改。</p></header>
        <div class="body">
          <div><span>生成内容</span><b>${state.storyboards.length} 镜整片</b></div>
          <div><span>预计耗时</span><b>约 4 分钟</b></div>
          <div><span>视频设置</span><b>${escapeHtml(videoSettingSummary())}</b></div>
          <div><span>字幕配音</span><b>${state.videoVoiceEnabled?'配音开启':'配音关闭'} · ${state.videoSubtitleEnabled?'字幕开启':'字幕关闭'}</b></div>
          <p>生成失败的镜头会保留重试入口。建议先生成低清样片，满意后再高清渲染。</p>
        </div>
        <footer><button class="nami-video-btn ghost" type="button" data-video-modal-close>再检查一下</button><button class="nami-video-btn primary" type="button" data-video-confirm-generate>确认生成</button></footer>
      </div>
    </div>`;
  }
  function settingOption(group,value,label,copy){
    const selected=(group==='ratio'?state.videoRatio:state.videoStyle)===value;
    const isStyle=group==='style';
    const visual=isStyle?styleVisuals[value]:null;
    const styleVisual=isStyle&&visual?`<div class="nami-style-thumb" data-style="${escapeHtml(visual.slug)}" data-image-target="${escapeHtml(visual.target)}" aria-hidden="true"></div>`:'';
    return `<button class="nami-setting-card ${selected?'selected':''} ${isStyle?'nami-style-card':''}" type="button" data-setting-group="${escapeHtml(group)}" data-setting-value="${escapeHtml(value)}">${styleVisual}<span>${escapeHtml(group==='ratio'?'画面比例':'视频风格')}</span><b>${escapeHtml(label)}</b><small>${escapeHtml(copy)}</small></button>`;
  }
  function assetStudioKeys(){
    return ['role','scene','prop'];
  }
  function assetSectionCounts(key){
    const items=assetStudioData[key].items;
    const confirmed=items.filter(item=>assetItemState(item.id)==='confirmed').length;
    return {confirmed,total:items.length,remaining:items.length-confirmed};
  }
  function assetOverallCounts(){
    return assetStudioKeys().reduce((acc,key)=>{
      const counts=assetSectionCounts(key);
      acc.confirmed+=counts.confirmed;
      acc.total+=counts.total;
      acc.remaining+=counts.remaining;
      return acc;
    },{confirmed:0,total:0,remaining:0});
  }
  function assetItemState(id){
    return state.assetItemStates[id]||defaultAssetItemStates[id]||'empty';
  }
  function setAssetItemState(id,value){
    state.assetItemStates[id]=value;
    state.assetsConfirmed=assetOverallCounts().remaining===0;
  }
  function assetFindItem(id){
    for(const key of assetStudioKeys()){
      const item=assetStudioData[key].items.find(entry=>entry.id===id);
      if(item) return {key,section:assetStudioData[key],item};
    }
    return null;
  }
  function renderAssetStudioTabs(){
    return assetStudioKeys().map(key=>{
      const section=assetStudioData[key];
      const counts=assetSectionCounts(key);
      const allDone=counts.remaining===0;
      return `<button class="nami-rs-tab ${state.assetTab===key?'on':''} ${allDone?'alldone':''}" type="button" data-asset-switch="${escapeHtml(key)}">
        <span>${section.icon}</span>${escapeHtml(section.label)}
        <i>${counts.confirmed}/${counts.total}</i>
        <em>${assetStudioIcons.check}</em>
      </button>`;
    }).join('');
  }
  function renderAssetCurrentTracker(){
    const counts=assetSectionCounts(state.assetTab);
    return `<span>本类 <b>${counts.confirmed}</b> / ${counts.total} 已确认</span>`;
  }
  function renderAssetStudioCards(){
    const section=assetStudioData[state.assetTab];
    return section.items.map(item=>renderAssetStudioCard(section,item)).join('')+
      `<button class="nami-rs-add-card" type="button" data-asset-add>${assetStudioIcons.add}<span>新增${escapeHtml(section.label)}</span></button>`;
  }
  function renderAssetStudioCard(section,item){
    const itemState=assetItemState(item.id);
    const isConfirmed=itemState==='confirmed';
    const voice=state.assetVoices[item.id]||item.voice||'';
    const voiceButton=state.assetTab==='role'?`<button class="nami-rs-voice ${voice?'set':''}" type="button" data-asset-voice="${escapeHtml(item.id)}">${assetStudioIcons.mic}${escapeHtml(voice?voice.split('-').slice(-1)[0]:'设置音色')}</button>`:'';
    const regen=(itemState==='done'||itemState==='confirmed')?`<button class="nami-rs-cardgo regen" type="button" data-asset-regenerate-one="${escapeHtml(item.id)}" title="重新生成">${assetStudioIcons.refresh}</button>`:'';
    let action='';
    if(itemState==='empty') action=`<button class="nami-rs-cardgo gen" type="button" data-asset-generate-one="${escapeHtml(item.id)}">${assetStudioIcons.spark}生成</button>`;
    if(itemState==='gen') action='<button class="nami-rs-cardgo busy" type="button">生成中...</button>';
    if(itemState==='done') action=`<button class="nami-rs-cardgo confirm" type="button" data-asset-confirm-one="${escapeHtml(item.id)}">${assetStudioIcons.check}确认</button>`;
    if(itemState==='confirmed') action=`<span class="nami-rs-cardgo confirmed-state">${assetStudioIcons.check} 已确认</span>`;
    return `<article class="nami-rs-card ${itemState} ${isConfirmed?'confirmed':''}" id="asset-card-${escapeHtml(item.id)}">
      <div class="nami-rs-preview">
        ${item.main?'<span class="nami-rs-main-badge">主</span>':''}
        <span class="nami-rs-confirm-tag">${assetStudioIcons.check} 已确认</span>
        <div class="nami-rs-empty">${section.icon}<span>未生成 · 点击下方生成</span></div>
        <div class="nami-rs-generating"><i></i><span>正在生成${escapeHtml(section.viewLabel)}...</span></div>
        <div class="nami-rs-views">${section.views.map(view=>`<div>${section.icon}<span>${escapeHtml(view)}</span></div>`).join('')}</div>
      </div>
      <div class="nami-rs-card-body">
        <div class="nami-rs-name-row"><b>${escapeHtml(item.name)}</b><small>${escapeHtml(item.kind)}</small></div>
        <p class="nami-rs-view-label">${escapeHtml(section.viewLabel)}：<strong>${section.views.map(escapeHtml).join(' / ')}</strong></p>
        <div class="nami-rs-attrs">${item.attrs.map(attr=>`<span>${escapeHtml(attr)}</span>`).join('')}</div>
        <p class="nami-rs-desc">${escapeHtml(item.desc)}</p>
      </div>
      <div class="nami-rs-card-foot">
        ${voiceButton}
        <button class="nami-rs-mini" type="button" data-asset-edit="${escapeHtml(item.id)}" title="编辑">${assetStudioIcons.edit}</button>
        <button class="nami-rs-mini del" type="button" data-asset-delete="${escapeHtml(item.id)}" title="删除">${assetStudioIcons.del}</button>
        <span></span>
        ${regen}${action}
      </div>
    </article>`;
  }
  function renderAssetStudioActionBar(){
    const counts=assetOverallCounts();
    const missing=assetStudioKeys().map(key=>{
      const sectionCounts=assetSectionCounts(key);
      return sectionCounts.remaining?`${assetStudioData[key].label} ${sectionCounts.remaining} 项`:'';
    }).filter(Boolean);
    const ready=counts.remaining===0;
    return `<div class="nami-rs-actionbar">
      <p>${ready?`<b>全部 ${counts.total} 项已确认</b>，可以进入分镜脚本了。`:`还有 <strong>${escapeHtml(missing.join('、'))}</strong> 待确认，全部确认后才能进入分镜。`}</p>
      <button class="nami-rs-btn ghost" type="button" data-asset-prev>上一步</button>
      <button class="nami-rs-btn primary" type="button" data-asset-next ${ready?'':'disabled'}>下一步：分镜脚本<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></button>
    </div>`;
  }
  function renderAssetVoiceModal(){
    if(!assetVoiceTarget) return '';
    const found=assetFindItem(assetVoiceTarget);
    if(!found) return '';
    const current=pendingAssetVoice||state.assetVoices[assetVoiceTarget]||found.item.voice||'';
    const tabs=Object.keys(assetVoiceOptions);
    return `<div class="nami-rs-scrim" id="asset-voice-scrim" role="dialog" aria-modal="true">
      <div class="nami-rs-modal">
        <header>
          <span>${assetStudioIcons.mic}</span>
          <h3>设置音色 · ${escapeHtml(found.item.name)}</h3>
          <button type="button" data-asset-voice-close aria-label="关闭">${assetStudioIcons.x}</button>
        </header>
        <div class="nami-rs-voice-tabs">${tabs.map(tab=>`<button class="${tab===assetVoiceTab?'on':''}" type="button" data-asset-voice-tab="${escapeHtml(tab)}">${escapeHtml(tab)}</button>`).join('')}</div>
        <div class="nami-rs-voice-list">
          ${assetVoiceOptions[assetVoiceTab].map(voice=>{
            const selected=voice[0]===current;
            return `<button class="nami-rs-voice-card ${selected?'on':''}" type="button" data-asset-pick-voice="${escapeHtml(voice[0])}">
              <span class="nami-rs-play" data-asset-voice-preview="${escapeHtml(voice[0])}">${assetStudioIcons.play}</span>
              <span><b>${escapeHtml(voice[0])}</b><small><i>${escapeHtml(voice[1])}</i>${escapeHtml(voice[2])}</small></span>
              <em>${assetStudioIcons.check}</em>
            </button>`;
          }).join('')}
        </div>
        <footer><button class="nami-rs-btn ghost" type="button" data-asset-voice-close>取消</button><button class="nami-rs-btn primary" type="button" data-asset-save-voice>使用该音色</button></footer>
      </div>
    </div>`;
  }
  function assetTitle(id){
    const found=assetFindItem(id);
    return found?found.item.name:'资产';
  }
  function bindPanelEvents(){
    const idea=document.getElementById('idea-input');
    const script=document.getElementById('script-editor');
    const scriptFile=document.getElementById('script-file');
    const scriptModel=document.getElementById('script-model');
    if(scriptModel){
      scriptModel.addEventListener('change',()=>{
        state.scriptModel=scriptModel.value;
        save();
        render();
      });
    }
    if(idea){
      idea.addEventListener('input',()=>{
        state.idea=idea.value;
        document.getElementById('ai-create').disabled=!state.idea.trim();
        save();
      });
    }
    if(script){
      script.addEventListener('input',()=>{
        state.script=script.value.slice(0,MAX_SCRIPT_LENGTH);
        document.getElementById('script-count').textContent=state.script.length+'/'+MAX_SCRIPT_LENGTH;
        save();
        renderStatusOnly();
      });
    }
    document.getElementById('ai-create')?.addEventListener('click',()=>{
      const ideaText=state.idea.trim()||'主角发现异常线索，进入一场悬疑故事。';
      state.script=`第一集分镜视频剧本：${ideaText}\n\n开场：主角在熟悉的地点发现一个不合常理的细节，镜头快速推近，抛出“为什么只有我看见？”的钩子。\n\n发展：主角顺着线索找到关键人物或关键道具，对方只说半句话就消失，冲突从日常转为危险。\n\n反转：主角以为自己在追查别人，实际证据指向自己。画面切换到旧照片、录音或门禁记录，强化悬疑感。\n\n结尾：主角打开最后一道门，看见和自己有关的真相，画面停在震惊表情并留下下一集问题。`;
      state.generatedFromIdea=ideaText;
      save();
      render();
      toast(state.scriptModel+' 已生成剧本，可继续编辑');
    });
    document.querySelectorAll('[data-editor-action]').forEach(button=>button.addEventListener('click',()=>{
      const action=button.dataset.editorAction;
      if(action==='copy'){
        if(!hasScript()) return toast('请输入内容');
        navigator.clipboard?.writeText(state.script);
        return toast('已复制');
      }
      if(action==='clear'){
        state.script='';
        save();
        render();
        return toast('已清空');
      }
      if(action==='upload') return scriptFile?.click();
    }));
    scriptFile?.addEventListener('change',()=>{
      const file=scriptFile.files?.[0];
      if(!file) return;
      state.script='已上传剧本：《'+file.name+'》\n\n这里会显示上传剧本解析后的文本内容。';
      save();
      render();
      toast('上传剧本成功');
    });
    document.querySelectorAll('[data-setting-group]').forEach(button=>button.addEventListener('click',()=>{
      if(button.dataset.settingGroup==='ratio') state.videoRatio=button.dataset.settingValue;
      if(button.dataset.settingGroup==='style') state.videoStyle=button.dataset.settingValue;
      state.videoConfirmed=false;
      save();
      render();
    }));
    document.querySelector('[data-stage-reset="video"]')?.addEventListener('click',()=>{
      state.videoRatio='9:16';
      state.videoModel='neo-video-2-0';
      state.videoModelProvider='DOUBAO';
      state.videoResolution='480p';
      state.videoSettingDuration='4';
      state.videoSettingRatio='16:9';
      state.videoStyle='都市写实';
      state.videoConfirmed=false;
      save();
      render();
      toast('已恢复默认视频设定');
    });
    document.querySelectorAll('[data-asset-switch]').forEach(button=>button.addEventListener('click',()=>{
      state.assetTab=button.dataset.assetSwitch;
      save();
      render();
    }));
    document.getElementById('confirm-video')?.addEventListener('click',()=>{
      state.videoConfirmed=true;
      save();
      render();
      toast('已确认视频设定');
    });
    document.querySelectorAll('[data-asset-generate-one],[data-asset-regenerate-one]').forEach(button=>button.addEventListener('click',()=>{
      const id=button.dataset.assetGenerateOne||button.dataset.assetRegenerateOne;
      const name=assetTitle(id);
      setAssetItemState(id,'gen');
      save();
      render();
      toast((button.dataset.assetRegenerateOne?'重新生成 ':'正在生成 ')+name+'...');
      setTimeout(()=>{
        setAssetItemState(id,'done');
        save();
        render();
      },1500);
    }));
    document.querySelectorAll('[data-asset-confirm-one]').forEach(button=>button.addEventListener('click',()=>{
      const id=button.dataset.assetConfirmOne;
      if(assetItemState(id)!=='done') return;
      setAssetItemState(id,'confirmed');
      save();
      render();
      toast(assetTitle(id)+' 已确认');
    }));
    document.querySelector('[data-asset-generate-current]')?.addEventListener('click',()=>{
      const items=assetStudioData[state.assetTab].items.filter(item=>assetItemState(item.id)==='empty');
      if(!items.length) return toast('本类没有未生成项');
      items.forEach(item=>setAssetItemState(item.id,'gen'));
      save();
      render();
      toast('正在批量生成 '+items.length+' 项...');
      items.forEach((item,index)=>{
        setTimeout(()=>{
          setAssetItemState(item.id,'done');
          save();
          render();
        },1400+index*500);
      });
    });
    document.querySelectorAll('[data-asset-voice]').forEach(button=>button.addEventListener('click',()=>{
      assetVoiceTarget=button.dataset.assetVoice;
      assetVoiceTab='Recent';
      pendingAssetVoice=state.assetVoices[assetVoiceTarget]||assetFindItem(assetVoiceTarget)?.item.voice||'';
      render();
    }));
    document.querySelectorAll('[data-asset-voice-tab]').forEach(button=>button.addEventListener('click',()=>{
      assetVoiceTab=button.dataset.assetVoiceTab;
      render();
    }));
    document.querySelectorAll('[data-asset-pick-voice]').forEach(button=>button.addEventListener('click',()=>{
      pendingAssetVoice=button.dataset.assetPickVoice;
      render();
    }));
    document.querySelectorAll('[data-asset-voice-preview]').forEach(button=>button.addEventListener('click',event=>{
      event.stopPropagation();
      toast('试听：'+button.dataset.assetVoicePreview);
    }));
    document.querySelector('[data-asset-save-voice]')?.addEventListener('click',()=>{
      if(assetVoiceTarget&&pendingAssetVoice){
        state.assetVoices[assetVoiceTarget]=pendingAssetVoice;
        save();
        toast(assetTitle(assetVoiceTarget)+' 的音色已设置');
      }
      assetVoiceTarget=null;
      pendingAssetVoice=null;
      render();
    });
    document.querySelectorAll('[data-asset-voice-close]').forEach(button=>button.addEventListener('click',()=>{
      assetVoiceTarget=null;
      pendingAssetVoice=null;
      render();
    }));
    document.getElementById('asset-voice-scrim')?.addEventListener('click',event=>{
      if(event.target.id==='asset-voice-scrim'){
        assetVoiceTarget=null;
        pendingAssetVoice=null;
        render();
      }
    });
    document.querySelector('[data-asset-add]')?.addEventListener('click',()=>toast('新增'+assetStudioData[state.assetTab].label+'（演示）'));
    document.querySelectorAll('[data-asset-edit]').forEach(button=>button.addEventListener('click',()=>toast('编辑设定')));
    document.querySelectorAll('[data-asset-delete]').forEach(button=>button.addEventListener('click',()=>toast('已移除（演示）')));
    document.querySelector('[data-asset-prev]')?.addEventListener('click',()=>{
      state.stage=1;
      save();
      render();
    });
    document.querySelector('[data-asset-next]')?.addEventListener('click',()=>{
      const counts=assetOverallCounts();
      if(counts.remaining>0) return toast('请先确认全部角色、场景和道具');
      state.assetsConfirmed=true;
      state.stage=3;
      ensureStoryboards();
      save();
      render();
    });
    document.querySelectorAll('[data-board-filter]').forEach(button=>button.addEventListener('click',()=>{
      state.storyboardFilter=button.dataset.boardFilter;
      save();
      render();
    }));
    document.querySelectorAll('[data-board-generate-one],[data-board-regenerate-one]').forEach(button=>button.addEventListener('click',()=>{
      const id=button.dataset.boardGenerateOne||button.dataset.boardRegenerateOne;
      const shot=state.storyboards.find(item=>item.id===id);
      if(!shot) return;
      shot.state='gen';
      save();
      render();
      toast((button.dataset.boardRegenerateOne?'重新生成 ':'正在生成 ')+id+' 画面...');
      setTimeout(()=>{
        const current=state.storyboards.find(item=>item.id===id);
        if(current) current.state='done';
        save();
        render();
      },1400);
    }));
    document.querySelectorAll('[data-board-confirm-one]').forEach(button=>button.addEventListener('click',()=>{
      const shot=state.storyboards.find(item=>item.id===button.dataset.boardConfirmOne);
      if(!shot||shot.state!=='done') return;
      shot.state='confirmed';
      save();
      render();
      toast(shot.id+' 已确认');
    }));
    document.querySelector('[data-board-generate-all]')?.addEventListener('click',()=>{
      const counts=storyboardCounts();
      if(!counts.pending) return toast('没有未生成的镜头');
      storyboardModal={type:'cost'};
      render();
    });
    document.querySelector('[data-board-confirm-cost]')?.addEventListener('click',()=>{
      const pending=state.storyboards.filter(item=>item.state==='empty');
      storyboardModal=null;
      pending.forEach(item=>{item.state='gen';});
      save();
      render();
      toast('正在批量生成 '+pending.length+' 个镜头...');
      pending.forEach((item,index)=>{
        setTimeout(()=>{
          const shot=state.storyboards.find(entry=>entry.id===item.id);
          if(shot) shot.state='done';
          save();
          render();
        },1200+index*450);
      });
    });
    document.querySelectorAll('[data-board-edit]').forEach(button=>button.addEventListener('click',()=>{
      storyboardModal={type:'edit',id:button.dataset.boardEdit};
      storyboardDurationDraft='';
      render();
    }));
    document.querySelectorAll('[data-board-duration]').forEach(button=>button.addEventListener('click',()=>{
      storyboardDurationDraft=button.dataset.boardDuration;
      render();
    }));
    document.querySelectorAll('[data-board-save-edit]').forEach(button=>button.addEventListener('click',()=>{
      const shot=state.storyboards.find(item=>item.id===button.dataset.boardSaveEdit);
      if(!shot) return;
      const image=document.getElementById('board-edit-line')?.value.trim();
      const line=document.getElementById('board-edit-dialog')?.value.trim();
      if(image){
        shot.image=image;
        if(!shot.who) shot.line=image;
      }
      if(shot.who&&line) shot.line=line;
      if(storyboardDurationDraft) shot.dur=storyboardDurationDraft;
      storyboardModal=null;
      storyboardDurationDraft='';
      save();
      render();
      toast(shot.id+' 已更新');
    }));
    document.querySelectorAll('[data-board-modal-close]').forEach(button=>button.addEventListener('click',()=>{
      storyboardModal=null;
      storyboardDurationDraft='';
      render();
    }));
    document.getElementById('board-modal-scrim')?.addEventListener('click',event=>{
      if(event.target.id==='board-modal-scrim'){
        storyboardModal=null;
        storyboardDurationDraft='';
        render();
      }
    });
    document.querySelectorAll('[data-board-preview]').forEach(button=>button.addEventListener('click',()=>toast('放大预览 '+button.dataset.boardPreview)));
    document.querySelectorAll('[data-board-voice]').forEach(button=>button.addEventListener('click',()=>toast('试听配音 · '+button.dataset.boardVoice)));
    document.querySelector('[data-board-add]')?.addEventListener('click',()=>toast('新增镜头（演示）'));
    document.querySelectorAll('[data-board-delete]').forEach(button=>button.addEventListener('click',()=>toast('已移除（演示）')));
    document.querySelector('[data-board-prev]')?.addEventListener('click',()=>{
      state.stage=2;
      save();
      render();
    });
    document.querySelector('[data-board-next]')?.addEventListener('click',()=>{
      const counts=storyboardCounts();
      if(counts.confirmed<counts.total) return toast('请先确认全部分镜镜头');
      state.stage=4;
      save();
      render();
    });
    document.querySelectorAll('[data-video-select-shot]').forEach(button=>button.addEventListener('click',()=>{
      state.videoSelectedShotId=button.dataset.videoSelectShot;
      save();
      render();
      toast('正在预览镜头 '+state.videoSelectedShotId);
    }));
    document.querySelectorAll('[data-video-provider]').forEach(button=>button.addEventListener('click',()=>{
      const provider=button.dataset.videoProvider;
      const firstModel=videoModelsByProvider(provider)[0];
      if(firstModel){
        state.videoModelProvider=provider;
        state.videoModel=firstModel.value;
        ensureVideoModelState(state);
      }
      save();
      render();
    }));
    document.querySelectorAll('[data-video-model]').forEach(button=>button.addEventListener('click',()=>{
      state.videoModel=button.dataset.videoModel;
      const model=videoFindModel(state.videoModel);
      if(model) state.videoModelProvider=model.provider;
      ensureVideoModelState(state);
      save();
      render();
    }));
    document.querySelectorAll('[data-video-resolution]').forEach(button=>button.addEventListener('click',()=>{
      state.videoResolution=button.dataset.videoResolution;
      ensureVideoModelState(state);
      save();
      render();
    }));
    document.querySelectorAll('[data-video-duration]').forEach(button=>button.addEventListener('click',()=>{
      state.videoSettingDuration=button.dataset.videoDuration;
      ensureVideoModelState(state);
      save();
      render();
    }));
    document.querySelectorAll('[data-video-aspect]').forEach(button=>button.addEventListener('click',()=>{
      state.videoSettingRatio=button.dataset.videoAspect;
      ensureVideoModelState(state);
      save();
      render();
    }));
    document.querySelectorAll('[data-video-toggle]').forEach(button=>button.addEventListener('click',()=>{
      if(button.disabled) return;
      if(button.dataset.videoToggle==='voice') state.videoVoiceEnabled=!state.videoVoiceEnabled;
      if(button.dataset.videoToggle==='subtitle') state.videoSubtitleEnabled=!state.videoSubtitleEnabled;
      save();
      render();
    }));
    document.querySelector('[data-video-fill-voice]')?.addEventListener('click',()=>{
      state.videoVoiceCompleted=true;
      save();
      render();
      toast('配音已补齐');
    });
    document.querySelector('[data-video-optimize]')?.addEventListener('click',()=>toast('已优化当前镜头设置'));
    document.querySelectorAll('[data-video-open-cost]').forEach(button=>button.addEventListener('click',()=>{
      state.videoModal=state.videoGenerated?'export':'cost';
      save();
      render();
    }));
    document.querySelector('[data-video-confirm-generate]')?.addEventListener('click',()=>{
      state.videoModal=null;
      completeFullVideoGeneration();
      render();
      toast('已开始生成，可在任务队列查看进度');
    });
    document.querySelector('[data-video-export]')?.addEventListener('click',()=>{
      state.videoModal=null;
      save();
      render();
      toast('正在导出成片...');
    });
    document.querySelectorAll('[data-video-modal-close]').forEach(button=>button.addEventListener('click',()=>{
      state.videoModal=null;
      save();
      render();
      if(button.closest('.nami-video-modal')?.querySelector('h3')?.textContent.includes('已就绪')) toast('已保存到项目库');
    }));
    document.getElementById('video-modal-scrim')?.addEventListener('click',event=>{
      if(event.target.id==='video-modal-scrim'){
        state.videoModal=null;
        save();
        render();
      }
    });
    document.querySelector('[data-video-prev]')?.addEventListener('click',()=>{
      state.stage=3;
      save();
      render();
    });
    document.querySelector('[data-video-play]')?.addEventListener('click',()=>toast('正在预览当前镜头'));
    document.getElementById('regen-storyboard')?.addEventListener('click',()=>{state.storyboards=[];ensureStoryboards();save();render();toast('已重新生成分镜');});
    document.querySelectorAll('[data-login-action]').forEach(button=>button.addEventListener('click',()=>openLogin('请先使用邀请码登录')));
  }
  function renderStatusOnly(){
    const stage=stages[state.stage];
    els.outputStatus.textContent=stage.status();
  }
  function validateCurrent(){
    if(state.stage===0&&!hasScript()){
      toast('请输入内容');
      return false;
    }
    if(state.stage===1) state.videoConfirmed=true;
    if(state.stage===2){
      const counts=assetOverallCounts();
      if(counts.remaining>0){
        toast('请先确认全部角色、场景和道具');
        return false;
      }
      state.assetsConfirmed=true;
    }
    if(state.stage===3){
      ensureStoryboards();
      const counts=storyboardCounts();
      if(counts.confirmed<counts.total){
        toast('请先确认全部分镜镜头');
        return false;
      }
    }
    if(state.stage===4){
      state.videoModal=state.videoGenerated?'export':'cost';
      save();
      render();
      return false;
    }
    save();
    return true;
  }
  function goToStage(index){
    if(index>state.stage){
      toast('请先完成当前步骤');
      return;
    }
    state.stage=index;
    save();
    render();
  }
  els.next.addEventListener('click',()=>{
    if(!validateCurrent()) return;
    if(state.stage<stages.length-1){
      state.stage+=1;
      save();
      render();
      return;
    }
    toast('项目版本已保存');
  });
  els.back.addEventListener('click',()=>{
    if(state.stage>0){
      state.stage-=1;
      save();
      render();
    }
  });
  document.getElementById('studio-return')?.addEventListener('click',()=>{
    if(window.history.length>1) window.history.back();
    else window.location.href='index.html';
  });
  document.getElementById('shot-count-toggle')?.addEventListener('click',()=>toast('分镜数量：自动'));
  document.getElementById('asset-buy-top')?.addEventListener('click',()=>{
    if(currentView==='assets') return toast('请先登录后购买');
    openLogin('请先使用邀请码登录');
  });
  document.getElementById('save-exit')?.addEventListener('click',()=>toast('已保存项目'));
  document.getElementById('guide-question')?.addEventListener('click',()=>openLogin('请先使用邀请码登录'));
  window.addEventListener('popstate',()=>{
    currentView=new URLSearchParams(location.search).get('menuKey')==='assets'?'assets':'creator';
    render();
  });
  document.getElementById('login-close')?.addEventListener('click',closeLogin);
  els.loginModal?.addEventListener('click',event=>{
    if(event.target===els.loginModal) closeLogin();
  });
  document.getElementById('studio-invite-login')?.addEventListener('click',loginWithInvite);
  document.getElementById('studio-login-invite')?.addEventListener('keydown',event=>{
    if(event.key==='Enter') loginWithInvite();
  });
  document.querySelectorAll('.production-stages [data-stage]').forEach(button=>{
    button.addEventListener('click',()=>goToStage(Number(button.dataset.stage)));
  });
  render();
})();
