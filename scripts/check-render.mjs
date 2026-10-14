import assert from 'node:assert/strict';
import {createServer} from 'vite';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {lessons} from '../src/data/index.js';
import {emptyState,STORAGE_KEY} from '../src/learning.js';
const store=new Map();
globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
globalThis.window={location:{hash:'#/'},addEventListener(){},removeEventListener(){}};
const server=await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}});
try{
 const {default:App}=await server.ssrLoadModule('/src/App.jsx');
 const render=route=>{window.location.hash=`#${route}`;return renderToString(React.createElement(App));};
 assert.ok(render('/').includes('Твой немецкий.'));
 assert.equal((render('/course').match(/class="lesson-row"/g)||[]).length,30);
 assert.equal((render('/course?chapter=4').match(/class="lesson-row"/g)||[]).length,6);
 for(const l of lessons)for(let step=0;step<4;step++){
  const html=render(`/lesson/${l.id}/${step}`);
  assert.ok(html.includes(l.title.replaceAll('&','&amp;')),`Lesson must render: ${l.id}/${step}`);
  if(step===2)assert.equal((html.match(/class="quiz-card"/g)||[]).length,4);
  if(step===3)assert.ok(html.includes('id="writing"'));
 }
 for(const route of ['/dictionary','/practice','/progress','/lesson/missing/0'])assert.ok(render(route).length>3000);
 const example=emptyState();example.saved=['der computer'];example.quiz['1-1']=4;example.completed['1-1']={text:lessons[0].writing.model,date:new Date().toISOString(),score:4};
 store.set(STORAGE_KEY,JSON.stringify(example));
 assert.ok(render('/progress').replace(/<!--.*?-->/g,'').includes('1 из 30 уроков'));
 assert.ok(render('/lesson/1-1/3').includes('Ещё одна тема стала твоей.'));
 console.log('React server render: 129 routes/states passed. This is not browser visual QA.');
}finally{await server.close();}
