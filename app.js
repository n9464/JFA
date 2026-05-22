const TZ = "America/Edmonton";

const locations = {
  maurice: "École Maurice-Lavallée",
  joseph: "École Joseph-Moreau",
  michaelle: "École Michaëlle-Jean",
  claudette: "École Claudette-et-Denis-Tardif",
  gabrielle: "École Gabrielle-Roy",
  competition: "Lieux des compétitions"
};

const schedule = [
  day("2026-05-22", "Vendredi 22 mai", "Ven", [
    item("16:00", "19:30", "Arrivée et accréditation", locations.maurice),
    item("16:30", "19:30", "Souper et temps libre", locations.maurice),
    item("19:30", "20:00", "Préparation pour la cérémonie d’ouverture", locations.maurice),
    item("20:00", "21:30", "Cérémonie et spectacle d’ouverture", locations.maurice),
    item("21:30", "22:30", "Douches et collations", locations.maurice),
    item("21:30", "22:00", "Rencontre des chefs de mission", locations.maurice),
    item("22:30", "22:45", "Couvre-feu", locations.maurice)
  ]),
  day("2026-05-23", "Samedi 23 mai", "Sam", [
    item("06:30", "06:45", "Réveil", locations.maurice),
    item("06:30", "08:00", "Déjeuner", locations.maurice),
    item("07:30", "08:00", "Départ pour les compétitions", locations.maurice),
    item("08:00", "12:00", "Compétitions: badminton, basketball 3x3, kinball cadet, kinball junior, soccer 5x5, volleyball cadet, volleyball junior", locations.competition),
    item("12:00", "13:00", "Dîner", locations.competition),
    item("13:00", "17:00", "Compétitions: badminton, basketball 3x3, kinball cadet, kinball junior, soccer 5x5, volleyball cadet, volleyball junior", locations.competition),
    item("16:00", "17:00", "Retour des compétitions", locations.maurice),
    item("16:30", "19:00", "Souper", locations.maurice),
    item("19:00", "20:00", "Temps libre", locations.maurice),
    item("20:00", "22:00", 'Soirée "Par et Pour les jeunes"', locations.maurice),
    item("22:00", "23:00", "Douches et collations", locations.maurice),
    item("23:00", "23:15", "Couvre-feu", locations.maurice)
  ]),
  day("2026-05-24", "Dimanche 24 mai", "Dim", [
    item("06:30", "06:45", "Réveil", locations.maurice),
    item("06:30", "08:00", "Déjeuner et ramassage des chambres", locations.maurice),
    item("07:30", "08:00", "Départ pour les compétitions", locations.maurice),
    item("08:00", "12:00", "Compétitions: badminton, basketball 3x3, kinball cadet, kinball junior, soccer 5x5, volleyball cadet, volleyball junior", locations.competition),
    item("11:30", "12:30", "Retour des compétitions et ramassage", locations.maurice),
    item("11:30", "13:00", "BBQ", locations.maurice),
    item("13:00", "14:00", "Cérémonie de fermeture", locations.maurice),
    item("14:00", "14:15", "Départ des délégations", locations.maurice)
  ])
];

const zones = [
  zone(1, "Bleu", "#0000f6", "#fff", ["Airdrie", "Brooks", "Canmore", "Cochrane", "Lethbridge", "Medicine Hat", "Okotoks"]),
  zone(2, "Jaune", "#fff200", "#111", ["Beaumont", "Camrose", "Leduc", "Red Deer", "Sylvan Lake", "Wainwright", "Ardrossan", "Olds", "Innisfail"]),
  zone(3, "Orange", "#ff6500", "#111", ["Calgary"]),
  zone(4, "Rouge clair", "#f20d0d", "#fff", ["Edson", "Fort Saskatchewan", "Hinton", "Jasper", "Legal", "Morinville", "Spruce Grove", "St-Albert", "Stony Plain"]),
  zone(5, "Vert forêt", "#00830b", "#fff", ["Athabasca", "Bonnyville", "Cold Lake", "Lac La Biche", "Lloydminster", "Plamondon", "St Paul", "Vegreville"]),
  zone(6, "Bleu marin", "#132a40", "#fff", ["Edmonton", "Sherwood Park"]),
  zone(7, "Vert pâle", "#11b561", "#111", ["Fort McMurray"]),
  zone(8, "Noir", "#000", "#fff", ["Donnelly", "Fairview", "Falher", "Girouxville", "High Prairie", "Rivière-la-Paix", "Valleyview"]),
  zone(9, "Rouge bourgogne", "#9b3a37", "#fff", ["Grande Prairie", "Whitecourt"])
];

const kinballGames = [
  game("2026-05-23", "09:00", "10:00", [1, 9, 3]),
  game("2026-05-23", "10:00", "11:00", [4, 5, 6]),
  game("2026-05-23", "11:00", "12:00", [9, 4, 8]),
  game("2026-05-23", "12:00", "12:45", [], "Dîner"),
  game("2026-05-23", "12:45", "13:45", [6, 1, 3]),
  game("2026-05-23", "13:45", "14:45", [5, 8, 1]),
  game("2026-05-23", "14:45", "15:45", [8, 6, 4]),
  game("2026-05-23", "15:45", "16:45", [9, 5, 3]),
  game("2026-05-24", "08:00", "09:00", [], "6e place c. 5e place c. 4e place"),
  game("2026-05-24", "09:00", "10:00", [], "3e place c. 2e place c. 1re place")
];

let activeDay = "2026-05-22";
let selectedZone = zones.find((entry) => entry.id === 5);

const currentTitle = document.querySelector("#currentTitle");
const currentMeta = document.querySelector("#currentMeta");
const currentProgress = document.querySelector("#currentProgress");
const nextTitle = document.querySelector("#nextTitle");
const nextMeta = document.querySelector("#nextMeta");
const nextKinball = document.querySelector("#nextKinball");
const nextKinballMeta = document.querySelector("#nextKinballMeta");
const scheduleList = document.querySelector("#scheduleList");
const kinballList = document.querySelector("#kinballList");
const teamSearch = document.querySelector("#teamSearch");
const clearTeam = document.querySelector("#clearTeam");
const teamResult = document.querySelector("#teamResult");
const zonesDialog = document.querySelector("#zonesDialog");
const zonesList = document.querySelector("#zonesList");
const zoneSearch = document.querySelector("#zoneSearch");

function item(start, end, title, location) {
  return { start, end, title, location };
}

function day(date, label, shortLabel, items) {
  return { date, label, shortLabel, items: items.map((entry) => ({ ...entry, date })) };
}

function zone(id, color, bg, ink, teams) {
  return { id, color, bg, ink, teams };
}

function game(date, start, end, teams, label) {
  return { date, start, end, teams, label, location: locations.michaelle };
}

function localNow() {
  return new Date();
}

function toDate(date, time) {
  const [hour, minute] = time.split(":").map(Number);
  return new Date(`${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-06:00`);
}

function formatTime(time) {
  const [hour, minute] = time.split(":");
  const hourNumber = Number(hour);
  if (minute === "00") return `${hourNumber}h`;
  return `${hourNumber}h${minute}`;
}

function timeRange(entry) {
  return `${formatTime(entry.start)} - ${formatTime(entry.end)}`;
}

function allScheduleItems() {
  return schedule.flatMap((entry) => entry.items);
}

function activeEntry(items, now) {
  return items.find((entry) => toDate(entry.date, entry.start) <= now && now < toDate(entry.date, entry.end));
}

function nextEntry(items, now) {
  return items.find((entry) => toDate(entry.date, entry.start) > now);
}

function isCurrent(entry, now) {
  return toDate(entry.date, entry.start) <= now && now < toDate(entry.date, entry.end);
}

function gameTitle(entry) {
  if (entry.label) return entry.label;
  return entry.teams.map((team) => `Zone ${team}`).join(" c. ");
}

function findZone(query) {
  const clean = query.trim().toLowerCase();
  if (!clean) return null;
  return zones.find((entry) => {
    const zoneText = `zone ${entry.id} ${entry.color}`.toLowerCase();
    return zoneText.includes(clean) || entry.teams.some((team) => team.toLowerCase().includes(clean));
  });
}

function renderStatus() {
  const now = localNow();
  const items = allScheduleItems().sort((a, b) => toDate(a.date, a.start) - toDate(b.date, b.start));
  const active = activeEntry(items, now);
  const upcoming = nextEntry(items, now);

  if (active) {
    currentTitle.textContent = active.title;
    currentMeta.textContent = `${timeRange(active)} • ${active.location}`;
    const start = toDate(active.date, active.start).getTime();
    const end = toDate(active.date, active.end).getTime();
    const percent = Math.max(0, Math.min(100, ((now.getTime() - start) / (end - start)) * 100));
    currentProgress.style.width = `${percent}%`;
  } else if (upcoming) {
    currentTitle.textContent = "Le JFA n’a pas encore commencé";
    currentMeta.textContent = `Premier élément: ${upcoming.title} à ${formatTime(upcoming.start)} le ${dayLabel(upcoming.date)}.`;
    currentProgress.style.width = "0%";
  } else {
    currentTitle.textContent = "Le weekend JFA est terminé";
    currentMeta.textContent = "L’horaire affiché se termine le dimanche 24 mai à 14h15.";
    currentProgress.style.width = "100%";
  }

  if (upcoming) {
    nextTitle.textContent = upcoming.title;
    nextMeta.textContent = `${dayLabel(upcoming.date)} • ${timeRange(upcoming)}`;
  } else {
    nextTitle.textContent = "Aucun élément à venir";
    nextMeta.textContent = "Horaire terminé";
  }

  const kinballUpcoming = nextKinballGame(now);
  if (kinballUpcoming) {
    nextKinball.textContent = gameTitle(kinballUpcoming);
    nextKinballMeta.textContent = `${dayLabel(kinballUpcoming.date)} • ${timeRange(kinballUpcoming)}`;
  } else {
    nextKinball.textContent = "Aucun match à venir";
    nextKinballMeta.textContent = selectedZone ? `Zone ${selectedZone.id}` : "Kinball Junior";
  }
}

function nextKinballGame(now) {
  return kinballGames.find((entry) => {
    if (toDate(entry.date, entry.start) <= now) return false;
    if (!selectedZone || entry.teams.length === 0) return true;
    return entry.teams.includes(selectedZone.id);
  });
}

function dayLabel(date) {
  return schedule.find((entry) => entry.date === date)?.label ?? date;
}

function shortDayLabel(date) {
  return schedule.find((entry) => entry.date === date)?.shortLabel ?? date;
}

function renderSchedule() {
  const now = localNow();
  const dayData = schedule.find((entry) => entry.date === activeDay);
  scheduleList.innerHTML = "";
  dayData.items.forEach((entry) => {
    const card = document.createElement("article");
    card.className = `timeline-item${isCurrent(entry, now) ? " now" : ""}`;
    card.innerHTML = `
      <div class="time">${timeRange(entry)}</div>
      <div>
        <h3>${entry.title}</h3>
        <p>${entry.location}</p>
      </div>
    `;
    scheduleList.append(card);
  });
}

function renderKinball() {
  const now = localNow();
  const next = nextKinballGame(now);
  kinballList.innerHTML = "";
  kinballGames.forEach((entry) => {
    const isRelevant = selectedZone && entry.teams.includes(selectedZone.id);
    const card = document.createElement("article");
    card.className = `game-card${entry === next ? " next" : ""}`;
    card.innerHTML = `
      <div class="time">${shortDayLabel(entry.date)}<br>${timeRange(entry)}</div>
      <div>
        <h3>${gameTitle(entry)}</h3>
        <p>${entry.location}${isRelevant ? ` • Ta zone` : ""}</p>
      </div>
    `;
    kinballList.append(card);
  });
}

function renderZones(filter = "") {
  const clean = filter.trim().toLowerCase();
  zonesList.innerHTML = "";
  zones
    .filter((entry) => {
      if (!clean) return true;
      const text = [`zone ${entry.id}`, entry.color, ...entry.teams].join(" ").toLowerCase();
      return text.includes(clean);
    })
    .forEach((entry) => {
      const card = document.createElement("article");
      card.className = "zone-card";
      card.style.background = entry.bg;
      card.style.setProperty("--zone-ink", entry.ink);
      card.innerHTML = `
        <h3>Zone ${entry.id} - ${entry.color}</h3>
        <ul>${entry.teams.map((team) => `<li>${team}</li>`).join("")}</ul>
      `;
      zonesList.append(card);
    });
}

function selectZone(entry) {
  selectedZone = entry;
  if (!entry) {
    teamResult.textContent = "Recherche une ville pour personnaliser tes matchs de kinball.";
  } else {
    teamResult.textContent = `Zone ${entry.id} (${entry.color}) utilisée pour ton prochain match de kinball.`;
  }
  renderStatus();
  renderKinball();
}

function hydrateSelectedZone() {
  if (!selectedZone) return;
  teamSearch.value = `Zone ${selectedZone.id}`;
  teamResult.textContent = `Zone ${selectedZone.id} (${selectedZone.color}) utilisée pour ton prochain match de kinball.`;
}

document.querySelectorAll(".segmented button").forEach((button) => {
  button.addEventListener("click", () => {
    activeDay = button.dataset.day;
    document.querySelectorAll(".segmented button").forEach((item) => item.classList.toggle("active", item === button));
    renderSchedule();
  });
});

teamSearch.addEventListener("input", () => {
  const match = findZone(teamSearch.value);
  selectZone(match);
  if (teamSearch.value.trim() && !match) {
    teamResult.textContent = "Aucune équipe trouvée pour l’instant.";
  }
});

clearTeam.addEventListener("click", () => {
  teamSearch.value = "";
  selectZone(null);
  teamSearch.focus();
});

document.querySelector("#openZones").addEventListener("click", () => {
  renderZones(zoneSearch.value);
  zonesDialog.showModal();
  zoneSearch.focus();
});

document.querySelector("#zonesNav").addEventListener("click", () => {
  renderZones(zoneSearch.value);
  zonesDialog.showModal();
  zoneSearch.focus();
});

document.querySelector("#closeZones").addEventListener("click", () => zonesDialog.close());
zoneSearch.addEventListener("input", () => renderZones(zoneSearch.value));

hydrateSelectedZone();
renderStatus();
renderSchedule();
renderKinball();
renderZones();
setInterval(() => {
  renderStatus();
  renderSchedule();
  renderKinball();
}, 30_000);
