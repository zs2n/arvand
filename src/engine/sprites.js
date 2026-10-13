/* ===== Arvand sprites v2: shaded, outlined pixel art (portraits 32x32, bodies 24x44) ===== */
const SP2=(()=>{
const h2r=h=>{if(h.length===4)h='#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3];const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]};
function rgb2hsl([r,g,b]){r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0,l=(mx+mn)/2;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return[h,s,l]}
function hsl2hex(h,s,l){h=((h%360)+360)%360;s=Math.max(0,Math.min(1,s));l=Math.max(0,Math.min(1,l));const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return'#'+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('')}
const toward=(h,t,amt)=>{let d=((t-h+540)%360)-180;return h+Math.sign(d)*Math.min(Math.abs(d),amt)};
const RC={};
function ramp(hex){if(RC[hex])return RC[hex];const[h,s,l]=rgb2hsl(h2r(hex));
 const r=[hsl2hex(toward(h,255,26),s*.85,Math.max(.07,l-.30)),hsl2hex(toward(h,255,13),s*.95,Math.max(.1,l-.15)),hex,hsl2hex(toward(h,55,10),s*.95,Math.min(.93,l+.13)),hsl2hex(toward(h,255,34),s*.75,Math.max(.04,l-.44))];
 return RC[hex]=r}/* 0 deep,1 shadow,2 base,3 light,4 outline */
const LV=(()=>{const v=[-.55,-.62,.56],m=Math.hypot(...v);return v.map(x=>x/m)})();
const tone=(nx,ny,nz)=>{const d=nx*LV[0]+ny*LV[1]+nz*LV[2];return d>.74?3:d>.36?2:d>.02?1:0};

function Grid(w,h){const g={w,h,M:new Array(w*h).fill(null),T:new Array(w*h).fill(2),X:new Array(w*h).fill(null)};
 g.in=(x,y)=>x>=0&&y>=0&&x<w&&y<h;g.i=(x,y)=>y*w+x;
 g.set=(x,y,m,t)=>{x|=0;y|=0;if(g.in(x,y)){const i=g.i(x,y);g.M[i]=m;g.T[i]=t;g.X[i]=null}};
 g.col=(x,y,c)=>{x|=0;y|=0;if(g.in(x,y)){const i=g.i(x,y);g.X[i]=c;if(!g.M[i])g.M[i]='fx'}};
 g.get=(x,y)=>g.in(x,y)?g.M[g.i(x,y)]:null;
 g.tone=(x,y,t)=>{if(g.in(x,y)&&g.M[g.i(x,y)])g.T[g.i(x,y)]=t};
 g.blob=(cx,cy,rx,ry,m,test,mode)=>{for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let x=Math.floor(cx-rx);x<=cx+rx;x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry,r=dx*dx+dy*dy;if(r<=1&&(!test||test(x,y))){const nz=Math.sqrt(1-r);g.set(x,y,m,mode==='flat'?2:tone(dx,dy*.8,nz))}}};
 g.cyl=(cx,y0,y1,hw,m,test)=>{for(let y=y0;y<=y1;y++){const w=typeof hw==='function'?hw(y):hw;for(let x=Math.floor(cx-w);x<cx+w;x++){if(test&&!test(x,y))continue;const nx=(x+.5-cx)/w;g.set(x,y,m,tone(nx,.15,Math.sqrt(Math.max(0,1-nx*nx))))}}};
 return g}

function render(g,mats,cv,scale){
 cv.width=g.w;cv.height=g.h;const c=cv.getContext('2d');c.clearRect(0,0,g.w,g.h);
 // inner contrast: pixel below hair/hat gets shadow
 for(let y=1;y<g.h;y++)for(let x=0;x<g.w;x++){const m=g.M[g.i(x,y)],up=g.M[g.i(x,y-1)];if(m==='skin'&&up&&up!=='skin'&&up!=='fx'&&up!=='beard')g.T[g.i(x,y)]=Math.min(g.T[g.i(x,y)],1)}
 for(let y=0;y<g.h;y++)for(let x=0;x<g.w;x++){const i=g.i(x,y),m=g.M[i];let col=null;
  if(m){col=g.X[i]||(mats[m]?ramp(mats[m])[g.T[i]]:null)}
  else{for(const[dx,dy]of[[0,1],[0,-1],[1,0],[-1,0]]){const n=g.get(x+dx,y+dy);if(n&&n!=='fx'&&mats[n]){col=ramp(mats[n])[4];break}}}
  if(col){c.fillStyle=col;c.fillRect(x,y,1,1)}}
 return cv}

/* ---------- PORTRAIT 32x32 ---------- */
function portrait(c,expr){
 const g=Grid(32,32),cx=16,P=c.p||{};
 const mats={skin:c.skin,hair:c.hair||'#3a2418',beard:c.beard||c.hair||'#3a2418',cloth:c.robe,trim:c.trim,cape:c.cape||c.robe,hat:c.hatc||c.robe,gold:'#e3b54e',metal:'#9aa3b0',gem:'#c0283a',gem2:'#5ab8f0',wood:'#7a4a26'};
 const longHair=c.hs===2;
 // back hair
 if(longHair&&!['helm'].includes(c.hat))g.blob(cx,16,9.2,13,'hair',(x,y)=>y>=9&&y<=29&&(x<=10||x>=21||y<=12));
 // cape / back hood
 if(c.cape)g.cyl(cx,23,31,y=>Math.min(16,9+(y-23)*1.6),'cape');
 if(c.hat==='hood'||c.hat==='veil')g.blob(cx,15,10.2,13,'hat',(x,y)=>y>=3);
 // body
 g.cyl(cx,24,31,y=>y<26?8+(y-24)*2.6:Math.min(15.5,13.2+(y-26)*.55),'cloth');
 for(let y=24;y<=25;y++)for(let x=11;x<=20;x++)g.set(x,y,'trim',y===24?3:2);
 for(let y=26;y<=31;y++){g.set(15,y,'trim',2);g.set(16,y,'trim',1)}
 if(c.armor){for(let y=26;y<=31;y++)for(let x=3;x<=28;x++)if(g.get(x,y)==='cloth'&&y%2===0&&g.T[g.i(x,y)]>0)g.tone(x,y,g.T[g.i(x,y)]-1)}
 // neck
 for(let y=19;y<=25;y++)for(let x=13;x<=18;x++)if(y<24||(x>=14&&x<=17))g.set(x,y,'skin',y<=21?0:1);
 // head
 g.blob(cx,12.6,6.7,7.1,'skin');g.blob(cx,15.2,5.7,6.2,'skin',(x,y)=>y>=13);
 g.blob(9.3,14,1.5,2.1,'skin');g.blob(22.7,14,1.5,2.1,'skin');
 g.tone(9,14,1);g.tone(22,14,0);
 // beard
 if(c.beard){g.blob(cx,17.6,6.1,5.4,'beard',(x,y)=>y>=15);for(let x=13;x<=18;x++)g.set(x,17,'beard',x<16?2:1)}
 // front hair
 if(c.hs&&c.hat!=='helm'&&c.hat!=='hood'&&c.hat!=='veil'){
  g.blob(cx,10.6,7.6,7.2,'hair',(x,y)=>y<=7||(y===8&&x%3!==1)||((x<=10||x>=21)&&y<=(longHair?21:13)));
  for(let y=0;y<32;y++)for(let x=0;x<32;x++)if(g.get(x,y)==='hair'){const t=g.T[g.i(x,y)];if(t===2&&y>4&&(x===10||x===13||x===19||x===21))g.tone(x,y,1);if(t>=2&&y<=4&&(x+y)%4===0)g.tone(x,y,3)}
 }
 // hats
 const H=c.hat;
 if(H==='crown'){for(let y=5;y<=7;y++)for(let x=9;x<=22;x++)g.set(x,y,'gold',y===5?3:x>18?1:2);
  for(const px of[9,12,15,19,22]){g.set(px,4,'gold',3);if(px===15){g.set(15,3,'gold',3);g.set(16,3,'gold',2);g.set(16,4,'gold',2);g.set(15,2,'gold',3)}else g.set(px,3,'gold',2)}
  g.col(12,6,'#c0283a');g.col(19,6,'#c0283a');g.col(15,6,'#5ab8f0');g.col(16,6,'#2a7ab8')}
 if(H==='circlet'){for(let x=10;x<=21;x++)g.set(x,8,'gold',x<15?3:x>18?1:2);g.col(15,8,'#7ad0ff');g.col(16,8,'#3a8ad0')}
 if(H==='helm'){g.blob(cx,10.2,8,7.6,'metal',(x,y)=>y<=10);
  for(let y=10;y<=19;y++){for(const x of[8,9,10])g.set(x,y,'metal',x===8?1:2);for(const x of[21,22,23])g.set(x,y,'metal',x===23?0:1)}
  for(let x=8;x<=23;x++)g.set(x,10,'metal',1);for(let y=10;y<=15;y++){g.set(15,y,'metal',3);g.set(16,y,'metal',1)}
  for(let y=3;y<=9;y++)g.tone(12,y,3)}
 if(H==='hood'||H==='veil'){g.blob(cx,13,6.2,7.4,'skin',(x,y)=>y>=7);g.blob(cx,15.3,5.4,6,'skin',(x,y)=>y>=13);
  for(let y=6;y<=9;y++)for(let x=10;x<=21;x++)if(g.get(x,y)==='skin'&&y<=7)g.set(x,y,'hat',1);
  if(H==='veil'){for(let x=11;x<=20;x++)g.set(x,7,'trim',x<14?3:2)}
  if(c.hs===2&&H==='veil'){for(let y=8;y<=12;y++){g.set(10,y,'hair',1);g.set(21,y,'hair',0)}}}
 if(H==='turban'){g.blob(cx,7.6,8.3,5.8,'hat',(x,y)=>y<=10);for(let y=2;y<=10;y++)for(let x=7;x<=24;x++)if(g.get(x,y)==='hat'&&(x+y*2)%6===0)g.tone(x,y,1);g.col(16,5,'#c0283a');g.col(16,4,'#ff8a9a')}
 if(H==='cap'){g.blob(cx,8.6,7.6,5,'hat',(x,y)=>y<=9);for(let x=8;x<=24;x++)g.set(x,9,'hat',x>20?0:1)}
 // shoulder items
 if(c.item==='spear'){for(let y=6;y<=31;y++)g.set(28,y,'wood',y%4?2:1);g.blob(28.5,4,1.6,3.4,'metal')}
 if(c.item==='staff'){for(let y=6;y<=31;y++)g.set(28,y,'wood',2);g.blob(28.5,4.5,2,2,'gem2');mats.gem2=c.itemc||'#9fd0ff'}
 if(c.item==='sword'){for(let y=18;y<=31;y++){g.set(27,y,'metal',3);g.set(28,y,'metal',1)}for(let x=25;x<=30;x++)g.set(x,22,'gold',2)}
 if(c.item==='bow'){for(let y=4;y<=31;y++){const x=Math.round(27+Math.sin((y-4)/27*Math.PI)*2);g.set(x,y,'wood',2)}}
 face(g,expr||'neutral',c);
 return{g,mats}}

function face(g,e,c){
 const sk=ramp(c.skin),D='#1d1320',W='#f1ebe2',IR=c.eye||'#4a2e1e',BR=ramp(c.hair||'#2a1c14')[0],LIP=ramp(c.skin)[0];
 const eyesOpen=(irisC)=>{for(const[a,b]of[[11,13],[18,20]]){for(let x=a;x<=b;x++)g.col(x,12,D)}
  g.col(11,13,W);g.col(12,13,irisC||IR);g.col(13,13,D);g.col(18,13,D);g.col(19,13,irisC||IR);g.col(20,13,W)};
 const brows=(L,R)=>{L.forEach(([x,y])=>g.col(x,y,BR));R.forEach(([x,y])=>g.col(x,y,BR))};
 const nose=()=>{g.col(16,15,sk[1]);g.col(16,16,sk[0]);g.col(15,15,sk[3])};
 const flatBrows=()=>brows([[11,10],[12,10],[13,10]],[[18,10],[19,10],[20,10]]);
 nose();
 switch(e){
  case'neutral':flatBrows();eyesOpen();for(let x=14;x<=17;x++)g.col(x,18,LIP);g.col(15,19,sk[3]);break;
  case'happy':flatBrows();g.col(11,13,D);g.col(12,12,D);g.col(13,13,D);g.col(18,13,D);g.col(19,12,D);g.col(20,13,D);
   for(const x of[11,12,19,20])g.col(x,15,'#e3868c');g.col(13,17,D);g.col(18,17,D);for(let x=14;x<=17;x++)g.col(x,18,D);g.col(15,18,W);g.col(16,18,W);break;
  case'angry':brows([[11,9],[12,10],[13,11]],[[20,9],[19,10],[18,11]]);eyesOpen();for(const x of[11,12,19,20])g.col(x,11,sk[0]);
   for(let x=13;x<=18;x++)g.col(x,18,D);g.col(13,19,LIP);g.col(18,19,LIP);break;
  case'sad':brows([[11,10],[12,10],[13,9]],[[18,9],[19,10],[20,10]]);eyesOpen();g.col(12,14,'#8ac8ff');g.col(12,15,'#5aa0e0');
   for(let x=14;x<=17;x++)g.col(x,18,LIP);g.col(13,19,LIP);g.col(18,19,LIP);break;
  case'shock':brows([[11,9],[12,9],[13,9]],[[18,9],[19,9],[20,9]]);eyesOpen();g.col(11,14,W);g.col(12,14,W);g.col(13,14,W);g.col(18,14,W);g.col(19,14,W);g.col(20,14,W);g.col(13,13,W);g.col(18,13,W);
   g.col(15,18,D);g.col(16,18,D);g.col(15,19,D);g.col(16,19,D);g.col(14,18,LIP);g.col(17,18,LIP);g.col(23,8,'#bfe6ff');g.col(23,9,'#7ac0ff');g.col(23,10,'#5aa0e0');break;
  case'smug':brows([[11,10],[12,10],[13,10]],[[18,9],[19,9],[20,10]]);eyesOpen();for(let x=11;x<=13;x++)g.col(x,12,sk[0]);for(let x=18;x<=20;x++)g.col(x,12,sk[0]);g.col(11,12,D);g.col(20,12,D);
   for(let x=14;x<=16;x++)g.col(x,18,LIP);g.col(17,17,D);g.col(18,17,D);break;
  case'cold':flatBrows();eyesOpen();for(let x=11;x<=13;x++)g.col(x,12,D);for(let x=11;x<=20;x++)if(x<=13||x>=18)g.col(x,11,sk[1]);
   for(let x=14;x<=17;x++)g.col(x,18,LIP);g.col(17,17,LIP);break;
  case'tired':brows([[11,10],[12,10],[13,9]],[[18,9],[19,10],[20,10]]);eyesOpen();for(const x of[11,12,13,18,19,20]){g.col(x,12,sk[0]);g.col(x,14,sk[1])}
   for(let x=14;x<=17;x++)g.col(x,18,LIP);break;
  case'fierce':brows([[11,9],[12,10],[13,11]],[[20,9],[19,10],[18,11]]);eyesOpen('#ff8a2a');g.col(12,12,'#ffd27a');g.col(19,12,'#ffd27a');
   for(let x=13;x<=18;x++){g.col(x,18,D);g.col(x,20,D)}for(let x=14;x<=17;x++)g.col(x,19,'#e8e0d0');break;
 }}

/* ---------- FULL BODY 24x44 (front view) ---------- */
function body(c,frame,expr){
 const g=Grid(24,46),cx=12,bob=frame===1||frame===2?1:0,Y=y=>y+bob;
 const mats={skin:c.skin,hair:c.hair||'#3a2418',beard:c.beard||c.hair||'#3a2418',cloth:c.robe,trim:c.trim,cape:c.cape||c.robe,hat:c.hatc||c.robe,gold:'#e3b54e',metal:'#9aa3b0',wood:'#7a4a26',boot:'#3a2a20',gem2:c.itemc||'#9fd0ff'};
 const longHair=c.hs===2;
 if(c.item==='spear'||c.item==='staff'){for(let y=Y(4);y<=44;y++)g.set(20,y,'wood',2);if(c.item==='spear')g.blob(20.5,Y(3),1.3,3,'metal');else g.blob(20.5,Y(4),1.8,1.8,'gem2')}
 if(longHair&&c.hat!=='helm')g.blob(cx,Y(11),6,9,'hair',(x,y)=>y>=Y(6));
 if(c.cape)g.cyl(cx,Y(13),42,y=>Math.min(9,5.5+(y-Y(13))*.25),'cape');
 if(c.hat==='hood'||c.hat==='veil')g.blob(cx,Y(8),5.6,7.4,'hat',(x,y)=>y>=Y(1));
 // legs
 const l1=frame===1?-1:0,l2=frame===2?-1:0;
 for(let y=38;y<=44;y++){if(y<=44+l1)for(const x of[9,10])g.set(x,y,y>=42+l1?'boot':'cloth',y>=42+l1?(x===9?2:1):0);if(y<=44+l2)for(const x of[13,14])g.set(x,y,y>=42+l2?'boot':'cloth',y>=42+l2?(x===13?2:1):0)}
 // robe
 g.cyl(cx,Y(13),Y(39),y=>y<Y(16)?5+(y-Y(13))*.6:Math.min(7.5,6.4+(y-Y(16))*.06),'cloth');
 for(let x=7;x<=16;x++)g.set(x,Y(25),'trim',x<12?3:2);for(let y=Y(26);y<=Y(39);y++)g.set(12,y,'trim',1);
 for(let x=5;x<=18;x++)if(g.get(x,Y(39))==='cloth')g.set(x,Y(39),'trim',1);
 if(c.armor)for(let y=Y(14);y<=Y(24);y++)for(let x=6;x<=17;x++)if(g.get(x,y)==='cloth'&&y%2===0&&g.T[g.i(x,y)]>0)g.tone(x,y,g.T[g.i(x,y)]-1);
 // arms
 for(let y=Y(14);y<=Y(25);y++){g.set(4,y,'cloth',1);g.set(5,y,'cloth',2);g.set(18,y,'cloth',1);g.set(19,y,'cloth',0)}
 g.blob(4.9,Y(26.5),1.5,1.6,'skin');g.blob(19,Y(26.5),1.5,1.6,'skin');
 for(let x=8;x<=15;x++)g.set(x,Y(13),'trim',3);
 // head
 g.blob(cx,Y(7.6),4.4,4.7,'skin');g.blob(cx,Y(9.4),3.7,3.6,'skin',(x,y)=>y>=Y(8));
 for(let y=Y(12);y<=Y(13);y++)for(let x=10;x<=13;x++)g.set(x,y,'skin',0);
 if(c.beard)g.blob(cx,Y(10.5),4,3,'beard',(x,y)=>y>=Y(9));
 if(c.hs&&!['helm','hood','veil'].includes(c.hat))g.blob(cx,Y(6.4),4.9,4.4,'hair',(x,y)=>y<=Y(4)||((x<=8||x>=15)&&y<=Y(longHair?12:8)));
 const H=c.hat;
 if(H==='crown'){for(let x=8;x<=15;x++){g.set(x,Y(3),'gold',2);g.set(x,Y(4),'gold',x>12?1:2)}for(const x of[8,10,13,15])g.set(x,Y(2),'gold',3);g.set(11,Y(1),'gold',3);g.set(12,Y(1),'gold',2);g.set(11,Y(2),'gold',3);g.set(12,Y(2),'gold',2);g.col(11,Y(3),'#c0283a')}
 if(H==='circlet'){for(let x=8;x<=15;x++)g.set(x,Y(4),'gold',x<12?3:1)}
 if(H==='helm'){g.blob(cx,Y(6.2),5.2,5,'metal',(x,y)=>y<=Y(6));for(let y=Y(6);y<=Y(10);y++){g.set(7,y,'metal',2);g.set(16,y,'metal',0)}g.set(11,Y(7),'metal',3);g.set(12,Y(7),'metal',1);g.set(11,Y(8),'metal',3)}
 if(H==='hood'||H==='veil'){g.blob(cx,Y(8),3.6,4.4,'skin',(x,y)=>y>=Y(5));for(let x=9;x<=14;x++)g.set(x,Y(5),'hat',1);if(H==='veil')for(let x=9;x<=14;x++)g.set(x,Y(4),'trim',2)}
 if(H==='turban'){g.blob(cx,Y(4.4),5.4,3.8,'hat',(x,y)=>y<=Y(6));g.col(12,Y(3),'#c0283a')}
 if(H==='cap'){g.blob(cx,Y(4.6),5,3.2,'hat',(x,y)=>y<=Y(5));for(let x=7;x<=17;x++)g.set(x,Y(5),'hat',1)}
 if(c.item==='sword'){for(let y=Y(22);y<=Y(34);y++){g.set(20,y,'metal',3);g.set(21,y,'metal',1)}for(let x=19;x<=22;x++)g.set(x,Y(25),'gold',2)}
 if(c.item==='bow'){for(let y=Y(10);y<=Y(34);y++)g.set(Math.round(20+Math.sin((y-Y(10))/24*Math.PI)*1.6),y,'wood',2)}
 if(c.item==='scroll'){for(let x=17;x<=20;x++){g.set(x,Y(25),'trim',3);g.set(x,Y(26),'trim',2)}}
 if(c.item==='basket'){g.blob(19.5,Y(28),2.6,2,'wood');g.col(19,Y(26),'#e8c070');g.col(20,Y(26),'#d9a35a')}
 // face (small): eyes + mouth by expression
 const D='#1d1320',sk=ramp(c.skin),fy=Y(8);
 const e=expr||'neutral';
 if(e==='happy'){g.col(10,fy-1,D);g.col(13,fy-1,D);g.col(11,fy+2,D);g.col(12,fy+2,D);g.col(10,fy+1,D);g.col(13,fy+1,D)}
 else{g.col(10,fy,D);g.col(13,fy,D);if(e==='angry'||e==='fierce'){g.col(9,fy-1,D);g.col(14,fy-1,D)}if(e==='fierce'){g.col(10,fy,'#ff8a2a');g.col(13,fy,'#ff8a2a')}
  if(e==='shock'){g.col(11,fy+2,D);g.col(12,fy+2,D);g.col(11,fy+3,D);g.col(12,fy+3,D)}else if(e==='sad'){g.col(11,fy+2,sk[0]);g.col(12,fy+2,sk[0]);g.col(10,fy+3,sk[0]);g.col(13,fy+3,sk[0])}else{g.col(11,fy+2,sk[0]);g.col(12,fy+2,sk[0])}}
 g.col(11,fy+1,sk[3]);
 return{g,mats}}


/* ---------- SIDE VIEW BODY 24x46 (facing right; flip for left) ---------- */
function bodySide(c,frame,expr,pose){
 const g=Grid(24,46),cx=11,walk=frame===1||frame===2,bob=walk?1:0,Y=y=>y+bob,seated=pose==='seated';
 const mats={skin:c.skin,hair:c.hair||'#3a2418',beard:c.beard||c.hair||'#3a2418',cloth:c.robe,trim:c.trim,cape:c.cape||c.robe,hat:c.hatc||c.robe,gold:'#e3b54e',metal:'#9aa3b0',wood:'#7a4a26',boot:'#3a2a20',gem2:c.itemc||'#9fd0ff',back:c.robe};
 const longHair=c.hs===2,sw=frame===1?2:frame===2?-2:0;
 // bow / cape / long hair behind
 if(c.item==='bow')for(let y=Y(12);y<=Y(34);y++)g.set(Math.round(7-Math.sin((y-Y(12))/22*Math.PI)*2),y,'wood',1);
 if(c.cape)g.cyl(8.6,Y(13),seated?Y(34):42,y=>Math.min(3.2,2+(y-Y(13))*.06),'cape');
 if(longHair&&!['helm','hood','veil'].includes(c.hat))g.blob(9,Y(11),3.4,8,'hair',(x,y)=>y>=Y(6)&&x<=11);
 if(c.hat==='hood'||c.hat==='veil')g.blob(10.4,Y(10),5,7.6,'hat',(x,y)=>y>=Y(2)&&x<=13);
 // legs
 if(!seated){
  const legs=frame===1?[[13,1],[8,0]]:frame===2?[[8,1],[13,0]]:[[10,1],[11,0]];
  for(const[lx,front]of legs)for(let y=38;y<=44;y++){const boot=y>=42;g.set(lx,y,boot?'boot':'cloth',front?(boot?2:1):(boot?1:0));g.set(lx+1,y,boot?'boot':'cloth',front?(boot?1:1):0);if(y===44)g.set(lx+2,y,'boot',front?2:1)}
 }else{for(let x=11;x<=19;x++)for(let y=Y(33);y<=Y(35);y++)g.set(x,y,'cloth',y===Y(33)?2:1);for(let y=Y(35);y<=Y(42);y++){g.set(18,y,'cloth',1);g.set(19,y,'cloth',1)}for(let x=18;x<=21;x++)g.set(x,Y(43),'boot',2)}
 // torso
 g.cyl(cx,Y(13),seated?Y(35):Y(39),y=>y<Y(16)?3.2+(y-Y(13))*.3:Math.min(4.8,4+(y-Y(16))*.05),'cloth');
 for(let x=7;x<=15;x++)if(g.get(x,Y(25))==='cloth')g.set(x,Y(25),'trim',x>11?2:1);
 if(!seated)for(let x=5;x<=17;x++)if(g.get(x,Y(39))==='cloth')g.set(x,Y(39),'trim',1);
 if(c.armor)for(let y=Y(14);y<=Y(24);y++)for(let x=6;x<=16;x++)if(g.get(x,y)==='cloth'&&y%2===0&&g.T[g.i(x,y)]>0)g.tone(x,y,g.T[g.i(x,y)]-1);
 for(let x=10;x<=13;x++)g.set(x,Y(13),'trim',3);
 // head (profile): skull + jaw forward + nose
 g.blob(10.8,Y(7.8),4.3,4.6,'skin');g.blob(12,Y(10),3.5,2.8,'skin',(x,y)=>y>=Y(9));
 g.set(15,Y(8),'skin',2);g.set(16,Y(9),'skin',2);g.set(15,Y(9),'skin',2);
 for(let y=Y(12);y<=Y(13);y++)for(let x=10;x<=12;x++)g.set(x,y,'skin',0);
 g.set(9,Y(8),'skin',1);g.set(9,Y(9),'skin',0);
 if(c.beard)g.blob(12.4,Y(11),3.6,2.6,'beard',(x,y)=>y>=Y(9.5)&&x>=10);
 if(c.hs&&!['helm','hood','veil'].includes(c.hat))g.blob(10.2,Y(6.6),4.8,4.4,'hair',(x,y)=>y<=Y(4)||(x<=11&&y<=Y(longHair?11:9))||(y<=Y(5)&&x<=14));
 const H=c.hat;
 if(H==='crown'){for(let x=7;x<=14;x++){g.set(x,Y(3),'gold',2);g.set(x,Y(4),'gold',x>11?2:1)}for(const x of[7,10,12,14])g.set(x,Y(2),'gold',3);g.set(11,Y(1),'gold',3);g.col(12,Y(3),'#c0283a')}
 if(H==='circlet'){for(let x=7;x<=14;x++)g.set(x,Y(4),'gold',x>11?3:1);g.col(14,Y(4),'#7ad0ff')}
 if(H==='helm'){g.blob(10.6,Y(6.4),5.2,5,'metal',(x,y)=>y<=Y(6)||x<=9);for(let y=Y(6);y<=Y(10);y++)g.set(15,y,'metal',1);g.set(12,Y(3),'metal',3);g.set(11,Y(3),'metal',3)}
 if(H==='hood'||H==='veil'){g.blob(10.6,Y(6.6),5.2,5,'hat',(x,y)=>y<=Y(5)||x<=10);if(H==='veil')for(let y=Y(4);y<=Y(11);y++)g.set(11,y,'trim',2)}
 if(H==='turban'){g.blob(10.4,Y(4.6),5.2,3.6,'hat',(x,y)=>y<=Y(6));for(let x=6;x<=15;x++)if(g.get(x,Y(4))==='hat'&&x%3===0)g.tone(x,Y(4),1);g.col(14,Y(3),'#c0283a')}
 if(H==='cap'){g.blob(10.4,Y(4.8),4.8,3.2,'hat',(x,y)=>y<=Y(5));for(let x=12;x<=17;x++)g.set(x,Y(5),'hat',1)}
 // front arm (swings when walking) + hand
 const hx=13+(seated?3:sw),hy=Y(seated?28:26);
 for(let y=Y(14);y<=hy-1;y++){const t=(y-Y(14))/(hy-Y(14));const x=Math.round(12+(hx-12)*t);g.set(x,y,'cloth',2);g.set(x+1,y,'cloth',1)}
 g.blob(hx+.9,hy+.3,1.4,1.4,'skin');
 // held items
 const ix=hx+1;
 if(c.item==='spear'||c.item==='staff'){for(let y=Y(3);y<=(seated?Y(43):44);y++)g.set(ix+1,y,'wood',2);if(c.item==='spear')g.blob(ix+1.5,Y(2),1.3,2.8,'metal');else g.blob(ix+1.5,Y(3),1.8,1.8,'gem2')}
 if(c.item==='sword'){for(let y=Y(24);y<=Y(37);y++){g.set(8,y,'metal',y%3?3:1)}for(let x=7;x<=9;x++)g.set(x,Y(25),'gold',2)}
 if(c.item==='scroll'){for(let y=hy-2;y<=hy;y++)for(let x=ix;x<=ix+2;x++)g.set(x,y,'trim',y===hy-2?3:2)}
 if(c.item==='basket'){g.blob(ix+1.5,hy+2,2.4,1.8,'wood');g.col(ix+1,hy,'#e8c070')}
 // face (profile)
 const D='#1d1320',W='#f1ebe2',sk=ramp(c.skin),BR=ramp(c.hair||'#2a1c14')[0],fy=Y(7),e=expr||'neutral';
 const eye=c.eye||'#3a2418';
 g.col(13,fy,W);g.col(14,fy,e==='fierce'?'#ff8a2a':D);
 if(e==='happy'){g.col(13,fy,sk[2]);g.col(14,fy,sk[2]);g.col(13,fy-1,D);g.col(14,fy-1,D);g.col(14,fy+4,D);g.col(15,fy+3,D)}
 else if(e==='angry'||e==='fierce'){g.col(13,fy-2,BR);g.col(14,fy-1,BR);g.col(13,fy+4,D);g.col(14,fy+4,D)}
 else if(e==='sad'){g.col(14,fy-2,BR);g.col(13,fy-1,BR);g.col(14,fy+1,'#8ac8ff');g.col(14,fy+4,sk[0]);g.col(15,fy+5,sk[0])}
 else if(e==='shock'){g.col(13,fy-1,W);g.col(14,fy-1,W);g.col(14,fy+4,D);g.col(14,fy+5,D);g.col(8,fy-2,'#9fd8ff')}
 else if(e==='smug'||e==='cold'){g.col(13,fy-1,sk[0]);g.col(14,fy-1,sk[0]);g.col(14,fy+4,sk[0]);if(e==='smug')g.col(15,fy+3,D)}
 else if(e==='tired'){g.col(13,fy-1,sk[0]);g.col(14,fy-1,sk[0]);g.col(14,fy+1,sk[1]);g.col(14,fy+4,sk[0])}
 else{g.col(14,fy+4,sk[0]);g.col(13,fy-2,BR);g.col(14,fy-2,BR)}
 return{g,mats}}

/* ---------- THREE-QUARTER BODY 24x46 (turned to the right; flip for left) ---------- */
function body34(c,frame,expr){
 const g=Grid(24,46),cx=11.6,walk=frame===1||frame===2,bob=walk?1:0,Y=y=>y+bob;
 const mats={skin:c.skin,hair:c.hair||'#3a2418',beard:c.beard||c.hair||'#3a2418',cloth:c.robe,trim:c.trim,cape:c.cape||c.robe,hat:c.hatc||c.robe,gold:'#e3b54e',metal:'#9aa3b0',wood:'#7a4a26',boot:'#3a2a20',gem2:c.itemc||'#9fd0ff'};
 const longHair=c.hs===2,sw=frame===1?1:frame===2?-1:0;
 if(c.item==='bow')for(let y=Y(10);y<=Y(34);y++)g.set(Math.round(5-Math.sin((y-Y(10))/24*Math.PI)*1.6),y,'wood',1);
 if(longHair&&c.hat!=='helm')g.blob(10.6,Y(11),5.4,9,'hair',(x,y)=>y>=Y(6)&&x<=13);
 if(c.cape)g.cyl(10.8,Y(13),42,y=>Math.min(8,5+(y-Y(13))*.22),'cape');
 if(c.hat==='hood'||c.hat==='veil')g.blob(11.6,Y(8),5.4,7.4,'hat',(x,y)=>y>=Y(1));
 // legs: stride when walking
 const L=frame===1?[[9,0],[14,1]]:frame===2?[[9,1],[14,0]]:[[9,1],[13,1]];
 for(const[lx,up]of L)for(let y=38;y<=44-(walk&&up?1:0);y++){const boot=y>=42-(walk&&up?1:0);g.set(lx,y,boot?'boot':'cloth',boot?2:0);g.set(lx+1,y,boot?'boot':'cloth',boot?1:0);if(boot&&y===44-(walk&&up?1:0))g.set(lx+2,y,'boot',1)}
 // back arm (partly hidden)
 for(let y=Y(15);y<=Y(24);y++)g.set(5,y,'cloth',0);g.set(5,Y(25),'skin',0);
 // robe
 g.cyl(cx,Y(13),Y(39),y=>y<Y(16)?4.6+(y-Y(13))*.6:Math.min(7,6.2+(y-Y(16))*.05),'cloth');
 for(let x=6;x<=18;x++)if(g.get(x,Y(25))==='cloth')g.set(x,Y(25),'trim',x<12?3:2);
 for(let y=Y(26);y<=Y(39);y++)g.set(14,y,'trim',1);
 for(let x=4;x<=19;x++)if(g.get(x,Y(39))==='cloth')g.set(x,Y(39),'trim',1);
 if(c.armor)for(let y=Y(14);y<=Y(24);y++)for(let x=5;x<=18;x++)if(g.get(x,y)==='cloth'&&y%2===0&&g.T[g.i(x,y)]>0)g.tone(x,y,g.T[g.i(x,y)]-1);
 for(let x=10;x<=16;x++)g.set(x,Y(13),'trim',3);
 // front arm + hand
 for(let y=Y(14);y<=Y(25);y++){g.set(18,y,'cloth',2);g.set(19,y,'cloth',1)}
 g.blob(19.2+sw*.5,Y(26.5),1.5,1.6,'skin');
 // head turned: features toward the right, ear and hair mass on the left
 g.blob(12,Y(7.6),4.4,4.7,'skin');g.blob(12.8,Y(9.4),3.6,3.6,'skin',(x,y)=>y>=Y(8));
 g.set(16,Y(8),'skin',2);g.set(17,Y(9),'skin',1);g.set(16,Y(9),'skin',2);
 for(let y=Y(12);y<=Y(13);y++)for(let x=11;x<=14;x++)g.set(x,y,'skin',0);
 g.set(8,Y(8),'skin',1);g.set(8,Y(9),'skin',0);
 if(c.beard)g.blob(13,Y(10.6),3.8,2.9,'beard',(x,y)=>y>=Y(9.2));
 if(c.hs&&!['helm','hood','veil'].includes(c.hat))g.blob(11.6,Y(6.4),5,4.4,'hair',(x,y)=>y<=Y(4)||(x<=9&&y<=Y(longHair?12:9))||(x<=10&&y<=Y(6)));
 const H=c.hat;
 if(H==='crown'){for(let x=8;x<=16;x++){g.set(x,Y(3),'gold',2);g.set(x,Y(4),'gold',x>12?1:2)}for(const x of[8,11,14,16])g.set(x,Y(2),'gold',3);g.set(12,Y(1),'gold',3);g.col(13,Y(3),'#c0283a')}
 if(H==='circlet'){for(let x=8;x<=16;x++)g.set(x,Y(4),'gold',x<12?3:1);g.col(15,Y(4),'#7ad0ff')}
 if(H==='helm'){g.blob(11.8,Y(6.2),5.4,5,'metal',(x,y)=>y<=Y(6)||x<=9);for(let y=Y(6);y<=Y(10);y++)g.set(7,y,'metal',1);g.set(15,Y(7),'metal',3);g.set(15,Y(8),'metal',2);g.set(11,Y(3),'metal',3)}
 if(H==='hood'||H==='veil'){g.blob(12.6,Y(8.4),3.5,4.4,'skin',(x,y)=>y>=Y(5));for(let x=10;x<=16;x++)g.set(x,Y(5),'hat',1);g.set(16,Y(8),'skin',2);g.set(17,Y(9),'skin',1);if(H==='veil')for(let x=10;x<=16;x++)g.set(x,Y(4),'trim',2)}
 if(H==='turban'){g.blob(11.8,Y(4.4),5.4,3.8,'hat',(x,y)=>y<=Y(6));for(let x=7;x<=17;x++)if(g.get(x,Y(4))==='hat'&&x%3===0)g.tone(x,Y(4),1);g.col(15,Y(3),'#c0283a')}
 if(H==='cap'){g.blob(11.8,Y(4.6),5,3.2,'hat',(x,y)=>y<=Y(5));for(let x=11;x<=18;x++)g.set(x,Y(5),'hat',1)}
 // items in front hand
 if(c.item==='spear'||c.item==='staff'){for(let y=Y(4);y<=44;y++)g.set(21,y,'wood',2);if(c.item==='spear')g.blob(21.5,Y(3),1.3,3,'metal');else g.blob(21.5,Y(4),1.8,1.8,'gem2')}
 if(c.item==='sword'){for(let y=Y(22);y<=Y(34);y++){g.set(21,y,'metal',3);g.set(22,y,'metal',1)}for(let x=20;x<=23;x++)g.set(x,Y(25),'gold',2)}
 if(c.item==='scroll'){for(let x=18;x<=21;x++){g.set(x,Y(25),'trim',3);g.set(x,Y(26),'trim',2)}}
 if(c.item==='basket'){g.blob(20.2,Y(28),2.6,2,'wood');g.col(20,Y(26),'#e8c070');g.col(21,Y(26),'#d9a35a')}
 // face: far eye small, near eye with white
 const D='#1d1320',W='#f1ebe2',sk=ramp(c.skin),BR=ramp(c.hair||'#2a1c14')[0],fy=Y(8),e=expr||'neutral',far=11,near=14;
 const eyes=(col)=>{g.col(far,fy,col||D);g.col(near,fy,W);g.col(near+1,fy,col||D)};
 if(e==='happy'){g.col(far,fy-1,D);g.col(near,fy-1,D);g.col(near+1,fy-1,D);g.col(13,fy+3,D);g.col(14,fy+3,D);g.col(12,fy+2,D);g.col(15,fy+2,D)}
 else{eyes(e==='fierce'?'#ff8a2a':null);
  if(e==='angry'||e==='fierce'){g.col(far-1,fy-1,BR);g.col(near,fy-1,BR);g.col(near+1,fy-2,BR);g.col(13,fy+3,D);g.col(14,fy+3,D)}
  else if(e==='sad'){g.col(far,fy-2,BR);g.col(near,fy-2,BR);g.col(near+1,fy-1,BR);g.col(near,fy+1,'#8ac8ff');g.col(13,fy+3,sk[0]);g.col(12,fy+4,sk[0]);g.col(15,fy+4,sk[0])}
  else if(e==='shock'){g.col(near,fy-1,W);g.col(near+1,fy-1,W);g.col(13,fy+3,D);g.col(13,fy+4,D);g.col(14,fy+3,D);g.col(7,fy-3,'#9fd8ff')}
  else if(e==='smug'||e==='cold'||e==='tired'){g.col(near,fy-1,sk[0]);g.col(near+1,fy-1,sk[0]);g.col(far,fy-1,sk[0]);g.col(13,fy+3,sk[0]);g.col(14,fy+3,sk[0]);if(e==='smug')g.col(15,fy+2,D)}
  else{g.col(near,fy-2,BR);g.col(near+1,fy-2,BR);g.col(13,fy+3,sk[0]);g.col(14,fy+3,sk[0])}}
 g.col(15,fy+1,sk[3]);
 return{g,mats}}

return{portrait,body,body34,bodySide,render,ramp};
})();

/* cached access by character key */
const SPR=(()=>{const cache=new Map();
 const get=(kind,key,expr,frame)=>{const id=kind+'|'+key+'|'+expr+'|'+(frame||0);let cv=cache.get(id);if(cv)return cv;
  const c=C[key]||C.guard;const r=kind==='p'?SP2.portrait(c,expr):kind==='s'?SP2.bodySide(c,frame||0,expr,'stand'):kind==='k'?SP2.bodySide(c,0,expr,'seated'):kind==='t'?SP2.body34(c,frame||0,expr):SP2.body(c,frame||0,expr);cv=SP2.render(r.g,r.mats,document.createElement('canvas'));cache.set(id,cv);return cv};
 return{portrait:(k,e)=>get('p',k,e||'neutral'),body:(k,f,e)=>get('b',k,e||'neutral',f),side:(k,f,e)=>get('s',k,e||'neutral',f),q34:(k,f,e)=>get('t',k,e||'neutral',f),seated:(k,e)=>get('k',k,e||'neutral'),
  paint(cv,k,e,bg){const src=get('p',k,e||'neutral');cv.width=32;cv.height=32;const g=cv.getContext('2d');g.imageSmoothingEnabled=false;if(bg){g.fillStyle=bg;g.fillRect(0,0,32,32)}g.drawImage(src,0,0);return cv}};
})();
