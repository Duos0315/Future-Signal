const $ = (id) => document.getElementById(id);
const fallbackSignal = {
  date: new Date().toISOString().slice(0,10),
  id: "FS-BOOT",
  domain: "SYSTEMS + ECOLOGY",
  title: "What if a city could behave like a forest?",
  hook: "A network of buildings, batteries and sensors borrows one trick from living ecosystems: local decisions, shared resilience.",
  experiment: "Model a neighborhood as small energy nodes. Give each node a local reserve and allow surplus energy to move only to nearby neighbors. Then introduce random outages and compare the network with a single central source.",
  variables: ["local storage", "neighbor radius", "outage probability"],
  question: "Does a decentralized network recover faster when its most connected node fails?",
  caveat: "Conceptual experiment. Real grids require detailed electrical, economic and safety modelling."
};
let currentSignal = fallbackSignal;
let runs = 0;

function renderSignal(signal) {
  currentSignal = signal || fallbackSignal;
  $("signal-date").textContent = currentSignal.date || "LATEST SIGNAL";
  $("daily-signal").querySelector(".tag").textContent = currentSignal.domain || "DAILY SIGNAL";
  $("daily-signal").querySelector(".mono").textContent = "SIGNAL // " + (currentSignal.id || "FS-001");
  $("daily-signal").querySelector("h3").textContent = currentSignal.title;
  $("daily-signal").querySelector(".signal-copy p").textContent = currentSignal.hook;
  document.title = currentSignal.title + " — FUTURE//SIGNAL";
}

async function loadArchive() {
  try {
    const response = await fetch("data/archive/index.json", {cache:"no-store"});
    if (!response.ok) return;
    const archive = await response.json();
    const items = (archive.items || []).filter(item => item.date !== currentSignal.date).slice(0,8);
    $("archive-count").textContent = (items.length + 1) + " SIGNALS";
    if (!items.length) return;
    $("archive-list").innerHTML = items.map(item =>
      '<article class="archive-item"><span class="archive-date">' + escapeHtml(item.date) + '</span><span class="archive-title">' + escapeHtml(item.title) + '</span><span class="archive-domain">' + escapeHtml(item.domain || "EXPERIMENT") + '</span></article>'
    ).join("");
  } catch (_) { /* The site remains useful when archive data is unavailable. */ }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}

async function loadDaily() {
  try {
    const response = await fetch("data/daily.json", {cache:"no-store"});
    if (response.ok) renderSignal(await response.json());
  } catch (_) { /* Keep the built-in starter signal. */ }
  await loadArchive();
}

function simulate() {
  const efficiency = Number($("efficiency").value);
  const noise = Number($("noise").value);
  const nodes = Number($("scale").value);
  const connectivity = Math.min(100, 18 + Math.sqrt(nodes) * 8.2);
  const resilience = Math.max(0, Math.min(100, efficiency * .55 + connectivity * .34 - noise * .42 + (100-noise) * .11));
  const score = resilience.toFixed(1);
  runs++;
  $("result-score").innerHTML = score + "<span>/100</span>";
  $("result-meter").style.width = score + "%";
  $("run-status").textContent = "SIMULATION COMPLETE";
  $("run-count").textContent = "RUNS: " + runs;
  let insight = resilience >= 75 ? "In this toy model, efficient nodes and manageable noise create a resilient network. Try raising noise until the system starts to buckle." :
    resilience >= 45 ? "The network is in a fragile middle zone. Improve efficiency or reduce noise, then compare how much each change matters." :
    "The model is under stress. Try adding efficiency first, then increase network size. More nodes do not automatically mean more resilience.";
  $("result-explanation").textContent = insight + " This score is an illustrative index, not a measured property of a real system.";
}

["efficiency","noise","scale"].forEach(id => $(id).addEventListener("input", () => {
  $(id + "-value").textContent = $(""+id).value + (id === "scale" ? " nodes" : "%");
}));
$("run-sim").addEventListener("click", simulate);
$("share-signal").addEventListener("click", async () => {
  const text = currentSignal.title + " — " + currentSignal.hook + " Explore FUTURE//SIGNAL: " + location.href;
  try {
    await navigator.clipboard.writeText(text);
    $("share-signal").textContent = "Copied ✓";
  } catch (_) { $("share-signal").textContent = "Copy unavailable"; }
});
function tickClock() { $("local-clock").textContent = "LOCAL TIME — " + new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",second:"2-digit"}); }
tickClock(); setInterval(tickClock, 1000);
simulate();
loadDaily();