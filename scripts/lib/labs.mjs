import { createRng, hashSeed, runExperiment } from "./network.mjs";
export const MODEL_VERSION="1.2.0";
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
 for(const [name,value] of [["scale",scale],["pressure",pressure],["noise",noise]])if(!Number.isFinite(value))throw new RangeError(name+" must be a finite number");
 const trialRng=index=>createRng(hashSeed([seed,family,index].join("|")));
 let results,scoreLabel,secondaryLabel,tertiaryLabel,secondary,tertiary,parameters;
 if(family==="network"){const nodes=Math.round(clamp(scale,12,120)/4)*4,degree=Math.min(Math.round(clamp(noise,1,10)),Math.floor((nodes-1)/2)),failureRate=clamp(pressure,0,80),r=runExperiment({nodes,degree,failureRate,trials,seed:[seed,family].join("|")});parameters={nodes,linkRadius:degree,failureRate};results=r.results.map(x=>({score:x.originalShare,conditionalConnectivity:x.conditionalConnectivity,survivalRate:x.survivalRate,survivors:x.survivors,largestCluster:x.largestCluster}));scoreLabel="Largest cluster / original network";secondaryLabel="Node survival rate";tertiaryLabel="Conditional connectivity";secondary=r.meanSurvivalRate;tertiary=r.meanConditionalConnectivity;}
 else if(family==="swarm"){const agents=Math.round(clamp(scale,12,120)),radius=clamp(noise,1,10),obstacles=clamp(pressure,0,80);parameters={agents,explorationBias:radius,obstacleDensity:obstacles};results=Array.from({length:trials},(_,i)=>({score:swarmTrial(agents,radius,obstacles,trialRng(i))}));scoreLabel="Explored reachable area";secondaryLabel="Agents per trial";tertiaryLabel="Obstacle density";secondary=agents;tertiary=obstacles;}
 else{const capacity=clamp(scale,12,120),recovery=clamp(noise*10,10,100),volatility=clamp(pressure,0,80),details=Array.from({length:trials},(_,i)=>energyTrial(capacity,recovery,volatility,trialRng(i)));parameters={capacity,recoveryRate:recovery,demandVolatility:volatility};results=details.map(x=>({score:x.score}));scoreLabel="Demand fully served";secondaryLabel="Mean stored reserve";tertiaryLabel="Unmet demand (units)";secondary=mean(details.map(x=>x.reserve));tertiary=mean(details.map(x=>x.unmet));}
 const scores=results.map(x=>x.score),meanQuaternary=family==="network"?mean(results.map(x=>x.largestCluster)):null;return{family,modelVersion:MODEL_VERSION,parameters,trials,scoreLabel,secondaryLabel,tertiaryLabel,mean:mean(scores),min:Math.min(...scores),max:Math.max(...scores),meanSecondary:secondary,meanTertiary:tertiary,meanQuaternary,results};
}

const median=values=>{const sorted=[...values].sort((a,b)=>a-b),m=Math.floor(sorted.length/2);return sorted.length%2?sorted[m]:(sorted[m-1]+sorted[m])/2;};
export function compareLabs({family="network",baseline={},intervention={},trials=100,seed="future-signal"}={}){
 const a=runLab({family,...baseline,trials,seed}),b=runLab({family,...intervention,trials,seed}),deltas=b.results.map((x,i)=>x.score-a.results[i].score),wins=deltas.filter(x=>x>0).length,ties=deltas.filter(x=>x===0).length,meanDelta=deltas.reduce((s,v)=>s+v,0)/deltas.length;
 return {family,modelVersion:MODEL_VERSION,trials,baselineMean:a.mean,interventionMean:b.mean,meanDelta,medianDelta:median(deltas),minDelta:Math.min(...deltas),maxDelta:Math.max(...deltas),improvedTrials:wins,tiedTrials:ties,declinedTrials:trials-wins-ties,improvedRate:wins/trials*100,baseline:a,intervention:b,deltas};
}

export function runSensitivity({family="network",parameters={},trials=100,seed="future-signal",multipliers=[0.8,0.9,1,1.1,1.2]}={}){
 if(!Array.isArray(multipliers)||multipliers.length<3||multipliers.some(x=>!Number.isFinite(x)||x<=0)||!multipliers.includes(1))throw new RangeError("multipliers must be positive finite values and include 1");
 const base={scale:parameters.scale??60,noise:parameters.noise??4,pressure:parameters.pressure??20};
 const baseline=runLab({family,...base,trials,seed});
 const bounds={scale:[12,120],noise:[1,10],pressure:[0,80]};
 const axes=["scale","noise","pressure"].map(parameter=>{
  const points=multipliers.map(multiplier=>{
   let value=clamp(base[parameter]*multiplier,...bounds[parameter]);
   if(parameter==="scale")value=family==="network"?Math.round(value/4)*4:Math.round(value);
   if(parameter==="noise"&&family==="network")value=Math.round(value);
   const scenario={...base,[parameter]:value},result=runLab({family,...scenario,trials,seed});
   return{multiplier,requestedValue:value,effectiveParameters:result.parameters,mean:result.mean,delta:result.mean-baseline.mean,min:result.min,max:result.max};
  });
  return{parameter,points};
 });
 return{family,modelVersion:MODEL_VERSION,trials,baseline:{requestedParameters:base,effectiveParameters:baseline.parameters,mean:baseline.mean,min:baseline.min,max:baseline.max},axes,method:"one-factor-at-a-time; each point changes one requested control while holding the other two at baseline; identical deterministic seed per trial index",limitations:"Sensitivity of this synthetic model only. Shared seeds aid comparison but do not establish statistical significance, causality in real systems, or real-world predictive validity."};
}
