/* ===== ENGINE: kingdom map ===== */
const mc=$('#map'),mg=mc.getContext('2d');
let mapBase=null,selLoc='castle';
function drawMapBase(){
 const cv=document.createElement('canvas');cv.width=320;cv.height=200;const m=cv.getContext('2d');
 const W=320,H=200;let seed=7;const r=()=>(seed=(seed*16807)%2147483647)/2147483647;
 for(let y=0;y<H;y+=4)for(let x=0;x<W;x+=4){const ash=x>235+Math.sin(y/14)*8;const n=r();m.fillStyle=ash?(n<.5?'#5a504a':'#625850'):(n<.33?'#4a6b3a':n<.66?'#527540':'#466336');m.fillRect(x,y,4,4)}
 for(let i=0;i<14;i++){const x=70+i*14+r()*8,y=8+r()*22,h=14+r()*10;m.fillStyle='#6a6870';m.beginPath();m.moveTo(x,y+h);m.lineTo(x+10,y);m.lineTo(x+20,y+h);m.fill();m.fillStyle='#55535c';m.beginPath();m.moveTo(x+10,y);m.lineTo(x+20,y+h);m.lineTo(x+12,y+h);m.fill();m.fillStyle='#e8e8f0';m.beginPath();m.moveTo(x+7,y+5);m.lineTo(x+10,y);m.lineTo(x+13,y+5);m.fill()}
 m.strokeStyle='#4a90c8';m.lineWidth=4;m.beginPath();m.moveTo(140,40);m.bezierCurveTo(110,60,90,62,70,78);m.bezierCurveTo(50,94,30,96,0,118);m.stroke();m.strokeStyle='#7ab8e8';m.lineWidth=1;m.stroke();
 for(let i=0;i<60;i++){const x=180+r()*60,y=140+r()*50;m.fillStyle='#24401f';m.fillRect(x|0,y|0,5,5);m.fillStyle='#2f5228';m.fillRect((x|0)+1,(y|0)-2,3,2)}
 for(let i=0;i<14;i++){const x=245+r()*70,y=40+r()*140;m.fillStyle='#2a2422';m.fillRect(x|0,y|0,1,6);m.fillRect((x|0)-2,(y|0)+1,5,1)}
 m.strokeStyle='#a88a5a';m.lineWidth=2;m.setLineDash([3,3]);for(const k in LOC){if(k==='castle')continue;m.beginPath();m.moveTo(150,105);m.lineTo(LOC[k].x,LOC[k].y);m.stroke()}m.setLineDash([]);
 m.fillStyle='#5a5560';m.fillRect(140,92,20,16);m.fillStyle='#7a7580';m.fillRect(138,88,6,20);m.fillRect(156,88,6,20);m.fillStyle='#8a1f30';m.fillRect(148,82,4,8);
 m.fillStyle='#8a6a3a';m.fillRect(86,134,12,8);m.fillStyle='#a33';m.fillRect(85,131,14,3);
 m.fillStyle='#d8dce6';m.fillRect(33,162,10,10);m.fillStyle='#9fd0ff';m.fillRect(36,158,4,4);
 m.fillStyle='#2f5f8a';m.fillRect(44,70,16,6);m.fillStyle='#efe6d0';m.fillRect(50,62,2,8);
 m.fillStyle='#3a1a10';m.fillRect(272,78,16,10);m.fillStyle='#c4552b';m.fillRect(276,72,8,6);
 m.strokeStyle='#120d14';m.lineWidth=6;m.strokeRect(0,0,W,H);
 mapBase=cv}
const mapLayers=[];/* living-map layers: f(ctx,t) */
function drawMap(t){if(!mapBase)drawMapBase();mg.drawImage(mapBase,0,0);for(const f of mapLayers)f(mg,t||0)}
function renderNodes(onPick){const box=$('#nodes');box.innerHTML='';
 for(const k in LOC){const L=LOC[k];const ms=M.filter(m=>m.loc===k&&(!m.cond||m.cond()));const here=S.missions.filter(m=>(M.find(x=>x.id===m.id)||{}).loc===k);
  const b=document.createElement('button');b.className='node'+(k===selLoc?' sel':'');b.style.right=(100-L.x/320*100)+'%';b.style.top=(L.y/200*100)+'%';
  b.innerHTML=`<i></i><em>${L.n}</em>${ms.length?`<span class="badge">${A(ms.length)}</span>`:''}${here.length?`<span class="busy">${here.map(m=>N[m.ret][0].split(' ').pop()).join('، ')}</span>`:''}`;
  b.onclick=()=>{selLoc=k;onPick()};b.setAttribute('aria-label',L.n);box.appendChild(b)}}
