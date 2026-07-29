(function startPopup() {
  "use strict";

  const Core = globalThis.AntiShortsCore;
  const form = document.querySelector("#settings-form");
  const input = document.querySelector("#minimum-minutes");
  const status = document.querySelector("#status");

  function showStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error", isError);
  }

  chrome.storage.sync.get(
    { [Core.STORAGE_KEY]: Core.DEFAULT_MINIMUM_SECONDS },
    (settings) => {
      if (chrome.runtime.lastError) {
        showStatus("Could not load setting. Try reopening this window.", true);
        return;
      }

      const seconds = Core.normalizeMinimumSeconds(settings[Core.STORAGE_KEY]);
      input.value = String(Math.round(seconds / 60));
    }
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const minutes = Number(input.value);

    if (
      !Number.isInteger(minutes) ||
      minutes < 0 ||
      minutes > Core.MAXIMUM_MINUTES
    ) {
      showStatus("Enter a whole number from 0 to 1440.", true);
      input.focus();
      return;
    }

    chrome.storage.sync.set(
      { [Core.STORAGE_KEY]: minutes * 60 },
      () => {
        if (chrome.runtime.lastError) {
          showStatus("Setting was not saved. Try again.", true);
          return;
        }

        const detail =
          minutes === 0
            ? "Regular videos of any length are allowed."
            : `Videos under ${minutes} minute${minutes === 1 ? "" : "s"} are hidden.`;
        showStatus(`Saved. ${detail}`);
      }
    );
  });
})();
