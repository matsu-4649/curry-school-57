app.js

const stores = [
  {
    id: "coco",
    name: "CoCo壱",
    levels: [
      { label: "1辛", heat: 1 },
      { label: "2辛", heat: 2 },
      { label: "3辛", heat: 3 },
      { label: "4辛", heat: 4 },
      { label: "5辛", heat: 5 },
      { label: "6辛", heat: 6 },
      { label: "7辛", heat: 7 },
      { label: "8辛", heat: 8 },
      { label: "9辛", heat: 9 },
      { label: "10辛", heat: 10 },
    ],
  },
  {
    id: "rakkyo",
    name: "らっきょ",
    levels: [
      { label: "1", heat: 0.8 },
      { label: "2", heat: 1.5 },
      { label: "3", heat: 2.2 },
      { label: "4", heat: 2.8 },
      { label: "5", heat: 3.2 },
      { label: "6", heat: 4.1 },
      { label: "7", heat: 5.5 },
      { label: "8", heat: 6.7 },
      { label: "9", heat: 8 },
      { label: "10", heat: 9.5 },
    ],
  },
  {
    id: "okushiba",
    name: "奥芝商店",
    levels: [
      { label: "0", heat: 0.3 },
      { label: "1", heat: 1.8 },
      { label: "2", heat: 2.8 },
      { label: "3", heat: 3.25 },
      { label: "4", heat: 4.4 },
      { label: "5", heat: 6.8 },
      { label: "6", heat: 8.5 },
      { label: "7", heat: 10 },
    ],
  },
];

const storeSelect = document.querySelector("#storeSelect");
const heatSelect = document.querySelector("#heatSelect");
const sourceLabel = document.querySelector("#sourceLabel");
const sourceValue = document.querySelector("#sourceValue");
const resultList = document.querySelector("#resultList");

function getStore(storeId) {
  return stores.find((store) => store.id === storeId);
}

function formatRange(levels) {
  if (levels.length === 0) {
    return "該当なし";
  }

  if (levels.length === 1) {
    return levels[0].label;
  }

  return `${levels[0].label}〜${levels[levels.length - 1].label}`;
}

function getEquivalentLevels(targetStore, sourceHeat) {
  const tolerance = Math.max(0.55, sourceHeat * 0.18);
  let matches = targetStore.levels.filter((level) => Math.abs(level.heat - sourceHeat) <= tolerance);

  if (matches.length === 0) {
    const nearest = targetStore.levels.reduce((best, level) => {
      const bestDistance = Math.abs(best.heat - sourceHeat);
      const currentDistance = Math.abs(level.heat - sourceHeat);
      return currentDistance < bestDistance ? level : best;
    });
    matches = [nearest];
  }

  return matches;
}

function populateStores() {
  storeSelect.innerHTML = stores
    .map((store) => `<option value="${store.id}">${store.name}</option>`)
    .join("");
}

function populateHeatLevels() {
  const currentStore = getStore(storeSelect.value);
  heatSelect.innerHTML = currentStore.levels
    .map((level, index) => `<option value="${index}">${level.label}</option>`)
    .join("");

  const defaultIndex = currentStore.id === "coco" ? 2 : 0;
  heatSelect.value = String(defaultIndex);
}

function renderResults() {
  const currentStore = getStore(storeSelect.value);
  const currentLevel = currentStore.levels[Number(heatSelect.value)];
  const targetStores = stores.filter((store) => store.id !== currentStore.id);

  sourceLabel.textContent = "選択中";
  sourceValue.textContent = `${currentStore.name} ${currentLevel.label}`;

  resultList.innerHTML = targetStores
    .map((store) => {
      const equivalent = getEquivalentLevels(store, currentLevel.heat);
      return `
        <article class="result-card">
          <span class="store">${store.name}</span>
          <span class="heat">${formatRange(equivalent)}</span>
        </article>
      `;
    })
    .join("");
}

storeSelect.addEventListener("change", () => {
  populateHeatLevels();
  renderResults();
});

heatSelect.addEventListener("change", renderResults);

populateStores();
populateHeatLevels();
renderResults();
