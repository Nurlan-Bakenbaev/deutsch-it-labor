export const STORAGE_KEY='deutsch-it-progress-v1';
export const emptyState=()=>({version:1,completed:{},saved:[],reviews:{},drafts:{},quiz:{},activity:{},lastLesson:'1-1',lastStep:0});
export const normalize=s=>String(s).toLocaleLowerCase('de').normalize('NFC').replaceAll('ß','ss').replaceAll('ä','ae').replaceAll('ö','oe').replaceAll('ü','ue').replace(/[.,!?;:„“"()]/g,'').replace(/\s+/g,' ').trim();
export const checkFill=(text,answers)=>answers.some(a=>normalize(text)===normalize(a));
export function assessWriting(text,task){
 const tokens=normalize(text).match(/[a-zà-ž]+/g)||[];
 const words=tokens.length;
 const required=task.required.map(r=>({...r,found:tokens.some(t=>[r.stem,...(r.aliases||[])].some(stem=>t.startsWith(normalize(stem))))}));
 return {words,required,enough:words>=8,pass:words>=8&&required.every(r=>r.found)};
}
export function validateState(value,ids){
 if(!value||value.version!==1||Array.isArray(value)||typeof value!=='object')throw new Error('Неизвестный формат файла прогресса.');
 const state=emptyState();
 for(const field of ['completed','drafts','quiz']) {
  if(value[field]&&typeof value[field]==='object'&&!Array.isArray(value[field]))
   for(const [id,v] of Object.entries(value[field]))if(ids.includes(id)) {
    if(field==='drafts'&&typeof v==='string') state[field][id]=v.slice(0,12000);
    if(field==='completed'&&v&&typeof v==='object'&&typeof v.text==='string')state[field][id]={text:v.text.slice(0,12000),date:String(v.date||''),score:Math.max(0,Math.min(4,Number(v.score)||0))};
    if(field==='quiz'&&Number.isInteger(v)&&v>=0&&v<=4)state[field][id]=v;
   }
 }
 if(Array.isArray(value.saved))state.saved=value.saved.filter(v=>typeof v==='string').slice(0,2000);
 if(value.reviews&&typeof value.reviews==='object')for(const [key,r]of Object.entries(value.reviews))if(r&&Number.isFinite(r.due)&&Number.isInteger(r.level))state.reviews[key]={due:r.due,level:Math.min(5,Math.max(0,r.level))};
 if(value.activity&&typeof value.activity==='object')for(const [key,v]of Object.entries(value.activity))if(/^\d{4}-\d{2}-\d{2}$/.test(key)&&Number.isFinite(v))state.activity[key]=Math.min(1000,Math.max(0,v));
 if(ids.includes(value.lastLesson))state.lastLesson=value.lastLesson;
 state.lastStep=Number.isInteger(value.lastStep)?Math.min(3,Math.max(0,value.lastStep)):0;
 return state;
}
export const localDay=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function speakGerman(text,onError=()=>{}){
 if(!('speechSynthesis'in window)){onError('Озвучивание недоступно в этом браузере.');return;}
 window.speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);u.lang='de-DE';u.rate=.86;
 const voice=window.speechSynthesis.getVoices().find(v=>v.lang.startsWith('de'));if(voice)u.voice=voice;
 u.onerror=e=>{if(e.error!=='interrupted'&&e.error!=='canceled')onError('Не удалось воспроизвести. Проверьте наличие немецкого голоса в системе.');};
 window.speechSynthesis.speak(u);
}
