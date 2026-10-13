/* ===== ENGINE: epilogue, chronicle, endings board, achievements, first-week guide ===== */
const META_KEY='arvand_meta';
title.extra=title.extra||[];
const META=Object.assign({ends:{},ach:{},games:0},store.get(META_KEY,{}));
const saveMeta=()=>store.set(META_KEY,META);
const END_HINTS={dawn:'انتصر، واكشف الخائن، وأبقِ شعبك راضيًا.',victory:'انتصر واكشف الخائن، لكن القلوب بعيدة.',shadow:'انتصر دون أن تكشف الخائن، وشعبك يحبك.',stolen:'انتصر دون أن تكشف الخائن، وشعبك ساخط.',ashwin:'انتصر بفارق ضئيل.',exile:'اخسر الحصار وأهل القرن أصهارك.',fall:'اخسر الحصار وحيدًا.',peace:'افهم سبب الرماد، واستقبل الغرباء، واملأ مخازنك.',revolt:'دع صبر الشعب ينفد.'};
const ACH=[
 {id:'river',n:'صديق النهر',d:'أنهِ اللعبة وعلاقتك ببني النهر ٩٠ فأكثر.',t:()=>S.rel.river>=90},
 {id:'horn',n:'من دم الجبال',d:'أنهِ اللعبة وعلاقتك بأهل القرن ٩٠ فأكثر.',t:()=>S.rel.horn>=90},
 {id:'moon',n:'تحت ضوء القمر',d:'أنهِ اللعبة وعلاقتك بالرهبنة ٩٠ فأكثر.',t:()=>S.rel.moon>=90},
 {id:'eye',n:'عين في الظلام',d:'اكشف الخائن قبل نهاية الأسبوع السابع.',t:()=>F('exposed')&&S.exposedWeek&&S.exposedWeek<=7},
 {id:'fed',n:'لم يجع أحد',d:'أنهِ اللعبة دون مجاعة واحدة.',t:()=>S.famines===0},
 {id:'mason',n:'البنّاء',d:'ارفع الأسوار إلى المستوى الثالث.',t:()=>S.fort>=3},
 {id:'council',n:'مجلس كامل',d:'وظّف دانيال وقاسم في لعبة واحدة.',t:()=>S.ret.daniel.on&&S.ret.qasim.on},
 {id:'father',n:'الأب الرحيم',d:'ربِّ زياد على الرحمة ثلاث مرات.',t:()=>S.son.kind>=3},
 {id:'liar',n:'لا يُخدع الملك',d:'اكشف زائرًا كاذبًا قبل أن تعطيه شيئًا.',t:()=>Object.values(S.checked).includes('lie')},
 {id:'rich',n:'خزانة ممتلئة',d:'أنهِ اللعبة ومعك ٢٥٠ ذهبًا.',t:()=>S.gold>=250},
 {id:'peace',n:'بلا دم',d:'احصل على نهاية «سلام الرماد».',t:()=>S.endKey==='peace'},
 {id:'hard',n:'طاغية الجفاف',d:'انتصر في المستوى الصعب.',t:()=>S.diff==='hard'&&['dawn','victory','shadow','peace'].includes(S.endKey)},
];
apply.extra.push(e=>{if(e.set&&e.set.includes('exposed')&&!S.exposedWeek)S.exposedWeek=S.week});
/* record the ending + achievements, then offer epilogue and chronicle */
HOOK.ending.push(k=>{
 if(!S.recorded){S.recorded={ach:[]};META.games++;META.ends[k]=(META.ends[k]||0)+1;
  for(const a of ACH){try{if(a.t()&&!META.ach[a.id]){META.ach[a.id]=1;S.recorded.ach.push(a.id)}}catch(e){}}
  saveMeta()}
 const fresh_=S.recorded.ach.map(id=>ACH.find(a=>a.id===id));
 return`${fresh_.length?`<div class="chips">${fresh_.map(a=>`<span class="chip good">إنجاز جديد: ${a.n}</span>`).join('')}</div>`:''}
 <div class="row"><button class="px" id="bGens">بعد عشرين عامًا…</button><button class="px" id="bChron">سجل الملك المصوّر</button></div>`});
HOOK.endingBind.push(k=>{$('#bGens').onclick=()=>showGens(k);$('#bChron').onclick=()=>showChron(k)});

/* ---- twenty years later ---- */
function gensLines(k){const L=[],fell=['fall','exile','revolt','stolen'].includes(k);
 const s=S.son,top=Object.entries(s).sort((a,b)=>b[1]-a[1]);const trait=top[0][1]===top[1][1]?'mix':top[0][0];
 const son={war:'صار زياد فارسًا لا يُهزم، يحكم بالسيف ويخافه الجيران أكثر مما يحبّونه.',wis:'صار زياد ملكًا عالمًا، بنى مكتبة على أنقاض البرج الشرقي، وكتب تاريخ الحصار بيده.',kind:'صار زياد ملكًا يعرف أسماء الأطفال في الأسواق، ولم يُغلق باب قاعته في وجه زائر قط.',mix:'صار زياد رجلًا متردّدًا بين السيف والكتاب، يتعلّم من أخطائه كما تعلّمت أنت.'}[trait];
 L.push(fell?(k==='exile'?'كبر زياد في الجبال بين أهل القرن. ':'كبر زياد بعيدًا عن العرش. ')+son:son);
 if(F('wells'))L.push('قرية الطاحونة صارت أخصب قرى الوادي. ما زال عُدَيّ يحكي لأحفاده عن الآبار التي حُفرت في سنة العطش.');else L.push('هجر نصف أهل قرية الطاحونة حقولهم بعد سنة العطش، ولم يعودوا.');
 if(F('refugees'))L.push('أحفاد مريم يتكلّمون لهجتين، ويخبزون خبز الرماد في أفران الوادي.');
 if(F('cured'))L.push('في قرية الطاحونة نصبٌ صغير لمن نجوا من الحمّى، عليه اسم '+(F('samarloyal')||S.ret.samar.on?'سمر.':'الملك.'));else if(F('plague'))L.push('قبور الحمّى ما زالت خلف الطاحونة، والأمهات يتجنّبن ذلك الطريق.');
 if(F('temple')&&!F('betrayedmoon'))L.push('صار معبد القمر أكبر من القصر، والكاهنات يعالجن الفقراء مجانًا.');if(F('betrayedmoon'))L.push('لا قناديل في الليل بعد اليوم الذي سُلّمت فيه أسيل. الناس يقولون إن القمر لم يعد يرى الوادي.');
 if(F('linatrust'))L.push(F('betrothed')?'تزوّجت لينا من جسّار حين اختارت، لا حين اختير لها، وصارت جسرًا بين الوادي والجبال.':'صارت لينا أشهر سفيرة في الممالك الثلاث، ويُقال إنها أنهت حربين بالكلام.');else if(F('linacold'))L.push('تزوّجت لينا كما أُمرت. لم تزُر القصر بعد ذلك إلا في الجنائز.');
 if(F('saqrsaved'))L.push('صقر بن غازي صار قائد الجيش بعد أبيه، ولا يبدأ حملة قبل أن يمرّ بالأقفاص التي أُخرج منها، ليتذكّر.');else if(F('saqrlost'))L.push('لم يُعرف مصير صقر بن غازي. ترك القائد سيفه بعد الحرب ومات وحيدًا.');
 if(F('exposed'))L.push(F('pardoned')?'رستم عاش ما بقي من عمره حارسًا على البرج الذي خانه، ولم يُسمع له صوت.':'خاتم الأسد معلّق في قاعة العرش، تذكيرًا بأن الخيانة تبدأ من البيت.');else if(F('rustamfell'))L.push('سقط رستم بخنجر نوال على البوابة الشرقية. نوال اختفت بعد الحرب ولم يرها أحد.');
 if(F('bandits')&&!F('banditsdone'))L.push('عادت عصابة الذئاب أقوى، وصارت الغابة السوداء طريقًا لا يسلكه أحد بعد المغيب.');
 if(k==='peace')L.push('الطريق بين الوادي وأرض الرماد صار طريق قوافل. وفي الشرق تمثال لملك غريب يحمل رغيف خبز.');
 return L}
function showGens(k){modal(`<h3>بعد عشرين عامًا…</h3><div class="gens">${gensLines(k).map(l=>`<p>${l}</p>`).join('')}</div>`,()=>ending(k))}

/* ---- the king's illustrated chronicle (a picture you can keep) ---- */
function showChron(k){
 const items=S.chron.slice(-10),W=640,rowH=64,H=200+items.length*rowH+120;
 const cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');x.imageSmoothingEnabled=false;
 const gr=x.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#efe0bd');gr.addColorStop(1,'#d9c294');x.fillStyle=gr;x.fillRect(0,0,W,H);
 x.strokeStyle='#6a1a22';x.lineWidth=6;x.strokeRect(10,10,W-20,H-20);x.lineWidth=2;x.strokeRect(20,20,W-40,H-40);
 x.direction='rtl';x.textAlign='center';x.fillStyle='#6a1a22';x.font='800 44px Handjet, "Noto Kufi Arabic", sans-serif';x.fillText('سجل الملك سالار',W/2,84);
 x.font='16px "Noto Kufi Arabic", sans-serif';x.fillStyle='#4a3420';x.fillText('عرش أرْوَند · '+DIFF[S.diff].n+' · اثنا عشر أسبوعًا',W/2,116);
 x.fillStyle='#9a845a';x.fillRect(80,136,W-160,2);
 x.textAlign='right';
 items.forEach((c,i)=>{const y=160+i*rowH;const p=SPR.portrait(c.who,c.x||'neutral');x.fillStyle='#3a2d44';x.fillRect(W-96,y,48,48);x.drawImage(p,W-96,y,48,48);x.strokeStyle='#6a1a22';x.lineWidth=2;x.strokeRect(W-96,y,48,48);
  x.fillStyle='#6a1a22';x.font='700 15px "Noto Kufi Arabic", sans-serif';x.fillText('الأسبوع '+A(c.w)+' · '+(N[c.who]||['؟'])[0],W-110,y+18);
  x.fillStyle='#2a1d14';x.font='14px "Noto Kufi Arabic", sans-serif';let t=c.t;if(t.length>52)t=t.slice(0,50)+'…';x.fillText(t,W-110,y+42)});
 const yb=160+items.length*rowH+20;x.fillStyle='#9a845a';x.fillRect(80,yb,W-160,2);
 x.textAlign='center';x.fillStyle='#6a1a22';x.font='800 36px Handjet, "Noto Kufi Arabic", sans-serif';x.fillText(ENDS[k][0],W/2,yb+52);
 x.fillStyle='#a3283a';x.beginPath();x.arc(W/2,yb+86,16,0,7);x.fill();x.fillStyle='#fff3cf';x.font='700 14px "Noto Kufi Arabic", sans-serif';x.fillText('ق',W/2,yb+91);
 x.fillStyle='#4a3420';x.font='12px "Noto Kufi Arabic", sans-serif';x.fillText('إنتاج استوديو قرطاس',W/2,H-30);
 modal(`<h3>سجل الملك المصوّر</h3><div class="chron"><img alt="سجل الملك" src="${cv.toDataURL()}"></div><p class="muted">اضغط على الصورة مطوّلًا أو بالزر الأيمن لحفظها.</p>`,()=>ending(k));
}

/* ---- endings & achievements board ---- */
function showBoard(back){
 const got=Object.keys(META.ends).length,ach=Object.keys(META.ach).length;
 modal(`<h3>لوحة النهايات</h3><p class="muted">${A(got)} من ٩ نهايات · ${A(ach)} من ${A(ACH.length)} إنجازًا · ${A(META.games)} لعبة</p>
 <div class="ends">${Object.keys(ENDS).map(k=>META.ends[k]?`<div class="endc got"><b>${ENDS[k][0]}</b><span>وصلتها ${A(META.ends[k])} ${META.ends[k]>2?'مرات':'مرة'}</span></div>`:`<div class="endc lock"><b>؟؟؟</b><span>${END_HINTS[k]}</span></div>`).join('')}</div>
 <h3>الإنجازات</h3><div class="ends">${ACH.map(a=>`<div class="endc ${META.ach[a.id]?'got':'lock'}"><b>${META.ach[a.id]?a.n:'؟؟؟'}</b><span>${a.d}</span></div>`).join('')}</div>`,back);
}
title.extra.push({id:'bBoard',label:'لوحة النهايات',click:()=>showBoard(()=>title())});

/* ---- first-week guide with Ghazi (can be turned off in settings) ---- */
const tut=(()=>{let box=null;
 const STEPS={
  hud:{sel:'#hud',t:'مرحبًا يا مولاي، أنا غازي. سأرافقك في أسبوعك الأول. هذا شريط المملكة: الذهب والطعام ورضا الشعب والجنود. إن وصل الرضا إلى صفر سقط العرش. (تستطيع إطفاء هذا الدليل في أي وقت من الإعدادات ⚙)'},
  opts:{sel:'#opts',t:'هذا أول زائر. تحت كل خيار تكلفته، وبعض الخيارات تحتاج أن ترسل مستشارًا، فيبقى مشغولًا بقية الأسبوع. لا يوجد خيار مجاني تمامًا.'},
  adv:{sel:'#extra',t:'قبل أن تقرر، تستطيع أن تسأل أحدنا مرة واحدة لكل زائر. انتبه: كل مستشار ينصحك بما يهمّه هو.'},
  map:{sel:'#mapWrap',t:'هذه غرفة المجلس. الخريطة تُظهر مواقع المملكة، والرقم الأحمر عدد المهمّات في كل موقع. اضغط على موقع لترى مهمّاته.'},
  mis:{sel:'#secMis',t:'أرسل كل مستشار إلى مهمة تناسب مهارته. النسبة بجانب اسمه هي فرصة النجاح. المهمات تُحسم عند ختم الأسبوع.'},
  dec:{sel:'#secDecree',t:'هنا مرسوم الأسبوع والسوق والضرائب. كل قانون له ثمن، والشعب يتذكّر.'},
  end:{sel:'#endW',t:'حين تنتهي، اختم الأسبوع. ستُحسب الضرائب والطعام ورواتب الجند، وتصلك التقارير.'},
  rep:{sel:'#panel',t:'هذا دفتر الأسبوع. اقرأه جيدًا: الأرقام تخبرك بما سيحدث قبل أن يحدث. بعد هذا ستحكم وحدك. بهرام يصل في الأسبوع الثاني عشر. وفّقك الله يا مولاي.'},
 };
 const queue=[];
 function render(){if(box){box.remove();box=null}$$('.hl').forEach(e=>e.classList.remove('hl'));if(!queue.length||!SET.tutorial)return;
  const id=queue[0],st=STEPS[id],el=$(st.sel);if(el)el.classList.add('hl');
  box=document.createElement('div');box.className='tut';box.innerHTML=`<div class="box"><canvas></canvas><div><p>${st.t}</p><div class="row"><button class="px small" id="tutOff">أطفئ الدليل</button><button class="px small gold" id="tutNext">فهمت</button></div></div></div>`;
  document.body.appendChild(box);SPR.paint(box.querySelector('canvas'),'ghazi','happy','#2f2335');
  $('#tutNext').onclick=()=>{S.tut=S.tut||{};S.tut[id]=1;queue.shift();render()};
  $('#tutOff').onclick=()=>{SET.tutorial=false;saveSet();stop();toast('أُطفئ الدليل. تستطيع تشغيله من الإعدادات ⚙')}}
 function show(...ids){if(!SET.tutorial||!S||S.week!==1)return;for(const id of ids)if(!(S.tut&&S.tut[id])&&!queue.includes(id))queue.push(id);if(!box)render()}
 function stop(){queue.length=0;render()}
 return{show,stop};
})();
window.tut=tut;
HOOK.weekStart.push(()=>{if(S.week===1)setTimeout(()=>tut.show('hud'),900)});
HOOK.afterOpts.push(id=>{if(S.week===1)tut.show('opts','adv')});
HOOK.council.push(()=>{if(S.week===1)tut.show('map','mis','dec','end')});
const _endWeek=endWeek;endWeek=function(){const w=S.week;_endWeek();if(w===1&&SET.tutorial&&!(S.tut&&S.tut.rep)){S.week=1;tut.show('rep');S.week=2}};
showHelp.extra.push(()=>`<p class="muted">دليل الأسبوع الأول مع القائد غازي يمكن تشغيله أو إطفاؤه من الإعدادات ⚙.</p>`);
