/* ===== DATA: royal treasury items =====
   Each item can be used once: give to a faction or advisor, or sell. */
Object.assign(ITEMS,{
 passmap:{n:'خريطة الممرّات',d:'رسمها فارٌّ من جيش بهرام: الطرق الجبلية التي سيأتي منها.',uses:[
  {t:'أعطها لرعد',e:{set:['scouted'],retmod:['raad',.1]}},{t:'بِعها لبني النهر',e:{gold:30,river:5}}]},
});
