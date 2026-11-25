import { INDICATOR_CATALOG, fetchWorldBankIndicator } from "./scripts/lib/worldbank.mjs";
const $=id=>document.getElementById(id);
const countries=[["PAK","Pakistan"],["IND","India"],["BGD","Bangladesh"],["LKA","Sri Lanka"],["NPL","Nepal"],["AFG","Afghanistan"],["WLD","World"],["USA","United States"],["GBR","United Kingdom"],["CHN","China"]];
let activeController=null,currentRecord=null;
function option(value,label){const node=document.createElement("option");node.value=value;node.textContent=label;return node;}
function download(name,type,content){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
function csvCell(value){const text=String(value??"");return '"'+text.replace(/"/g,'""')+'"';}
function renderRecord(record){
 const summary=$("data-summary"),table=$("data-table");summary.replaceChildren();table.replaceChildren();
 const heading=document.createElement("h3");heading.textContent=record.country.name+" · "+record.indicator.name;summary.append(heading);
 const detail=document.createElement("p");detail.textContent=record.coverage.withValues+" observations with values · "+record.coverage.missing+" missing · "+record.indicator.unit+" · Retrieved "+new Date(record.retrievedAt).toLocaleString();summary.append(detail);
 const source=document.createElement("a");source.href=record.sourceUrl;source.target="_blank";source.rel="noreferrer";source.textContent="Open original World Bank API response ↗";summary.append(source);
 const thead=document.createElement("thead"),headRow=document.createElement("tr");
 for(const label of ["Year","Value","Observation status","Footnote"]){const th=document.createElement("th");th.scope="col";th.textContent=label;headRow.append(th);}thead.append(headRow);table.append(thead);
 const tbody=document.createElement("tbody");
 for(const row of [...record.observations].reverse()){
  const tr=document.createElement("tr");
  for(const value of [row.year,row.value===null?"Missing":new Intl.NumberFormat(undefined,{maximumFractionDigits:3}).format(row.value),row.observationStatus||"—",row.footnote||"—"]){const td=document.createElement("td");td.textContent=String(value);tr.append(td);}
  tbody.append(tr);
 }
 table.append(tbody);
 $("data-results").hidden=false;$("export-data-json").disabled=false;$("export-data-csv").disabled=false;
}
async function loadData(){
 if(activeController)activeController.abort();
 const controller=new AbortController();activeController=controller;const country=$("data-country").value,indicator=$("data-indicator").value,startYear=Number($("data-start-year").value),endYear=Number($("data-end-year").value);
 $("data-status").textContent="Retrieving the public series…";$("load-worldbank-data").disabled=true;$("export-data-json").disabled=true;$("export-data-csv").disabled=true;$("data-results").hidden=true;currentRecord=null;
 try{
  const record=await fetchWorldBankIndicator({country,indicator,startYear,endYear,signal:controller.signal});
  currentRecord=record;renderRecord(record);
  $("data-status").textContent="Source retrieved. Check the source, coverage and missing values before interpreting the series.";
 }catch(error){
  if(error.name==="AbortError")return;
  $("data-status").textContent="Data unavailable: "+(error.message||"The source could not be reached.")+" Try again later or open the source documentation.";
 }finally{if(activeController===controller)$("load-worldbank-data").disabled=false;}
}
function init(){
 if(!$("data-explorer"))return;
 for(const [code,name] of countries)$("data-country").append(option(code,name+" ("+code+")"));
 for(const item of INDICATOR_CATALOG)$("data-indicator").append(option(item.code,item.name+" — "+item.unit));
 $("data-country").value="PAK";$("data-indicator").value="SP.POP.TOTL";
 const year=new Date().getUTCFullYear();$("data-end-year").value=String(year);$("data-start-year").value=String(Math.max(1960,year-20));
 $("load-worldbank-data").addEventListener("click",loadData);
 $("export-data-json").addEventListener("click",()=>{if(!currentRecord)return;download("future-signal-world-bank-"+currentRecord.country.code+"-"+currentRecord.indicator.code+".json","application/json",JSON.stringify({product:"FUTURE//SIGNAL",schemaVersion:1,...currentRecord},null,2));});
 $("export-data-csv").addEventListener("click",()=>{if(!currentRecord)return;const rows=[["year","value","unit","observation_status","footnote"],...currentRecord.observations.map(x=>[x.year,x.value,currentRecord.indicator.unit,x.observationStatus,x.footnote])];download("future-signal-world-bank-"+currentRecord.country.code+"-"+currentRecord.indicator.code+".csv","text/csv;charset=utf-8",rows.map(row=>row.map(csvCell).join(",")).join("\n"));});
}
init();
