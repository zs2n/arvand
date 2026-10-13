/* ===== DATA: weekly decrees (one per week, applied when the week is sealed) ===== */
const DEC={
 none:{n:'بلا مرسوم',d:'الأمور تجري كما هي.'},
 curfew:{n:'حظر التجوال',d:'مهمات الخفاء أنجح بعشرة بالمئة. −٣ رضا.',e:{hap:-3}},
 farmers:{n:'إعفاء الفلاحين',d:'+٦ طعام، −١٠ ذهب.',gold:-10,food:6},
 conscript:{n:'التجنيد الإجباري',d:'+٨ جنود، −٤ رضا، −٤ سكان.',e:{soldiers:8,hap:-4,pop:-4}},
 market:{n:'يوم السوق',d:'+١٠ ذهب، −٤ طعام، +٢ بنو النهر.',gold:10,food:-4,e:{river:2}},
 prayer:{n:'صلاة القمر',d:'+٤ رهبنة القمر، +١ رضا، −٥ ذهب.',need:()=>F('temple'),hint:'يتطلب بناء المعبد',gold:-5,e:{moon:4,hap:1}},
 drills:{n:'تدريبات الحامية',d:'+٤ معنويات ليوم الحصار، −٥ طعام.',food:-5,e:{morale:4}},
};
