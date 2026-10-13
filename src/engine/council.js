/* ===== ENGINE: council (map, missions, treasury) ===== */
function showStage(which){$('#scene').hidden=which!=='scene';$('#mapWrap').hidden=which!=='map';sceneMode=which==='map'?'map':which==='siege'?'siege':'room'}
function retCard(k){const st=retState(k);const cls=st==='متاح'?'st-ok':st==='غائب'?'st-no':st==='في مهمة'?'st-mid':'st-no';
 const sk=Object.entries(RET[k].sk).filter(([,v])=>v>=2).map(([s,v])=>SKN[s]+' '+'■'.repeat(v)).join(' · ');
 const md=S.ret[k].mod?` <span class="${S.ret[k].mod>0?'st-ok':'st-no'}">(${S.ret[k].mod>0?'+':'−'}${A(Math.abs(S.ret[k].mod*100))}٪)</span>`:'';
 return`<div class="ret"><canvas data-p="${k}"></canvas><div><b>${N[k][0]}</b><small class="${cls}">${st}${st==='مصاب'?' حتى الأسبوع '+A(S.ret[k].inj):''}</small>${md}<br><small class="muted">${sk}</small></div></div>`}
const COUNCIL=[];/* extra sections: {html(), bind()} */
function renderCouncil(){
 showStage('map');renderNodes(renderCouncil);hud();
 const L=LOC[selLoc];const ms=M.filter(m=>m.loc===selLoc&&(!m.cond||m.cond()));
 const ec=econ();
 const keys=RKEYS.filter(k=>S.ret[k].on);
 $('#panel').innerHTML=`
 <div class="sec" id="secRet"><h3>المجلس</h3><div class="rets">${keys.map(retCard).join('')}</div></div>
 <div class="sec" id="secMis"><h3>${L.n}</h3>${ms.length?ms.map(m=>misCard(m)).join(''):'<p class="muted">لا مهمّات هنا هذا الأسبوع. اختر موقعًا آخر من الخريطة.</p>'}</div>
 ${COUNCIL.map(s=>s.html()).join('')}
 <div class="sec" id="secTreasury"><h3>الخزانة والقوانين</h3>
  <div><span class="muted">الضرائب</span><div class="seg">${TAX.map((t,i)=>`<button class="px small${S.tax===i?' on':''}" data-tax="${i}">${t.n}</button>`).join('')}</div></div>
  <div><span class="muted">حصص الطعام</span><div class="seg"><button class="px small${!S.ration?' on':''}" data-r="0">كاملة</button><button class="px small${S.ration?' on':''}" data-r="1">مقنّنة (−٢٥٪ استهلاك، −٤ رضا)</button></div></div>
  <div class="row"><span class="muted">التجنيد: ٢٥ ذهبًا ← ١٠ جنود (−٥ سكان، −١ رضا)</span><button class="px small" id="rec" ${S.gold<25||S.pop<20?'disabled':''}>جنّد</button></div>
  <div class="chips"><span class="chip ${ec.gold>=0?'good':'bad'}">${ic('gold')}الخزينة المتوقعة ${sg(ec.gold)} أسبوعيًا</span><span class="chip ${ec.food>=0?'good':'bad'}">${ic('food')}المؤن المتوقعة ${sg(ec.food)} أسبوعيًا</span>${S.week>=3&&!F('wells')?'<span class="chip bad">الجفاف ينقص الحصاد (احفر الآبار)</span>':''}</div>
 </div>
 <button class="px gold" id="endW">اختم الأسبوع ${A(S.week)}</button>`;
 $('#panel').querySelectorAll('canvas[data-p]').forEach(c=>SPR.paint(c,c.dataset.p,'neutral','#120d14'));
 $('#panel').querySelectorAll('[data-tax]').forEach(b=>b.onclick=()=>{S.tax=+b.dataset.tax;renderCouncil()});
 $('#panel').querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{S.ration=+b.dataset.r;renderCouncil()});
 $('#rec').onclick=()=>{S.gold-=25;apply({soldiers:10,pop:-5,hap:-1});floatDeltas([['gold',-25]]);renderCouncil()};
 $('#panel').querySelectorAll('[data-send]').forEach(b=>b.onclick=()=>{const[mid,k]=b.dataset.send.split('|');const m=M.find(x=>x.id===mid);for(const[c,v]of Object.entries(m.cost||{}))S[c]-=v;S.missions.push({id:mid,ret:k,end:S.week+m.dur-1,at:S.week});sfx('choose');renderCouncil()});
 $('#panel').querySelectorAll('[data-cancel]').forEach(b=>b.onclick=()=>{const i=+b.dataset.cancel;const a=S.missions[i];const m=M.find(x=>x.id===a.id);for(const[c,v]of Object.entries(m.cost||{}))S[c]+=v;S.missions.splice(i,1);renderCouncil()});
 COUNCIL.forEach(s=>s.bind&&s.bind());
 $('#endW').onclick=confirmEnd;
 run('council');
}
function misCard(m){
 const ai=S.missions.findIndex(a=>a.id===m.id);let body;
 if(ai>=0){const a=S.missions[ai];body=`<div class="row"><span class="chip req">${N[a.ret][0]} في المهمة حتى نهاية الأسبوع ${A(a.end)}</span>${a.at===S.week?`<button class="px small" data-cancel="${ai}">استدعِ</button>`:''}</div>`}
 else{const can=Object.entries(m.cost||{}).every(([k,v])=>S[k]>=v);
  const ks=RKEYS.filter(k=>S.ret[k].on&&(!m.only||m.only===k));
  body=`<div class="sendrow">${ks.map(k=>{const ok=avail(k)&&can;return`<button class="px small" data-send="${m.id}|${k}" ${ok?'':'disabled'} title="${retState(k)}">${N[k][0].split(' ').pop()} · ${A(chance(m,k)*100)}٪</button>`}).join('')}</div>`}
 return`<div class="mis"><header><b>${m.n}</b><span class="chips">${costChips(m.cost)}<span class="chip">${SKN[m.sk]}</span><span class="chip">${m.dur>1?'أسبوعان':'أسبوع'}</span>${m.risk?'<span class="chip risk">خطر إصابة</span>':''}${m.personal?'<span class="chip good">مهمة شخصية</span>':''}</span></header><p>${txt(m.d)}</p>${body}</div>`}
function confirmEnd(){
 const idle=RKEYS.filter(k=>avail(k));
 const ec=econ();const warn=[];
 if(idle.length)warn.push(`${idle.map(k=>N[k][0]).join('، ')} بلا مهمة.`);
 if(S.food+ec.food<0)warn.push('المؤن لن تكفي: سيجوع الناس.');
 if(S.gold+ec.gold<0)warn.push('الخزينة ستعجز عن رواتب الجنود.');
 if(!warn.length){endWeek();return}
 $('#ov').hidden=false;$('#ov').innerHTML=`<div class="box"><h3>قبل أن تختم الأسبوع</h3>${warn.map(w=>`<p>${w}</p>`).join('')}<div class="row"><button class="px" id="cb">عودة</button><button class="px gold" id="cy">اختم على أي حال</button></div></div>`;
 $('#cb').onclick=()=>$('#ov').hidden=true;$('#cy').onclick=()=>{$('#ov').hidden=true;endWeek()};
}
