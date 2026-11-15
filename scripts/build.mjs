#!/usr/bin/env node
// Builds themes/t3-codex.json from src/colors.mjs + src/theme.css.
import { readFileSync, writeFileSync } from "node:fs";
import { dark, light } from "../src/colors.mjs";

const css = readFileSync(new URL("../src/theme.css", import.meta.url), "utf8");
const theme = {
  version: 1,
  id: "t3-codex",
  name: "T3 Codex",
  appearance: "dark",
  colors: dark,
  variants: { light },
  css,
};
writeFileSync(new URL("../themes/t3-codex.json", import.meta.url), JSON.stringify(theme, null, 2) + "\n");
console.log(`built themes/t3-codex.json (css ${css.length} chars)`);
