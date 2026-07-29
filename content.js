(function startAntiShorts() {
  "use strict";

  const Core = globalThis.AntiShortsCore;

  if (!Core) {
    return;
  }

  const HOME_URL = "https://www.youtube.com/";
  const SHORT_CLASS = "anti-shorts-short";
  const DURATION_CLASS = "anti-shorts-too-short";
  const DEDICATED_SHORTS_SELECTOR = [
    "ytd-reel-shelf-renderer",
    "ytd-rich-shelf-renderer[is-shorts]",
    "ytd-reel-item-renderer",
    "ytd-reel-video-renderer",
    "ytm-shorts-lockup-view-model",
    "ytm-shorts-lockup-view-model-v2",
    "ytd-shorts"
  ].join(",");
  const CONDITIONAL_SHELF_SELECTOR = [
    "grid-shelf-view-model",
    "ytd-rich-shelf-renderer"
  ].join(",");
  const SECTION_SELECTOR = "ytd-rich-section-renderer";
  const NAVIGATION_SELECTOR = [
    "ytd-guide-entry-renderer",
    "ytd-mini-guide-entry-renderer"
  ].join(",");
  const CARD_SELECTORS = [
    "ytd-rich-item-renderer",
    "ytd-video-renderer",
    "ytd-grid-video-renderer",
    "ytd-compact-video-renderer",
    "ytd-playlist-video-renderer",
    "ytd-playlist-panel-video-renderer",
    "ytd-radio-renderer",
    "ytd-movie-renderer",
    "ytd-rich-grid-media",
    "yt-lockup-view-model"
  ];
  const CARD_SELECTOR = CARD_SELECTORS.join(",");
  const DURATION_NODE_SELECTOR = [
    "ytd-thumbnail-overlay-time-status-renderer #text",
    "ytd-thumbnail-overlay-time-status-renderer",
    "yt-thumbnail-badge-view-model .yt-badge-shape__text",
    "yt-thumbnail-badge-view-model .badge-shape-wiz__text",
    "yt-thumbnail-badge-view-model"
  ].join(",");
  const CONTEXT_SELECTOR = [
    SECTION_SELECTOR,
    CONDITIONAL_SHELF_SELECTOR,
    NAVIGATION_SELECTOR,
    CARD_SELECTOR,
    DEDICATED_SHORTS_SELECTOR
  ].join(",");

  let minimumDurationSeconds = Core.DEFAULT_MINIMUM_SECONDS;
  let redirecting = false;
  let scanTimer = 0;
  let lastUrl = location.href;
  const pendingRoots = new Set();

  function redirectIfNeeded() {
    if (!Core.isShortsUrl(location.href)) {
      return false;
    }

    if (!redirecting) {
      redirecting = true;
      document.documentElement?.classList.add("anti-shorts-redirecting");
      location.replace(HOME_URL);
    }

    return true;
  }

  if (redirectIfNeeded()) {
    return;
  }

  function elementsIn(root, selector) {
    const elements = [];

    if (root instanceof Element && root.matches(selector)) {
      elements.push(root);
    }

    if (typeof root.querySelectorAll === "function") {
      elements.push(...root.querySelectorAll(selector));
    }

    return elements;
  }

  function anchorsIn(root) {
    return elementsIn(root, "a[href]");
  }

  function isShortsAnchor(anchor) {
    return Core.isShortsUrl(anchor.getAttribute("href"), location.href);
  }

  function containsShortsLink(element) {
    return anchorsIn(element).some(isShortsAnchor);
  }

  function containsWatchLink(element) {
    return anchorsIn(element).some((anchor) => {
      try {
        return new URL(anchor.getAttribute("href"), location.href).pathname === "/watch";
      } catch (_error) {
        return false;
      }
    });
  }

  function isShortsShelf(element) {
    if (element.matches("ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts]")) {
      return true;
    }

    if (element.querySelector(DEDICATED_SHORTS_SELECTOR)) {
      return true;
    }

    const shortLinks = anchorsIn(element).filter(isShortsAnchor);

    return shortLinks.length >= 2 && !containsWatchLink(element);
  }

  function isShortsSection(element) {
    const shelves = elementsIn(element, CONDITIONAL_SHELF_SELECTOR);

    return (
      Boolean(element.querySelector(DEDICATED_SHORTS_SELECTOR)) ||
      shelves.some(isShortsShelf)
    );
  }

  function preferredCard(element) {
    for (const selector of CARD_SELECTORS) {
      const card = element.closest(selector);

      if (card) {
        return card;
      }
    }

    return null;
  }

  function ownerForShortsLink(anchor) {
    const navigationEntry = anchor.closest(NAVIGATION_SELECTOR);

    if (navigationEntry) {
      return navigationEntry;
    }

    const section = anchor.closest(SECTION_SELECTOR);

    if (section && isShortsSection(section)) {
      return section;
    }

    const shelf = anchor.closest(CONDITIONAL_SHELF_SELECTOR);

    if (shelf && isShortsShelf(shelf)) {
      return shelf;
    }

    return preferredCard(anchor) || anchor.closest(DEDICATED_SHORTS_SELECTOR) || anchor;
  }

  function durationSecondsFor(card) {
    const durationNodes = elementsIn(card, DURATION_NODE_SELECTOR);

    for (const node of durationNodes) {
      const values = [node.textContent, node.getAttribute("aria-label")];

      for (const value of values) {
        const parsed = Core.parseDurationText(value);

        if (parsed !== null) {
          return parsed;
        }
      }
    }

    const dataValues = [
      card.data?.lengthText?.simpleText,
      card.data?.lengthText?.accessibility?.accessibilityData?.label,
      card.data?.content?.videoRenderer?.lengthText?.simpleText
    ];

    for (const value of dataValues) {
      const parsed = Core.parseDurationText(value);

      if (parsed !== null) {
        return parsed;
      }
    }

    return null;
  }

  function classifyCard(card) {
    const isShort =
      containsShortsLink(card) ||
      Boolean(card.querySelector(DEDICATED_SHORTS_SELECTOR));
    card.classList.toggle(SHORT_CLASS, isShort);

    if (isShort || minimumDurationSeconds === 0) {
      card.classList.remove(DURATION_CLASS);
      return;
    }

    const durationSeconds = durationSecondsFor(card);
    card.classList.toggle(
      DURATION_CLASS,
      durationSeconds !== null && durationSeconds < minimumDurationSeconds
    );
  }

  function scan(root) {
    for (const element of elementsIn(root, DEDICATED_SHORTS_SELECTOR)) {
      element.classList.add(SHORT_CLASS);
    }

    for (const shelf of elementsIn(root, CONDITIONAL_SHELF_SELECTOR)) {
      shelf.classList.toggle(SHORT_CLASS, isShortsShelf(shelf));
    }

    for (const section of elementsIn(root, SECTION_SELECTOR)) {
      section.classList.toggle(SHORT_CLASS, isShortsSection(section));
    }

    for (const navigationEntry of elementsIn(root, NAVIGATION_SELECTOR)) {
      navigationEntry.classList.toggle(
        SHORT_CLASS,
        containsShortsLink(navigationEntry)
      );
    }

    for (const anchor of anchorsIn(root)) {
      const isShort = isShortsAnchor(anchor);
      const owner = isShort ? ownerForShortsLink(anchor) : anchor;

      anchor.classList.toggle(SHORT_CLASS, isShort && owner === anchor);

      if (isShort && owner !== anchor) {
        owner.classList.add(SHORT_CLASS);
      }
    }

    const cards = new Set(
      elementsIn(root, CARD_SELECTOR).map(preferredCard).filter(Boolean)
    );

    for (const card of cards) {
      classifyCard(card);
    }

    if (root instanceof Element) {
      const parentContext = root.parentElement?.closest(CONTEXT_SELECTOR);

      if (parentContext) {
        scan(parentContext);
      }
    }
  }

  function removeNestedRoots(roots) {
    return roots.filter(
      (root, index) =>
        !roots.some(
          (other, otherIndex) =>
            index !== otherIndex &&
            typeof other.contains === "function" &&
            other.contains(root)
        )
    );
  }

  function flushScans() {
    scanTimer = 0;
    let roots = [...pendingRoots];
    pendingRoots.clear();

    if (roots.includes(document) || roots.length > 30) {
      roots = [document];
    } else {
      roots = removeNestedRoots(roots);
    }

    for (const root of roots) {
      scan(root);
    }
  }

  function scheduleScan(root = document) {
    let scanRoot = root;

    if (!(scanRoot instanceof Document) && !(scanRoot instanceof Element)) {
      scanRoot = scanRoot.parentElement || document;
    }

    pendingRoots.add(scanRoot);

    if (!scanTimer) {
      scanTimer = window.setTimeout(flushScans, 60);
    }
  }

  function handlePotentialShortsNavigation(event) {
    const eventPath =
      typeof event.composedPath === "function" ? event.composedPath() : [];
    const anchor =
      eventPath.find((node) => node instanceof HTMLAnchorElement) ||
      (event.target instanceof Element ? event.target.closest("a[href]") : null);

    if (!anchor || !isShortsAnchor(anchor)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (location.pathname !== "/") {
      location.assign(HOME_URL);
    }
  }

  function handleYouTubeNavigation() {
    window.setTimeout(() => {
      lastUrl = location.href;

      if (!redirectIfNeeded()) {
        scheduleScan(document);
      }
    }, 0);
  }

  function startObserver() {
    if (!document.documentElement) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        scheduleScan(mutation.target);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["href", "aria-label"],
      childList: true,
      characterData: true,
      subtree: true
    });

    scheduleScan(document);
  }

  document.addEventListener("click", handlePotentialShortsNavigation, true);
  document.addEventListener("auxclick", handlePotentialShortsNavigation, true);
  window.addEventListener("popstate", handleYouTubeNavigation);
  window.addEventListener("hashchange", handleYouTubeNavigation);
  document.addEventListener("yt-navigate-start", handleYouTubeNavigation);
  document.addEventListener("yt-navigate-finish", handleYouTubeNavigation);

  chrome.storage.sync.get(
    { [Core.STORAGE_KEY]: Core.DEFAULT_MINIMUM_SECONDS },
    (settings) => {
      if (chrome.runtime.lastError) {
        minimumDurationSeconds = Core.DEFAULT_MINIMUM_SECONDS;
        scheduleScan(document);
        return;
      }

      minimumDurationSeconds = Core.normalizeMinimumSeconds(
        settings[Core.STORAGE_KEY]
      );
      scheduleScan(document);
    }
  );

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync" || !changes[Core.STORAGE_KEY]) {
      return;
    }

    minimumDurationSeconds = Core.normalizeMinimumSeconds(
      changes[Core.STORAGE_KEY].newValue
    );
    scheduleScan(document);
  });

  if (document.documentElement) {
    startObserver();
  } else {
    document.addEventListener("DOMContentLoaded", startObserver, { once: true });
  }

  window.setInterval(() => {
    if (location.href === lastUrl) {
      return;
    }

    lastUrl = location.href;

    if (!redirectIfNeeded()) {
      scheduleScan(document);
    }
  }, 250);
})();
