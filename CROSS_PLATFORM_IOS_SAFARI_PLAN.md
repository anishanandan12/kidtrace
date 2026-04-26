# Cross-Platform Compatibility Plan

This plan focuses on making KidTrace more reliable across mobile browsers, with extra attention to iOS Safari and iOS standalone/PWA mode.

## Current Risk Summary

KidTrace is already mostly mobile-oriented, but a few browser APIs and CSS choices are likely to behave differently on iOS Safari:

- Full-screen layouts use `100vh`, `100vw`, and `82vh`, which can mis-measure when Safari's address bar, toolbar, or standalone safe areas change.
- The tracing canvas uses separate mouse and touch handlers instead of a single pointer-event path with pointer capture.
- Speech synthesis depends on `onend`/`onerror` callbacks, which can be unreliable on iOS Safari.
- Canvas sizing only listens to `window.resize`, while iOS Safari often changes the visual viewport without a normal resize event.
- PWA install/offline behavior still needs real-device verification, especially in iOS standalone mode.
- Some UI states rely on hover behavior, which can feel sticky or inconsistent on touch browsers.

## Phase 1: Highest-Impact iOS Safari Fixes

### 1. Replace Fragile Viewport Units

Files:

- `src/pages/HomeScreen/index.css`
- `src/styles/tokens.css`
- `src/pages/TracingScreen/index.module.css`
- `src/index.css`
- `index.html`

Problems:

- `height: 100vh` can be too tall or too short on iOS Safari as browser chrome expands/collapses.
- `width: 100vw` can produce tiny horizontal overflow in some browsers.
- `--size-canvas: min(82vw, 82vh)` inherits the same `vh` instability.
- The close button uses `top: max(var(--space-md), env(safe-area-inset-top))`, which places the button at the safe-area edge rather than adding spacing after the safe area.

Plan:

- Introduce global viewport variables:
  - `--app-height: 100dvh`
  - fallback to `100svh` or `-webkit-fill-available` where needed
  - optional JavaScript fallback using `window.visualViewport.height` for older iOS versions
- Replace `height: 100vh` with `min-height: var(--app-height)` or `height: var(--app-height)` for fixed screens.
- Replace `width: 100vw` with `width: 100%` on fixed full-screen containers.
- Update canvas sizing to use `min(82vw, calc(var(--app-height) * 0.82))`.
- Change safe-area offsets to additive spacing, for example:
  - `top: calc(env(safe-area-inset-top) + var(--space-md))`
  - `left: calc(env(safe-area-inset-left) + var(--space-md))`
- Add bottom and right safe-area padding to overlays and action areas.

Acceptance checks:

- Home and tracing screens do not jump or crop when Safari browser chrome appears/disappears.
- Close and overlay buttons stay clear of the notch, Dynamic Island, and home indicator.
- No horizontal overflow appears on iPhone Safari.

### 2. Move Canvas Input to Pointer Events

Files:

- `src/components/TracingCanvas/index.tsx`

Problems:

- The canvas currently handles mouse and touch separately.
- iOS can emit cancel events during scroll, multitouch, orientation changes, or system gestures.
- Without pointer capture, tracing can stop if the finger moves outside the canvas bounds.
- Mouse events can sometimes fire after touch events, causing duplicate or stale interactions.

Plan:

- Prefer `onPointerDown`, `onPointerMove`, `onPointerUp`, `onPointerCancel`, and `onLostPointerCapture`.
- Store the active `pointerId` and ignore other pointers while tracing.
- Call `canvas.setPointerCapture(e.pointerId)` on start and release it on end/cancel.
- Keep a small fallback for browsers without `PointerEvent`, if older iOS support is required.
- Treat cancel/lost-capture as a failed stroke unless progress already meets the completion threshold.
- Keep `touch-action: none`, and add CSS-level `-webkit-user-select: none` and `-webkit-touch-callout: none` for the tracing surface.

Acceptance checks:

- Tracing continues when a finger drifts slightly outside the canvas.
- Multitouch does not corrupt tracing progress.
- `pointercancel` or orientation changes reset the stroke cleanly.
- Desktop mouse input still works.

### 3. Make Speech Synthesis Non-Blocking

Files:

- `src/utils/speech.ts`
- `src/pages/TracingScreen/index.tsx`

Problems:

- iOS Safari may require speech to start from a user activation.
- `speechSynthesis.onend` can be delayed or fail to fire.
- The celebration overlay currently waits for `speakThen` to finish; if speech stalls, the user may not see the completion UI promptly.
- Voices can load asynchronously, especially on Safari.

Plan:

- Show the celebration overlay immediately after completion, then play speech as enhancement.
- Add a timeout fallback to `speakThen`, for example 1500-2500 ms for short praise.
- Add a speech initialization helper that calls `speechSynthesis.getVoices()` after the first user tap.
- Listen for `voiceschanged` and choose a stable voice/language when available.
- Add a user-facing mute/audio toggle later if speech reliability or parental preference becomes important.
- Guard every speech call so visual progression never depends on audio success.

Acceptance checks:

- Completing a trace always shows the overlay, even when audio is blocked or muted.
- Audio still plays on browsers that support it.
- Rapid retry/next/home actions cancel queued speech cleanly.

## Phase 2: Canvas Rendering and Resize Robustness

### 4. Improve Canvas Sizing on High-DPR iPads

Files:

- `src/components/TracingCanvas/index.tsx`

Problems:

- Canvas backing dimensions are `rect.width * devicePixelRatio` and `rect.height * devicePixelRatio` with no cap.
- Large iPads with high DPR can create expensive canvases.
- Width/height can become fractional, which may soften rendering or cause unnecessary redraws.

Plan:

- Clamp DPR for this app, for example `Math.min(window.devicePixelRatio || 1, 2)`.
- Round backing dimensions with `Math.round`.
- Avoid resizing when the computed backing size has not changed.
- Keep coordinate conversion based on backing size.

Acceptance checks:

- Canvas remains sharp on Retina displays.
- Memory and frame time stay reasonable on iPad.
- No repeated resize/redraw loop occurs.

### 5. Observe the Canvas Instead of Only the Window

Files:

- `src/components/TracingCanvas/index.tsx`

Problems:

- `window.resize` does not catch every layout change on iOS Safari.
- `visualViewport` changes can happen when browser chrome changes.
- CSS or orientation changes can alter the canvas wrapper without a window resize.

Plan:

- Add a `ResizeObserver` on the canvas or its parent wrapper.
- Also listen to `window.visualViewport.resize` when available.
- Add `orientationchange` as a fallback.
- Debounce redraws through the existing `requestAnimationFrame` path.

Acceptance checks:

- Canvas stays correctly scaled after rotation.
- Canvas stays correctly scaled when opening the app from the iOS home screen.
- Canvas does not become blank or offset after Safari toolbar changes.

## Phase 3: PWA and Install Behavior

### 6. Make Asset Paths Base-Aware

Files:

- `index.html`
- `public/site.webmanifest`
- `vite.config.ts`

Status: implemented with `%BASE_URL%` HTML asset paths, relative manifest URLs, and `VITE_BASE_PATH`.

Original problems:

- Icons, manifest, `start_url`, and `scope` are hardcoded to `/kidtrace/`.
- This is fine for GitHub Pages under `/kidtrace/`, but less portable for local previews, custom domains, or alternate deployments.

Plan:

- Keep `/kidtrace/` if GitHub Pages is the only production target.
- If portability matters, generate the manifest during build or use base-aware values from `import.meta.env.BASE_URL`.
- Document supported deployment paths in `README.md`.
- Verify `npm run preview` serves the app under the same base path used in production.

Acceptance checks:

- Icons load in local preview and production.
- Installed app opens to the correct route.
- Moving the app to a custom domain does not require manual path edits in multiple files.

### 7. Add Real PWA Offline Support

Files:

- `public/site.webmanifest`
- new service worker or Vite PWA integration

Status: started with a small custom service worker for app-shell precache and same-scope runtime caching.

Problems:

- A manifest alone does not make the app offline-capable.
- iOS standalone apps feel broken if they launch without network and assets are not cached.

Plan:

- Add a service worker using `vite-plugin-pwa` or a small custom worker.
- Precache the app shell, category chunks, CSS, and icons.
- Add a simple update strategy, such as prompt-on-next-launch or auto-update for this small app.
- Test installed standalone mode on iOS after clearing Safari website data.

Acceptance checks:

- Installed app launches offline after first successful visit.
- Category data loads offline.
- App updates do not strand users on stale broken bundles.

### 8. Expand iOS App Metadata

Files:

- `index.html`
- `public/site.webmanifest`
- `public/`

Status: partially implemented. Existing Apple tags remain, manifest metadata was expanded, and icon sizes were verified.

Plan:

- Keep existing `apple-mobile-web-app-capable`, title, and status bar tags.
- Add a `mask-icon` only if Safari pinned-tab support matters.
- Consider iOS startup images if polished standalone launch is important.
- Verify `apple-touch-icon.png` is exactly 180x180 and not transparent.
- Ensure `theme_color` and `apple-mobile-web-app-status-bar-style` look good in both browser and standalone modes.

Acceptance checks:

- Home-screen icon looks correct on iOS.
- Standalone launch screen does not flash an unintended color.
- Status bar text remains readable.

## Phase 4: Touch UI Polish

### 9. Restrict Hover Effects to Hover-Capable Devices

Files:

- `src/pages/HomeScreen/index.css`
- `src/pages/TracingScreen/index.module.css`

Status: implemented with `@media (hover: hover) and (pointer: fine)` wrappers.

Problems:

- Mobile Safari can leave `:hover` styles active after tapping.

Plan:

- Wrap hover-only transforms in `@media (hover: hover) and (pointer: fine)`.
- Keep `:active` feedback for touch devices.

Acceptance checks:

- Category cards and buttons do not remain enlarged after tap on iPhone/iPad.
- Desktop hover behavior is unchanged.

### 10. Make Celebration Overlay Fit Small Screens

Files:

- `src/pages/TracingScreen/index.module.css`
- `src/components/CelebrationOverlay/index.tsx`

Status: implemented in CSS with safe-area padding, card constraints, clamped sizing, scroll fallback, and wrapping actions.

Problems:

- The celebration card has large fixed sizes: `120px` label, `220px` emoji, fixed margins, and wide padding.
- On smaller iPhones or landscape mode, the card/actions can collide with safe areas or clip.

Plan:

- Add overlay padding with all safe-area insets.
- Constrain the card with `max-width`, `max-height`, and `overflow-y: auto`.
- Convert large fixed font sizes and margins to `clamp()`.
- Allow action buttons to wrap when space is limited.

Acceptance checks:

- Overlay is usable on iPhone SE-sized screens.
- Buttons remain reachable in portrait, landscape, Safari, and standalone mode.

### 11. Improve Font Consistency

Files:

- `src/styles/tokens.css`

Status: implemented with a broader rounded/system font fallback stack.

Problems:

- `"Arial Rounded MT Bold"` is not consistently available across platforms.
- iOS may fall back to plain Arial, changing the app's visual weight and layout.

Plan:

- Use a stronger system fallback stack:
  - `"Arial Rounded MT Bold", "Avenir Next Rounded", "Nunito", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- If the rounded style is central to the brand, bundle a webfont with `font-display: swap`.

Acceptance checks:

- Text remains visually close across Windows, Android, macOS, and iOS.
- Font fallback does not cause button text clipping.

## Phase 5: Build Target and Compatibility Policy

### 12. Define Browser Support Targets

Files:

- `vite.config.ts`
- `tsconfig.app.json`
- `package.json`
- `README.md`

Status: implemented with an explicit Vite build/CSS target and README support matrix.

Problems:

- TypeScript targets `ES2023`.
- The Vite build has no explicit browser target.
- Without a stated support matrix, older iOS Safari compatibility is accidental.

Plan:

- Decide minimum iOS Safari version, for example:
  - recommended: iOS Safari 16.4+ for dynamic viewport units and modern PWA behavior
  - broader: iOS Safari 15+ with viewport JavaScript fallback
- Add an explicit Vite build target if supporting older Safari.
- Document the support matrix in `README.md`.
- Add compatibility checks to release notes or PR checklist.

Acceptance checks:

- Production bundle syntax matches the chosen iOS Safari minimum.
- Future changes have a clear compatibility bar.

## Phase 6: Testing Plan

### 13. Add Automated Browser Smoke Tests

Recommended tools:

- Playwright with Chromium, Firefox, and WebKit
- Real-device iOS Safari for final verification
- BrowserStack/Sauce Labs if real devices are not always available

Test cases:

- App loads home screen.
- Category selection lazy-loads tracing screen.
- Canvas accepts a synthetic pointer trace.
- Retry, next, and home actions work.
- Overlay remains visible and buttons are clickable at mobile viewport sizes.
- App works under the configured base path `/kidtrace/`.

Limitations:

- Desktop WebKit is useful, but it is not a perfect replacement for iOS Safari.
- Speech synthesis and installed PWA behavior need real-device/manual testing.

### 14. Manual iOS Safari Checklist

Devices/viewports:

- iPhone SE-sized viewport
- Modern notched iPhone
- iPad portrait and landscape
- Safari browser mode
- iOS home-screen standalone mode

Checklist:

- No screen is clipped by the address bar, notch, or home indicator.
- Canvas aligns with the finger throughout a full trace.
- Rotation does not break canvas scale.
- Speech failure does not block progress.
- Buttons do not get stuck in hover styles.
- Installed app icon, launch, status bar, and offline launch behave as expected.

## Suggested Implementation Order

1. Viewport and safe-area CSS fixes.
2. Pointer-event tracing rewrite with cancel handling.
3. Non-blocking speech flow with timeout fallback.
4. Canvas DPR clamp plus `ResizeObserver`/`visualViewport` resize handling.
5. Celebration overlay responsive/safe-area polish.
6. Hover media-query cleanup.
7. Build target and documented browser support.
8. PWA path/offline improvements.
9. Automated smoke tests and real iOS manual checklist.

## Quick Win Checklist

- [x] Replace `100vh` usage with app-height/dynamic viewport fallback.
- [x] Remove `100vw` from fixed screens where `width: 100%` is enough.
- [x] Add additive safe-area spacing around fixed controls.
- [x] Make completion UI independent from speech callbacks.
- [x] Add `pointercancel`/cancel handling for tracing.
- [x] Clamp canvas DPR to avoid oversized iPad canvases.
- [x] Wrap hover transforms in hover-capable media queries.
- [x] Document the minimum supported iOS Safari version.
