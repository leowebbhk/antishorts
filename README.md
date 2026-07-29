To see the prompt I used to create this software in one request to GPT 5.6 Sol Ultra, scroll to the bottom. The rest of the readme is AI-generated, until you get to the horizontal line.

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

----

Here is the prompt I used:

> Okay, so I'd like you to make for me a Chrome extension which blocks YouTube Shorts. I don't want to see any YouTube Shorts recommended to me, I don't want to see them when I'm scrolling YouTube, I don't want any way to click onto them. And if somehow I am looking at a YouTube Short despite all of the efforts that have been made to remove all of the Shorts from YouTube, I want you to ensure that I am immediately directed back to my nice safe homepage where there are no Shorts. I should be running a basically normal and standard version of Chrome. I have no experience with making Chrome extensions or using them before, but I'd really like you to make this Chrome extension simple for me to put on my own Chrome. I have no idea how that's possible, so I'd like you to leave an instruction manual. When you are doing this coding, I'd like you to use as few different kind of languages and frameworks and as few different, sorry, like the simplest code possible that can eliminate Shorts for my YouTube life. Yeah, and I wouldn't like you necessarily to like place anything in their place. I'd like you to just remove them so that, say for example, if my homepage were two rows of long videos and then Shorts, and then another two rows of long videos, it should then just look like four rows of long videos. And the other thing, apart from always getting rid of Shorts, is I'd like you to have the Chrome extension have like a minimum length timer, so that if a YouTube video in any kind of recommendation area, whether that's the main page or the recommendations on the side of a video or something, has a length lower than the minimum length, then it's removed, it's not shown. Because I'd like for my YouTube just to be populated with videos longer than a period of time that is settable by me, the user of the Chrome extension. For example, say I'd like to not see any video shorter than five minutes, so I set the Chrome extension to do five minutes. Like I select five minutes in the Chrome extension somehow in some simple user interface, and then it blocks, basically, like it prevents me from seeing any Shorts or landscape orientation videos that have length less than five minutes. All right, so please go ahead and do that and give me a clear instruction manual on how to get from a perfectly normal ordinary Chrome to one where this custom extension has been installed on Chrome and is working and making my YouTube experience much better.

The quality of the writing here is terrible because, to make this prompt, I simply rambled into the microphone about what I wanted.
