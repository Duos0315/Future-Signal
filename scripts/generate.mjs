import { mkdir, readFile, writeFile } from "node:fs/promises";
const today=new Date().toISOString().slice(0,10);
const seed=Number(today.replaceAll("-",""));
function pick(items,offset=0){return items[(Math.floor(seed/(offset+1))+offset*17)%items.length];}
const domains=[
{name:"BIOLOGY + COMPUTING",a:"mycelium networks",b:"distributed computers",verb:"route information",question:"Can local rules create robust global coordination?"},
{name:"MATERIALS + ENERGY",a:"phase-change materials",b:"passive cooling",verb:"store and release heat",question:"Can a building stay comfortable with less active cooling?"},
{name:"ROBOTICS + ECOLOGY",a:"swarm robotics",b:"ant foraging",verb:"coordinate movement",question:"How little communication does a useful swarm need?"},
{name:"OCEANS + SENSORS",a:"ocean currents",b:"low-power sensors",verb:"map hidden patterns",question:"Can sparse measurements reveal a moving system?"},
{name:"SPACE + AGRICULTURE",a:"closed-loop habitats",b:"vertical farming",verb:"recycle scarce resources",question:"Which resource becomes the first bottleneck in a sealed habitat?"},
{name:"NETWORKS + PHYSICS",a:"percolation theory",b:"resilient networks",verb:"survive random failures",question:"When does a connected system stop being connected?"},
{name:"NEUROSCIENCE + SOFTWARE",a:"neural plasticity",b:"adaptive software",verb:"adapt to changing signals",question:"Can a system learn useful behavior from local feedback alone?"},
{name:"GEOMETRY + ARCHITECTURE",a:"minimal surfaces",b:"lightweight structures",verb:"distribute mechanical stress",question:"Which geometry gives the best strength-to-material trade-off?"},
{name:"AGRICULTURE + WATER",a:"root systems",b:"distributed irrigation",verb:"allocate scarce water",question:"Can local sensing reduce water waste without central control?"},
{name:"ASTRONOMY + COMPUTING",a:"event detection",b:"distributed telescopes",verb:"combine sparse observations",question:"How much can coordinated small instruments infer together?"}
];
const templates=[
{title:"What if {a} could think like {b}?",hook:"Borrow one mechanism from {a} and apply it to {b}. The interesting behavior may emerge from the rules, not the components.",experiment:"Build a toy model where agents observe only nearby states. Let them {verb}, then remove a random fraction of connections and compare recovery. Record the assumptions before interpreting the result.",variables:["local rules","connection density","failure rate"],caveat:"Conceptual model only. It does not establish real-world feasibility or performance."},
{title:"The hidden limit of {a}",hook:"Every system has a bottleneck. This experiment searches for the point where a small change causes a surprisingly large effect.",experiment:"Vary one resource at a time in a simplified model of {a}. Track throughput, waste and recovery as the system approaches its limit. Repeat with different starting conditions.",variables:["resource budget","demand","recovery time"],caveat:"Illustrative model; real systems need measured parameters and domain validation."},
{title:"Can {b} survive without a central brain?",hook:"What happens when coordination is pushed to the edges and no single component has the full picture?",experiment:"Give each agent a small rule set and local information. Let the group {verb}, then compare centralized and decentralized outcomes under identical disturbances.",variables:["agent count","local visibility","message delay"],caveat:"A simulation prompt, not evidence that a real deployment would work."},
{title:"A tiny experiment in {a}",hook:"A cross-disciplinary question: can a mechanism from one field reveal a useful design principle in another?",experiment:"Represent the system with a small set of interacting parts. Change {v1} while holding the other variables fixed; then repeat with {v2}. Compare outcomes across at least 100 deterministic trials.",variables:["{v1}","{v2}","disturbance level"],caveat:"The result depends on chosen assumptions. It is a hypothesis generator, not a scientific finding."}
];
const domain=pick(domains,3),template=pick(templates,11);
const fill=s=>s.replaceAll("{a}",domain.a).replaceAll("{b}",domain.b).replaceAll("{verb}",domain.verb).replaceAll("{v1}",domain.a+" budget").replaceAll("{v2}",domain.b+" density");
const signal={date:today,id:"FS-"+today.replaceAll("-",""),domain:domain.name,title:fill(template.title),hook:fill(template.hook),experiment:fill(template.experiment),variables:template.variables.map(fill),question:domain.question,caveat:template.caveat,generated_by:"FUTURE//SIGNAL deterministic generator",model:"rules-v2"};
if(!signal.title||!signal.experiment||!signal.question||!Array.isArray(signal.variables)||signal.variables.length<2)throw new Error("Generated signal failed validation");
await mkdir("data/archive",{recursive:true});
await writeFile("data/daily.json",JSON.stringify(signal,null,2)+"\n");
let archive={updated:today,items:[]};try{archive=JSON.parse(await readFile("data/archive/index.json","utf8"));}catch{}
const items=Array.isArray(archive.items)?archive.items:[];
archive.items=[{...signal},...items.filter(x=>x.date!==today)].slice(0,365);
archive.updated=today;
await writeFile("data/archive/index.json",JSON.stringify(archive,null,2)+"\n");
console.log("Generated "+signal.id+": "+signal.title+" | archive: "+archive.items.length);
