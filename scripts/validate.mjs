#!/usr/bin/env node
// Checks theme files against the rules T3 Code enforces on import (theme file version 1).
// Usage: node scripts/validate.mjs [themes/*.json]
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROLES = new Set(
  "canvas chrome toolbar toolbarForeground toolbarBorder toolbarControl toolbarControlForeground toolbarControlHover surface surfaceRaised surfaceOverlay text textMuted border input focus accent accentForeground secondary secondaryForeground muted mutedForeground placeholder secondaryLabel iconMuted error errorForeground errorSurface warning warningForeground warningSurface update updateForeground updateSurface accentSurface accentSurfaceForeground messageSurface messageForeground messageAction messageActionForeground messageActionHover codeBackground codeForeground searchMatchBackground searchMatchForeground searchMatchActiveBackground searchMatchActiveForeground sidebar sidebarForeground sidebarMutedForeground sidebarControlSurface sidebarRowHover sidebarRowActive sidebarRowSelected sidebarBorder terminalBackground terminalForeground terminalCursor terminalSelection terminalScrollbar terminalScrollbarHover".split(" "),
);
const RESERVED = new Set(["t3-chat", "grove", "ocean", "ember", "iris"]);
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const CSS_MAX = 50_000;

function checkColors(colors, where, errors) {
  if (!colors || typeof colors !== "object") return errors.push(`${where}: must be an object`);
  for (const [role, value] of Object.entries(colors)) {
    if (!ROLES.has(role)) errors.push(`${where}.${role}: unknown color role`);
    if (typeof value !== "string" || !HEX.test(value)) errors.push(`${where}.${role}: "${value}" is not a hex color`);
  }
}

function validate(file) {
  const errors = [];
  let t;
  try {
    t = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    return [`not valid JSON: ${e.message}`];
  }
  if (t.version !== 1) errors.push("version must be 1");
  if (typeof t.name !== "string" || !t.name || t.name.length > 48) errors.push("name: 1 to 48 characters");
  if (!["light", "dark"].includes(t.appearance)) errors.push('appearance must be "light" or "dark"');
  if (t.id !== undefined) {
    if (!/^[a-z0-9-]+$/.test(t.id)) errors.push("id: lowercase letters, numbers and hyphens only");
    if (RESERVED.has(t.id)) errors.push(`id "${t.id}" is reserved`);
  }
  checkColors(t.colors, "colors", errors);
  if (t.variants !== undefined) {
    for (const [mode, colors] of Object.entries(t.variants)) {
      if (!["light", "dark"].includes(mode)) errors.push(`variants.${mode}: must be light or dark`);
      else checkColors(colors, `variants.${mode}`, errors);
    }
  }
  if (t.css !== undefined) {
    if (typeof t.css !== "string") errors.push("css must be a string");
    else {
      if (t.css.length > CSS_MAX) errors.push(`css is ${t.css.length} chars (max ${CSS_MAX})`);
      if (/@import/i.test(t.css)) errors.push("css: @import is not allowed");
      if (/image-set\(/i.test(t.css)) errors.push("css: image-set() is not allowed");
      for (const m of t.css.matchAll(/url\(\s*['"]?([^'")\s]+)/gi)) {
        if (!/^(data:|#)/i.test(m[1])) errors.push(`css: url(${m[1]}) must be data: or #id`);
      }
    }
  }
  return errors;
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : readdirSync("themes").filter((f) => f.endsWith(".json")).map((f) => join("themes", f));

let failed = 0;
for (const file of files) {
  const errors = validate(file);
  if (errors.length) {
    failed++;
    console.log(`FAIL ${file}`);
    for (const e of errors) console.log(`  - ${e}`);
  } else {
    console.log(`ok   ${file}`);
  }
}
process.exit(failed ? 1 : 0);
