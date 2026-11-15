# T3 Codex: handover

## Done
- Theme built: `src/colors.mjs` + `src/theme.css` -> `node scripts/build.mjs` -> `themes/t3-codex.json`; `node scripts/validate.mjs` passes.
- Dark and light QA done; fixes for the sidebar edge and the light composer border are committed.
- Public repo: https://github.com/HarjjotSinghh/t3-codex
- README screenshots: `docs/screenshots/dark.png` and `light.png` (3456 px wide capture, cropped to 2688 px, right git panel removed).
- Live T3 Code theme = committed build, dark appearance.

## How the screenshots were made (repeat for a v2)
1. Apply the theme plus temporary CSS that hides sidebar rows outside the t3-codex project: `[data-thread-item]:not(:has([aria-label*="t3-codex"])) { display: none !important; }`
2. cua-driver: `run_steps` click by role and name on the "Debounce helper" row, then `get_window_state` with `max_image_dimension:0` and `screenshot_out_file`.
3. Post-process: the macOS Vision OCR script plus a PIL script (scratchpad, not committed). They remove the device name "Harjot's MacBook Pro" and the agent-sender prefix on the prompt banner.
4. Better next time: type the demo prompt yourself, so there is no agent-sender banner. Rename the Mac or crop the footer.

## Gotchas
- cua-driver element tokens go stale between CLI calls. Use `run_steps` with `role`/`name` targets.
- Electron refuses background `type_text`, and foreground typing steals Harjot's focus. Don't type into T3 while he is using it.
- Demo threads were launched by an agent, so T3 shows the parent thread title above the prompt.

## Next
1. Harjot posts the tweet (draft: `docs/TWEET.md`), with dark.png as the image or a recording.
2. Optional: record a 30 to 60 s video (plan in `docs/TWEET.md`; `cua-driver recording start|stop`).
3. Open polish: the selected row title is a bit dark (#262521), muted sidebar text samples #71716f, and `surface-grain` noise is faint.
4. Optional cleanup: delete the t3-codex T3 project and its 4 demo threads.
