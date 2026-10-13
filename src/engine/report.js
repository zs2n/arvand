/* ===== ENGINE: end of week ===== */
function endWeek(){
 const R={missions:[],events:[]};
 const keep=[];
 for(const a of S.missions){if(a.end>S.week){keep.push(a);continue}
  const m=M.find(x=>x.id===a.id);const ok=Math.random()<chance(m,a.ret);
  const eff=(ok?m.ok():m.no())||{};let t=(ok?'نجحت: ':'فشلت: ')+txt(ok?m.okT:m.noT);
  if(!ok&&m.risk&&Math.random()<.5){eff.injure=[a.ret,m.risk];t+=`، وأُصيب ${N[a.ret][0]}`}
  apply(eff);R.missions.push({who:N[a.ret][0],name:m.n,t});S.log.push(`الأسبوع ${A(S.week)} · مهمة «${m.n}» (${N[a.ret][0]}): ${ok?'نجاح':'فشل'}`);
  if(m.personal)S.chron.push({w:S.week,who:a.ret,t:m.n+(ok?' (نجحت)':' (فشلت)'),x:ok?'happy':'sad'})}
 S.missions=keep;
 const ec=econ();
 S.gold+=ec.gold;S.food+=ec.food;
 let dh=TAX[S.tax].h+(S.ration?-4:0);
 if(S.gold<0){const d=Math.ceil(S.soldiers*.15);S.soldiers-=d;S.gold=0;dh-=5;R.events.push(`لم تُدفع الرواتب: فرّ ${A(d)} جنديًا.`)}
 if(S.food<0){const d=Math.ceil(S.pop*.08);S.pop-=d;S.food=0;dh-=10;S.famines++;R.events.push(`مجاعة: مات أو رحل ${A(d)} من السكان.`)}
 if(S.hap>=65){S.pop+=3;R.events.push('الرخاء يجذب العائلات: +٣ سكان.')}
 if(S.hap>70)dh-=1;
 if(dh){S.hap=clamp(S.hap+dh,0,100);R.events.push(`تغيّر رضا الشعب بسبب القوانين والأحوال: ${sg(dh)}.`)}
 S.enemy+=DIFF[S.diff].growth;R.events.push('جيش بهرام يكبر: يلتحق به الجائعون من الشرق.');
 if(S.clues>=3&&!F('exposed')&&!F('cluenote')){S.flags.cluenote=1;R.events.push('نوال وسليم يتفقان: كل الأدلة تشير إلى خاتم الأسد. الأمير رستم.')}
 for(const l of run('weekEnd'))R.events.push(l);
 const wk=S.week;S.week++;S.phase='report';hud();sfx('bell');
 const sumLine=arr=>arr.map(([n,v])=>`<li><span>${n}</span><span class="${v>=0?'p':'n'}">${sg(v)}</span></li>`).join('');
 const note=l=>`<li class="note" style="display:block">${l}</li>`;
 $('#panel').innerHTML=`<div class="ledger"><h3>دفتر الأسبوع ${A(wk)}</h3>
 <div><h4>${ic('gold')} الخزينة</h4><ul>${sumLine(ec.lines.gold)}<li><span><b>الرصيد</b></span><span>${A(S.gold)}</span></li></ul></div>
 <div><h4>${ic('food')} المخازن</h4><ul>${sumLine(ec.lines.food)}<li><span><b>الرصيد</b></span><span>${A(S.food)}</span></li></ul></div>
 ${R.missions.length?`<div><h4>تقارير المهام</h4><ul>${R.missions.map(m=>note(`<b>${m.name}</b> · ${m.who}: ${m.t}.`)).join('')}</ul></div>`:''}
 ${S.wk.length?`<div><h4>ما جرى في القاعة</h4><ul>${S.wk.map(note).join('')}</ul></div>`:''}
 <div><h4>أحوال المملكة</h4><ul>${R.events.map(note).join('')}</ul></div>
 ${run('report').join('')}
 </div><button class="px gold" id="nw">${S.week===12?'بهرام عند الأسوار…':'الأسبوع '+A(S.week)}</button>`;
 showStage('scene');
 if(S.hap<=0){$('#nw').onclick=()=>ending('revolt');return}
 $('#nw').onclick=startWeek;$('#nw').focus();
}
