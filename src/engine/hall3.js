/* ===== Throne hall v3: one-point perspective, dais, torch light =====
   drawHall3(ctx, t, opts) — opts.style 'chibi'|'tall', opts.cast = {petitioner, expr, advisors:[], night} */
function drawHall3(x,t,o){
 const W=320,H=180,HZ=94;
 const style=o.style||'chibi';
 // back wall
 x.fillStyle='#211826';x.fillRect(0,0,W,H);
 for(let y=0;y<HZ;y+=7){const off=(y/7)%2?7:0;for(let i=48-off;i<272;i+=14){const n=((i*7+y*13)>>>0)%5;x.fillStyle=['#2d2233','#30243a','#2a2030','#33273c','#2b2131'][n];x.fillRect(i+1,y+1,12,5)}}
 // side walls (darker, perspective brick rows)
 const side=(L)=>{x.fillStyle='#19121d';x.beginPath();if(L){x.moveTo(0,0);x.lineTo(52,0);x.lineTo(52,HZ);x.lineTo(0,148)}else{x.moveTo(W,0);x.lineTo(268,0);x.lineTo(268,HZ);x.lineTo(W,148)}x.closePath();x.fill();
  x.strokeStyle='#241a2a';x.lineWidth=1;for(let k=1;k<9;k++){const yb=k*HZ/9,yf=k*148/9;x.beginPath();if(L){x.moveTo(0,yf);x.lineTo(52,yb)}else{x.moveTo(W,yf);x.lineTo(268,yb)}x.stroke()}};
 side(true);side(false);
 // floor with perspective checker
 const img=x.getImageData(0,0,W,H),d=img.data;
 for(let y=HZ;y<H;y++){const tt=(y-HZ)/(H-HZ),hw=108+tt*190,v=1/(.22+tt);for(let px=0;px<W;px++){
   const u=(px-160)/hw;if(Math.abs(u)>1.0&&y<148+ (Math.abs(px-160)>160?0:0)){/* side wall area */const wallBottom=px<160?HZ+(52-px)/52*(148-HZ):HZ+(px-268)/52*(148-HZ);if(y<wallBottom)continue}
   const ch=(Math.floor(u*7+20)+Math.floor(v*2.2))%2;const fade=.55+tt*.45;const base=ch?[66,50,46]:[54,40,38];
   const i=(y*W+px)*4;d[i]=base[0]*fade;d[i+1]=base[1]*fade;d[i+2]=base[2]*fade;d[i+3]=255}}
 x.putImageData(img,0,0);
 // carpet runner to the dais
 x.fillStyle='#6e1a28';x.beginPath();x.moveTo(146,103);x.lineTo(174,103);x.lineTo(206,H);x.lineTo(114,H);x.closePath();x.fill();
 x.strokeStyle='#d9a540';x.lineWidth=1;x.beginPath();x.moveTo(147,103);x.lineTo(116,H);x.moveTo(173,103);x.lineTo(204,H);x.stroke();
 x.fillStyle='#5a1420';for(let y=110;y<H;y+=9){const tt=(y-HZ)/(H-HZ);x.fillRect(160-2-tt*4,y,4+tt*8,2)}
 // windows on back wall
 for(const wx of[86,234]){x.fillStyle='#120d14';x.fillRect(wx-10,14,20,52);x.fillRect(wx-8,10,16,4);x.fillRect(wx-5,8,10,2);
  const gr=x.createLinearGradient(0,14,0,66);gr.addColorStop(0,o.night?'#1a2448':'#ffd98a');gr.addColorStop(1,o.night?'#0a0e22':'#e0874a');x.fillStyle=gr;x.fillRect(wx-8,16,16,48);x.fillRect(wx-6,12,12,4);x.fillRect(wx-3,10,6,2);
  x.fillStyle='#120d14';x.fillRect(wx-1,10,2,56);x.fillRect(wx-8,38,16,2);x.fillStyle='#3a2c40';x.fillRect(wx-11,66,22,3)}
 // rosette above the throne
 x.fillStyle='#120d14';x.beginPath();x.arc(160,22,13,0,7);x.fill();const rg=x.createRadialGradient(160,22,1,160,22,12);rg.addColorStop(0,'#fff0c0');rg.addColorStop(1,o.night?'#2a2a60':'#c45a2a');x.fillStyle=rg;x.beginPath();x.arc(160,22,11,0,7);x.fill();
 x.strokeStyle='#120d14';x.lineWidth=1.5;for(let a=0;a<8;a++){x.beginPath();x.moveTo(160,22);x.lineTo(160+Math.cos(a*Math.PI/4)*11,22+Math.sin(a*Math.PI/4)*11);x.stroke()}
 // banners
 for(const bx of[124,196]){const sw=Math.round(Math.sin(t/900+bx));x.fillStyle='#d9a540';x.fillRect(bx-7,30,15,2);x.fillStyle='#8a1f30';x.fillRect(bx-6+sw,32,13,42);x.beginPath();x.moveTo(bx-6+sw,74);x.lineTo(bx+sw,68);x.lineTo(bx+7+sw,74);x.lineTo(bx+7+sw,72);x.lineTo(bx-6+sw,72);x.fill();x.fillStyle='#5e1420';x.fillRect(bx-6+sw,32,2,40);
  x.fillStyle='#e3b54e';x.fillRect(bx-1+sw,42,3,12);x.fillRect(bx-4+sw,46,9,2);x.fillRect(bx-3+sw,40,1,3);x.fillRect(bx+2+sw,40,1,3)}
 // dais steps
 const step=(y,hw,c1,c2)=>{x.fillStyle=c1;x.fillRect(160-hw,y,hw*2,5);x.fillStyle=c2;x.fillRect(160-hw,y,hw*2,1)};
 step(84,44,'#4a3c52','#7a6a84');step(89,52,'#433649','#6e5e78');step(94,60,'#3c3042','#62546c');step(99,68,'#352a3b','#5a4c64');
 // throne
 x.fillStyle='#5a3a10';x.fillRect(143,44,34,42);x.fillStyle='#d9a540';x.fillRect(144,45,32,40);x.fillStyle='#7a1f2b';x.fillRect(148,52,24,30);x.fillStyle='#5e1420';x.fillRect(148,52,2,30);
 x.fillStyle='#d9a540';x.fillRect(154,36,12,9);x.fillRect(158,30,4,6);x.fillStyle='#c0283a';x.fillRect(159,39,2,2);
 // braziers on the dais
 const brazier=(bx,by)=>{x.fillStyle='#2a2028';x.fillRect(bx-4,by,8,3);x.fillRect(bx-1,by+3,2,8);x.fillRect(bx-3,by+11,6,2);const f=Math.sin(t/80+bx)*1.3;x.fillStyle='#ff8a2a';x.fillRect(bx-3,by-5-Math.round(f),6,5+Math.round(f));x.fillStyle='#ffd27a';x.fillRect(bx-1,by-4-Math.round(f),3,4)};
 brazier(110,82);brazier(210,82);
 // wall torches on side walls
 const torch=(tx,ty)=>{x.fillStyle='#3a2414';x.fillRect(tx-1,ty,3,7);const f=Math.sin(t/90+tx)*1.2;x.fillStyle='#ff9a2a';x.fillRect(tx-2,ty-6-Math.round(f),5,6);x.fillStyle='#ffe07a';x.fillRect(tx-1,ty-4-Math.round(f),3,3)};
 torch(30,64);torch(290,64);
 // door on the left side wall (perspective)
 x.fillStyle='#0e0a10';x.beginPath();x.moveTo(14,92);x.lineTo(36,84);x.lineTo(36,118);x.lineTo(14,132);x.closePath();x.fill();
 x.fillStyle=o.doorOpen?'#6a5a40':'#4e321e';x.beginPath();x.moveTo(16,94);x.lineTo(34,87);x.lineTo(34,117);x.lineTo(16,129);x.closePath();x.fill();
 if(!o.doorOpen){x.strokeStyle='#36220f';for(let k=0;k<4;k++){x.beginPath();x.moveTo(19+k*4,93-k*1.5);x.lineTo(19+k*4,127-k*2.6);x.stroke()}x.fillStyle='#d9a540';x.fillRect(30,104,2,2)}
 // darken the room (characters drawn after stay readable)
 x.save();x.globalCompositeOperation='multiply';x.fillStyle=o.night?'#3a3a6a':'#8a7a8a';x.fillRect(0,0,W,H);x.restore();
 // --- characters (back to front) with shadows
 const S3=(key,o2)=>SP3.get(key,Object.assign({style},o2));
 const put=(key,cx,feet,o2,left)=>{const cv=S3(key,o2);const w=cv.width;
  x.fillStyle='rgba(8,4,10,.45)';x.beginPath();x.ellipse(cx,feet,w*.36,Math.max(2,w*.09),0,0,7);x.fill();
  if(left){x.save();x.translate(Math.round(cx),0);x.scale(-1,1);x.drawImage(cv,-Math.round(w/2),Math.round(feet-cv.height+2));x.restore()}else x.drawImage(cv,Math.round(cx-w/2),Math.round(feet-cv.height+2))};
 // king seated on throne (front)
 const kc=S3('king',{H:style==='chibi'?40:44,facing:'f',seated:true,expr:'neutral'});
 x.drawImage(kc,Math.round(160-kc.width/2),Math.round(86-kc.height+(style==='chibi'?6:9)));
 x.fillStyle='#b8902a';x.fillRect(140,70,7,4);x.fillRect(173,70,7,4);x.fillStyle='#5a3a10';x.fillRect(141,74,5,12);x.fillRect(174,74,5,12);
 // advisors on the right of the dais, angled toward the petitioner
 (o.advisors||[]).forEach((k,i)=>put(k,232+i*20,120+i*6,{H:style==='chibi'?40:46,facing:'q'},true));
 // petitioner (foreground left of the carpet), angled toward the throne
 if(o.petitioner)put(o.petitioner,o.px||118,o.py||160,{H:style==='chibi'?50:60,facing:'q',expr:o.expr||'neutral',frame:o.frame||0},o.leaving);
 // foreground guard (right) and pillars framing the view
 put('guard',292,182,{H:style==='chibi'?58:70,facing:'q'},true);
 for(const[px,pw]of[[0,14],[W-14,14]]){x.fillStyle='#0d0910';x.fillRect(px,0,pw,H);x.fillStyle='#2a1f2e';x.fillRect(px===0?pw-2:px,0,2,H)}
 // --- lighting pass
 x.save();x.globalCompositeOperation='lighter';
 const glow=(gx,gy,rad,col,a)=>{const gr=x.createRadialGradient(gx,gy,0,gx,gy,rad);gr.addColorStop(0,col.replace('A',a));gr.addColorStop(1,col.replace('A',0));x.fillStyle=gr;x.fillRect(gx-rad,gy-rad,rad*2,rad*2)};
 const fl=1+Math.sin(t/120)*.05;
 glow(110,78,70*fl,'rgba(255,150,60,A)',.32);glow(210,78,70*fl,'rgba(255,150,60,A)',.32);glow(30,58,60*fl,'rgba(255,140,50,A)',.28);glow(290,58,60*fl,'rgba(255,140,50,A)',.28);
 glow(160,24,30,'rgba(255,220,160,A)',.35);
 if(!o.night){x.globalAlpha=.10;x.fillStyle='#ffd9a0';for(const wx of[86,234]){x.beginPath();x.moveTo(wx-8,20);x.lineTo(wx+8,20);x.lineTo(wx+(wx<160?40:-10),H);x.lineTo(wx+(wx<160?10:-40),H);x.closePath();x.fill()}x.globalAlpha=1}
 x.restore();
 // vignette
 const vg=x.createRadialGradient(160,100,60,160,100,210);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(6,3,10,.75)');x.fillStyle=vg;x.fillRect(0,0,W,H);
}
