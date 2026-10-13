/* ===== DATA: advisors — hiring and personal quests ===== */
/* hiring: Daniel (craft) through the inventor, Qasim (trade) through the grain merchant */
E.tinker.story=1;E.tinker.w=[4,4];delete E.tinker.pool;
E.tinker.opts.unshift({t:'ابقَ في القصر مهندسًا للبلاط',cost:{gold:30},e:{unlock:'daniel',set:['crossbows']},r:'صار للمجلس مهندس. دانيال سيصنع الأقواس الآلية، ويبني لك ما تطلبه من آلات.'});
EXPR.tinker[1].unshift('happy');
E.grain.story=1;E.grain.w=[6,6];delete E.grain.pool;
E.grain.opts.unshift({t:'ابقَ معي أمينًا للخزانة',cost:{gold:20},e:{unlock:'qasim',food:20},r:'وافق قاسم بشرط واحد: أن يُسمح له بمساومة الجميع، حتى الملك.'});
EXPR.grain[1].unshift('happy');

Object.assign(E,{
/* Ghazi: his son is missing at the border */
ghazison:{who:'ghazi',story:1,w:[5,5],key:1,text:'مولاي… ابني صقر لم يعد من دورية عند حدود الرماد منذ ثلاثة أيام. لا أطلب شيئًا للقائد. أطلب للأب.',opts:[
 {t:'سنجده. افتحوا مهمة البحث',e:{set:['saqrquest']},r:'على الخريطة الآن مهمة في أرض الرماد: «البحث عن صقر». رعد أقدر من يجده.'},
 {t:'الحرب لا تنتظر أحدًا يا غازي',e:{retmod:['ghazi',-.1],set:['ghazigrief']},r:'انحنى غازي ولم يقل شيئًا. لكنه لم يعد كما كان.'},
]},
saqrback:{who:'saqr',w:[1,12],key:1,text:'أنا صقر بن غازي. أسرني رجال بهرام وأطلقني رعد من أقفاصهم. أبي يقول إن حياتي دَين عليه لك. وأنا أقول إنها دَين عليّ أنا.',opts:[
 {t:'قُد عشرة رجال تحت إمرة أبيك',e:{soldiers:10,hap:2},r:'وقف صقر إلى جانب أبيه. غازي يبتسم لأول مرة منذ أسابيع.'},
 {t:'ارجع إلى أمك، فقد قاتلت بما يكفي',e:{hap:3,retmod:['ghazi',.05]},r:'قبّل صقر يد أبيه ومضى. غازي لن ينسى رحمتك.'},
]},
/* Raad: revenge on the wolves gang */
raadhome:{who:'raad',story:1,w:[4,4],key:1,text:'عصابة الذئاب أحرقت بيت أختي في الغابة يا مولاي. أعرف أين ينامون. أعطني الإذن وعشرة رجال، ولن يعودوا يحرقون أحدًا.',opts:[
 {t:'لك الإذن والرجال',e:{set:['raadquest']},r:'على الخريطة الآن في الغابة السوداء: «ثأر رعد». مهمة لرعد وحده.'},
 {t:'ليس الآن، نحتاجك للصيد',e:{retmod:['raad',-.05]},r:'شدّ رعد وتر قوسه حتى صرّ، وخرج.'},
]},
/* Samar: the Moon order wants her tried */
samartrial:{who:'asil',story:1,w:[6,6],cond:()=>S.ret.samar.on,key:1,text:'عرّافتك سمر تعلّمت سحرها من كتب سُرقت من معبدنا قبل عشرين عامًا. الرهبنة تطالب بمحاكمتها. لن أطلب رأسها، لكن العدل عدل.',opts:[
 {t:'سمر تحت حمايتي',e:{moon:-15,retmod:['samar',.1],set:['samarloyal']},r:'غضبت أسيل. لكن سمر عرفت في تلك اللحظة لمن ولاؤها.'},
 {t:'لتصالحكم سمر بنفسها',e:{set:['samarquest']},r:'على الخريطة الآن عند معبد القمر: «مصالحة سمر». مهمة لها وحدها.'},
 {t:'خذوها، العدل عدل',e:{moon:20,lose:'samar',hap:-3},r:'سيقت سمر إلى المعبد. المجلس صار أفقر بعرّافة.'},
]},
/* Nawal: her past with Rustam */
nawalpast:{who:'nawal',story:1,w:[7,7],cond:()=>S.ret.nawal.on,key:1,text:'يجب أن تعرف شيئًا قبل أن تعرفه من غيري: قبل أن آتيك، كنتُ أعمل لأخيك رستم. تركته حين فهمت ما يريد. صدّقني أو اطردني.',opts:[
 {t:'أصدّقك. أخبريني بما تعرفين',e:{clues:1,retmod:['nawal',.05],set:['nawaltrust']},r:'رسمت لك نوال شبكة رجال رستم: من يحمل رسائله، ومن يدفع لهم.'},
 {t:'سأختبرك أولًا',e:{set:['nawalquest']},r:'على الخريطة الآن في القلعة: «اختبار نوال». ستأتيك بدليل من داخل البرج، أو تسقط.'},
 {t:'اخرجي من قصري',e:{lose:'nawal'},r:'لم تجادل. حين التفتّ كانت قد اختفت، كما جاءت أول مرة.'},
]},
/* Daniel: iron for siege engines */
danieliron:{who:'daniel',story:1,w:[6,9],cond:()=>S.ret.daniel.on&&!F('catapults'),key:1,text:'أستطيع أن أبني منجنيقين يرميان الحجارة على من يقترب من الأسوار. لكن الحديد في السوق رديء. حديد جبال القرن هو ما أحتاجه.',opts:[
 {t:'اشترِ الحديد من السوق بخمسين',cost:{gold:50},e:{set:['catapults']},r:'منجنيقان على الأسوار: +٣٠ يوم الحصار.'},
 {t:'اذهب إلى الجبال بنفسك',e:{set:['danielquest']},r:'على الخريطة الآن في جبال القرن: «حديد القرن». مهمة لدانيال.'},
 {t:'الأسوار تكفي',e:{},r:'هزّ دانيال رأسه وعاد إلى ورشته.'},
]},
/* Qasim: an old debt */
qasimdebt:{who:'qasim',story:1,w:[7,10],cond:()=>S.ret.qasim.on,key:1,text:'جلالتك، تجار النهر يطالبونني بدَين قديم: أربعون قطعة. إن لم أدفع سيقولون في المرفأ إن أمين خزانة الملك مفلس، وهذا يضرّك قبل أن يضرّني.',opts:[
 {t:'الخزانة تدفع عنك',cost:{gold:40},e:{river:10,retmod:['qasim',.1]},r:'دفعتَ الدَّين. قاسم سيعيده إليك أضعافًا، كما يقسم.'},
 {t:'اذهب وسوِّه بنفسك',e:{set:['qasimquest']},r:'على الخريطة الآن عند مرفأ النهر: «تسوية دَين قاسم».'},
 {t:'ديونك شأنك',e:{retmod:['qasim',-.1],river:-5},r:'خرج قاسم وهو يحسب شيئًا في رأسه.'},
]},
});
Object.assign(EXPR,{ghazison:['sad',['happy','sad']],saqrback:['happy',['happy','happy']],raadhome:['angry',['happy','angry']],
 samartrial:['cold',['angry','neutral','smug']],nawalpast:['tired',['happy','cold','sad']],danieliron:['neutral',['happy','happy','sad']],qasimdebt:['tired',['happy','neutral','sad']]});

/* missions for new advisors and personal quests */
M.push(
 {id:'findsaqr',loc:'ash',n:'البحث عن صقر',d:'ابن غازي أسير في معسكرات الرماد.',sk:'wild',dur:1,risk:1,personal:1,cond:()=>F('saqrquest')&&!F('saqrsaved')&&!F('saqrlost'),ok:()=>({set:['saqrsaved'],retmod:['ghazi',.1],follow:['saqrback',1]}),no:()=>({}),okT:'عاد صقر حيًّا',noT:'لم يُعثر على أثر'},
 {id:'raadrevenge',loc:'forest',n:'ثأر رعد',d:'رعد يعرف أين ينام الذئاب.',sk:'wild',dur:1,risk:2,personal:1,only:'raad',cond:()=>F('raadquest')&&!F('raaddone'),ok:()=>({set:['raaddone','banditsdone'],hap:4,retmod:['raad',.1],item:'ivoryhorn'}),no:()=>({}),okT:'انتهت عصابة الذئاب، وعاد رعد ببوق زعيمها',noT:'هرب الذئاب إلى عمق الغابة'},
 {id:'reconcile',loc:'moon',n:'مصالحة سمر',d:'سمر تواجه الرهبنة بنفسها.',sk:'magic',dur:1,personal:1,only:'samar',cond:()=>F('samarquest')&&!F('samardone'),ok:()=>({set:['samardone'],moon:15,retmod:['samar',.1],item:'moonscroll'}),no:()=>({moon:-10,set:['samardone']}),okT:'صالحت سمر الرهبنة، وأهدتها أسيل مخطوطة',noT:'انتهى اللقاء بالصراخ'},
 {id:'nawaltest',loc:'castle',n:'اختبار نوال',d:'دليل من داخل البرج الشرقي.',sk:'shadow',dur:1,risk:1,personal:1,only:'nawal',cond:()=>F('nawalquest')&&!F('nawaldone'),ok:()=>({set:['nawaldone','nawaltrust'],clues:2,retmod:['nawal',.1]}),no:()=>({set:['nawaldone'],hap:-2}),okT:'عادت برسالتين بختم الأسد',noT:'كاد رجال البرج يمسكونها'},
 {id:'horniron',loc:'horn',n:'حديد القرن',d:'دانيال يفاوض الحدادين في الجبال.',sk:'craft',dur:2,personal:1,only:'daniel',cond:()=>F('danielquest')&&!F('catapults'),ok:()=>({set:['catapults'],horn:6}),no:()=>({gold:-10}),okT:'عاد دانيال بالحديد وبُني المنجنيقان',noT:'الحديد غالٍ، وعاد بنصفه'},
 {id:'settledebt',loc:'river',n:'تسوية دَين قاسم',d:'قاسم يساوم دائنيه.',sk:'trade',dur:1,personal:1,only:'qasim',cond:()=>F('qasimquest')&&!F('qasimdone'),ok:()=>({set:['qasimdone'],river:12,gold:20,retmod:['qasim',.1]}),no:()=>({set:['qasimdone'],river:-8}),okT:'سوّى قاسم الدَّين وربح فوقه',noT:'خسر المساومة هذه المرة'},
 {id:'caravan',loc:'river',n:'قافلة تجارية',d:'بيع فائض الحِرف في أسواق النهر.',sk:'trade',cost:{gold:20},dur:1,ok:()=>({gold:45}),no:()=>({gold:12}),okT:'ربحت القافلة',noT:'سوق كاسدة'},
 {id:'workshop',loc:'castle',n:'ورشة السلاح',d:'سيوف ورماح جديدة للجيش.',sk:'craft',cost:{gold:25},dur:1,ok:()=>({arms:2}),no:()=>({arms:1}),okT:'صُنعت دفعتان من السلاح',noT:'دفعة واحدة فقط'},
);
