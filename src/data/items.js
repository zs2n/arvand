/* ===== DATA: royal treasury items =====
   Each item can be used once: give to a faction or advisor, or sell. */
Object.assign(ITEMS,{
 passmap:{n:'خريطة الممرّات',d:'رسمها فارٌّ من جيش بهرام: الطرق الجبلية التي سيأتي منها.',uses:[
  {t:'أعطها لرعد',e:{set:['scouted'],retmod:['raad',.1]}},{t:'بِعها لبني النهر',e:{gold:30,river:5}}]},
});
Object.assign(ITEMS,{
 ivoryhorn:{n:'بوق زعيم الذئاب',d:'بوق صيد من العاج، أخذه رعد من زعيم العصابة.',uses:[
  {t:'أعطه لرعد',e:{retmod:['raad',.1]}},{t:'أهده لأهل القرن',e:{horn:12}},{t:'بِعه',e:{gold:35}}]},
 moonscroll:{n:'مخطوطة القمر',d:'هدية أسيل بعد المصالحة: شروح قديمة في السحر.',uses:[
  {t:'أعطها لسمر',e:{retmod:['samar',.1]}},{t:'أعدها للمعبد تكريمًا',e:{moon:15}},{t:'بِعها لتاجر كتب',e:{gold:40,moon:-8}}]},
});
