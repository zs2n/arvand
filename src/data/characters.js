/* ===== DATA: characters =====
   Each character: look (skin, hair, hs 0 bald/1 short/2 long, robe, trim, hat, hatc, beard, cape, item, itemc, eye, armor)
   N: [name, role]. MOOD: how they react when refused (sad / angry) and whether they smirk when given what they want (sly). */
const C={
 king:{skin:'#e0ad83',hair:'#3a2418',hs:1,robe:'#7a1f3a',trim:'#e3b54e',hat:'crown',beard:'#3a2418',cape:'#a3283a',eye:'#3a2418'},
 herald:{skin:'#c99673',hair:'#222222',hs:0,robe:'#4a4652',trim:'#8b8790',hat:'hood',item:'spear'},
 farmer:{skin:'#c98c5e',hair:'#4a3020',hs:1,robe:'#7a6a3a',trim:'#4a3a1a',hat:'cap',hatc:'#b89a50',beard:'#4a3020',item:'basket'},
 rustam:{skin:'#e0ad83',hair:'#1e1410',hs:1,robe:'#4b2a6b',trim:'#c9a24a',hat:'circlet',beard:'#1e1410',cape:'#2a1a3a',eye:'#2a1a10'},
 farrukh:{skin:'#b97f55',hair:'#222222',hs:1,robe:'#2f5f8a',trim:'#d8c27a',hat:'turban',hatc:'#efe6d0',item:'scroll'},
 mehran:{skin:'#c48a60',hair:'#888888',hs:1,robe:'#1f4a6e',trim:'#e3b54e',hat:'turban',hatc:'#2f7fb0',beard:'#9a9a9a',cape:'#173650'},
 nawal:{skin:'#d9a37c',hair:'#111111',hs:2,robe:'#1d1a24',trim:'#5a4a6a',hat:'hood',eye:'#5a3a6a'},
 burhan:{skin:'#c98c5e',hair:'#6b4a2a',hs:2,robe:'#6b4a2a',trim:'#a7a9ad',hat:'helm',beard:'#8a5a32',item:'sword',cape:'#3d2c1c',armor:1},
 asil:{skin:'#ead0b6',hair:'#dddddd',hs:2,robe:'#d8dce6',trim:'#7aa6d8',hat:'veil',hatc:'#eef2fa',item:'staff',itemc:'#9fd0ff',eye:'#5a8ac0'},
 dima:{skin:'#e7b993',hair:'#5a2e1a',hs:2,robe:'#2e6b4f',trim:'#e3b54e',hat:'crown',eye:'#3a5a2a'},
 lina:{skin:'#e7b993',hair:'#6a3a20',hs:2,robe:'#3f7c8a',trim:'#f0d8a0',hat:'circlet',eye:'#3a6a4a'},
 ziyad:{skin:'#e7b993',hair:'#3a2418',hs:1,robe:'#8a2a3a',trim:'#e3b54e',hat:'circlet',eye:'#3a2418'},
 ghazi:{skin:'#c48a60',hair:'#222222',hs:1,robe:'#8a2a2a',trim:'#a7a9ad',hat:'helm',beard:'#333333',item:'spear',armor:1},
 samar:{skin:'#d9a37c',hair:'#333333',hs:2,robe:'#5a3a7a',trim:'#c9a24a',hat:'hood',item:'staff',itemc:'#d48cff',eye:'#6a3a8a'},
 raad:{skin:'#c48a60',hair:'#6b4a2a',hs:1,robe:'#3f5a2e',trim:'#6b4a2a',hat:'hood',item:'bow',beard:'#6b4a2a'},
 daniel:{skin:'#e0ad83',hair:'#cccccc',hs:1,robe:'#7a5a2a',trim:'#3a2a1a',hat:'cap',hatc:'#4a3a2a',beard:'#cccccc',item:'scroll'},
 qasim:{skin:'#e0ad83',hair:'#333333',hs:1,robe:'#8a6a1a',trim:'#e3b54e',hat:'turban',hatc:'#c46a2a',beard:'#333333',item:'scroll'},
 guard:{skin:'#c48a60',hair:'#222222',hs:1,robe:'#6a2430',trim:'#a7a9ad',hat:'helm',item:'spear',armor:1},
 halima:{skin:'#c98c5e',hair:'#3a2418',hs:2,robe:'#8a5a3a',trim:'#d9b06a',hat:'veil',hatc:'#c9a07a'},
 bard:{skin:'#e0ad83',hair:'#c46a2a',hs:2,robe:'#2f7a5a',trim:'#e3b54e',hat:'cap',hatc:'#a3283a',eye:'#2a6a4a'},
 widow:{skin:'#d9a37c',hair:'#222222',hs:2,robe:'#2a2a33',trim:'#555555',hat:'veil',hatc:'#3a3a44'},
 pilgrim:{skin:'#c99673',hair:'#555555',hs:0,robe:'#9aa4b8',trim:'#7aa6d8',hat:'hood',item:'staff',itemc:'#cfe0ff'},
 hunter:{skin:'#b97f55',hair:'#4a3020',hs:1,robe:'#5a4a2a',trim:'#3a2a1a',hat:'cap',hatc:'#3f5a2e',beard:'#4a3020',item:'bow'},
 merc:{skin:'#c48a60',hair:'#222222',hs:2,robe:'#3a3a40',trim:'#888888',hat:'helm',item:'sword',cape:'#2a2a30',armor:1},
 thief:{skin:'#d9a37c',hair:'#3a2418',hs:1,robe:'#5a4a3a',trim:'#3a2a1a',hat:null},
 smith:{skin:'#b97f55',hair:'#222222',hs:0,robe:'#4a3a30',trim:'#8a6a4a',hat:null,beard:'#222222',item:'sword'},
 noble:{skin:'#efc3a0',hair:'#c9a24a',hs:1,robe:'#6a2a5a',trim:'#e3b54e',hat:'cap',hatc:'#2a1a3a',cape:'#4a1a3a',eye:'#4a6a8a'},
 refugee:{skin:'#c99673',hair:'#222222',hs:2,robe:'#6a6058',trim:'#4a4038',hat:'veil',hatc:'#8a8078'},
 boy:{skin:'#e0ad83',hair:'#6b4a2a',hs:1,robe:'#4f7aa6',trim:'#d8c27a',hat:null},
 bahram:{skin:'#bfa898',hair:'#dddddd',hs:2,robe:'#3a3438',trim:'#c4552b',hat:'helm',beard:'#cccccc',item:'sword',cape:'#5a1a10',armor:1,eye:'#7a6a5a'},
 jailer:{skin:'#c48a60',hair:'#444444',hs:0,robe:'#4a3a2a',trim:'#888888',hat:'cap',hatc:'#333333',beard:'#555555'},
 cook:{skin:'#d9a37c',hair:'#3a2418',hs:2,robe:'#e8e0d0',trim:'#a3283a',hat:'veil',hatc:'#f0ead8'},
 priest:{skin:'#e0ad83',hair:'#eeeeee',hs:0,robe:'#3a3a52',trim:'#c9a24a',hat:'cap',hatc:'#2a2a3a',beard:'#eeeeee',item:'staff',itemc:'#e3b54e'},
 deserter:{skin:'#bfa898',hair:'#555555',hs:1,robe:'#4a4044',trim:'#c4552b',hat:null,beard:'#555555'},
 mother:{skin:'#c98c5e',hair:'#2a1a10',hs:2,robe:'#6a4a6a',trim:'#d9b06a',hat:'veil',hatc:'#8a6a8a'},
 hoarder:{skin:'#efc3a0',hair:'#444444',hs:1,robe:'#5a6a2a',trim:'#e3b54e',hat:'turban',hatc:'#8a8a3a',beard:'#444444'},
 lordling:{skin:'#e0ad83',hair:'#6a4a2a',hs:1,robe:'#2a4a6a',trim:'#c9a24a',hat:'cap',hatc:'#1a2a3a',cape:'#1a3a5a',beard:'#6a4a2a'},
 watchman:{skin:'#c48a60',hair:'#333333',hs:1,robe:'#4a3a2a',trim:'#8a8a8a',hat:'helm',item:'spear'},
 saqr:{skin:'#c48a60',hair:'#222222',hs:1,robe:'#6a2a2a',trim:'#a7a9ad',hat:null,item:'sword'},
 ashsoldier:{skin:'#bfa898',hair:'#555555',hs:1,robe:'#3a3438',trim:'#c4552b',hat:'helm',item:'spear',armor:1},
 stablemaster:{skin:'#b97f55',hair:'#5a3a20',hs:1,robe:'#6a5030',trim:'#3a2a1a',hat:'cap',hatc:'#5a4020',beard:'#5a3a20'},
};
const N={
 herald:['الرسول الرمادي','مبعوث بهرام سيّد أرض الرماد'],farmer:['عُدَيّ المزارع','من قرية الطاحونة'],
 rustam:['الأمير رُستم','أخو الملك، خاتمه أسدٌ متوَّج'],farrukh:['السفير فَرّوخ','رسول بني النهر'],mehran:['اللورد مِهران','سيّد بني النهر'],
 nawal:['نوال','سيّدة الظلال'],burhan:['الزعيم بُرهان','سيّد أهل القرن'],asil:['الكاهنة أسيل','الكاهنة العليا لرهبنة القمر'],
 dima:['الملكة ديما','زوجة الملك'],lina:['الأميرة لينا','ابنة الملك'],ziyad:['الأمير زياد','ابن الملك الصغير'],
 ghazi:['القائد غازي','قائد جيش أرْوَند'],samar:['العرّافة سمر','عرّافة البلاط وطبيبته'],raad:['الصيّاد رعد','صيّاد الملك ودليله'],
 daniel:['المعلّم دانيال','صانع آلات ومهندس'],qasim:['التاجر قاسم','تاجر حبوب من الجنوب'],
 guard:['الحارس سليم','حرس البوابة الشرقية'],halima:['حليمة','قابلة قرية الطاحونة'],bard:['زِرياب الصغير','مغنٍّ جوّال'],widow:['أم ناصر','أرملة جندي'],
 pilgrim:['حاجّ القمر','زائر للمعبد'],hunter:['شهاب','صيّاد من الغابة'],
 merc:['القائدة رَزان','زعيمة سريّة الحديد المأجورة'],thief:['سارق الخبز','يقوده الحرس'],smith:['الحدّاد بكر','حدّاد العاصمة'],noble:['السيد قيصر','نبيل الضياع الغربية'],
 refugee:['مريم','لاجئة من أرض الرماد'],boy:['يونس','صبيّ من القرية'],bahram:['بَهرام الرمادي','سيّد أرض الرماد'],jailer:['السجّان عِمران','حارس القبو'],
 cook:['الطبّاخة رقيّة','مطبخ القصر'],priest:['الشيخ هارون','قيّم برج الأجراس'],deserter:['جنديّ رماديّ','فارّ من جيش بهرام'],mother:['أم سلمى','باسم أمهات المدينة'],
 hoarder:['التاجر شَمّاس','صاحب مخازن الحبوب'],lordling:['السيد وضّاح','باسم صغار النبلاء'],watchman:['الحارس جابر','برج المراقبة الغربي'],
 saqr:['صقر بن غازي','ابن القائد غازي'],stablemaster:['السائس منصور','إسطبلات القصر'],
};
/* reaction temperament: refused → sad or angry; sly characters smirk when they get what they want */
const MOOD={sly:['herald','rustam','bahram','merc','noble','hoarder','nawal'],angry:['herald','rustam','burhan','bahram','merc','noble','hoarder','lordling','farrukh','mehran']};
/* advisors: skills 0..3 */
const RET={
 ghazi:{sk:{war:3,talk:1,wild:1,shadow:0,magic:0,craft:0,trade:0}},
 samar:{sk:{war:0,talk:2,wild:1,shadow:0,magic:3,craft:0,trade:0}},
 raad:{sk:{war:1,talk:0,wild:3,shadow:1,magic:0,craft:1,trade:0}},
 nawal:{sk:{war:0,talk:2,wild:0,shadow:3,magic:1,craft:0,trade:1}},
 daniel:{sk:{war:0,talk:1,wild:0,shadow:0,magic:1,craft:3,trade:1}},
 qasim:{sk:{war:0,talk:2,wild:0,shadow:1,magic:0,craft:0,trade:3}},
};
const RKEYS=Object.keys(RET);
const SKN={war:'القتال',talk:'الدبلوماسية',wild:'البرّية',shadow:'الخفاء',magic:'السحر',craft:'الصنعة',trade:'التجارة'};
const FAC={
 river:{n:'بنو النهر',lord:'اللورد مِهران',give:'٤٠ بحّارًا مسلّحًا يوم الحصار + ١٠ ذهب أسبوعيًا من التجارة (عند ٦٠)',want:'تخفيف الرسوم، الوفاء بالديون، الحماية من القراصنة',seal:'#2f6f9a'},
 horn:{n:'أهل القرن',lord:'الزعيم بُرهان',give:'٨٠ محاربًا جبليًا يوم الحصار',want:'روابط الدم، الشجاعة، الحديد',seal:'#7a5a3a'},
 moon:{n:'رهبنة القمر',lord:'الكاهنة أسيل',give:'سحرٌ يُضعف جيش بهرام بمقدار العُشر',want:'معبد في العاصمة، التسامح، الرحمة بالغرباء',seal:'#6a7ab0'},
};
