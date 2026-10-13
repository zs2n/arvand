/* ===== DATA: map locations and missions ===== */
const LOC={
 castle:{n:'القلعة',x:150,y:105},village:{n:'قرية الطاحونة',x:92,y:138},forest:{n:'الغابة السوداء',x:205,y:158},
 river:{n:'مرفأ بني النهر',x:52,y:74},horn:{n:'جبال القرن',x:132,y:30},moon:{n:'معبد القمر',x:38,y:168},ash:{n:'أرض الرماد',x:280,y:84},
};
const M=[
 {id:'train',loc:'castle',n:'تدريب المجنّدين',d:'تحويل فلاحين إلى رماحين.',sk:'war',cost:{gold:20},dur:1,ok:()=>({soldiers:15}),no:()=>({soldiers:5}),okT:'تخرّج خمسة عشر رماحًا',noT:'صمد خمسة فقط حتى النهاية'},
 {id:'fortify',loc:'castle',n:'ترميم الأسوار',d:'كل مستوى يضيف ثلاثين يوم الحصار (الحد ٣).',sk:'war',cost:{gold:50},dur:2,cond:()=>S.fort<3,ok:()=>({fort:1}),no:()=>({gold:20}),okT:'ارتفعت الأسوار طبقة',noT:'انهار جزء من الحائط، واستُرجع بعض المال'},
 {id:'whispers',loc:'castle',n:'تتبّع الهمسات',d:'من يكتب إلى الشرق ليلًا؟',sk:'shadow',dur:1,cond:()=>S.ret.nawal.on&&!F('exposed'),ok:()=>({clues:1}),no:()=>({}),okT:'وُجد دليل جديد على الخائن',noT:'الأثر برد قبل أن يُلتقط'},
 {id:'hunt',loc:'forest',n:'رحلة صيد',d:'لحمٌ للمخازن.',sk:'wild',dur:1,ok:()=>({food:22}),no:()=>({food:6}),okT:'عادت العربة محمّلة',noT:'صيدٌ شحيح'},
 {id:'wolves',loc:'forest',n:'مطاردة عصابة الذئاب',d:'العصابة ما زالت تنهب القرى.',sk:'war',dur:1,risk:2,cond:()=>F('bandits')&&!F('banditsdone'),ok:()=>({hap:6,food:15,set:['banditsdone']}),no:()=>({}),okT:'تشتّتت العصابة واستُعيد القمح',noT:'أفلت الذئاب'},
 {id:'aid',loc:'village',n:'العمل مع القرويين',d:'إصلاح السواقي والبيوت.',sk:'talk',dur:1,ok:()=>({hap:6}),no:()=>({hap:2}),okT:'القرية تشكر التاج',noT:'عمل قليل وكلام كثير'},
 {id:'cure',loc:'village',n:'إيقاف الحمّى',d:'الحمّى تنتشر بين البيوت.',sk:'magic',dur:1,cond:()=>F('plague')&&!F('cured'),ok:()=>({hap:8,set:['cured']}),no:()=>({pop:-8}),okT:'انحسرت الحمّى',noT:'الحمّى أقوى من الأعشاب هذه المرة'},
 {id:'dip_river',loc:'river',n:'سفارة إلى بني النهر',d:'هدايا وكلام طيّب.',sk:'talk',cost:{gold:15},dur:1,ok:()=>({river:12}),no:()=>({river:3}),okT:'مِهران راضٍ',noT:'استقبالٌ بارد'},
 {id:'dip_horn',loc:'horn',n:'رفقة المحاربين',d:'أهل القرن يحترمون من يقاتل معهم.',sk:'war',cost:{gold:15},dur:1,ok:()=>({horn:12}),no:()=>({horn:3}),okT:'شُرب نخب أرْوَند في الجبال',noT:'لم يُترك أثر'},
 {id:'dip_moon',loc:'moon',n:'التأمّل مع الكهنة',d:'الرهبنة تقدّر من يفهم السحر.',sk:'magic',cost:{gold:15},dur:1,ok:()=>({moon:12}),no:()=>({moon:3}),okT:'أسيل تذكرك في صلواتها',noT:'صمتٌ مهذّب'},
 {id:'scout',loc:'ash',n:'استطلاع جيش بهرام',d:'معرفة عدد العدو تفتح خطة الكمين.',sk:'wild',dur:1,risk:1,cond:()=>!F('scouted'),ok:()=>({set:['scouted']}),no:()=>({}),okT:'جيش بهرام صار مكشوفًا',noT:'طاردتهم دوريات الرماد'},
 {id:'sabotage',loc:'ash',n:'إحراق مؤن العدو',d:'ينقص جيش بهرام ثلاثين (مرتان كحد أقصى).',sk:'shadow',dur:2,risk:2,cond:()=>S.sabotage<2&&S.week>=4,ok:()=>{S.sabotage++;return{enemy:-30}},no:()=>({}),okT:'احترقت مخازن بهرام',noT:'كُشف المتسلّل وهرب بصعوبة'},
 {id:'ashsecret',loc:'ash',n:'سرّ الأرض الميتة',d:'ما الذي يقتل أرض الرماد؟',sk:'magic',dur:2,risk:1,cond:()=>F('ashhint')&&!F('ashsecret'),ok:()=>({set:['ashsecret']}),no:()=>({}),okT:'اكتُشف أن ينابيع الشرق تسمّمت بالملح، وأن بهرام يغزو ليُطعم شعبه',noT:'عاصفة رماد أعادت الباحث'},
];
