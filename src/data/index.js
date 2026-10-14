import a from './chapters-1-2.js';
import b from './chapters-3-4.js';
import c from './chapters-5-6.js';
import lexicon from './lexicon.js';
export const chapters = [
  {id:1,title:'Мир информатики',de:'Informatik',description:'Информация, технологии и принцип EVA',icon:'Braces',color:'#e6edd6'},
  {id:2,title:'Внутри компьютера',de:'Computer',description:'От первых машин до аппаратного и программного обеспечения',icon:'Monitor',color:'#e4e9f6'},
  {id:3,title:'Архитектура и сети',de:'Grundarchitekturen',description:'Как устроены вычисления, языки и соединения',icon:'Network',color:'#f5e7d9'},
  {id:4,title:'Как работает интернет',de:'Internet',description:'История, протоколы, веб и браузеры',icon:'Globe',color:'#dfede9'},
  {id:5,title:'Поиск и социальные сети',de:'Suchmaschinen · Soziale Netzwerke',description:'Поисковые системы, Google и цифровое общение',icon:'Search',color:'#eee3ef'},
  {id:6,title:'Будущее технологий',de:'Zukunft der IT',description:'Облака, искусственный интеллект и безопасность',icon:'Sparkles',color:'#f1eccd'},
];
export const lessons = [...a,...b,...c];
const map = new Map();
for(const w of [...lexicon,...lessons.flatMap(l=>l.vocab.map(v=>({...v,definition:v.ru,example:l.sections[0]?.example?.de||'',lessonId:l.id})))]) {
 const key=w.de.toLocaleLowerCase('de').trim();
 if(!map.has(key)) map.set(key,{...w,key});
}
export const dictionary=[...map.values()].sort((a,b)=>a.de.localeCompare(b.de,'de'));
export const source={title:'Немецкий язык для IT-студентов',author:'С. В. Платонова (составитель)',year:2017,pages:116,publisher:'ФЛИНТА · Издательство Уральского университета'};
