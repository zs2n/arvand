/* ===== Sprites v3: part-based characters with internal outlines =====
   style 'chibi' (big head, expressive eyes) or 'tall' (realistic proportions)
   facing 'q' (three-quarter, turned right) or 'f' (front). H = height in pixels. */
const SP3=(()=>{
const{ramp}=SP2;
function canvasOf(w,h){const M=new Array(w*h).fill(null),T=new Array(w*h).fill(2),Z=new Array(w*h).fill(-1),X=new Array(w*h).fill(null);
 const g={w,h,M,T,Z,X,i:(x,y)=>y*w+x,in:(x,y)=>x>=0&&y>=0&&x<w&&y<h};
 g.put=(x,y,m,t,z)=>{x=Math.round(x);y=Math.round(y);if(!g.in(x,y))return;const i=g.i(x,y);if(Z[i]>z)return;M[i]=m;T[i]=t;Z[i]=z;X[i]=null};
 g.col=(x,y,c)=>{x=Math.round(x);y=Math.round(y);if(!g.in(x,y))return;X[g.i(x,y)]=c;if(!M[g.i(x,y)]){M[g.i(x,y)]='fx';Z[g.i(x,y)]=99}};
 g.get=(x,y)=>g.in(x,y)?M[g.i(x,y)]:null;
 return g}
/* fill helpers: shade 'band' = lit left / base / shadow right; 'flat' = base with soft edge shadow */
function ellipse(g,cx,cy,rx,ry,m,z,shade,test){for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry;if(dx*dx+dy*dy>1)continue;if(test&&!test(x,y))continue;g.put(x,y,m,shadeAt(dx,dy,shade),z)}}
function shadeAt(nx,ny,mode){if(mode==='flat'){if(nx>.72||ny>.78)return 1;if(nx<-.35&&ny<-.25)return 3;return 2}
 if(mode==='metal'){if(nx<-.2&&ny<-.1)return 3;if(nx>.55)return 0;if(nx>.15)return 1;return 2}
 if(nx<-.45)return 3;if(nx<.25)return 2;if(nx<.7)return 1;return 0}
function shape(g,y0,y1,fx0,fx1,m,z,mode){for(let y=y0;y<=y1;y++){const a=fx0(y),b=fx1(y);for(let x=Math.round(a);x<=Math.round(b);x++){const nx=((x+.5)-(a+b)/2)/((b-a)/2+.5);g.put(x,y,m,shadeAt(nx,0,mode||'band'),z)}}}
function render(g,mats){const cv=document.createElement('canvas');cv.width=g.w;cv.height=g.h;const c=cv.getContext('2d');
 for(let y=0;y<g.h;y++)for(let x=0;x<g.w;x++){const i=g.i(x,y),m=g.M[i];let col=null;
  if(m){if(g.X[i])col=g.X[i];else{const r=ramp(mats[m]);let t=g.T[i];
    /* internal outline: this part is in front of a neighbour part → darken edge facing it */
    for(const[dx,dy]of[[1,0],[0,1],[-1,0],[0,-1]]){if(!g.in(x+dx,y+dy))continue;const j=g.i(x+dx,y+dy),n=g.M[j];if(n&&n!=='fx'&&n!==m&&g.Z[j]<g.Z[i]-.5&&g.Z[i]-g.Z[j]<50){t=Math.min(t,0);break}}
    col=r[t]}}
  else{for(const[dx,dy]of[[0,1],[0,-1],[1,0],[-1,0]]){if(!g.in(x+dx,y+dy))continue;const n=g.M[g.i(x+dx,y+dy)];if(n&&n!=='fx'&&mats[n]){col=ramp(mats[n])[4];break}}}
  if(col){c.fillStyle=col;c.fillRect(x,y,1,1)}}
 return cv}

function make(c,{H=52,style='chibi',facing='q',expr='neutral',frame=0,seated=false}={}){
 const chibi=style==='chibi',q=facing==='q';
 const W=Math.round(H*(chibi?.78:.6))+8,g=canvasOf(W,H+2);
 const mats={skin:c.skin,hair:c.hair||'#3a2418',beard:c.beard||c.hair||'#3a2418',cloth:c.robe,sleeve:c.robe,trim:c.trim,cape:c.cape||c.robe,hat:c.hatc||c.robe,gold:'#e3b54e',metal:'#a2abb8',wood:'#7a4a26',boot:'#3a2a20',gem2:c.itemc||'#9fd0ff',belt:'#4a3020',hand:c.skin};
 const walk=frame===1||frame===2,bob=walk?1:0;
 /* proportions */
 const headH=Math.round(H*(chibi?.42:.2)),r=chibi?headH*.5:headH*.45,ry=headH*.5;
 const cx=W/2-(q?1.5:0),hx=cx+(q?r*.15:0),hy=1+bob+ry+(c.hat==='crown'||c.hat==='turban'||c.hat==='helm'?2:0);
 const neckY=Math.round(hy+ry*(chibi?.82:.92)),hemY=H-Math.max(3,Math.round(H*.07)),L=hemY-neckY;
 const sw=chibi?Math.max(5,r*.78):Math.max(5,H*.16);
 const half=y=>{const t=(y-neckY)/L;if(t<.1)return sw*(.6+t*4);if(t<.42)return sw*(1-(t-.1)*.45);return sw*(.86+(t-.42)*.55)};
 const long=c.hs===2;
 /* z order: 0 back items, 5 cape, 8 back hair/hood, 10 legs, 20 back arm, 30 robe, 40 belt/trim, 50 front arm, 55 hand, 60 neck, 70 head, 75 beard, 80 hair, 90 hat, 95 front items */
 if(c.item==='bow'){for(let y=neckY;y<=hemY-4;y++){const t=(y-neckY)/(hemY-4-neckY);g.put(cx-sw-1-Math.sin(t*Math.PI)*2.2,y,'wood',2,1)}}
 if(c.cape)shape(g,neckY+1,H-1,y=>cx-half(Math.min(y,hemY))-1.5,y=>cx+half(Math.min(y,hemY))-(q?3:-1.5),'cape',5,'band');
 if(long&&c.hat!=='helm')ellipse(g,hx-(q?r*.35:0),hy+ry*.55,r*1.02,ry*(chibi?1.25:2.2),'hair',8,'band',(x,y)=>y>=hy-ry*.2&&(!q||x<=hx+r*.25));
 if(c.hat==='hood'||c.hat==='veil')ellipse(g,hx-(q?r*.12:0),hy+ry*.12,r*1.3,ry*1.32,'hat',8,'band',(x,y)=>y<=neckY+2);
 /* legs */
 if(!seated){const fw=Math.max(2,Math.round(sw*.34)),gap=Math.max(1,Math.round(sw*.16)),st=walk?Math.max(1,Math.round(sw*.28)):0;
  const legs=[[Math.round(cx-gap-fw+(q?1:0))-(frame===1?st:frame===2?st:0),frame===2],[Math.round(cx+gap+(q?1:0))+(frame?st:0),frame===1]];
  legs.forEach(([lx,up],li)=>{const yb=H-(up?1:0),bootH=Math.max(2,Math.round(H*.055));for(let y=hemY-1;y<=yb;y++)for(let x=lx;x<lx+fw+(q&&y===yb?1:0);x++){const boot=y>yb-bootH;g.put(x,y,boot?'boot':'cloth',boot?(x===lx?3:x===lx+fw-1?1:2):0,10+li)}})}
 /* back arm (three-quarter: a sliver behind the robe) */
 const armW=Math.max(2,Math.round(sw*(chibi?.42:.32))),handY=neckY+Math.round(L*(seated?.48:.5));
 if(q)shape(g,neckY+1,handY-1,y=>cx-half(y)-armW*.6,y=>cx-half(y)+1,'sleeve',20,'band');
 /* robe body */
 shape(g,neckY,hemY,y=>cx-half(y),y=>cx+half(y)-1,'cloth',30,'band');
 for(let y=Math.round(neckY+L*.45);y<hemY;y++)for(let x=Math.round(cx-half(y));x<cx+half(y)-1;x++)if((Math.round(x-cx)+2)%4===0&&g.get(x,y)==='cloth')g.T[g.i(x,y)]=Math.max(0,g.T[g.i(x,y)]-1);
 if(c.armor)for(let y=neckY+2;y<neckY+L*.42;y++)if(y%2===0)for(let x=Math.round(cx-half(y))+1;x<cx+half(y)-2;x++)if(g.get(x,y)==='cloth')g.T[g.i(x,y)]=Math.max(0,g.T[g.i(x,y)]-1);
 if(seated){const sy=neckY+Math.round(L*.6);shape(g,sy,sy+2,()=>cx-sw,()=>cx+sw+2,'cloth',31,'band')}
 /* collar, belt, hem, front opening */
 const cw=Math.max(2,Math.round(sw*.45));for(let k=0;k<=Math.max(2,Math.round(L*.08));k++){const w=Math.max(1,cw-k);for(let x=Math.round(cx-w+(q?1:0));x<=cx+w+(q?1:0);x++)g.put(x,neckY+k,'trim',k===0?3:2,40)}
 const by=neckY+Math.round(L*.4);for(let x=Math.round(cx-half(by));x<cx+half(by)-1;x++){g.put(x,by,'belt',x<cx?2:1,40);g.put(x,by+1,'belt',0,40)}g.col(cx+(q?2:0),by,'#e3b54e');g.col(cx+(q?2:0),by+1,'#a07a2a');
 for(let x=Math.round(cx-half(hemY));x<cx+half(hemY)-1;x++)g.put(x,hemY,'trim',x<cx?2:1,40);
 const op=Math.round(cx+(q?sw*.3:0));for(let y=by+2;y<hemY;y++)g.put(op,y,'trim',1,40);
 /* front arm + hand */
 const sx=q?cx+half(neckY+3)-armW+1:cx+sw-armW+1,swing=walk?(frame===1?1:-1):0;
 const armX=y=>sx+(y-neckY)/(handY-neckY)*(chibi?.5:1.2)+swing*(y-neckY)/(handY-neckY);
 shape(g,neckY+1,handY,y=>armX(y),y=>armX(y)+armW-1+(y>handY-3?1:0),'sleeve',50,'band');
 const hxp=armX(handY)+armW/2;ellipse(g,hxp,handY+1.6,Math.max(1.3,armW*.5),Math.max(1.3,armW*.45),'hand',55,'flat');
 if(!q){const sx2=cx-sw-1;shape(g,neckY+1,handY,y=>sx2-(y-neckY)/(handY-neckY)*(chibi?.5:1.2),y=>sx2-(y-neckY)/(handY-neckY)*(chibi?.5:1.2)+armW-1,'sleeve',50,'band');ellipse(g,sx2-1+armW/2,handY+1.6,Math.max(1.3,armW*.5),Math.max(1.3,armW*.45),'hand',55,'flat')}
 /* neck + head (flat face shading) */
 for(let y=Math.round(hy+ry*.55);y<=neckY;y++)for(let x=Math.round(hx-r*.28);x<=hx+r*.28;x++)g.put(x,y,'skin',y<neckY-1?0:1,60);
 ellipse(g,hx,hy,r,ry,'skin',70,'flat');
 if(!chibi)ellipse(g,hx+(q?r*.12:0),hy+ry*.32,r*.84,ry*.72,'skin',70,'flat',(x,y)=>y>=hy);
 if(q){g.put(hx-r*.66,hy+ry*.08,'skin',1,71);g.put(hx-r*.66,hy+ry*.26,'skin',0,71);g.put(hx+r*.98,hy+ry*.18,'skin',2,71)}
 if(c.beard){const my0=hy+ry*(chibi?.5:.56);ellipse(g,hx+(q?r*.22:0),my0+ry*.3,r*(chibi?.62:.7),ry*(chibi?.36:.42),'beard',75,'flat',(x,y)=>y>=my0);
  for(let x=Math.round(hx+(q?r*.05:-r*.35));x<=hx+(q?r*.75:r*.35);x++)g.put(x,Math.round(my0-1),'beard',2,75);
  if(q)for(let y=Math.round(hy+ry*.15);y<my0;y++)g.put(hx-r*.48,y,'beard',1,75)}
 /* hair: crown of the head + back + a bang line that never covers the eyes */
 const browY=hy+ry*(chibi?-.12:-.18);
 if(c.hs&&!['helm','hood','veil'].includes(c.hat)){
  ellipse(g,hx-(q?r*.08:0),hy-ry*.08,r*1.08,ry*1.02,'hair',80,'band',(x,y)=>{if(y<=browY-1)return true;if(q)return x<=hx-r*.42&&y<=hy+ry*(long?1.3:.42);return(x<=hx-r*.78||x>=hx+r*.78)&&y<=hy+ry*(long?1.3:.35)});
  for(let x=Math.round(hx-r*.6);x<=hx+r*.85;x++)if((x*3)%5<2)g.put(x,Math.round(browY),'hair',1,80);
  for(let y=0;y<g.h;y++)for(let x=0;x<g.w;x++){const i=g.i(x,y);if(g.M[i]==='hair'&&g.Z[i]>=80&&y<hy-ry*.55&&(x+y)%3===0)g.T[i]=3}}
 /* hats */
 const Hh=c.hat,band=Math.round(hy-ry*.7);
 if(Hh==='crown'){for(let y=band-1;y<=band+1;y++)for(let x=Math.round(hx-r*.86);x<=hx+r*.86;x++)g.put(x,y,'gold',y===band-1?3:x>hx+r*.3?1:2,90);
  const step=Math.max(2,Math.round(r*.45));for(let x=Math.round(hx-r*.86);x<=hx+r*.86;x+=step){g.put(x,band-2,'gold',3,90);g.put(x,band-3,'gold',2,90)}g.col(hx+(q?r*.25:0),band,'#c0283a');g.col(hx+(q?r*.25:0)-step,band,'#5ab8f0')}
 if(Hh==='circlet'){const y=Math.round(browY-1);for(let x=Math.round(hx-r*.95);x<=hx+r*.95;x++)g.put(x,y,'gold',x<hx?3:1,90);g.col(hx+(q?r*.35:0),y,'#7ad0ff')}
 if(Hh==='helm'){ellipse(g,hx-(q?r*.05:0),hy-ry*.05,r*1.12,ry*1.05,'metal',90,'metal',(x,y)=>y<=browY||(q?x<=hx-r*.35&&y<=hy+ry*.55:(x<=hx-r*.72||x>=hx+r*.72)&&y<=hy+ry*.55));
  const nx=Math.round(hx+(q?r*.45:0));for(let y=Math.round(browY);y<=hy+ry*.22;y++)g.put(nx,y,'metal',2,91);for(let x=Math.round(hx-r*1.05);x<=hx+r*1.05;x++)if(g.get(x,Math.round(browY))==='metal')g.T[g.i(x,Math.round(browY))]=0}
 if(Hh==='hood'||Hh==='veil'){ellipse(g,hx-(q?r*.06:0),hy-ry*.12,r*1.06,ry*.98,'hat',90,'band',(x,y)=>y<=browY-1||(q&&x<=hx-r*.45&&y<=hy+ry*.5));for(let x=Math.round(hx-r*.8);x<=hx+r*.9;x++)g.put(x,Math.round(browY-1),'hat',0,91);if(Hh==='veil')for(let x=Math.round(hx-r*.9);x<=hx+r*.9;x++)g.put(x,Math.round(browY),'trim',2,91)}
 if(Hh==='turban'){ellipse(g,hx-(q?r*.05:0),hy-ry*.55,r*1.16,ry*.7,'hat',90,'band',(x,y)=>y<=browY);for(let y=0;y<g.h;y++)for(let x=0;x<g.w;x++){const i=g.i(x,y);if(g.M[i]==='hat'&&g.Z[i]===90&&(x+y*2)%5===0)g.T[i]=Math.max(0,g.T[i]-1)}g.col(hx+(q?r*.35:0),hy-ry*.7,'#c0283a')}
 if(Hh==='cap'){ellipse(g,hx-(q?r*.05:0),hy-ry*.5,r*1.08,ry*.62,'hat',90,'band',(x,y)=>y<=browY);for(let x=Math.round(hx-r*(q?.5:1.1));x<=hx+r*1.3;x++)g.put(x,Math.round(browY),'hat',1,91)}
 /* items in the front hand */
 const hand=[Math.round(hxp),Math.round(handY+1)];
 if(c.item==='spear'||c.item==='staff'){const x=hand[0]+1;for(let y=Math.round(hy-ry*.4);y<=H;y++)g.put(x,y,'wood',2,95);if(c.item==='spear'){ellipse(g,x+.5,hy-ry*.7,1.4,3,'metal',96,'metal')}else ellipse(g,x+.5,hy-ry*.55,1.9,1.9,'gem2',96,'flat')}
 if(c.item==='sword'){const x=Math.round(cx-sw*.55);for(let y=by+1;y<=by+Math.round(L*.45);y++)g.put(x,y,'metal',y%3?3:1,41);for(let k=-1;k<=1;k++)g.put(x+k,by+1,'gold',2,42)}
 if(c.item==='scroll'){for(let y=hand[1]-1;y<=hand[1]+1;y++)for(let x=hand[0]+1;x<=hand[0]+3;x++)g.put(x,y,'trim',y===hand[1]-1?3:2,96)}
 if(c.item==='basket'){ellipse(g,hand[0]+2.5,hand[1]+2,3,2.2,'wood',96,'band');g.col(hand[0]+2,hand[1],'#e8c070');g.col(hand[0]+3,hand[1],'#d9a35a')}
 face(g,c,{hx,hy,r,ry,q,chibi,expr,browY});
 return{g,mats}}

function face(g,c,{hx,hy,r,ry,q,chibi,expr,browY}){
 const D='#1b1220',W='#f6f1e8',sk=ramp(c.skin),BR=ramp(c.hair||'#2a1c14')[0],IR=c.eye||'#4a2e1e',LIP=ramp(c.skin)[0],e=expr;
 const ey=Math.round(hy+ry*(chibi?.08:.04));
 const ex=q?[Math.round(hx-r*.08),Math.round(hx+r*.42)]:[Math.round(hx-r*.5),Math.round(hx+r*.22)];
 const big=chibi?{w:2,h:3}:{w:2,h:1};
 const eye=(i,col)=>{const far=q&&i===0,w=far?1:big.w,x=ex[i];
  if(chibi){for(let k=0;k<w;k++){g.col(x+k,ey,D);g.col(x+k,ey+1,col||IR);g.col(x+k,ey+2,col||D)}if(!far)g.col(x,ey+1,W)}
  else{g.col(x,ey,col||D);if(w>1)g.col(x+1,ey,col||D);if(!far)g.col(x-1,ey,W)}};
 const brow=(i,dy0,dy1)=>{const far=q&&i===0,x=ex[i],w=far?1:big.w;const y=ey-2;g.col(x-(far?0:0),y+dy0,BR);if(w>1)g.col(x+1,y+dy1,BR);if(!far)g.col(x+w,y+dy1,BR)};
 const mx=Math.round(hx+(q?r*.4:0)),my=Math.round(hy+ry*(chibi?.5:.56));
 /* nose */
 if(chibi)g.col(mx+(q?1:0),ey+3,sk[1]);else if(q){g.col(hx+r*.95,ey+1,sk[2]);g.col(hx+r*.9,ey+2,sk[0])}else g.col(hx,ey+2,sk[1]);
 const blush=()=>{if(chibi){g.col(ex[1]+2,ey+3,'#e0868c');if(!q)g.col(ex[0]-1,ey+3,'#e0868c')}};
 switch(e){
  case'happy':[0,1].forEach(i=>{const far=q&&i===0,w=far?1:big.w;for(let k=0;k<w;k++){g.col(ex[i]+k,ey+(chibi?1:0),D)}if(chibi&&!far){g.col(ex[i]-1,ey+2,D);g.col(ex[i]+w,ey+2,D)}});
   brow(0,0,0);brow(1,0,0);g.col(mx-1,my,D);g.col(mx,my+1,D);g.col(mx+1,my+1,D);g.col(mx+2,my,D);blush();break;
  case'angry':case'fierce':eye(0,e==='fierce'?'#ff8a2a':null);eye(1,e==='fierce'?'#ff8a2a':null);brow(0,-1,0);brow(1,1,0);g.col(ex[1]+2,ey-2,BR);
   for(let k=-1;k<=1;k++)g.col(mx+k,my,D);if(e==='fierce'){g.col(mx,my+1,W);g.col(mx+1,my+1,W)}break;
  case'sad':eye(0);eye(1);brow(0,1,0);brow(1,0,1);g.col(ex[1]+1,ey+(chibi?3:1),'#9fd4ff');g.col(ex[1]+1,ey+(chibi?4:2),'#5aa0e0');g.col(mx,my,LIP);g.col(mx-1,my+1,LIP);g.col(mx+1,my+1,LIP);break;
  case'shock':eye(0);eye(1);brow(0,-1,-1);brow(1,-1,-1);g.col(mx,my,D);g.col(mx,my+1,D);if(chibi){g.col(mx+1,my,D);g.col(mx+1,my+1,D)}g.col(hx-r*.6,hy-ry*.3,'#bfe6ff');g.col(hx-r*.6,hy-ry*.15,'#7ac0ff');break;
  case'smug':case'cold':case'tired':eye(0);eye(1);[0,1].forEach(i=>{const w=q&&i===0?1:big.w;for(let k=0;k<w;k++)g.col(ex[i]+k,ey,sk[0])});if(e==='smug'){brow(0,0,0);brow(1,-1,-1);g.col(mx,my,LIP);g.col(mx+1,my-1,D);g.col(mx+2,my-1,D)}else if(e==='cold'){brow(0,0,0);brow(1,0,0);g.col(mx-1,my,LIP);g.col(mx,my,LIP);g.col(mx+1,my,LIP)}else{brow(0,1,0);brow(1,0,1);g.col(mx,my,LIP);ex.forEach(x=>g.col(x,ey+(chibi?3:1),sk[1]))}break;
  default:eye(0);eye(1);brow(0,0,0);brow(1,0,0);g.col(mx,my,LIP);g.col(mx+1,my,LIP);
 }}
const cache=new Map();
function get(key,o){const id=key+JSON.stringify(o);let cv=cache.get(id);if(cv)return cv;const r=make(C[key]||C.guard,o);cv=render(r.g,r.mats);cache.set(id,cv);return cv}
return{make,get};
})();
