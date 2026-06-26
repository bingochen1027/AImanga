(function(){
  const STORAGE_KEY='md-nami-workbench';
  const CONNECTED_KEY='md-connected-state';
  const INVITE_KEY='md-invite-codes';
  const MAX_SCRIPT_LENGTH=10000;
  const VIDEO_DURATION_SECONDS=15;
  const VIDEO_CREDIT_COST=15;
  const DEFAULT_PROJECT_ID='1729382256911763547';
  const defaultInvites=[
    {code:'ESALES2026',label:'第一阶段内测码',status:'启用',maxUses:60,used:0,createdAt:'2026-06-25 10:00',note:'用于首批内测用户注册'},
    {code:'AIMANGA60',label:'15秒分镜视频体验码',status:'启用',maxUses:30,used:0,createdAt:'2026-06-25 10:00',note:'用于体验第一阶段分镜视频生成'},
    {code:'TEAMTEST',label:'团队测试码',status:'启用',maxUses:10,used:0,createdAt:'2026-06-25 10:00',note:'内部团队验证'}
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
      status:()=>state.videoConfirmed?`15 秒上限 · ${state.videoRatio} · ${state.videoStyle}`:'待确认视频参数',
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
      status:()=>state.assetsConfirmed?'资产提示词已确认':(state.assetRegenerated?'资产已重新生成':'待确认资产提示词'),
      rules:['可修改提示词','可重新生成资产','人物资产提供四视图'],
      preview:['角色','场景','道具'],
      image:'assets/images/story-cases/case-fog-harbor-letter.png'
    },
    {
      name:'分镜脚本',
      next:'分镜视频',
      title:'分镜脚本',
      desc:'把剧本拆成可生成视频的镜头卡片，确认镜头顺序、画面描述和台词。',
      guideTitle:'检查分镜是否可生成',
      guideCopy:'进入分镜视频之前，需要至少有 3 条分镜。系统会根据剧本自动生成一版示例分镜。',
      action:'确认分镜脚本',
      status:()=>state.storyboards.length?'已生成 '+state.storyboards.length+' 条分镜':'待生成分镜',
      rules:['至少 3 条分镜','每条包含画面描述','可返回前一步调整资产'],
      preview:['镜头序号','画面描述','台词旁白'],
      image:'assets/images/story-cases/case-shanhai-oath.png'
    },
    {
      name:'分镜视频',
      next:'',
      title:'分镜视频',
      desc:'生成单条分镜视频任务，并检查片段状态、失败重试、单条分镜重生成和单条导出。',
      guideTitle:'生成分镜视频',
      guideCopy:'第一阶段生成动作需要先用邀请码登录；登录后会创建分镜视频演示任务，单个分镜视频上限 15 秒，并支持单条重生成和导出。',
      action:'生成分镜视频',
      status:()=>state.videoGenerated?'分镜视频已生成':'待生成分镜视频',
      rules:['必须邀请码登录','单个分镜上限 15 秒','支持单条分镜重生成和导出'],
      preview:['15 秒分镜','生成状态','单条导出'],
      image:'assets/images/story-cases/case-redline-chase.png'
    }
  ];
  const assetBlueprints=[
    {
      key:'role',
      title:'人物资产',
      examples:'主角、对手、关键线索人物',
      views:['正面','侧面','背面','表情'],
      checklist:['身份关系','年龄气质','发型服装','表情动作'],
      output:'人物四视图'
    },
    {
      key:'scene',
      title:'场景资产',
      examples:'街道、旧照相馆、雨夜天桥',
      views:['全景','近景','夜景','细节'],
      checklist:['空间结构','时代地点','光线天气','镜头质感'],
      output:'场景多视图'
    },
    {
      key:'prop',
      title:'道具资产',
      examples:'旧照片、录音笔、门禁卡',
      views:['正面','侧面','细节','使用状态'],
      checklist:['外形材质','尺寸比例','关键纹理','剧情用途'],
      output:'道具多视图'
    }
  ];
  const assetViewState={folderId:'root',previewId:null,dialog:null};
  const assetSessionMedia={};
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
      videoRatio:'9:16',
      videoStyle:'都市写实',
      videoConfirmed:false,
      assetsConfirmed:false,
      assetPrompts:{
        role:'主角：年轻创作者，外冷内热，服装以蓝白为主，需要正面、侧面、背面和表情四视图。',
        scene:'核心场景：雨夜街道、旧照相馆、天桥。保持同一城市、同一光线和同一镜头质感。',
        prop:'核心道具：旧照片、录音笔、门禁卡。需要清晰轮廓、材质细节和可复用视角。'
      },
      assetRegenerated:false,
      assetGenerated:{},
      assetUploads:{},
      storyboards:[],
      clipRegenerated:{},
      videoGenerated:false,
      postEdit:{crop:false,subtitle:true,sound:false,stitch:true},
      previewChecked:false,
      lastSaved:'自动保存于刚刚'
    };
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{};
      const merged=Object.assign(fallback,saved,{
        assetPrompts:Object.assign({},fallback.assetPrompts,saved.assetPrompts||{}),
        assetGenerated:Object.assign({},fallback.assetGenerated,saved.assetGenerated||{}),
        assetUploads:Object.assign({},fallback.assetUploads,saved.assetUploads||{}),
        clipRegenerated:Object.assign({},fallback.clipRegenerated,saved.clipRegenerated||{}),
        postEdit:Object.assign({},fallback.postEdit,saved.postEdit||{})
      });
      merged.stage=Math.min(Math.max(Number(merged.stage)||0,0),4);
      const allowedStyles=['都市写实','古风写实','暗黑悬疑','国漫现代（2d）','国漫古风（2d）','赛博朋克','3D动漫','90年代写实','90年代漫画风'];
      if(!allowedStyles.includes(merged.videoStyle)) merged.videoStyle='都市写实';
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
      if(normalizeInvite(invite.code)==='AIMANGA60'&&(/60秒|60 秒|短视频/.test(`${invite.label||''}${invite.note||''}`))){
        invite.label='15秒分镜视频体验码';
        invite.note='用于体验第一阶段分镜视频生成';
        updated=true;
      }
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
    if(invite.status!=='启用') return {ok:false,message:'该邀请码已停用，请联系运营重新开通。'};
    if(Number(invite.maxUses||0)>0&&Number(invite.used||0)>=Number(invite.maxUses)) return {ok:false,message:'该邀请码已达到可用次数上限。'};
    return {ok:true,invite};
  }
  function consumeInvite(code,phone){
    const normalized=normalizeInvite(code);
    const invites=readInvites();
    const invite=invites.find(item=>normalizeInvite(item.code)===normalized);
    if(!invite) return null;
    invite.users=Array.isArray(invite.users)?invite.users:[];
    if(!invite.users.includes(phone)){
      invite.used=Number(invite.used||0)+1;
      invite.users.push(phone);
    }
    invite.lastUsedAt=new Date().toLocaleString('zh-CN',{hour12:false});
    invite.lastUser=phone;
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
  function syncShortVideoGeneration(){
    const connected=readConnected();
    const project=(connected.projects&&connected.projects[0])||{
      id:'项目-'+currentProjectId.slice(-6),
      title:'第一条 15 秒分镜视频',
      stage:'分镜视频',
      progress:100,
      platform:state.videoRatio==='16:9'?'横屏 16:9':'竖屏 9:16',
      createdAt:new Date().toISOString()
    };
    if(!connected.projects||!connected.projects.length) connected.projects=[project];
    const already=(connected.events||[]).some(event=>event.name==='short_video_generated'&&event.meta&&event.meta.projectId===project.id);
    if(!already){
      connected.credits=Math.max(0,Number(connected.credits||0)-VIDEO_CREDIT_COST);
      connected.events=[...(connected.events||[]),{
        name:'short_video_generated',
        meta:{projectId:project.id,title:project.title,durationSeconds:VIDEO_DURATION_SECONDS,cost:VIDEO_CREDIT_COST,format:state.videoRatio,style:state.videoStyle},
        path:'creator-studio.html',
        at:new Date().toISOString()
      }].slice(-80);
      writeConnected(connected);
    }
  }
  function completeShortVideoGeneration(){
    if(!hasInviteSession()){
      openLogin('请先使用邀请码登录');
      return false;
    }
    state.videoGenerated=true;
    state.videoDuration=VIDEO_DURATION_SECONDS;
    state.videoCost=VIDEO_CREDIT_COST;
    state.videoGeneratedAt=new Date().toISOString();
    syncShortVideoGeneration();
    save();
    render();
    toast('15 秒分镜视频已生成');
    return true;
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
    if(state.storyboards.length) return;
    const base=state.script.trim()||'主角发现异常线索，开始进入故事核心冲突。';
    state.storyboards=[
      {shot:'01',scene:'开场异常',image:'主角在熟悉的街道上发现时间停顿，镜头从远景推进到面部特写。',line:'这里怎么只剩我一个人？'},
      {shot:'02',scene:'线索出现',image:'旧照片在手中发光，画面切到照片里的陌生房间。',line:'照片背后写着同一天的日期。'},
      {shot:'03',scene:'决定追查',image:'主角冲进雨夜，霓虹倒映在地面，远处出现关键人物剪影。',line:'我要找到这张照片的主人。'}
    ];
    if(base.length>80) state.storyboards.push({shot:'04',scene:'情绪钩子',image:'主角看见照片中的自己，画面停在震惊表情。',line:'为什么我也在里面？'});
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
    setDockActive('creator');
    els.micro.textContent=(state.stage+1)+' / '+stages.length+' · '+stage.name;
    els.title.textContent=stage.title;
    els.desc.textContent=stage.desc;
    els.next.textContent=stage.next?'下一步：'+stage.next:'完成制作';
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
  function setDockActive(view){
    document.querySelectorAll('.studio-dock a').forEach(link=>link.classList.remove('active'));
    const selector=view==='assets'?'[data-view-link="assets"]':'a[href="creator-studio.html"]';
    document.querySelector('.studio-dock '+selector)?.classList.add('active');
  }
  function assetUrl(){
    return 'creator-studio.html?menuKey=assets&id='+encodeURIComponent(currentProjectId);
  }
  function renderAssetsView(){
    body.dataset.stage='assets';
    setDockActive('assets');
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
            <span>没有剧本？AI帮你写：</span>
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
              <button type="button" data-editor-action="history">历史版本</button>
            </div>
          </div>
          <textarea id="script-editor" maxlength="${MAX_SCRIPT_LENGTH}" placeholder="粘贴或上传剧本内容。当前版本建议上传单集，生成效果更佳。">${escapeHtml(state.script)}</textarea>
          <input id="script-file" type="file" accept=".txt,.md,.doc,.docx" hidden/>
        </div>
        ${state.script.trim()?renderScriptVisualization():''}
      </div>
    `;
  }
  function renderVideoPanel(){
    return `
      <div class="nami-option-section">
        <div class="nami-option-heading"><span>单条上限</span><b>15 秒</b><small>单个分镜视频生成时长上限为 15 秒。</small></div>
        <div class="nami-option-heading"><span>预计消耗</span><b>${VIDEO_CREDIT_COST} 积分</b><small>登录后创建生成任务，失败会保留重试入口。</small></div>
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
          ${settingOption('style','都市写实','都市写实','现代城市、情感、职场和悬疑题材的写实质感。')}
          ${settingOption('style','古风写实','古风写实','适合古装、权谋、仙侠和历史感内容。')}
          ${settingOption('style','暗黑悬疑','暗黑悬疑','低调光影和强反差，适合反转、惊悚和犯罪题材。')}
          ${settingOption('style','国漫现代（2d）','国漫现代（2d）','线条清晰，适合现代连载漫剧和爽文题材。')}
          ${settingOption('style','国漫古风（2d）','国漫古风（2d）','国漫线稿与古风服化道结合，适合东方幻想。')}
          ${settingOption('style','赛博朋克','赛博朋克','霓虹、高科技和未来都市视觉。')}
          ${settingOption('style','3D动漫','3D动漫','角色体积感更强，适合轻喜剧、冒险和儿童向内容。')}
          ${settingOption('style','90年代写实','90年代写实','胶片色彩和年代环境，适合怀旧剧情。')}
          ${settingOption('style','90年代漫画风','90年代漫画风','复古漫画质感，适合强情绪和风格化叙事。')}
        </div>
      </div>
      <div class="nami-action-row"><button class="nami-green-btn" id="confirm-video" type="button">确认视频设定</button><button type="button" data-stage-reset="video">恢复默认</button></div>
    `;
  }
  function renderAssetPanel(){
    return `
      <div class="nami-asset-flow">
        <div><span>剧本资产拆分</span><b>人物</b><small>确认角色一致性</small></div>
        <div><span>空间资产拆分</span><b>场景</b><small>统一画面环境</small></div>
        <div><span>线索资产拆分</span><b>道具</b><small>保证剧情物件可复用</small></div>
      </div>
      <div class="nami-asset-prompt-grid">
        ${assetBlueprints.map(assetPromptCard).join('')}
      </div>
      <div class="nami-asset-confirm-strip">
        <div><b>${assetReadyCount()} / ${assetBlueprints.length}</b><span>类资产已生成或上传参考</span></div>
        <button class="nami-green-btn" id="regen-assets" type="button">按提示词重新生成全部资产</button>
        <button type="button" id="confirm-assets">确认资产清单</button>
      </div>
    `;
  }
  function renderStoryboardPanel(){
    ensureStoryboards();
    return `
      <div class="nami-table-list">
        ${state.storyboards.map(item=>`
          <div class="nami-shot-card">
            <b>${escapeHtml(item.shot)}</b>
            <div><span>${escapeHtml(item.scene)}</span><p>${escapeHtml(item.image)}</p><small>${escapeHtml(item.line)}</small></div>
          </div>
        `).join('')}
      </div>
      <div class="nami-action-row"><button class="nami-green-btn" id="regen-storyboard" type="button">重新生成分镜</button><button type="button" data-login-action>编辑分镜</button></div>
    `;
  }
  function renderVideoGeneratePanel(){
    return `
      <div class="nami-video-limit">
        <div><span>第一阶段输出</span><b>15 秒分镜视频</b></div>
        <p>${state.videoRatio==='16:9'?'横屏 16:9':'竖屏 9:16'} · ${escapeHtml(state.videoStyle)}，预计消耗 ${VIDEO_CREDIT_COST} 积分；必须先使用邀请码登录/注册。</p>
      </div>
      <div class="nami-table-list">
        ${state.storyboards.map((item,index)=>`
          <div class="nami-shot-card">
            <b>${escapeHtml(item.shot)}</b>
            <div><span>${escapeHtml(item.scene)}</span><p>${state.videoGenerated?'本条 15 秒分镜视频已生成，可单独导出。':'等待生成本条 15 秒分镜视频。'}</p><small>${state.videoGenerated?(state.clipRegenerated[item.shot]?'Regenerated':'Succeeded'):'Waiting'}</small></div>
            <div class="nami-shot-actions"><i>${state.videoGenerated?'✓':'待生成'}</i><button type="button" data-regenerate-shot="${escapeHtml(item.shot)}">重新生成</button><button type="button" data-export-shot="${escapeHtml(item.shot)}">导出</button></div>
          </div>
        `).join('')}
      </div>
      <div class="nami-action-row"><button class="nami-green-btn" id="generate-videos" type="button">生成分镜视频</button><button type="button" id="retry-videos">失败重试</button></div>
    `;
  }
  function renderScriptVisualization(){
    const brief=state.script.trim().split(/\n+/).filter(Boolean).slice(0,4);
    const cards=[
      ['开场钩子',brief[0]||'用异常事件在前 3 秒抓住用户。'],
      ['核心冲突',brief[1]||'主角发现线索并被迫做出选择。'],
      ['情绪反转',brief[2]||'关键人物出现，改变观众判断。'],
      ['结尾悬念',brief[3]||'留出下一集必须继续观看的问题。']
    ];
    return `<div class="nami-script-visual"><h3>AI 剧本故事可视化</h3><div>${cards.map(card=>`<article><span>${escapeHtml(card[0])}</span><p>${escapeHtml(card[1])}</p></article>`).join('')}</div></div>`;
  }
  function settingOption(group,value,label,copy){
    const selected=(group==='ratio'?state.videoRatio:state.videoStyle)===value;
    return `<button class="nami-setting-card ${selected?'selected':''}" type="button" data-setting-group="${escapeHtml(group)}" data-setting-value="${escapeHtml(value)}"><span>${escapeHtml(group==='ratio'?'画面比例':'视频风格')}</span><b>${escapeHtml(label)}</b><small>${escapeHtml(copy)}</small></button>`;
  }
  function assetPromptCard(config){
    const key=config.key;
    const prompt=state.assetPrompts[key]||'';
    const generated=Boolean(state.assetGenerated[key]);
    const upload=state.assetUploads[key]||'';
    return `
      <article class="nami-asset-prompt-card ${generated||upload?'ready':''}">
        <header>
          <span>${escapeHtml(config.title)}</span>
          <b>${escapeHtml(config.examples)}</b>
          <small>${escapeHtml(config.output)}：${config.views.map(escapeHtml).join(' / ')}</small>
        </header>
        <div class="nami-asset-checklist">${config.checklist.map(item=>`<em>${escapeHtml(item)}</em>`).join('')}</div>
        <textarea data-asset-prompt="${escapeHtml(key)}">${escapeHtml(prompt)}</textarea>
        <div class="nami-asset-preview-slots">
          ${config.views.map((view,index)=>`<div class="${generated||upload?'filled':''}"><b>${escapeHtml(view)}</b><small>${generated?'已生成':(upload?'参考已上传':'待生成')}</small><i>${index+1}</i></div>`).join('')}
        </div>
        <div class="nami-view-tags">${config.views.map(item=>`<em>${escapeHtml(item)}</em>`).join('')}</div>
        <div class="nami-asset-card-actions">
          <button type="button" data-generate-asset="${escapeHtml(key)}">${generated?'重新生成':'生成资产'}</button>
          <button type="button" data-upload-asset="${escapeHtml(key)}">${upload?'更换参考':'上传参考'}</button>
          <input type="file" accept="image/*" hidden data-asset-file="${escapeHtml(key)}"/>
        </div>
        <p class="nami-asset-status">${upload?`参考图：${escapeHtml(upload)}`:(generated?'已按当前提示词生成，可继续确认':'建议先检查提示词，再生成或上传参考图。')}</p>
      </article>
    `;
  }
  function assetReadyCount(){
    return assetBlueprints.filter(item=>state.assetGenerated[item.key]||state.assetUploads[item.key]).length;
  }
  function assetTitle(key){
    return assetBlueprints.find(item=>item.key===key)?.title||'资产';
  }
  function exportShotVideo(shotId){
    if(!state.videoGenerated) return toast('请先生成分镜视频');
    const shot=state.storyboards.find(item=>item.shot===shotId);
    const content=[
      `分镜 ${shotId||''} 15 秒视频导出记录`,
      `画面比例：${state.videoRatio}`,
      `视频风格：${state.videoStyle}`,
      `镜头：${shot?.scene||'未命名分镜'}`,
      `画面：${shot?.image||'暂无画面描述'}`,
      `台词：${shot?.line||'暂无台词'}`,
      `导出时间：${new Date().toLocaleString('zh-CN',{hour12:false})}`
    ].join('\n');
    const blob=new Blob(['\ufeff',content],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download=`分镜${shotId||'视频'}_15秒导出记录.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    toast('已导出本条 15 秒分镜视频');
  }
  function bindPanelEvents(){
    const idea=document.getElementById('idea-input');
    const script=document.getElementById('script-editor');
    const scriptFile=document.getElementById('script-file');
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
      toast('AI 剧本已生成，可继续编辑');
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
      if(action==='history') return openLogin('请先使用邀请码登录');
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
      state.videoStyle='都市写实';
      state.videoConfirmed=false;
      save();
      render();
      toast('已恢复默认视频设定');
    });
    document.querySelectorAll('[data-asset-prompt]').forEach(input=>input.addEventListener('input',()=>{
      state.assetPrompts[input.dataset.assetPrompt]=input.value;
      state.assetsConfirmed=false;
      save();
      renderStatusOnly();
    }));
    document.getElementById('confirm-video')?.addEventListener('click',()=>{state.videoConfirmed=true;save();render();toast('已确认视频设定');});
    document.querySelectorAll('[data-generate-asset]').forEach(button=>button.addEventListener('click',()=>{
      state.assetGenerated[button.dataset.generateAsset]=new Date().toISOString();
      state.assetsConfirmed=false;
      save();
      render();
      toast('已生成'+assetTitle(button.dataset.generateAsset));
    }));
    document.querySelectorAll('[data-upload-asset]').forEach(button=>button.addEventListener('click',()=>{
      document.querySelector(`[data-asset-file="${button.dataset.uploadAsset}"]`)?.click();
    }));
    document.querySelectorAll('[data-asset-file]').forEach(input=>input.addEventListener('change',()=>{
      const file=input.files?.[0];
      if(!file) return;
      state.assetUploads[input.dataset.assetFile]=file.name;
      state.assetsConfirmed=false;
      save();
      render();
      toast('已上传'+assetTitle(input.dataset.assetFile)+'参考图');
    }));
    document.getElementById('regen-assets')?.addEventListener('click',()=>{
      assetBlueprints.forEach(item=>{state.assetGenerated[item.key]=new Date().toISOString();});
      state.assetRegenerated=true;
      state.assetsConfirmed=false;
      save();
      render();
      toast('已按提示词重新生成全部资产');
    });
    document.getElementById('confirm-assets')?.addEventListener('click',()=>{state.assetsConfirmed=true;save();render();toast('已确认资产清单');});
    document.getElementById('regen-storyboard')?.addEventListener('click',()=>{state.storyboards=[];ensureStoryboards();save();render();toast('已重新生成分镜');});
    document.getElementById('generate-videos')?.addEventListener('click',()=>completeShortVideoGeneration());
    document.getElementById('retry-videos')?.addEventListener('click',()=>completeShortVideoGeneration());
    document.querySelectorAll('[data-regenerate-shot]').forEach(button=>button.addEventListener('click',()=>{
      if(!state.videoGenerated) return toast('请先生成分镜视频');
      state.clipRegenerated[button.dataset.regenerateShot]=new Date().toISOString();
      save();
      render();
      toast('已重新生成本条分镜视频');
    }));
    document.querySelectorAll('[data-export-shot]').forEach(button=>button.addEventListener('click',()=>exportShotVideo(button.dataset.exportShot)));
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
    if(state.stage===2) state.assetsConfirmed=true;
    if(state.stage===3) ensureStoryboards();
    if(state.stage===4&&!completeShortVideoGeneration()) return false;
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
  const assetLink=document.querySelector('[data-view-link="assets"]');
  if(assetLink) assetLink.setAttribute('href',assetUrl());
  assetLink?.addEventListener('click',event=>{
    event.preventDefault();
    currentView='assets';
    history.pushState(null,'',assetUrl());
    render();
  });
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
