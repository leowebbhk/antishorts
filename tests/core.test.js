"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../core.js");

test("recognizes only YouTube Shorts routes", () => {
  assert.equal(Core.isShortsUrl("/shorts/abc"), true);
  assert.equal(Core.isShortsUrl("https://youtube.com/shorts"), true);
  assert.equal(Core.isShortsUrl("https://m.youtube.com/SHORTS/abc?x=1"), true);
  assert.equal(Core.isShortsUrl("https://www.youtube.com/shortstore"), false);
  assert.equal(Core.isShortsUrl("https://example.com/shorts/abc"), false);
  assert.equal(Core.isShortsUrl("/watch?v=abc"), false);
});

test("parses minute and hour clock durations", () => {
  assert.equal(Core.parseDurationText("0:59"), 59);
  assert.equal(Core.parseDurationText(" 5:00 "), 300);
  assert.equal(Core.parseDurationText("1:02:03"), 3723);
  assert.equal(Core.parseDurationText("Length 12：34"), 754);
  assert.equal(Core.parseDurationText("\u200e4:59\u200f"), 299);
});

test("parses English accessible duration labels", () => {
  assert.equal(Core.parseDurationText("1 hour, 2 minutes, 3 seconds"), 3723);
  assert.equal(Core.parseDurationText("5 minutes, 9 seconds"), 309);
});

test("rejects invalid or non-duration badges", () => {
  assert.equal(Core.parseDurationText("LIVE"), null);
  assert.equal(Core.parseDurationText("UPCOMING"), null);
  assert.equal(Core.parseDurationText("4:99"), null);
  assert.equal(Core.parseDurationText("1:70:00"), null);
  assert.equal(Core.parseDurationText(null), null);
});

test("normalizes stored thresholds", () => {
  assert.equal(Core.normalizeMinimumSeconds(-1), 0);
  assert.equal(Core.normalizeMinimumSeconds("300"), 300);
  assert.equal(Core.normalizeMinimumSeconds(300.4), 300);
  assert.equal(Core.normalizeMinimumSeconds(Number.NaN), 0);
  assert.equal(Core.normalizeMinimumSeconds(999999), 86400);
});
