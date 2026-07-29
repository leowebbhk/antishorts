"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, "manifest.json"), "utf8")
);
const rules = JSON.parse(fs.readFileSync(path.join(root, "rules.json"), "utf8"));

test("manifest references existing extension files", () => {
  const referencedFiles = [
    manifest.action.default_popup,
    ...manifest.content_scripts.flatMap((script) => [
      ...script.css,
      ...script.js
    ]),
    ...manifest.declarative_net_request.rule_resources.map((item) => item.path)
  ];

  for (const file of referencedFiles) {
    assert.equal(fs.existsSync(path.join(root, file)), true, `${file} is missing`);
  }
});

test("all redirect rules send only main-frame Shorts requests home", () => {
  assert.ok(rules.length >= 1);

  for (const rule of rules) {
    assert.equal(rule.action.type, "redirect");
    assert.equal(rule.action.redirect.url, "https://www.youtube.com/");
    assert.deepEqual(rule.condition.resourceTypes, ["main_frame"]);
    assert.match(rule.condition.urlFilter, /youtube\.com\/shorts\^$/);
  }
});
