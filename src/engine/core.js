/* ===== ENGINE: state, rules, effects ===== */
let S;
const DIFF={
 easy:{n:'ملك جديد',d:'موارد أكثر، وجيش بهرام أصغر بأربعين، وجفاف أخف.',gold:170,food:120,enemy:-40,drought:3,growth:4},
 normal:{n:'ملك',d:'التوازن الذي صُمّمت عليه اللعبة.',gold:120,food:90,enemy:0,drought:6,growth:6},
 hard:{n:'طاغية الجفاف',d:'جفاف أقسى، وجيش أكبر بخمسين، وموارد أقل. لمن عرف اللعبة.',gold:90,food:70,enemy:50,drought:9,growth:8},
};
function fresh(diff){diff=diff||'normal';const D=DIFF[diff];return{v:2,diff,week:1,gold:D.gold,food:D.food,hap:55,soldiers:60,pop:150,fort:0,enemy:240+D.enemy,clues:0,sabotage:0,morale:0,arms:0,
 tax:1,ration:0,decree:'none',rel:{river:40,horn:35,moon:40},flags:{},done:{},follow:[],deferred:[],esc:{},lies:{},checked:{},
 ret:Object.fromEntries(RKEYS.map(k=>[k,{on:['ghazi','samar','raad'].includes(k)?1:0,inj:0,mod:0}])),
 items:[],son:{war:0,wis:0,kind:0},market:{grain:10,arms:30},
 missions:[],usedW:{},queue:[],qi:0,letters:[],li:0,log:[],chron:[],wk:[],famines:0,asked:{},plan:'field',phase:'court',lastCh:0,stats:{petitions:0,deferred:0,lies:0}}}
const F=f=>!!(S&&S.flags[f]);
const chapter=w=>w<=4?1:w<=8?2:w<=11?3:4;
const CH={1:['الفصل الأول','سنة العطش'],2:['الفصل الثاني','همسٌ في الأروقة'],3:['الفصل الثالث','ريح الرماد'],4:['الخاتمة','الحصار']};
/* plug-in points used by later systems */
const HOOK={weekStart:[],weekEnd:[],council:[],report:[],ending:[],endingBind:[],optionsExtra:[],afterChoice:[],afterOpts:[]};
const run=(h,...a)=>HOOK[h].flatMap(f=>{const r=f(...a);return r==null?[]:[r]});

function retState(k){const r=S.ret[k];if(!r||!r.on)return'غائب';if(r.inj>S.week)return'مصاب';if(S.missions.find(m=>m.ret===k))return'في مهمة';if(S.usedW[k])return'مشغول اليوم';return'متاح'}
const avail=k=>retState(k)==='متاح';
const inCastle=k=>{const s=retState(k);return s==='متاح'||s==='مشغول اليوم'};
function chance(m,k){let p=.3+(RET[k].sk[m.sk]||0)*.2+(S.ret[k].mod||0);if(k==='nawal'&&F('thiefagent'))p+=.1;if(S.decree==='curfew'&&m.sk==='shadow')p+=.1;return clamp(p,.1,.95)}

const TAX=[{n:'منخفضة',m:.6,h:3},{n:'عادية',m:1,h:0},{n:'مرتفعة',m:1.5,h:-6}];
function econ(){
 const D=DIFF[S.diff];
 const tax=Math.round((15+S.pop*.08+S.hap*.15)*TAX[S.tax].m);
 const lines={gold:[['الضرائب ('+TAX[S.tax].n+')',tax]],food:[['حصاد الحقول',17]]};
 if(S.rel.river>=60)lines.gold.push(['تجارة بني النهر',10]);
 if(F('tolls'))lines.gold.push(['رسوم الجسور المخفّضة',-5]);
 lines.gold.push(['رواتب الجنود',-Math.ceil(S.soldiers/6)]);
 if(S.week>=3&&!F('wells'))lines.food.push(['الجفاف',-D.drought]);
 lines.food.push(['إطعام السكان والجيش'+(S.ration?' (مقنّن)':''),-Math.ceil((S.pop/10+S.soldiers/12)*(S.ration?.75:1))]);
 for(const f of econ.extra)f(lines);
 const sum=k=>lines[k].reduce((a,b)=>a+b[1],0);
 return{lines,gold:sum('gold'),food:sum('food')};
}
econ.extra=[];
function enemyPower(){let e=S.enemy;if(!F('exposed'))e+=F('vanguard')?60:F('tower')?35:15;if(S.rel.moon>=70&&!F('betrayedmoon'))e*=.8;if(S.plan==='raid')e*=.85;return Math.round(e)}
function myPower(){const parts=[];let p=S.soldiers;if(S.plan==='ambush')p*=1.33;parts.push(['جنودك'+(S.plan==='ambush'?' (كمين ×١٫٣٣)':''),Math.round(p)]);
 if(S.rel.horn>=70)parts.push(['محاربو أهل القرن',80]);
 if(S.rel.river>=70)parts.push(['بحّارة بني النهر',40]);
 if(S.fort)parts.push(['الأسوار'+(S.plan==='walls'?' (تحصّن ×٢)':''),S.fort*30*(S.plan==='walls'?2:1)]);
 if(F('crossbows'))parts.push(['الأقواس الآلية',30]);
 if(F('smith'))parts.push(['نصال مشحوذة',20]);
 for(const f of myPower.extra)f(parts);
 let total=parts.reduce((a,b)=>a+b[1],0);
 if(S.morale){const m=Math.round(total*S.morale/100);parts.push(['المعنويات (+'+A(S.morale)+'٪)',m]);total+=m}
 return{total,parts}}
myPower.extra=[];

/* apply an effect object; returns list of visible deltas */
function apply(e){const out=[];if(!e)return out;
 for(const k of['gold','food','hap','soldiers','pop','fort','enemy','clues','morale','arms'])if(e[k]){
  const before=S[k];let v=S[k]+e[k];
  if(k==='hap')v=clamp(v,0,100);else if(k==='fort')v=clamp(v,0,3);else if(k==='morale')v=clamp(v,-30,60);else v=Math.max(0,v);
  S[k]=v;if(v!==before)out.push([k,v-before])}
 for(const f of['river','horn','moon'])if(e[f]){const b=S.rel[f];S.rel[f]=clamp(b+e[f],0,100);if(S.rel[f]!==b)out.push([f,S.rel[f]-b])}
 if(e.set)e.set.forEach(f=>S.flags[f]=1);
 if(e.unset)e.unset.forEach(f=>delete S.flags[f]);
 if(e.unlock){S.ret[e.unlock].on=1;out.push(['unlock',e.unlock])}
 if(e.lose){S.ret[e.lose].on=0;S.missions=S.missions.filter(m=>m.ret!==e.lose);out.push(['lose',e.lose])}
 if(e.injure){S.ret[e.injure[0]].inj=S.week+e.injure[1];out.push(['injure',e.injure[0]])}
 if(e.retmod){S.ret[e.retmod[0]].mod=(S.ret[e.retmod[0]].mod||0)+e.retmod[1];out.push(['retmod',e.retmod])}
 if(e.follow)S.follow.push({id:e.follow[0],w:S.week+e.follow[1]});
 if(e.plan)S.plan=e.plan;
 if(e.item&&!S.items.includes(e.item)){S.items.push(e.item);out.push(['item',e.item])}
 if(e.son)for(const k in e.son)S.son[k]+=e.son[k];
 for(const f of apply.extra)f(e,out);
 floatDeltas(out);return out}
apply.extra=[];
function chipsFor(out){return out.map(([k,v])=>{
 if(k==='unlock')return`<span class="chip good">انضمّ ${N[v][0]} إلى المجلس</span>`;
 if(k==='lose')return`<span class="chip bad">غادر ${N[v][0]} المجلس</span>`;
 if(k==='injure')return`<span class="chip bad">أُصيب ${N[v][0]}</span>`;
 if(k==='retmod')return`<span class="chip ${v[1]>0?'good':'bad'}">${N[v[0]][0]}: نجاح ${v[1]>0?'+':'−'}${A(Math.abs(v[1]*100))}٪</span>`;
 if(k==='item')return`<span class="chip good">${ic('chest')}كنز: ${ITEMS[v]?ITEMS[v].n:v}</span>`;
 const good=k==='enemy'?v<0:v>0;return`<span class="chip ${good?'good':'bad'}">${ic(k)}${STATN[k]} ${sg(v)}</span>`}).join('')}
function costChips(c,mult){return Object.entries(c||{}).map(([k,v])=>`<span class="chip cost">${ic(k)}−${A(Math.round(v*(mult||1)))} ${STATN[k]}</span>`).join('')}
const ITEMS={};/* filled by data/items.js */

const SAVE='arvand_save_v2';
function save(){store.set(SAVE,S)}
/* older saves (made before later systems existed) get the missing fields from a fresh game */
function migrate(s){if(!s||s.v!==2)return null;const f=fresh(s.diff||'normal');
 for(const k in f)if(s[k]===undefined)s[k]=f[k];
 for(const k of RKEYS)if(!s.ret[k])s.ret[k]=f.ret[k];else if(s.ret[k].mod===undefined)s.ret[k].mod=0;
 for(const k of['market','son','stats','rel'])s[k]=Object.assign({},f[k],s[k]);
 if(!DIFF[s.diff])s.diff='normal';return s}
function load(){return migrate(store.get(SAVE,null))}
let FINALE=null;/* set by siege.js: replaces the direct battle calculation */
