export function hashSeed(value){let h=2166136261;for(const char of String(value)){h^=char.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function createRng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
export function runTrial({nodes,degree,failureRate},random){
 if(!Number.isInteger(nodes)||nodes<2||nodes>500)throw new RangeError("nodes must be an integer from 2 to 500");
 if(!Number.isInteger(degree)||degree<1||degree>Math.floor((nodes-1)/2))throw new RangeError("degree must be from 1 to floor((nodes-1)/2)");
 if(!Number.isFinite(failureRate)||failureRate<0||failureRate>100)throw new RangeError("failureRate must be between 0 and 100");
 const alive=Array.from({length:nodes},()=>random()*100>=failureRate),seen=new Uint8Array(nodes);
 let largest=0,survivors=0;for(const state of alive)if(state)survivors++;
 for(let start=0;start<nodes;start++){if(!alive[start]||seen[start])continue;const stack=[start];seen[start]=1;let size=0;while(stack.length){const v=stack.pop();size++;for(let step=1;step<=degree;step++){const left=(v-step+nodes)%nodes,right=(v+step)%nodes;for(const next of [left,right])if(alive[next]&&!seen[next]){seen[next]=1;stack.push(next);}}}largest=Math.max(largest,size);}
 return {connectivity:survivors?largest/survivors*100:0,survivors,largestCluster:largest};
}
export function runExperiment({nodes,degree,failureRate,trials=100,seed="future-signal"}){
 if(!Number.isInteger(trials)||trials<1||trials>10000)throw new RangeError("trials must be an integer from 1 to 10000");
 const random=createRng(hashSeed(String(seed)));
 const results=Array.from({length:trials},()=>runTrial({nodes,degree,failureRate},random));
 const values=results.map(x=>x.connectivity),mean=values.reduce((a,b)=>a+b,0)/values.length;
 const meanSurvivors=results.reduce((sum,x)=>sum+x.survivors,0)/results.length;
 const meanLargest=results.reduce((sum,x)=>sum+x.largestCluster,0)/results.length;
 const meanOriginalShare=meanLargest/nodes*100;
 return {trials,mean,min:Math.min(...values),max:Math.max(...values),meanSurvivors,meanLargest,meanOriginalShare,results};
}
