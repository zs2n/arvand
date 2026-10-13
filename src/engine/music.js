/* ===== ENGINE: procedural music (Web Audio) =====
   Hijaz mode on D, a plucked oud-like voice, a low drone and a frame drum.
   The mood follows the chapter: calm → tense → dark → battle. */
const music=(()=>{
 const HIJAZ=[0,1,4,5,7,8,10,12],ROOT=146.83;/* D3 */
 const MOODS={1:{bpm:76,density:.45,drum:.35,oct:1},2:{bpm:84,density:.55,drum:.5,oct:1},3:{bpm:96,density:.6,drum:.7,oct:1},night:{bpm:60,density:.25,drum:0,oct:1},siege:{bpm:120,density:.5,drum:1,oct:.5}};
 let bus=null,timer=null,next=0,step=0,deg=0,mood=MOODS[1],on=false;
 const f=(d,o)=>ROOT*Math.pow(2,(HIJAZ[((d%8)+8)%8]+12*Math.floor(d/8))/12)*(o||1);
 function pluck(freq,t,len,vol){const a=AC;const o=a.createOscillator(),o2=a.createOscillator(),gn=a.createGain(),lp=a.createBiquadFilter();
  o.type='triangle';o2.type='sawtooth';o.frequency.value=freq;o2.frequency.value=freq*1.003;lp.type='lowpass';lp.frequency.setValueAtTime(2400,t);lp.frequency.exponentialRampToValueAtTime(500,t+len);
  gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(vol,t+.008);gn.gain.exponentialRampToValueAtTime(.0001,t+len);
  const g2=a.createGain();g2.gain.value=.25;o.connect(gn);o2.connect(g2);g2.connect(gn);gn.connect(lp);lp.connect(bus);o.start(t);o2.start(t);o.stop(t+len+.05);o2.stop(t+len+.05)}
 function drone(t,len){const a=AC;for(const[fr,v]of[[ROOT/2,.05],[ROOT*.75,.025]]){const o=a.createOscillator(),gn=a.createGain();o.type='sine';o.frequency.value=fr;gn.gain.setValueAtTime(0,t);gn.gain.linearRampToValueAtTime(v,t+.6);gn.gain.linearRampToValueAtTime(0,t+len);o.connect(gn);gn.connect(bus);o.start(t);o.stop(t+len+.1)}}
 function drum(t,low,vol){const a=AC;if(low){const o=a.createOscillator(),gn=a.createGain();o.type='sine';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(55,t+.18);gn.gain.setValueAtTime(vol*.5,t);gn.gain.exponentialRampToValueAtTime(.0001,t+.25);o.connect(gn);gn.connect(bus);o.start(t);o.stop(t+.3)}
  else{const len=Math.floor(a.sampleRate*.06),b=a.createBuffer(1,len,a.sampleRate),c=b.getChannelData(0);for(let i=0;i<len;i++)c[i]=(Math.random()*2-1)*(1-i/len);const s=a.createBufferSource(),fl=a.createBiquadFilter(),gn=a.createGain();s.buffer=b;fl.type='highpass';fl.frequency.value=2500;gn.gain.value=vol*.18;s.connect(fl);fl.connect(gn);gn.connect(bus);s.start(t)}}
 /* maqsum-like rhythm: dum tek - tek dum - tek - */
 const RHY=[1,2,0,2,1,0,2,0];
 function tick(){if(!on||!AC)return;const a=AC,beat=60/mood.bpm/2;
  while(next<a.currentTime+.25){const t=next,s=step%32;
   if(s===0)drone(t,beat*32);
   const r=RHY[step%8];if(mood.drum&&r)drum(t,r===1,mood.drum);
   if(Math.random()<mood.density&&!(s>=28)){deg+=pick([-2,-1,-1,0,1,1,2]);deg=clamp(deg,-1,10);if(s%8===0)deg=pick([0,2,4,7]);pluck(f(deg,mood.oct),t,beat*(Math.random()<.3?3:1.6),.07)}
   if(s===30)deg=0;
   next+=beat;step++}}
 function start(){if(!SET.music||on)return;const a=ac();if(!a)return;bus=a.createGain();bus.gain.value=.55;bus.connect(MASTER);on=true;next=a.currentTime+.1;step=0;timer=setInterval(tick,90)}
 function stop(){on=false;clearInterval(timer);if(bus){try{bus.gain.setTargetAtTime(0,AC.currentTime,.3);const b=bus;setTimeout(()=>b.disconnect(),1200)}catch(e){}}bus=null}
 function setMood(k){mood=MOODS[k]||MOODS[1]}
 function update(){if(SET.music)start();else stop()}
 return{start,stop,setMood,update};
})();
window.music=music;
/* start on the first click (browsers only allow sound after interaction) and follow the story */
document.addEventListener('click',()=>{if(SET.music)music.start()},{once:true});
HOOK.weekStart.push(()=>music.setMood(chapter(S.week)>=4?3:chapter(S.week)));
HOOK.weekEnd.push(()=>{music.setMood('night')});
const _startSiege=startSiege;startSiege=function(){music.setMood('siege');_startSiege()};
