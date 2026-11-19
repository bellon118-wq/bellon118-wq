import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source=readFileSync(new URL("../assets/js/youthspark-ai-gateway.js",import.meta.url),"utf8");
let runtime={schemaVersion:"1.0.0",enabled:false,endpoint:null,provider:"none",modelLabel:"Not connected",requireExplicitConsent:true};
let apiCalls=0;
const context={
  window:{},location:{origin:"https://mayflower.test"},URL,AbortController,
  setTimeout,clearTimeout,
  document:{currentScript:{src:"https://mayflower.test/assets/js/youthspark-ai-gateway.js"}},
  fetch:async url=>{
    if(String(url).includes("youthspark-ai-runtime.json"))return{ok:true,json:async()=>runtime};
    apiCalls++;
    return{ok:true,json:async()=>({schemaVersion:"1.0.0",reply:"Hello from the test gateway.",usedMemoryIds:["mem-1"]})};
  }
};
vm.runInNewContext(source,context);
const gateway=context.window.MayflowerYouthSparkGateway;
let state=await gateway.load();
assert.equal(state.enabled,false);
await assert.rejects(()=>gateway.send({message:"Hello",consent:true}),/not configured/);
assert.equal(apiCalls,0);
const built=gateway.buildRequest({message:"  "+("x".repeat(1300)),locale:"ko",tone:"bright",character:{name:"YouthSpark",role:"Muse",personality:"Gentle",values:["Hope"]},memoryRecords:[{id:"1",status:"retained",category:"core",title:"A",content:"B"},{id:"2",status:"candidate",category:"episodic",title:"C",content:"D"},{id:"3",status:"retained",category:"symbolic",title:"E",content:"F"},{id:"4",status:"retained",category:"relationship",title:"G",content:"H"}]});
assert.equal(built.message.length,1200);
assert.equal(built.memoryContext.length,2);
assert.equal(built.memoryContext.some(x=>x.id==="2"),false);
runtime={...runtime,enabled:true,endpoint:"/api/youthspark/chat",provider:"approved",modelLabel:"Test provider"};
await gateway.load();
await assert.rejects(()=>gateway.send({message:"Hello",consent:false}),/consent/);
const result=await gateway.send({message:"Hello",locale:"en",tone:"gentle",character:{name:"YouthSpark"},memoryRecords:[],consent:true});
assert.equal(result.reply,"Hello from the test gateway.");
assert.equal(apiCalls,1);
runtime={...runtime,endpoint:"https://external.example/chat"};
await gateway.load();
await assert.rejects(()=>gateway.send({message:"Hello",consent:true}),/same-origin/);
assert.equal(apiCalls,1);
console.log("YouthSpark AI gateway tests passed: disabled default, consent gate, payload limits, retained-only memory cap, same-origin enforcement and response contract.");
