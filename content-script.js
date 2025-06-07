// File: content-script.js

console.log("🎉 Super Mario Bingo Extension aktiv");

// ================================
// 1) @font-face-Injektion für Bangers
// ================================
(function injectBangersFont() {
  const fontUrl = chrome.runtime.getURL("fonts/Bangers.woff2");
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'Bangers';
      src: url('${fontUrl}') format('woff2');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
})();


let bingoMapping = null;

// Lädt das Mapping aus der JSON-Datei, die in der Extension liegt
async function loadMapping() {
  const url = chrome.runtime.getURL("data/bingo-mapping.json");
  try {
    const response = await fetch(url);
    bingoMapping = await response.json();
    console.log("Bingo-Mapping geladen", bingoMapping);
    // Starte jetzt das Polling, um auf die Kacheln zu warten
    waitForTiles();
  } catch (e) {
    console.error("Fehler beim Laden der Mapping-JSON:", e);
  }
}

// Liste der möglichen Kingdom-Namen (kleingeschrieben, um CSS-Klassen abzuleiten)
const worlds = [
  "cap",
  "cascade",
  "sand",
  "lake",
  "wooded",
  "cloud",
  "lost",
  "metro",
  "snow",
  "seaside",
  "all"
];

// Wandelt einen Kingdom-Namen in die entsprechende Badge-Klasse um
function getBadgeClass(kingdom) {
  const key = kingdom.toLowerCase().replace(/[^a-z0-9]/g, "");
  return worlds.includes(key) ? `smobadge smobadge-${key}` : null;
}

// Fügt für einen Slot (slotId) ein Badge oben rechts ein
function addBadge(slotId, kingdom) {
  const td = document.getElementById("slot" + slotId);
  if (!td) return;

  // Damit das Badge relativ zum <td> absolut positioniert werden kann
  td.style.position = "relative";

  const badgeClass = getBadgeClass(kingdom);
  if (!badgeClass) return;

  // Verhindere doppelte Badges
  if (td.querySelector(`.smobadge-${kingdom.toLowerCase().replace(/[^a-z0-9]/g, "")}`)) {
    return;
  }

  const span = document.createElement("span");
  span.className = badgeClass;
  span.textContent = kingdom
  td.appendChild(span);
}

// Ersetzt in jedem Slot-Element den Text durch das Bild (falls vorhanden) und hängt das Badge an
function updateBoard() {
  // nur ausführen, wenn .board-cover wirklich verborgen ist
  const cover = document.querySelector('.board-cover');
  const isHidden = cover && window.getComputedStyle(cover).display === 'none';
  if (!isHidden) {
    // Board ist noch verdeckt, nichts tun
    return;
  }

  if (!bingoMapping) return;

  for (let slotId = 1; slotId <= 25; slotId++) {
    const td = document.getElementById("slot" + slotId);
    if (!td) continue;

    // Innerview: die <div class="vertical-center text-container">
    const textDiv = td.querySelector(".vertical-center.text-container");
    if (!textDiv) continue;

    const currentText = textDiv.textContent.trim();
    const entry = bingoMapping[currentText];
    if (!entry) continue;

    // a) Bild einfügen (falls entry.image existiert)
    if (entry.image) {
  const imgSrc = chrome.runtime.getURL(entry.image);
  textDiv.innerHTML = ""; // Alles leeren
  
  const img = document.createElement("img");
  img.src = imgSrc;
  textDiv.appendChild(img);

  if (entry.text) {
    const textNode = document.createElement("div");
    textNode.textContent = entry.text;
    textNode.classList.add("text-overlay");
    textDiv.appendChild(textNode);
  }
}

    // b) Badge hinzufügen (Kingdom aus dem Mapping-JSON)
    const kingdom = entry.kingdom;
    addBadge(slotId, kingdom);
  }
}

// Starte everything
window.addEventListener("load", () => {
loadMapping();
});


// === Zwischen ColorChooser und Bingo-Board einen Container + Button injizieren ===

function injectLoadButtonBelowChooser() {
  const chooser = document.getElementById('color-chooser');
  if (!chooser) return console.warn('Color Chooser nicht gefunden.');

  // Prüfen, ob wir schon injiziert haben
  if (document.getElementById('smo-load-container')) return;

  // 1. Erstelle Container-DIV
  const container = document.createElement('div');
  container.id = 'smo-load-container';
  Object.assign(container.style, {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '8px 16px',
    background: 'transparent'
  });

  // 2. Erstelle den Button
  const btn = document.createElement('button');
  btn.id = 'smo-load-images-btn';
  btn.type = 'button';
  btn.textContent = 'Load Images';
  Object.assign(btn.style, {
    background: '#B22222',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    fontSize: '1.2em',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontFamily: "'Bangers', cursive"
  });

  // 3. Icon hinzufügen (optional)
  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL('images/bingo.png');
  icon.style.cssText = 'height:16px;margin-right:6px;vertical-align:middle;';
  btn.insertBefore(icon, btn.firstChild);

  // 4. Klick-Handler
  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = '';
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode('Loading…'));
    setTimeout(() => {
      updateBoard();
      btn.textContent = '';
      btn.appendChild(icon);
      btn.appendChild(document.createTextNode('Load Images'));
      btn.disabled = false;
    }, 100);
  });

  // 5. Container direkt unter den ColorChooser einfügen
  //    (das Board ist das nächste Element nach chooser)
  chooser.parentNode.insertBefore(container, chooser.nextSibling);

  // 6. Button in Container hängen
  container.appendChild(btn);
}

// Aufruf nach Window-Load mit kleinem Delay
window.addEventListener('load', () => setTimeout(injectLoadButtonBelowChooser, 500));
