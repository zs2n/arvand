/* ===== ENGINE: throne room scene (320x180, characters 24x46) ===== */
const sc=$('#scene'),g=sc.getContext('2d');g.imageSmoothingEnabled=false;
const BR=['#2e2230','#30243a','#2a1f2d','#33263a','#2c2133','#2f2436','#281d2a','#31253a'];
let actor=null,dust=[],sceneMode='room',sceneHook=null;
for(let i=0;i<40;i++)dust.push({x:Math.random()*320,y:Math.random()*150,v:.05+Math.random()*.12});
function sky(){const ch=chapter(S?S.week:1);return ch===1?['#f0c66a','#e39a4a']:ch===2?['#9a7ac0','#5a4a8a']:['#c4552b','#5a2a20']}
function drawQ(key,x,feetY,frame,expr,left){const cv=SPR.q34(key,frame,expr);x=Math.round(x);const y=Math.round(feetY-45);
 if(left){g.save();g.translate(x,0);g.scale(-1,1);g.drawImage(cv,-12,y);g.restore()}else g.drawImage(cv,x-12,y)}
function drawFront(key,x,feetY,expr){g.drawImage(SPR.body(key,0,expr),Math.round(x-12),Math.round(feetY-45))}
function drawSide(key,x,feetY,frame,expr,left,seated){const cv=seated?SPR.seated(key,expr):SPR.side(key,frame,expr);x=Math.round(x);const y=Math.round(feetY-45);
 if(left){g.save();g.translate(x,0);g.scale(-1,1);g.drawImage(cv,-11,y);g.restore()}else g.drawImage(cv,x-11,y)}
function drawRoom(t){
 const W=320,H=180,night=S&&S.phase==='report';
 g.fillStyle='#1c1520';g.fillRect(0,0,W,H);
 for(let y=0;y<146;y+=8){const off=(y/8)%2?8:0;for(let x=-off;x<W;x+=16){g.fillStyle=BR[((x*7+y*13)>>>0)%8];g.fillRect(x+1,y+1,14,6)}}
 const[s1,s2]=sky();
 for(const wx of[118,170,222]){g.fillStyle='#120d14';g.fillRect(wx-11,20,22,50);g.fillRect(wx-9,16,18,4);g.fillRect(wx-6,14,12,2);
  const gr=g.createLinearGradient(0,22,0,68);gr.addColorStop(0,night?'#1a2240':s1);gr.addColorStop(1,night?'#0a0e20':s2);g.fillStyle=gr;g.fillRect(wx-9,22,18,46);g.fillRect(wx-7,18,14,4);g.fillRect(wx-4,16,8,2);
  if(night){g.fillStyle='#e8f0ff';g.fillRect(wx-3+(wx%5),28,1,1);g.fillRect(wx+4,38,1,1)}
  if(chapter(S?S.week:1)>=3){g.fillStyle='rgba(200,190,180,.7)';for(let i=0;i<4;i++)g.fillRect(wx-8+((t/40+i*13+wx)%16),22+((t/25+i*11)%44),1,1)}
  g.fillStyle='#120d14';g.fillRect(wx-1,16,2,54);g.fillRect(wx-9,44,18,2);g.fillStyle='#4a3a4e';g.fillRect(wx-12,70,24,3);
  if(!night){g.save();g.globalAlpha=.07;g.fillStyle=s1;g.beginPath();g.moveTo(wx-9,24);g.lineTo(wx+9,24);g.lineTo(wx-14,150);g.lineTo(wx-50,150);g.closePath();g.fill();g.restore()}}
 for(const bx of[144,196]){const sw=Math.round(Math.sin(t/900+bx));g.fillStyle='#e3b54e';g.fillRect(bx-6,8,13,2);g.fillStyle='#8a1f30';g.fillRect(bx-5+sw,10,11,34);g.fillRect(bx-5+sw,44,4,4);g.fillRect(bx+2+sw,44,4,4);
  g.fillStyle='#e3b54e';g.fillRect(bx-1+sw,18,3,10);g.fillRect(bx-3+sw,22,7,2);g.fillRect(bx-2+sw,16,1,2);g.fillRect(bx+1+sw,16,1,2);g.fillStyle='#5e1420';g.fillRect(bx-5+sw,10,1,34)}
 for(const px of[58,284]){g.fillStyle='#3f3044';g.fillRect(px-7,6,14,142);g.fillStyle='#4f3f55';g.fillRect(px-5,6,3,142);g.fillStyle='#2a1f2d';g.fillRect(px+4,6,3,142);g.fillStyle='#5a4a60';g.fillRect(px-9,4,18,4);g.fillRect(px-9,140,18,6);
  const fl=Math.sin(t/90+px)*1.2;g.fillStyle='#4a2a14';g.fillRect(px-1,60,3,8);g.fillStyle='rgba(255,170,60,.13)';g.beginPath();g.arc(px,56,18+fl,0,7);g.fill();g.fillStyle='#ff9a2a';g.fillRect(px-2,54-Math.round(fl),5,6);g.fillStyle='#ffe07a';g.fillRect(px-1,56-Math.round(fl),3,3)}
 for(let x=0;x<W;x+=16)for(let y=146;y<H;y+=8){g.fillStyle=((x+y)/8)%2?'#33261f':'#3d2f28';g.fillRect(x,y,16,8)}
 g.fillStyle='#7a1f2b';g.fillRect(0,152,236,13);g.fillStyle='#e3b54e';g.fillRect(0,152,236,1);g.fillRect(0,164,236,1);g.fillRect(235,152,1,13);g.fillStyle='#5e1520';for(let x=6;x<232;x+=12)g.fillRect(x,157,4,3);
 // door (left wall)
 const open=actor&&actor.x<34;
 g.fillStyle='#120d14';g.fillRect(2,96,26,52);g.fillRect(5,92,20,4);
 if(!open){g.fillStyle='#5a3a22';g.fillRect(4,98,22,50);g.fillStyle='#4a2e1a';for(let x=7;x<26;x+=5)g.fillRect(x,98,1,50);g.fillStyle='#8a8a90';g.fillRect(4,108,22,2);g.fillRect(4,134,22,2);g.fillStyle='#e3b54e';g.fillRect(22,122,2,3)}
 else{g.fillStyle=night?'#0a0a14':'#6a5a40';g.fillRect(4,98,22,50)}
 // throne (front view, centre-right) with the king facing forward
 const TX=212;
 g.fillStyle='#6a4a12';g.fillRect(TX-22,80,44,72);g.fillStyle='#e3b54e';g.fillRect(TX-21,81,42,70);g.fillStyle='#7a1f2b';g.fillRect(TX-17,88,34,50);g.fillStyle='#5e1520';g.fillRect(TX-17,88,2,50);
 g.fillStyle='#e3b54e';g.fillRect(TX-6,72,12,8);g.fillRect(TX-2,66,4,6);g.fillStyle='#c0283a';g.fillRect(TX-1,75,2,2);g.fillStyle='#fff1a8';g.fillRect(TX-20,82,2,2);g.fillRect(TX+18,82,2,2);
 drawFront('king',TX,146,'neutral');
 g.fillStyle='#6a4a12';g.fillRect(TX-24,126,10,22);g.fillRect(TX+14,126,10,22);g.fillStyle='#e3b54e';g.fillRect(TX-24,124,10,3);g.fillRect(TX+14,124,10,3);g.fillRect(TX-23,127,8,1);g.fillRect(TX+15,127,8,1);
 g.fillStyle='#7a1f2b';g.fillRect(TX-14,134,28,6);g.fillStyle='#a3283a';g.fillRect(TX-14,134,28,1);g.fillStyle='#6a4a12';g.fillRect(TX-14,140,28,10);g.fillStyle='#e3b54e';g.fillRect(TX-14,140,28,1);
 // advisors present
 if(S){let i=0;for(const k of RKEYS){if(i>=4)break;if(inCastle(k)){drawQ(k,246+i*17,160,0,'neutral',true);i++}}}
 drawQ('guard',44,160,0,'neutral',false);
 // petitioner
 if(actor){const sp=.9;
  if(actor.state==='in'){actor.x+=sp;if(actor.x>=actor.tx){actor.x=actor.tx;actor.state='idle';const cb=actor.cb;actor.cb=null;cb&&cb()}}
  else if(actor.state==='out'){actor.x-=sp*1.25;if(actor.x<=2){const cb=actor.cb;actor=null;cb&&cb()}}
  if(actor){const fr=actor.state==='idle'?0:(Math.floor(t/150)%2)+1;drawQ(actor.who,actor.x,162,fr,actor.expr,actor.state==='out')}}
 if(!night){g.fillStyle='rgba(255,230,170,.5)';for(const d of dust){d.y+=d.v;d.x-=d.v*.4;if(d.y>150){d.y=20;d.x=40+Math.random()*220}g.fillRect(Math.round(d.x),Math.round(d.y),1,1)}}
 if(night){g.fillStyle='rgba(8,10,40,.5)';g.fillRect(0,0,W,H)}
 if(S&&chapter(S.week)>=3&&!night){g.fillStyle='rgba(120,40,20,.08)';g.fillRect(0,0,W,H)}
}
function loop(t){if(sceneMode==='room')drawRoom(t);else if(sceneMode==='map')drawMap(t);else if(sceneHook)sceneHook(t);requestAnimationFrame(loop)}
function walkIn(who,expr,cb){actor={who,x:12,tx:150,state:'in',expr:expr||'neutral',cb};sfx('door')}
function walkOut(cb){if(!actor){cb();return}actor.state='out';actor.cb=cb;sfx('steps')}
function setActorExpr(e){if(actor)actor.expr=e}
