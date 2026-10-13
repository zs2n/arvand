/* ===== ENGINE: the court (petitioners) ===== */
const PRE=[];/* steps before petitions each week: f(done) */
function buildQueue(){
 if(S.week===12){S.queue=['siege'];return}
 const q=[];const add=id=>{if(E[id]&&!q.includes(id))q.push(id)};
 for(const id in E){const e=E[id];if(!e.story||S.done[id])continue;if(S.week>=e.w[0]&&S.week<=e.w[1]&&(!e.cond||e.cond()))add(id)}
 S.follow.filter(f=>f.w===S.week).forEach(f=>{if(!E[f.id].cond||E[f.id].cond())add(f.id)});S.follow=S.follow.filter(f=>f.w>S.week);
 S.deferred.filter(d=>d.w===S.week).forEach(d=>add(d.id));S.deferred=S.deferred.filter(d=>d.w>S.week);
 const waiting=new Set([...S.deferred.map(d=>d.id),...S.follow.map(f=>f.id)]);
 const pool=shuffle(Object.keys(E).filter(id=>{const e=E[id];return e.pool&&!S.done[id]&&!waiting.has(id)&&!q.includes(id)&&S.week>=e.w[0]&&S.week<=e.w[1]&&(!e.cond||e.cond())}));
 /* chapter-3 filler first in late weeks so the second half stays busy */
 if(S.week>=7)pool.sort((a,b)=>(E[b].w[0]>=7)-(E[a].w[0]>=7));
 const target=S.week===11?4:4;while(q.length<target&&pool.length)q.splice(1+Math.floor(Math.random()*q.length),0,pool.shift());
 if(S.week===1)q.sort((a,b)=>(a==='herald'?-1:b==='herald'?1:0));
 S.queue=q;
}
function startWeek(){
 S.phase='court';S.usedW={};S.qi=0;S.wk=[];S.asked={};buildQueue();
 run('weekStart');save();showStage('scene');hud();
 const ch=chapter(S.week);if(ch!==S.lastCh){S.lastCh=ch;$('#card').innerHTML=`<div>${CH[ch][0]}<small>${CH[ch][1]}</small></div>`;setTimeout(()=>{$('#card').innerHTML=''},3300)}
 $('#panel').innerHTML=`<h3>صباح الأسبوع ${A(S.week)}</h3><p class="muted">يفتح الحاجب أبواب القاعة.</p>`;
 let i=0;const step=()=>{if(i<PRE.length){PRE[i++](step)}else{$('#panel').innerHTML=`<h3>صباح الأسبوع ${A(S.week)}</h3><p class="muted">${A(S.queue.length)} ${S.queue.length>2?'زوّار في الانتظار':'في الانتظار'}.</p>`;setTimeout(nextPetition,700)}};
 setTimeout(step,500);
}
function updQueue(){const q=$('#queue');const left=S.queue.length-S.qi-1;q.hidden=S.phase!=='court'||left<0;q.textContent=left>0?`في الانتظار: ${A(left)}`:'آخر الزوّار'}
function nextPetition(){
 if(S.qi>=S.queue.length){endCourt();return}
 const id=S.queue[S.qi],ev=E[id];updQueue();
 $('#panel').innerHTML=`<p class="muted">يدخل زائر…</p>`;
 walkIn(ev.who,(EXPR[id]||[])[0],()=>showPetition(id));
}
const esc=id=>S.esc[id]&&S.deferred.every(d=>d.id!==id)?S.esc[id]:1;
const scaleCost=(c,m)=>Object.fromEntries(Object.entries(c||{}).map(([k,v])=>[k,Math.round(v*m)]));
function scaleEff(e,m){if(!e||m===1)return e;const o={...e};for(const k in o)if(typeof o[k]==='number'&&o[k]<0)o[k]=Math.round(o[k]*m);return o}
function optionsOf(id){const ev=E[id];let opts=ev.opts.map((o,i)=>({...o,_i:i}));
 for(const f of HOOK.optionsExtra){const r=f(id,opts);if(r)opts=r}
 if((ev.pool||ev.defer)&&!S.esc[id]&&S.week<11)opts.push({t:'أجّل إلى الأسبوع القادم',defer:1,_i:-1});
 return opts}
function optState(o,id){
 const m=id?esc(id):1;
 for(const[k,v]of Object.entries(o.cost||{}))if(S[k]<Math.round(v*m))return'لا يكفي '+STATN[k];
 if(o.req&&!avail(o.req))return N[o.req][0]+': '+retState(o.req);
 if(o.need&&!o.need())return o.hint||'غير متاح';
 return'';
}
let typing=null,curOpts=[];
function showPetition(id){
 const ev=E[id];const[name,role]=N[ev.who]||['زائر',''];let t=txt(ev.text);
 if(esc(id)>1)t='(عاد بعد أسبوع، والأمر صار أثقل) '+t;
 $('#panel').innerHTML=`<div class="who"><canvas id="pt"></canvas><div><h2>${name}</h2><p>${role}</p></div></div>
  <div class="speech" id="sp" title="انقر لإكمال النص"></div><div id="extra"></div><div class="opts" id="opts" hidden></div>`;
 SPR.paint($('#pt'),ev.who,(EXPR[id]||[])[0]);
 const sp=$('#sp');let i=0;clearInterval(typing);
 const finish=()=>{clearInterval(typing);sp.textContent=t;renderOpts(id)};
 typing=setInterval(()=>{i+=SET.speed;sp.textContent=t.slice(0,i);if(i%8<SET.speed)sfx('type');if(i>=t.length)finish()},18);
 sp.onclick=finish;
}
function renderOpts(id){
 const box=$('#opts');if(!box||!box.hidden)return;box.hidden=false;
 curOpts=optionsOf(id);const m=esc(id);
 box.innerHTML=curOpts.map((o,i)=>{const why=optState(o,id);
  const req=o.req?`<span class="chip req">يرسل: ${N[o.req][0]}</span>`:'';
  const risk=o.ch?`<span class="chip risk">نجاح ${A(o.ch.p*100)}٪</span>`:'';
  const nd=o.need&&o.hint?`<span class="chip ${why?'bad':'req'}">${o.hint}</span>`:'';
  const df=o.defer?`<span class="chip risk">يعود أثقل بمرّة ونصف</span>`:'';
  return`<button class="opt" data-i="${i}" ${why?'disabled':''}><span>${o.t}</span><span class="chips">${costChips(o.cost,m)}${req}${risk}${df}${why&&!o.hint?`<span class="chip bad">${why}</span>`:nd}</span></button>`}).join('');
 box.querySelectorAll('.opt').forEach(b=>b.onclick=()=>choose(id,+b.dataset.i));
 run('afterOpts',id);
}
HOOK.afterOpts=[];
function reaction(id,o,ok){
 const ex=EXPR[id];if(o._i>=0&&ex&&ex[1][o._i]){if(ok===false)return MOOD.angry.includes(E[id].who)?'angry':'sad';return ex[1][o._i]}
 if(o.defer)return'tired';
 const who=E[id].who,give=(o.cost&&Object.keys(o.cost).length)||(o.e&&o.e.hap>0)||o.req;
 if(ok===false)return'sad';
 if(give)return MOOD.sly.includes(who)?'smug':'happy';return MOOD.angry.includes(who)?'angry':'sad'}
function choose(id,i){
 const ev=E[id],o=curOpts[i];if(!o||optState(o,id))return;
 sfx('choose');
 const m=esc(id),costOut=[];
 if(o.defer){S.deferred.push({id,w:S.week+1});S.esc[id]=1.5;S.stats.deferred++;
  const out=apply({hap:-1});setActorExpr('tired');showResult(id,o,`وعدتَه بالنظر في أمره الأسبوع القادم. سيعود، وقد يكون الأمر أثقل.`,out,null);return}
 for(const[k,v]of Object.entries(scaleCost(o.cost,m))){S[k]-=v;costOut.push([k,-v])}
 if(o.req)S.usedW[o.req]=1;
 S.done[id]=1;delete S.esc[id];S.stats.petitions++;
 let eff=o.e,res=o.r,ok=null;
 if(o.ch){ok=Math.random()<o.ch.p;const b=ok?o.ch.ok:o.ch.no;eff=b.e;res=b.r}
 const hookRes=run('afterChoice',id,o,eff,res);for(const h of hookRes){if(h.eff!==undefined)eff=h.eff;if(h.res!==undefined)res=h.res;if(h.ok!==undefined)ok=h.ok}
 const out=costOut.concat(apply(scaleEff(eff,m)));if(costOut.length)floatDeltas(costOut);
 if(out.some(([k,v])=>k==='gold'&&v>0))coin();
 const[name]=N[ev.who]||['زائر'];
 S.log.push(`الأسبوع ${A(S.week)} · ${name}: ${o.t}`);
 if(ev.story||ev.key)S.chron.push({w:S.week,who:ev.who,t:o.t,x:reaction(id,o,ok)});
 if(res==='end'){finale();return}
 setActorExpr(reaction(id,o,ok));
 S.wk.push(`${name}: ${txt(res)}`);
 showResult(id,o,txt(res),out,ok);
}
function showResult(id,o,res,out,ok){
 const ev=E[id],[name]=N[ev.who]||['زائر'],x=actor?actor.expr:'neutral';
 if(ok===false||x==='angry'||x==='sad')sfx('bad');else if(ok===true||x==='happy')sfx('good');
 $('#panel').innerHTML=`<div class="who"><canvas id="pt"></canvas><div><h2>${name}</h2><p>قرارك: ${o.t}</p></div></div>
 <div class="speech result">${ok===true?'<b>نجاح. </b>':ok===false?'<b>فشل. </b>':''}${res}</div>
 <div class="chips">${chipsFor(out)}</div>
 <div class="row"><span class="muted">${S.qi+1<S.queue.length?'الزائر التالي ينتظر':'لا مزيد من الزوّار اليوم'}</span><button class="px gold" id="nx">التالي</button></div>`;
 SPR.paint($('#pt'),ev.who,x);hud();
 $('#nx').onclick=()=>{$('#nx').disabled=true;S.qi++;walkOut(nextPetition)};$('#nx').focus();
 if(S.hap<=0)setTimeout(()=>ending('revolt'),600);
}
function endCourt(){
 updQueue();$('#queue').hidden=true;
 $('#panel').innerHTML=`<h3>انتهى الاستقبال</h3><p>أُغلقت أبواب القاعة. حان وقت المجلس: أرسل مستشاريك في المهام، وراجع الخزانة وقوانين الأسبوع، ثم اختم الأسبوع.</p><button class="px gold" id="toC">إلى غرفة المجلس</button>`;
 $('#toC').onclick=()=>{S.phase='council';renderCouncil()};$('#toC').focus();
}
