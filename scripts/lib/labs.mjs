import { createRng, runExperiment } from "./network.mjs";
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const mean=a=>a.reduce((s,v)=>s+v,0)/Math.max(1,a.length);
function swarmTrial(agents,radius,obstacles,rng){
 const side=24,total=side*side,blocked=new Uint8Array(total),visited=new Uint8Array(total);
 for(let i=0;i<total;i++)blocked[i]=rng()*100<obstacles?1:0;
 const free=total-blocked.reduce((s,v)=>s+v,0),positions=[];
 for(let a=0;a<agents;a++){let p=Math.floor(rng()*total),guard=0;while(blocked[p]&&guard++<total)p=(p+1)%total;positions.push(p);if(!blocked[p])visited[p]=1;}
 for(let t=0;t<90;t++)for(let a=0;a<agents;a++){const p=positions[a],x=p%side,y=Math.floor(p/side),moves=[];if(x>0)moves.push(p-1);if(x<side-1)moves.push(p+1);if(y>0)moves.push(p-side);if(y<side-1)moves.push(p+side);const valid=moves.filter(n=>!blocked[n]);if(!valid.length)continue;const fresh=valid.filter(n=>!visited[n]),pool=fresh.length&&rng()<Math.min(.9,.2+radius/18)?fresh:valid,next=pool[Math.floor(rng()*pool.length)];positions[a]=next;visited[next]=1;}
 let explored=0;for(let i=0;i<total;i++)if(visited[i]&&!blocked[i])explored++;return free?explored/free*100:0;
}
function energyTrial(capacity,recovery,volatility,rng){
 let stored=capacity*.55,served=0,reserve=0,unmet=0;const base=capacity*.075;
 for(let t=0;t<120;t++){const generation=base*(.75+recovery/100)*(.55+rng()*.9),demand=base*(.85+volatility/100*(rng()*1.5));stored=clamp(stored+generation,0,capacity);const supplied=Math.min(stored,demand);stored-=supplied;if(supplied>=demand*.999)served++;else unmet+=demand-supplied;reserve+=stored/capacity*100;}
 return{score:served/120*100,reserve:reserve/120,unmet};
}
export function runLab({family="network",scale=60,pressure=20,noise=4,trials=100,seed="future-signal"}={}){
 if(!["network","swarm","energy"].includes(family))throw new RangeError("Unknown experiment family");
 if(!Number.isInteger(trials)||trials<1||trials>10000)throw new RangeError("trials must be an integer from 1 to 10000");
 const rng=createRng((()=>{let h=2166136261;for(const c of [seed,family,scale,pressure,noise].join("|")){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;})());
 let results,scoreLabel,secondaryLabel,tertiaryLabel,secondary,tertiary;
 if(family==="network"){const nodes=Math.round(clamp(scale,12,120)/4)*4,degree=Math.round(clamp(noise,1,10)),r=runExperiment({nodes,degree,failureRate:clamp(pressure,0,80),trials,seed:[seed,family].join("|")});results=r.results.map(x=>({score:x.connectivity}));scoreLabel="Largest cluster / survivors";secondaryLabel="Mean surviving nodes";tertiaryLabel="Mean largest cluster";secondary=r.meanSurvivors;tertiary=r.meanLargest;}
 else if(family==="swarm"){const agents=Math.round(clamp(scale,12,120)),radius=clamp(noise,1,10),obstacles=clamp(pressure,0,80);results=Array.from({length:trials},()=>({score:swarmTrial(agents,radius,obstacles,rng)}));scoreLabel="Explored reachable area";secondaryLabel="Agents per trial";tertiaryLabel="Obstacle density";secondary=agents;tertiary=obstacles;}
 else{const capacity=clamp(scale,12,120),recovery=clamp(noise*10,10,100),volatility=clamp(pressure,0,80),details=Array.from({length:trials},()=>energyTrial(capacity,recovery,volatility,rng));results=details.map(x=>({score:x.score}));scoreLabel="Demand fully served";secondaryLabel="Mean stored reserve";tertiaryLabel="Unmet demand (units)";secondary=mean(details.map(x=>x.reserve));tertiary=mean(details.map(x=>x.unmet));}
 const scores=results.map(x=>x.score);return{family,trials,scoreLabel,secondaryLabel,tertiaryLabel,mean:mean(scores),min:Math.min(...scores),max:Math.max(...scores),meanSecondary:secondary,meanTertiary:tertiary,results};
}
