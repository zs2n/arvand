/* ===== ENGINE: throne room scene (perspective hall, model B characters) ===== */
const sc=$('#scene'),g=sc.getContext('2d');g.imageSmoothingEnabled=false;
let actor=null,sceneMode='room',sceneHook=null;
const lerp=(a,b,t)=>a+(b-a)*t;
function drawRoom(t){
 const night=S&&S.phase==='report';
 let pet=null;
 if(actor){
  if(actor.state==='in'){actor.p+=.0075;if(actor.p>=1){actor.p=1;actor.state='idle';const cb=actor.cb;actor.cb=null;cb&&cb()}}
  else if(actor.state==='out'){actor.p-=.009;if(actor.p<=0){const cb=actor.cb;actor=null;cb&&cb()}}
  if(actor){const e=actor.p;pet={who:actor.who,px:lerp(HALL.door[0],HALL.stand[0],e),py:lerp(HALL.door[1],HALL.stand[1],e),frame:actor.state==='idle'?0:(Math.floor(t/160)%2)+1,leaving:actor.state==='out',expr:actor.expr}}}
 const adv=S?RKEYS.filter(k=>inCastle(k)).slice(0,4):[];
 drawHall3(g,t,{ch:S?chapter(S.week):1,night,doorOpen:!!actor&&actor.p<.3,advisors:adv,tattered:S&&S.hap<30,
  petitioner:pet&&pet.who,px:pet&&pet.px,py:pet&&pet.py,frame:pet&&pet.frame,leaving:pet&&pet.leaving,expr:pet&&pet.expr});
}
function loop(t){if(sceneMode==='room')drawRoom(t);else if(sceneMode==='map')drawMap(t);else if(sceneHook)sceneHook(t);requestAnimationFrame(loop)}
function walkIn(who,expr,cb){actor={who,p:0,state:'in',expr:expr||'neutral',cb};sfx('door')}
function walkOut(cb){if(!actor){cb();return}actor.state='out';actor.cb=cb;sfx('steps')}
function setActorExpr(e){if(actor)actor.expr=e}
