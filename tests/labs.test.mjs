import test from "node:test";
import assert from "node:assert/strict";
import {runLab,compareLabs} from "../scripts/lib/labs.mjs";
for(const family of ["network","swarm","energy"]){
 test(family+" lab is reproducible and bounded",()=>{const args={family,scale:60,pressure:25,noise:5,trials:30,seed:"regression"};const a=runLab(args);assert.deepEqual(a,runLab(args));assert.equal(a.results.length,30);assert.ok(a.mean>=0&&a.mean<=100);assert.ok(Number.isFinite(a.meanSecondary));assert.ok(Number.isFinite(a.meanTertiary));});
}
test("lab rejects invalid model and trial count",()=>{assert.throws(()=>runLab({family:"unknown"}));assert.throws(()=>runLab({trials:0}));});

test("paired scenario comparison is reproducible and accounts for every trial",()=>{const args={family:"energy",baseline:{scale:60,noise:6,pressure:25},intervention:{scale:90,noise:8,pressure:15},trials:40,seed:"paired-test"};const a=compareLabs(args),b=compareLabs(args);assert.deepEqual(a,b);assert.equal(a.deltas.length,40);assert.equal(a.improvedTrials+a.tiedTrials+a.declinedTrials,40);assert.ok(Number.isFinite(a.meanDelta));assert.equal(a.baselineMean,a.baseline.mean);assert.equal(a.interventionMean,a.intervention.mean);});

for(const family of ["network","swarm","energy"]){
 test(family+" comparison pairs identical configurations trial by trial",()=>{const settings={scale:60,noise:5,pressure:25},r=compareLabs({family,baseline:settings,intervention:settings,trials:25,seed:"paired-identical"});assert.equal(r.meanDelta,0);assert.equal(r.improvedTrials,0);assert.equal(r.tiedTrials,25);assert.equal(r.declinedTrials,0);assert.ok(r.deltas.every(x=>x===0));});
}
