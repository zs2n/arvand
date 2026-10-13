/* ===== ENGINE: HUD, modals, title, settings ===== */
function hud(){
 if(!S)return;const ch=chapter(S.week);
 const st=[['gold',S.gold,S.gold<20],['food',S.food,S.food<25],['hap',S.hap,S.hap<30],['soldiers',S.soldiers,S.soldiers<30],['pop',S.pop,false],['fort',S.fort+'/٣',false]];
 $('#hud').innerHTML=`<div class="when">الأسبوع ${A(Math.min(S.week,12))} من ١٢<small>${CH[ch][0]}: ${CH[ch][1]}</small></div>
 <div class="stats">${st.map(([k,v,low])=>`<div class="stat${low?' low':''}" id="st-${k}" title="${STATN[k]}">${ic(k)}<b>${typeof v==='number'?A(v):v.replace(/\d/g,d=>AD[d])}</b><span>${STATN[k]}</span></div>`).join('')}
 <div class="stat" id="st-enemy" title="جيش بهرام">${ic('enemy')}<b>${F('scouted')?A(enemyPower()):'؟'}</b><span>بهرام</span></div>
 <div class="stat" id="st-clues" title="أدلة الخيانة">${ic('clue')}<b>${A(S.clues)}</b><span>أدلة</span></div></div>
 <div class="hbtns"><button class="px small" id="bFac">الفصائل والحرب</button><button class="px small" id="bLog">السجل</button>${hud.extraBtns.map(b=>`<button class="px small" id="${b.id}">${b.label()}</button>`).join('')}<button class="px small" id="bHelp" aria-label="طريقة اللعب">؟</button><button class="px small" id="bSet" aria-label="الإعدادات">⚙</button></div>`;
 $('#bFac').onclick=showFactions;$('#bLog').onclick=showLog;$('#bHelp').onclick=showHelp;$('#bSet').onclick=showSettings;
 hud.extraBtns.forEach(b=>{$('#'+b.id).onclick=b.click});
}
hud.extraBtns=[];
function floatDeltas(out){requestAnimationFrame(()=>{hud();out.forEach(([k,v])=>{const el=$('#st-'+k);if(!el||typeof v!=='number')return;const s=document.createElement('i');s.className='float '+(v>0?'pos':'neg');s.textContent=sg(v);el.appendChild(s);setTimeout(()=>s.remove(),1500)})})}
function modal(html,onClose){$('#ov').hidden=false;$('#ov').innerHTML=`<div class="box">${html}<button class="px gold" id="mx">إغلاق</button></div>`;$('#mx').onclick=()=>{$('#ov').hidden=true;onClose&&onClose()};$('#mx').focus()}
function showFactions(){
 const me=myPower();
 modal(`<h3>الفصائل والحرب</h3><p class="muted">الفصيل الذي تبلغ علاقته ٧٠ يقف معك يوم الحصار في الأسبوع ١٢.</p>
 ${['river','horn','moon'].map(k=>{const f=FAC[k],v=S.rel[k];return`<div class="fac"><div class="row"><b>${ic(k)} ${f.n} <span class="muted">(${f.lord})</span></b><b>${A(v)}</b></div><div class="bar"><i style="width:${v}%;background:${v>=70?'var(--moss)':'var(--gold)'}"></i><u></u></div><small>يعطون: ${f.give}</small><small class="muted">يريدون: ${f.want}</small></div>`}).join('')}
 <div class="ledger"><h4>ميزان الحرب الآن</h4><ul>${me.parts.map(([n,v])=>`<li><span>${n}</span><span class="p">${A(v)}</span></li>`).join('')}<li><span><b>قوّتك المتوقعة</b></span><span>${A(me.total)}</span></li><li><span><b>جيش بهرام</b></span><span class="n">${F('scouted')?A(enemyPower()):'مجهول، أرسل من يستطلعه'}</span></li></ul></div>`)}
function showLog(){modal(`<h3>سجل الحكم</h3><div class="log">${S.log.length?S.log.slice().reverse().map(l=>`<div>${l}</div>`).join(''):'<p class="muted">لم تُتخذ قرارات بعد.</p>'}</div>`)}
function showHelp(){modal(`<h3>طريقة اللعب</h3>
<p><b>كل أسبوع له ثلاث مراحل.</b> صباحًا تستقبل الرعايا والرسل في قاعة العرش وتقرّر في طلباتهم. بعضها يكلّف ذهبًا أو طعامًا أو جنودًا، وبعضها يحتاج إرسال أحد مستشاريك، فيصبح مشغولًا بقية الأسبوع.</p>
<p>بعد الاستقبال تنتقل إلى <b>المجلس</b>: خريطة المملكة ومهمّات في كل موقع. أرسل كل مستشار إلى مهمة تناسب مهارته، فنسبة النجاح تعتمد عليها. وغيّر الضرائب وحصص الطعام وجنّد الجنود.</p>
<p>عند ختم الأسبوع تُحسب الضرائب ورواتب الجيش والطعام المستهلك، وتصلك تقارير المهام. الجوع يقتل السكان، والإفلاس يُفرّ الجنود، ورضا الشعب إن وصل صفرًا سقط عرشك.</p>
<p><b>الهدف:</b> في الأسبوع ١٢ يصل بهرام. اجمع جيشًا، وارفع الأسوار، واكسب ثلاثة فصائل، واكشف الخائن في بلاطك قبل أن يفتح البوابة. أو ابحث عن طريق لا يحتاج حربًا.</p>${showHelp.extra.map(f=>f()).join('')}`)}
showHelp.extra=[];
function showSettings(){
 const row=(id,label,on)=>`<label for="${id}"><span>${label}</span><input type="checkbox" id="${id}" ${on?'checked':''}></label>`;
 modal(`<h3>الإعدادات</h3><div class="settings">
 ${row('setSfx','المؤثرات الصوتية',SET.sfx)}${row('setMusic','الموسيقى',SET.music)}${row('setTut','دليل الأسبوع الأول مع القائد غازي',SET.tutorial)}
 <label for="setVol"><span>مستوى الصوت</span><input type="range" id="setVol" min="0" max="1" step="0.05" value="${SET.vol}"></label>
 <label for="setSpd"><span>سرعة ظهور النص</span><input type="range" id="setSpd" min="1" max="6" step="1" value="${SET.speed}"></label>
 </div><p class="muted">تُحفظ الإعدادات في متصفحك.</p>`);
 $('#setSfx').onchange=e=>{SET.sfx=e.target.checked;saveSet()};
 $('#setMusic').onchange=e=>{SET.music=e.target.checked;saveSet();if(window.music)music.update()};
 $('#setTut').onchange=e=>{SET.tutorial=e.target.checked;saveSet();if(!SET.tutorial&&window.tut)tut.stop()};
 $('#setVol').oninput=e=>{SET.vol=+e.target.value;saveSet();if(MASTER)MASTER.gain.value=SET.vol};
 $('#setSpd').oninput=e=>{SET.speed=+e.target.value;saveSet()};
}
