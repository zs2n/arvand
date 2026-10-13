/* ===== ENGINE: extra rules that plug into core ===== */
/* siege bonuses from chapter-3 preparations */
myPower.extra.push(parts=>{
 if(F('arrows'))parts.push(['عشرة آلاف سهم',20]);else if(F('halfarrows'))parts.push(['خمسة آلاف سهم',10]);
 if(F('oil'))parts.push(['قدور الزيت المغلي',25]);
});

myPower.extra.push(parts=>{
 if(F('catapults'))parts.push(['منجنيقا دانيال',30]);
 if(S.arms)parts.push(['مخزون السلاح ('+A(S.arms)+')',S.arms*6]);
 });
/* advisors' personal quests left too long */
HOOK.weekEnd.push(()=>{
 if(F('saqrquest')&&!F('saqrsaved')&&!F('saqrlost')&&S.week>=9){S.flags.saqrlost=1;S.ret.ghazi.mod-=.1;return 'لم يُعثر على صقر بن غازي. القائد يقاتل الآن بقلب مكسور (−١٠٪).'}
});
