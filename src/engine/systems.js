/* ===== ENGINE: extra rules that plug into core ===== */
/* siege bonuses from chapter-3 preparations */
myPower.extra.push(parts=>{
 if(F('arrows'))parts.push(['عشرة آلاف سهم',20]);else if(F('halfarrows'))parts.push(['خمسة آلاف سهم',10]);
 if(F('oil'))parts.push(['قدور الزيت المغلي',25]);
});
