"use strict";
/* ===== util: helpers shared by data and engine ===== */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const AD='٠١٢٣٤٥٦٧٨٩';
const A=n=>String(Math.round(n)).replace(/-/g,'−').replace(/\d/g,d=>AD[d]);
const sg=v=>(v>0?'+':'')+A(v);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const store={
 get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},
 set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
 del(k){try{localStorage.removeItem(k)}catch(e){}}};
const txt=v=>typeof v==='function'?v():v;
function toast(msg){const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),3500)}

/* ===== pixel icons (8x8) ===== */
const ICONS={
 gold:[["..aaaa..",".abbbba.","abbccbba","abcbbcba","abcbbcba","abbccbba",".abbbba.","..aaaa.."],{a:'#8a5a12',b:'#f2c14e',c:'#fff1a8'}],
 food:[["...a....","..aba.a.",".abcbaba","..abcba.","...abba.","..abcba.",".abbba..","..aaa..."],{a:'#6b3d17',b:'#d9913f',c:'#f6d18b'}],
 hap:[[".aa..aa.","abbaabba","abcbbbba","abbbbbba",".abbbba.","..abba..","...aa...","........"],{a:'#5a0f1c',b:'#d8384f',c:'#ff9aa8'}],
 soldiers:[["......aa",".....aba","....aba.","c..aba..",".caba...","..cc....",".cdc....","cd..c..."],{a:'#6d7480',b:'#dfe6ee',c:'#7a4a22',d:'#c9a24a'}],
 pop:[["...aa...","..abba..","..abba..","...aa...",".cccccc.","cccccccc",".cc..cc.",".cc..cc."],{a:'#3b2a20',b:'#e0b089',c:'#5a7fa6'}],
 fort:[["a.a..a.a","aaaaaaaa",".abbbba.",".abccba.",".abbbba.",".abbbba.",".abccba.",".aaaaaa."],{a:'#4a4f5a',b:'#9aa3b0',c:'#20232a'}],
 enemy:[["...a....","..aba...","..abba..",".abcba..",".abccba.","abcccba.","abcccbba",".aaaaaa."],{a:'#3a1a10',b:'#c4552b',c:'#f2b24a'}],
 river:[["........","a..a..a.",".aa.aa.a","........","a..a..a.",".aa.aa.a","........","aaaaaaaa"],{a:'#5fa8e0'}],
 horn:[["a......a","ab....ba",".ab..ba.",".abccba.","..cccc..","..cddc..","..cccc..","...cc..."],{a:'#e8e0c8',b:'#b8a880',c:'#7a5a3a',d:'#c9a24a'}],
 moon:[["..aaa...",".abb....","abb.....","abb.....","abb.....","abb....a",".abbbba.","..aaaa.."],{a:'#9fb8e0',b:'#e8f0ff'}],
 clue:[["..aaaa..",".abbbba.","ab.cc.ba","ab.cc.ba","abbbbbba",".abbbba.","..aaaa.a",".......a"],{a:'#c9a24a',b:'#2a2030',c:'#e3b54e'}],
 chest:[["........",".aaaaaa.","abbbbbba","acccccca","abbddbba","abbbbbba","abbbbbba",".aaaaaa."],{a:'#3a2210',b:'#8a5a2a',c:'#e3b54e',d:'#fff1a8'}],
 arms:[["a......a",".a....a.","..a..a..","...aa...","...aa...","..b..b..",".b....b.","b......b"],{a:'#dfe6ee',b:'#7a4a22'}],
 morale:[["...a....","..aaa...","..aba...",".aabaa..","..aba...","..aba...","..ccc...",".c...c.."],{a:'#e3b54e',b:'#a3283a',c:'#7a4a22'}],
};
const ICON={};
(function(){for(const k in ICONS){const[rows,pal]=ICONS[k];const c=document.createElement('canvas');c.width=8;c.height=8;const x=c.getContext('2d');rows.forEach((r,y)=>[...r].forEach((ch,i)=>{if(pal[ch]){x.fillStyle=pal[ch];x.fillRect(i,y,1,1)}}));ICON[k]=c.toDataURL()}})();
const ic=k=>ICON[k]?`<img src="${ICON[k]}" alt="">`:'';
const STATN={gold:'ذهب',food:'طعام',hap:'رضا',soldiers:'جنود',pop:'سكان',fort:'أسوار',enemy:'جيش بهرام',river:'بنو النهر',horn:'أهل القرن',moon:'رهبنة القمر',clues:'دليل',morale:'معنويات',arms:'سلاح'};
