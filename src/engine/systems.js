/* ===== ENGINE: extra rules that plug into core ===== */
/* siege bonuses from chapter-3 preparations */
myPower.extra.push(parts=>{
 if(F('arrows'))parts.push(['عشرة آلاف سهم',20]);else if(F('halfarrows'))parts.push(['خمسة آلاف سهم',10]);
 if(F('oil'))parts.push(['قدور الزيت المغلي',25]);
});

myPower.extra.push(parts=>{
 if(F('catapults'))parts.push(['منجنيقا دانيال',30]);
 if(S.arms)parts.push(['مخزون السلاح ('+A(S.arms)+')',S.arms*6]);
 });
/* advisors' personal quests left too long */
HOOK.weekEnd.push(()=>{
 if(F('saqrquest')&&!F('saqrsaved')&&!F('saqrlost')&&S.week>=9){S.flags.saqrlost=1;S.ret.ghazi.mod-=.1;return 'لم يُعثر على صقر بن غازي. القائد يقاتل الآن بقلب مكسور (−١٠٪).'}
});

/* ---- weekly decree ---- */
econ.extra.push(lines=>{const d=DEC[S.decree];if(!d||S.decree==='none')return;if(d.gold)lines.gold.push(['مرسوم: '+d.n,d.gold]);if(d.food)lines.food.push(['مرسوم: '+d.n,d.food])});
HOOK.weekEnd.push(()=>{const d=DEC[S.decree];if(!d||!d.e)return;const out=apply(d.e);return 'المرسوم ('+d.n+'): '+out.filter(o=>typeof o[1]==='number').map(([k,v])=>STATN[k]+' '+sg(v)).join('، ')});
COUNCIL.push({html:()=>`<div class="sec" id="secDecree"><h3>مرسوم الأسبوع</h3><div class="seg">${Object.entries(DEC).map(([k,d])=>{const no=d.need&&!d.need();return`<button class="px small${S.decree===k?' on':''}" data-dec="${k}" ${no?'disabled title="'+d.hint+'"':''}>${d.n}</button>`}).join('')}</div><p class="muted">${DEC[S.decree].d}</p></div>`,
 bind:()=>$$('[data-dec]').forEach(b=>b.onclick=()=>{S.decree=b.dataset.dec;sfx('stamp');renderCouncil()})});

/* ---- royal treasury (items) ---- */
hud.extraBtns.push({id:'bItems',label:()=>`${ic('chest')} الخزنة${S&&S.items.length?' ('+A(S.items.length)+')':''}`,click:showItems});
function showItems(){
 modal(`<h3>الخزنة الملكية</h3><p class="muted">كنوز جمعتها من القضايا والمهام. كل كنز يُستعمل مرة واحدة.</p><div class="items">${S.items.length?S.items.map(k=>{const it=ITEMS[k];return`<div class="item"><b>${ic('chest')} ${it.n}</b><span class="muted">${it.d}</span><div class="sendrow">${it.uses.map((u,i)=>`<button class="px small" data-use="${k}|${i}">${u.t}</button>`).join('')}</div></div>`}).join(''):'<p>الخزنة فارغة. الكنوز تأتي من قرارات القاعة والمهام والرسائل.</p>'}</div>`);
 $$('[data-use]').forEach(b=>b.onclick=()=>{const[k,i]=b.dataset.use.split('|');const u=ITEMS[k].uses[+i];S.items=S.items.filter(x=>x!==k);const out=apply(u.e);S.log.push(`الأسبوع ${A(S.week)} · الخزنة: ${ITEMS[k].n} ← ${u.t}`);sfx('coin');showItems();toast(ITEMS[k].n+': '+u.t);if(S.phase==='council')renderCouncil()});
}

/* ---- morning letters ---- */
PRE.push(done=>{
 const due=LETTERS.filter(l=>!S.done['L_'+l.id]&&S.week>=l.w[0]&&S.week<=l.w[1]&&(!l.cond||l.cond())).slice(0,2);
 if(!due.length){done();return}
 let i=0;const show=()=>{if(i>=due.length){done();return}const l=due[i];const[from,seal]=LFROM[l.from]||FAC[l.from]&&[FAC[l.from].n,FAC[l.from].seal]||['',''];
  sfx('quill');
  $('#panel').innerHTML=`<p class="muted">رسائل الصباح (${A(i+1)} من ${A(due.length)})</p><div class="letter"><span class="seal" style="background:${seal}">${from.slice(0,1)}</span><h4>${l.title}</h4><p>${l.text}</p><div class="opts">${l.opts.map((o,j)=>{const why=optState(o);return`<button class="opt" data-l="${j}" ${why?'disabled':''}><span>${o.t}</span><span class="chips">${costChips(o.cost)}${o.need&&o.hint?`<span class="chip ${why?'bad':'req'}">${o.hint}</span>`:''}</span></button>`}).join('')}</div></div>`;
  $$('[data-l]').forEach(b=>b.onclick=()=>{const o=l.opts[+b.dataset.l];if(optState(o))return;sfx('stamp');
   for(const[k,v]of Object.entries(o.cost||{}))S[k]-=v;const out=apply(o.e);S.done['L_'+l.id]=1;S.log.push(`الأسبوع ${A(S.week)} · رسالة «${l.title}»: ${o.t}`);
   $('#panel').innerHTML=`<div class="letter"><h4>${l.title}</h4><p>${o.r}</p></div><div class="chips">${chipsFor(out)}</div><div class="row"><span></span><button class="px gold" id="nx">${i+1<due.length?'الرسالة التالية':'افتحوا القاعة'}</button></div>`;
   $('#nx').onclick=()=>{i++;show()}})};
 show();
});
