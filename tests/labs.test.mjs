import test from "node:test";
import assert from "node:assert/strict";
import {runLab} from "../scripts/lib/labs.mjs";
for(const family of ["network","swarm","energy"]){
 test(family+" lab is reproducible and bounded",()=>{const args={family,scale:60,pressure:25,noise:5,trials:30,seed:"regression"};const a=runLab(args);assert.deepEqual(a,runLab(args));assert.equal(a.results.length,30);assert.ok(a.mean>=0&&a.mean<=100);assert.ok(Number.isFinite(a.meanSecondary));assert.ok(Number.isFinite(a.meanTertiary));});
}
test("lab rejects invalid model and trial count",()=>{assert.throws(()=>runLab({family:"unknown"}));assert.throws(()=>runLab({trials:0}));});
