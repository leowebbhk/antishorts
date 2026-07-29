(function exposeAntiShortsCore(globalScope) {
  "use strict";

  const STORAGE_KEY = "minimumDurationSeconds";
  const DEFAULT_MINIMUM_SECONDS = 0;
  const MAXIMUM_MINUTES = 1440;

  function normalizeMinimumSeconds(value) {
    const seconds = Number(value);

    if (!Number.isFinite(seconds)) {
      return DEFAULT_MINIMUM_SECONDS;
    }

    return Math.min(
      MAXIMUM_MINUTES * 60,
      Math.max(0, Math.round(seconds))
    );
  }

  function isShortsUrl(value, baseUrl = "https://www.youtube.com/") {
    try {
      const url = new URL(value, baseUrl);
      const hostname = url.hostname.toLowerCase();
      const isYouTube =
        hostname === "youtube.com" || hostname.endsWith(".youtube.com");
      const pathname = url.pathname.toLowerCase();

      return (
        isYouTube &&
        (pathname === "/shorts" || pathname.startsWith("/shorts/"))
      );
    } catch (_error) {
      return false;
    }
  }

  function parseDurationText(value) {
    if (typeof value !== "string") {
      return null;
    }

    const normalized = value
      .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "")
      .replace(/：/g, ":")
      .trim();
    const clockMatch = normalized.match(
      /(?:^|\D)((?:\d{1,4}:){1,2}\d{2})(?=\D|$)/
    );

    if (clockMatch) {
      const parts = clockMatch[1].split(":").map(Number);
      const seconds = parts.at(-1);
      const minutes = parts.at(-2);

      if (seconds < 60 && (parts.length === 2 || minutes < 60)) {
        if (parts.length === 2) {
          return minutes * 60 + seconds;
        }

        return parts[0] * 3600 + minutes * 60 + seconds;
      }
    }

    const hours = normalized.match(/(\d+)\s*(?:hours?|hrs?)(?=\W|$)/i);
    const minutes = normalized.match(/(\d+)\s*(?:minutes?|mins?)(?=\W|$)/i);
    const seconds = normalized.match(/(\d+)\s*(?:seconds?|secs?)(?=\W|$)/i);

    if (!hours && !minutes && !seconds) {
      return null;
    }

    return (
      Number(hours?.[1] || 0) * 3600 +
      Number(minutes?.[1] || 0) * 60 +
      Number(seconds?.[1] || 0)
    );
  }

  const api = Object.freeze({
    DEFAULT_MINIMUM_SECONDS,
    MAXIMUM_MINUTES,
    STORAGE_KEY,
    isShortsUrl,
    normalizeMinimumSeconds,
    parseDurationText
  });

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    globalScope.AntiShortsCore = api;
  }
})(typeof globalThis === "undefined" ? this : globalThis);
