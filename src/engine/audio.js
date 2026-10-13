/* ===== ENGINE: settings + sound effects (Web Audio, no files) ===== */
const SET=Object.assign({sfx:true,music:true,tutorial:true,speed:2,vol:.7},store.get('arvand_settings',{}));
const saveSet=()=>store.set('arvand_settings',SET);
let AC=null,MASTER=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();MASTER=AC.createGain();MASTER.gain.value=SET.vol;MASTER.connect(AC.destination)}catch(e){AC=null}}if(AC&&AC.state==='suspended')AC.resume().catch(()=>{});return AC}
function tone(f,d,{type='square',vol=.05,at=0,slide=0,dest}={}){const a=ac();if(!a)return;const o=a.createOscillator(),gn=a.createGain(),t=a.currentTime+at;o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(gn);gn.connect(dest||MASTER);o.start(t);o.stop(t+d+.02)}
function noise(d,{vol=.08,at=0,f=1200,q=1,type='bandpass',dest}={}){const a=ac();if(!a)return;const len=Math.max(1,Math.floor(a.sampleRate*d)),b=a.createBuffer(1,len,a.sampleRate),ch=b.getChannelData(0);for(let i=0;i<len;i++)ch[i]=Math.random()*2-1;const s=a.createBufferSource();s.buffer=b;const fl=a.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const gn=a.createGain(),t=a.currentTime+at;gn.gain.setValueAtTime(vol,t);gn.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(fl);fl.connect(gn);gn.connect(dest||MASTER);s.start(t)}
const SFX={
 door(){noise(.5,{f:180,q:6,vol:.12});tone(90,.4,{type:'sawtooth',vol:.02,slide:-30})},
 steps(){for(let i=0;i<4;i++)noise(.06,{f:500,q:2,vol:.06,at:i*.22})},
 coin(){tone(988,.08,{vol:.04});tone(1318,.14,{vol:.04,at:.07})},
 choose(){tone(523,.06,{vol:.035});tone(784,.08,{vol:.03,at:.05})},
 type(){tone(260+Math.random()*90,.02,{vol:.012})},
 stamp(){noise(.12,{f:150,q:1,vol:.25});tone(70,.15,{type:'sine',vol:.15})},
 bell(){[0,.5].forEach(at=>{tone(392,1.6,{type:'sine',vol:.06,at});tone(784,1.2,{type:'sine',vol:.025,at})})},
 bad(){tone(220,.18,{type:'triangle',vol:.05,slide:-80})},
 good(){tone(523,.08,{type:'triangle',vol:.05});tone(659,.08,{type:'triangle',vol:.05,at:.08});tone(784,.14,{type:'triangle',vol:.05,at:.16})},
 quill(){noise(.25,{f:4000,q:3,vol:.03})},
 drum(){tone(80,.25,{type:'sine',vol:.2,slide:-40});noise(.08,{f:300,q:1,vol:.08})},
 clash(){noise(.18,{f:3200,q:4,vol:.08});tone(1800,.12,{vol:.02,slide:-600})},
};
function sfx(n){if(!SET.sfx)return;try{SFX[n]&&SFX[n]()}catch(e){}}
const coin=()=>sfx('coin');
