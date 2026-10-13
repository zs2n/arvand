/* ===== ENGINE: advisor whispers, lying visitors, market ===== */

/* ---- advisor whispers: each advisor weighs the options through their own values ---- */
const PERSONA={
 ghazi:{w:{soldiers:3,enemy:-2.5,horn:1,morale:1.2,hap:.3,gold:.05,clues:2,fort:20,arms:5},why:{soldiers:'الرجال هم السور الحقيقي.',enemy:'كل ما يُضعف بهرام يقرّبنا من النصر.',horn:'أهل القرن سيوفٌ لا تُشترى.',fort:'الحجر لا يهرب من المعركة.',def:'العرش يحتاج يدًا قوية.'}},
 samar:{w:{hap:2,pop:1.2,moon:1.5,food:.2,gold:.03,clues:.5},why:{hap:'الناس سيتذكّرون من رحمهم.',pop:'كل روح تُنقذ لها ثمن.',moon:'القمر يرى ما نفعل.',def:'الرحمة لا تُضعف الملوك.'}},
 raad:{w:{food:1.5,hap:.6,gold:.2,soldiers:.5},why:{food:'البطون الفارغة لا تقاتل.',def:'خذ الطريق الأقصر يا مولاي.'}},
 nawal:{w:{clues:8,enemy:-1,gold:.3,hap:.2},why:{clues:'هذا الخيط يقود إلى الأسد.',enemy:'الظل أرخص من الحرب.',def:'لا تثق بالوجه الذي أمامك.'}},
 daniel:{w:{fort:25,arms:6,gold:.15,soldiers:.5},why:{fort:'الحجارة لا تخون.',arms:'السلاح الجيد نصف المعركة.',def:'كل مشكلة لها آلة تحلّها.'}},
 qasim:{w:{gold:1.2,food:.5,river:1,hap:.2},why:{gold:'الذهب الذي توفّره اليوم يشتري السيوف غدًا.',river:'التجّار ذاكرتهم طويلة.',food:'القمح أغلى من الذهب في الحصار.',def:'احسبها مرتين يا مولاي.'}},
};
const BUILD_FLAGS=['crossbows','oil','arrows','halfarrows','catapults','smith','wells','evac','scouted','exposed','cured','banditsdone'];
function scoreOpt(o,k){const w=PERSONA[k].w;let best={key:'def',v:0},sum=0;
 const effs=o.ch?[[o.ch.p,o.ch.ok.e],[1-o.ch.p,o.ch.no.e]]:[[1,o.e]];
 for(const[p,e]of effs){if(!e)continue;for(const key in w)if(typeof e[key]==='number'){const v=e[key]*w[key]*p;sum+=v;if(v>best.v)best={key,v}}
  if(e.unlock)sum+=15*p;if(e.set)for(const f of e.set)if(BUILD_FLAGS.includes(f)){sum+=12*p;if(12*p>best.v)best={key:k==='daniel'?'fort':k==='ghazi'?'fort':'def',v:12*p}}
  if(e.lose)sum-=25*p;if(e.injure)sum-=6*p}
 for(const[key,v]of Object.entries(o.cost||{}))sum-=v*Math.max(w[key]||0,key==='gold'?.15:.4);
 if(o.req===k)sum+=2;return{sum,why:best.key}}
function adviceFor(id,k){
 const ev=E[id];if(ev.adv&&ev.adv[k])return ev.adv[k];
 if(k==='nawal'&&ev.lie&&S.lies[id]!=null&&!S.checked[id])return S.lies[id]?'في كلامه شيء لا يستقيم. دعني أتحقق قبل أن تعطيه شيئًا.':'تكلّمت مع حرّاس البوابة عنه. يبدو صادقًا.';
 const opts=curOpts.filter(o=>!o.defer&&!o.check&&!optState(o,id));if(!opts.length)return'لا أرى خيارًا يمكنك اتخاذه الآن.';
 const ranked=opts.map(o=>({o,...scoreOpt(o,k)})).sort((a,b)=>b.sum-a.sum);const top=ranked[0];
 const why=PERSONA[k].why[top.why]||PERSONA[k].why.def;
 return`لو كنتُ مكانك لاخترت: «${top.o.t}». ${why}`}
HOOK.afterOpts.push(id=>{
 const box=$('#extra');if(!box)return;const ks=RKEYS.filter(k=>S.ret[k].on&&inCastle(k)&&k!==E[id].who);
 if(!ks.length||E[id].noadvice)return;
 if(S.asked[id]){box.innerHTML=S.asked[id];box.querySelectorAll('canvas[data-p]').forEach(c=>SPR.paint(c,c.dataset.p,'neutral','#120d14'));return}
 box.innerHTML=`<div class="adv"><span class="muted">اسأل مستشارًا (مرة واحدة):</span>${ks.map(k=>`<button class="px small" data-ask="${k}"><canvas data-p="${k}"></canvas>${N[k][0].split(' ').pop()}</button>`).join('')}</div>`;
 box.querySelectorAll('canvas[data-p]').forEach(c=>SPR.paint(c,c.dataset.p,'neutral','#120d14'));
 box.querySelectorAll('[data-ask]').forEach(b=>b.onclick=()=>{const k=b.dataset.ask;sfx('quill');
  const html=`<div class="advice"><canvas data-p="${k}"></canvas><div><b>${N[k][0]}</b><br>${adviceFor(id,k)}</div></div>`;S.asked[id]=html;box.innerHTML=html;box.querySelectorAll('canvas[data-p]').forEach(c=>SPR.paint(c,c.dataset.p,'smug','#120d14'))});
});

/* ---- lying visitors: Nawal can check before you give anything ---- */
const LIES={
 widow:{p:.3,trust:[0,1],truth:'ليست أرملة جندي. زوجها حيّ، يبيع الخبز في السوق الشرقي.',later:'تبيّن أن «أم ناصر» ليست أرملة، وأن زوجها يبيع الخبز في السوق الشرقي.',e:{hap:-2}},
 bandits:{p:.3,trust:[0,1],truth:'لم تُنهب القرية. عُدَيّ يريد تعويضًا عن موسم سيئ.',later:'لم يجد أحد أثرًا لعصابة الذئاب في القرية. عُدَيّ اختلق القصة.',e:{hap:-1}},
 pilgrim:{p:.3,trust:[0,1],truth:'ليس حاجًّا. لصّ يتنقّل بين القصور بثياب الحجاج.',later:'اختفى «حاجّ القمر» ومعه ملعقتان من فضة القصر.',e:{gold:-10}},
 merc:{p:.35,trust:[0],truth:'سريّة الحديد لا تتجاوز عشرين رجلًا، ونصفهم جرحى.',later:'وصلت سريّة الحديد: اثنا عشر رجلًا قادرًا على القتال، لا ثلاثون.',instead:{soldiers:12},e:{}},
 boy:{p:.25,trust:[0],truth:'لا تنّين. يونس يريد فقط أن يرى الملك.',later:'لم يجد رعد في الغابة إلا آثار خروف ضائع.',instead:{},e:{}},
 noble:{p:.3,trust:[0],truth:'لا هدية. قيصر يعدّ ورقة دَين مزيّفة باسم الخزانة.',later:'«هدية» قيصر كانت صكّ دَين مزوّرًا لا يساوي شيئًا.',instead:{hap:-4},e:{}},
};
for(const id in LIES)if(E[id])E[id].lie=LIES[id];
const CAUGHT=[{t:'اطردوه من القصر',e:{hap:2},r:'خرج مطأطئ الرأس، والناس في الساحة يضحكون.',_i:-2},{t:'اعفُ عنه هذه المرة',e:{hap:1},r:'نظر إليك طويلًا، ثم شكرك ومضى.',_i:-3}];
HOOK.optionsExtra.push((id,opts)=>{const ev=E[id];if(!ev.lie)return;
 if(S.lies[id]==null)S.lies[id]=Math.random()<ev.lie.p;
 if(S.checked[id]==='lie')return CAUGHT.map(o=>({...o}));
 if(!S.checked[id]&&S.ret.nawal.on)return opts.concat([{t:'نوال، تحققي من صدقه أولًا',req:'nawal',check:1,_i:-4}])});
HOOK.afterChoice.push((id,o)=>{const ev=E[id];
 if(o.check){S.checked[id]=S.lies[id]?'lie':'true';S.usedW.nawal=1;return}
 if(ev.lie&&S.lies[id]&&!S.checked[id]&&ev.lie.trust.includes(o._i)){S.stats.lies++;(S.pendingLies=S.pendingLies||[]).push(id);return{eff:ev.lie.instead||{}}}});
HOOK.weekEnd.push(()=>{if(!S.pendingLies||!S.pendingLies.length)return;const lines=S.pendingLies.map(id=>{apply(LIES[id].e);return'كذبة انكشفت: '+LIES[id].later});S.pendingLies=[];return lines.join(' ')});
/* checking replaces the normal choose flow */
const _choose=choose;
choose=function(id,i){const o=curOpts[i];if(o&&o.check&&!optState(o,id)){sfx('quill');S.checked[id]=S.lies[id]?'lie':'true';S.usedW.nawal=1;
  const lying=S.lies[id];setActorExpr(lying?'shock':'neutral');
  $('#panel').innerHTML=`<div class="who"><canvas id="pt"></canvas><div><h2>${N[E[id].who][0]}</h2><p>تحقّقت نوال</p></div></div><div class="advice"><canvas data-p="nawal"></canvas><div><b>نوال</b><br>${lying?E[id].lie.truth:'سألتُ عنه في السوق والبوابة. صادق فيما يقول.'}</div></div><div id="extra"></div><div class="opts" id="opts" hidden></div>`;
  SPR.paint($('#pt'),E[id].who,lying?'shock':'neutral');SPR.paint($('[data-p="nawal"]'),'nawal','smug','#120d14');renderOpts(id);return}
 return _choose(id,i)};

/* ---- market: grain and arms with weekly prices ---- */
HOOK.weekEnd.push(()=>{const m=S.market,ch=chapter(S.week);
 const drought=S.week>=3&&!F('wells')?3:0,war=ch>=3?4:ch>=2?1:0;
 const old=m.grain;m.grain=clamp(Math.round(9+drought+war+(Math.random()*5-2)),6,24);m.arms=clamp(Math.round(26+S.week*1.6+(Math.random()*8-4)),20,60);
 if(m.grain-old>=3)return'ارتفع سعر القمح في السوق إلى '+A(m.grain)+' ذهبًا لكل عشرة.'});
const disc=()=>S.ret.qasim.on&&!S.ret.qasim.inj?.85:1;
COUNCIL.push({html:()=>{const m=S.market,d=disc(),bg=Math.round(m.grain*d),sg_=Math.round(m.grain*.7),ba=Math.round(m.arms*d);
 return`<div class="sec" id="secMarket"><h3>السوق</h3>${d<1?'<p class="muted">قاسم يساوم لك: خصم ١٥٪ على الشراء.</p>':''}<div class="market">
 <div class="mis"><b>${ic('food')} القمح</b><p>${A(bg)} ذهبًا لكل عشرة أكياس (البيع بـ${A(sg_)})</p><div class="sendrow"><button class="px small" data-act="buyg" ${S.gold<bg?'disabled':''}>اشترِ ١٠</button><button class="px small" data-act="sellg" ${S.food<10?'disabled':''}>بِع ١٠</button></div></div>
 <div class="mis"><b>${ic('arms')} السلاح</b><p>${A(ba)} ذهبًا للدفعة (+٦ قوة يوم الحصار). عندك ${A(S.arms)}.</p><div class="sendrow"><button class="px small" data-act="buya" ${S.gold<ba?'disabled':''}>اشترِ دفعة</button></div></div>
 </div></div>`},
 bind:()=>$$('[data-act]').forEach(b=>b.onclick=()=>{const m=S.market,d=disc();const a=b.dataset.act;
  if(a==='buyg'){const c=Math.round(m.grain*d);if(S.gold<c)return;S.gold-=c;apply({food:10});floatDeltas([['gold',-c]])}
  if(a==='sellg'){if(S.food<10)return;S.food-=10;const c=Math.round(m.grain*.7);apply({gold:c});floatDeltas([['food',-10]])}
  if(a==='buya'){const c=Math.round(m.arms*d);if(S.gold<c)return;S.gold-=c;apply({arms:1});floatDeltas([['gold',-c]])}
  coin();renderCouncil()})});
