import assert from 'node:assert/strict';
import { lessons,chapters,dictionary } from '../src/data/index.js';
import { normalize,checkFill,assessWriting,validateState,emptyState } from '../src/learning.js';
assert.equal(lessons.length,30);assert.equal(new Set(lessons.map(l=>l.id)).size,30);
assert.deepEqual(chapters.map(c=>lessons.filter(l=>l.chapter===c.id).length),[5,5,4,6,5,5]);
const problems=[];
for(const l of lessons){
 try{
  for(const key of ['title','germanTitle','intro'])assert.ok(l[key]?.length>3,`${l.id} ${key}`);
  assert.ok(l.sections.length>=3);assert.ok(l.vocab.length>=6);assert.equal(l.quiz.length,3);
  assert.ok(l.pages[0]>=5&&l.pages[1]<=100);assert.ok(l.pages[0]<=l.pages[1]);
  for(const s of l.sections){assert.ok(s.body.length>=100);assert.ok(s.example.de&&s.example.ru);}
  assert.ok(l.grammar.pattern&&l.grammar.examples.length>=2);assert.ok(l.diagram.nodes.length>=2);
  for(const q of l.quiz){assert.equal(q.options.length,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.explanation);}
  assert.ok(checkFill(l.fill.answers[0],l.fill.answers));assert.ok(!checkFill('xyzWrong',l.fill.answers));
  assert.equal(assessWriting(l.writing.model,l.writing).pass,true,`Model must pass its criteria ${l.id}`);
  assert.equal(assessWriting('xyz',l.writing).pass,false);
 }catch(e){problems.push(`${l.id}: ${e.message}`);}
}
assert.deepEqual(problems,[]);
assert.equal(normalize('  Größe! '),'groesse');
assert.equal(checkFill('ausfuehren',['ausführen']),true);
assert.equal(assessWriting('Mein Profil ist privat. Ich pflege Kontakte und schreibe Beiträge.',lessons.find(l=>l.id==='5-3').writing).pass,true);
assert.equal(assessWriting('Das Internet bietet Chancen und Risiken. Ich prüfe jede Quelle.',lessons.find(l=>l.id==='6-4').writing).pass,true);
assert.deepEqual(validateState({...emptyState(),reviews:{word:{due:123,level:2.5}}},[]).reviews,{});
assert.deepEqual(validateState({...emptyState(),quiz:{'1-1':4,'bad':4}},lessons.map(l=>l.id)).quiz,{'1-1':4});
assert.throws(()=>validateState({version:99},[]));
assert.ok(dictionary.length>=150);
console.log(JSON.stringify({lessons:lessons.length,sections:lessons.reduce((s,l)=>s+l.sections.length,0),questions:lessons.reduce((s,l)=>s+l.quiz.length+1,0),writingTasks:lessons.length,terms:dictionary.length,checks:'passed'},null,2));
