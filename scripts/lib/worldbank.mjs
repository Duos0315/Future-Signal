export const WORLD_BANK_API="https://api.worldbank.org/v2";
export const WORLD_BANK_SOURCE_ID=2;
export const INDICATOR_CATALOG=[
 {code:"SP.POP.TOTL",name:"Population, total",unit:"people",description:"Total population"},
 {code:"EG.ELC.ACCS.ZS",name:"Access to electricity",unit:"% of population",description:"Share of population with access to electricity"},
 {code:"EG.USE.ELEC.KH.PC",name:"Electric power consumption",unit:"kWh per capita",description:"Electric power consumption per person"},
 {code:"EN.ATM.CO2E.PC",name:"CO2 emissions",unit:"metric tons per capita",description:"Carbon dioxide emissions per person"},
 {code:"NY.GDP.MKTP.CD",name:"GDP (current US$)",unit:"current US$",description:"Gross domestic product at current prices"},
 {code:"NY.GDP.MKTP.KD.ZG",name:"GDP growth",unit:"annual %",description:"Annual GDP growth rate"},
 {code:"FP.CPI.TOTL.ZG",name:"Inflation, consumer prices",unit:"annual %",description:"Annual consumer price inflation"}
];
const countryPattern=/^[A-Z0-9]{3}$/;
const indicatorPattern=/^[A-Z0-9]{2}(?:\.[A-Z0-9]+)+$/;
function validYear(value,name){if(!Number.isInteger(value)||value<1960||value>2100)throw new RangeError(name+" must be an integer from 1960 to 2100");}
export function buildWorldBankUrl({country="PAK",indicator="SP.POP.TOTL",startYear=2000,endYear=new Date().getUTCFullYear()}={}){
 const code=String(country).trim().toUpperCase(),series=String(indicator).trim().toUpperCase();
 if(!countryPattern.test(code))throw new TypeError("country must be a three-character ISO code");
 if(!indicatorPattern.test(series))throw new TypeError("indicator code is invalid");
 validYear(startYear,"startYear");validYear(endYear,"endYear");
 if(startYear>endYear)throw new RangeError("startYear must not be later than endYear");
 const url=new URL(WORLD_BANK_API+"/country/"+encodeURIComponent(code)+"/indicator/"+encodeURIComponent(series));
 url.searchParams.set("format","json");url.searchParams.set("date",startYear+":"+endYear);url.searchParams.set("per_page","1000");url.searchParams.set("source",String(WORLD_BANK_SOURCE_ID));
 return url.href;
}
export async function fetchWorldBankIndicator({country="PAK",indicator="SP.POP.TOTL",startYear=2000,endYear=new Date().getUTCFullYear(),fetchImpl=globalThis.fetch,signal}={}){
 if(typeof fetchImpl!=="function")throw new TypeError("A Fetch-compatible function is required");
 const url=buildWorldBankUrl({country,indicator,startYear,endYear});
 const response=await fetchImpl(url,{headers:{Accept:"application/json"},signal});
 if(!response||response.ok!==true)throw new Error("World Bank request failed"+(response?.status?" (HTTP "+response.status+")":""));
 let payload;try{payload=await response.json();}catch{throw new Error("World Bank returned invalid JSON");}
 if(!Array.isArray(payload)||!payload[0]||!Array.isArray(payload[1]))throw new Error(payload?.[0]?.message?.[0]?.value||"World Bank response did not contain an indicator series");
 const rows=payload[1],first=rows.find(x=>x&&x.indicator&&x.country);
 if(!first)throw new Error("No observations were returned for this country and indicator");
 const catalog=INDICATOR_CATALOG.find(x=>x.code===indicator);
 const observations=rows.filter(x=>x&&/^\d{4}$/.test(String(x.date))).map(x=>({year:Number(x.date),value:x.value===null?null:Number(x.value),unit:x.unit||catalog?.unit||"",observationStatus:x.obs_status||null,footnote:x.note||null})).filter(x=>x.value===null||Number.isFinite(x.value)).sort((a,b)=>a.year-b.year);
 const valid=observations.filter(x=>x.value!==null);
 return{
  provider:"The World Bank",
  dataset:"World Development Indicators",
  sourceId:WORLD_BANK_SOURCE_ID,
  country:{code:String(first.country.id||country).toUpperCase(),name:first.country.value||country},
  indicator:{code:indicator,name:first.indicator.value||catalog?.name||indicator,unit:catalog?.unit||first.unit||""},
  requestedPeriod:{startYear,endYear},
  retrievedAt:new Date().toISOString(),
  sourceUrl:url,
  apiMetadata:{page:payload[0].page??null,pages:payload[0].pages??null,total:payload[0].total??null},
  coverage:{returned:observations.length,withValues:valid.length,missing:observations.length-valid.length,firstYear:observations[0]?.year??null,lastYear:observations.at(-1)?.year??null},
  latestAvailable:valid.at(-1)||null,
  observations
 };
}
