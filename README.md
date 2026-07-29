# AntiShorts

AntiShorts is a small Chrome extension that:

- removes YouTube Shorts shelves, cards, and navigation links;
- redirects any YouTube `/shorts` page to the normal YouTube homepage;
- hides recommended regular videos shorter than a minimum you choose;
- closes grid gaps instead of adding replacement boxes.

It uses plain JavaScript, HTML, CSS, and Chrome's Manifest V3 format. There is no framework, build step, account, analytics, or outside network service.

## Install it in normal Chrome

Keep this entire `AntiShorts` folder somewhere permanent. Chrome loads the extension from this folder, so do not delete or move it after installation.

1. Open Google Chrome.
2. Type `chrome://extensions` into the address bar and press Enter.
3. Turn on **Developer mode** using the switch in the upper-right corner.
4. Click **Load unpacked**.
5. Select this exact `AntiShorts` folder—the folder containing `manifest.json`—then click **Select Folder**.
6. Confirm an **AntiShorts** card appears and its switch is on.
7. Reload any YouTube tabs that were already open.

Optional: click Chrome's puzzle-piece Extensions button, then pin **AntiShorts**. Its settings button will remain visible beside the address bar.

## Set a minimum video length

1. Click the **AntiShorts** toolbar button.
2. Enter a whole number of minutes. For example, enter `5` to hide every recommendation with a displayed duration below `5:00`.
3. Click **Save setting**.

The change applies automatically to open YouTube pages. A video exactly equal to the limit stays visible: with a five-minute minimum, `4:59` is hidden and `5:00` stays.

Enter `0` to turn off only the minimum-length filter. Shorts remain blocked at all times.

## What to expect

- Shorts shelves disappear and surrounding normal video rows flow together.
- Shorts entries disappear from full and collapsed YouTube navigation.
- Shorts cards disappear from home, search, subscriptions, channel grids, and watch-page recommendations.
- Typing, opening, or somehow reaching a standard desktop YouTube `/shorts` address sends the tab to `https://www.youtube.com/`.
- Regular recommendation cards below your saved minimum disappear across YouTube listings and sidebars.
- Live, upcoming, or other cards without a readable duration remain visible. AntiShorts does not guess their length.
- A directly opened regular `/watch` video is not interrupted, even when shorter than your minimum. The minimum applies to cards you browse; Shorts pages are always redirected.

## Quick check

After installing:

1. Open `https://www.youtube.com/` and confirm no Shorts shelf or Shorts navigation item appears.
2. Enter `5` in AntiShorts settings.
3. Browse home, search results, and a video's right-hand recommendations. Durations below `5:00` should be absent.
4. Type `https://www.youtube.com/shorts/` into the address bar. You should land on the YouTube homepage.
5. Change the minimum back to `0`. Short regular videos should return; Shorts should not.

## Update after editing files

1. Return to `chrome://extensions`.
2. Click the circular reload button on the **AntiShorts** card.
3. Reload open YouTube tabs.

## Troubleshooting

**Chrome says the manifest is missing**  
You selected the wrong folder. Choose the `AntiShorts` folder that directly contains `manifest.json`.

**YouTube was already open and nothing changed**  
Reload that YouTube tab once. Chrome cannot add a newly installed content script to a page that was already loaded.

**Some cards appear briefly while YouTube loads**  
YouTube builds and replaces page sections continuously. AntiShorts rechecks added content and removes matching cards as soon as their link or duration appears.

**A future YouTube redesign exposes Shorts**  
Reload the extension and page first. If it persists, YouTube likely changed its page elements and this extension's selectors need an update.

**Remove the extension**  
Open `chrome://extensions`, find **AntiShorts**, and click **Remove**. This is fully reversible.

## Privacy

AntiShorts reads only YouTube page elements needed to identify links and displayed durations. It has no analytics, third-party service, background fetch, or data collection. Redirecting away from a Short performs only the normal navigation to YouTube's homepage. The one saved setting is stored using Chrome's synchronized extension settings; it still works locally when Chrome sync is off.

## Developer check (optional)

No packages are required. With Node.js installed, run:

```powershell
node --test tests/*.test.js
node --check core.js
node --check content.js
node --check popup.js
```
