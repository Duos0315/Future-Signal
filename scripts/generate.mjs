import { mkdir, readFile, writeFile } from "node:fs/promises";

const today = new Date().toISOString().slice(0, 10);
const seed = Number(today.replaceAll("-", ""));
const pick = (items, offset = 0) => items[(Math.floor(seed / (offset + 1)) + offset * 17) % items.length];

const domains = [
  {name:"BIOLOGY + COMPUTING", a:"mycelium networks", b:"distributed computers", verb:"route information", question:"Can local rules create robust global coordination?"},
  {name:"MATERIALS + ENERGY", a:"phase-change materials", b:"passive cooling", verb:"store and release heat", question:"Can a building stay comfortable with less active cooling?"},
  {name:"ROBOTICS + ECOLOGY", a:"swarm robotics", b:"ant foraging", verb:"coordinate movement", question:"How little communication does a useful swarm need?"},
  {name:"OCEANS + SENSORS", a:"ocean currents", b:"low-power sensors", verb:"map hidden patterns", question:"Can sparse measurements reveal a moving system?"},
  {name:"SPACE + AGRICULTURE", a:"closed-loop habitats", b:"vertical farming", verb:"recycle scarce resources", question:"Which resource becomes the first bottleneck in a sealed habitat?"},
  {name:"NETWORKS + PHYSICS", a:"percolation theory", b:"resilient networks", verb:"survive random failures", question:"When does a connected system stop being connected?"}
];
const formats = [
  {title:"What if {a} could think like {b}?", hook:"Borrow one mechanism from {a} and apply it to {b}. The surprising part may emerge from the rules, not the components.", experiment:"Build a small model where agents can only observe nearby states. Let them {verb}, then remove a random fraction of connections and compare recovery.", vars:["local rules","connection density","failure rate"], caveat:"A conceptual model only. It does not establish real-world feasibility."},
  {title:"The hidden limit of {a}", hook:"Every system has a bottleneck. This experiment searches for the point where a small change causes a surprisingly large effect.", experiment:"Vary one resource at a time in a toy model of {a}. Track throughput, waste and recovery as the system approaches its limit.", vars:["resource budget","demand","recovery time"], caveat:"The model is illustrative; real systems need measured parameters and domain validation."},
  {title:"Can {b} survive without a central brain?", hook:"What happens when coordination is pushed to the edges and no single component has the full picture?", experiment:"Give each agent a tiny rule set and local information. Let the group {verb}, then compare centralized and decentralized outcomes.", vars:["agent count","local visibility","message delay"], caveat:"This is a simplified simulation prompt, not evidence that a real deployment would work."}
];
const domain = pick(domains, 3);
const format = pick(formats, 11);
const fill = (s) => s.replaceAll("{a}", domain.a).replaceAll("{b}", domain.b).replaceAll("{verb}", domain.verb);
const signal = {
  date: today,
  id: "FS-" + today.replaceAll("-", ""),
  domain: domain.name,
  title: fill(format.title),
  hook: fill(format.hook),
  experiment: fill(format.experiment),
  variables: format.vars,
  question: domain.question,
  caveat: format.caveat,
  generated_by: "FUTURE//SIGNAL deterministic generator",
  model: "rule-based-v1"
};

await mkdir("data/archive", {recursive:true});
await writeFile("data/daily.json", JSON.stringify(signal, null, 2) + "\n");
let archive = {updated:today, items:[]};
try { archive = JSON.parse(await readFile("data/archive/index.json", "utf8")); } catch {}
archive.items = [ {date:today,id:signal.id,domain:signal.domain,title:signal.title}, ...(archive.items || []).filter(x => x.date !== today) ].slice(0,90);
archive.updated = today;
await writeFile("data/archive/index.json", JSON.stringify(archive, null, 2) + "\n");
console.log("Generated " + signal.id + ": " + signal.title);