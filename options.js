// File: options.js
document.addEventListener('DOMContentLoaded', () => {
  const glowCheckbox = document.getElementById('toggle-rightclick-glow');

  // 1. Lade gespeicherten Zustand (default: false)
  chrome.storage.sync.get({ showDifficulty: false, enableRightClickGlow: false }, prefs => {
    glowCheckbox.checked = prefs.enableRightClickGlow;
  });

  // 2. Speichere bei Änderung
  glowCheckbox.addEventListener('change', () => {
    chrome.storage.sync.set({ enableRightClickGlow: glowCheckbox.checked });
  });

  const checkbox = document.getElementById('toggle-difficulty');

  // 1) Lade gespeicherten Zustand (default: false)
  chrome.storage.sync.get({ showDifficulty: false }, prefs => {
    checkbox.checked = prefs.showDifficulty;
  });

  // 2) Bei Änderung speichern
  checkbox.addEventListener('change', () => {
    chrome.storage.sync.set({ showDifficulty: checkbox.checked });
  });
});
