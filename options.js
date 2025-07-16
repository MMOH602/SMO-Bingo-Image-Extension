// File: options.js
document.addEventListener('DOMContentLoaded', () => {
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
