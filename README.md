# Password Generator BD — পাসওয়ার্ড জেনারেটর বিডি

A free, fully offline password generator. Bilingual (English/বাংলা). Nothing you generate is ever stored, logged, or sent anywhere.

## Problem
Weak, reused passwords are the most common way accounts get taken over. People need strong, unique passwords but cannot invent or remember random strings.

## Features
- Length slider (8–64 characters)
- Toggleable character sets: lowercase, UPPERCASE, digits, symbols (at least one required)
- Cryptographically secure generation via `crypto.getRandomValues` (never `Math.random`)
- Guaranteed inclusion: every selected set appears at least once in the output
- Strength meter: entropy in bits with Weak / Fair / Strong / Fortress rating
- Honest crack-time estimate, explicitly labeled as an estimate
- Exclude ambiguous characters (`0OIl1`) option
- Memorable mode: pronounceable consonant–vowel syllables (lowercase only)
- Copy to clipboard (with fallback for non-secure contexts)
- Full EN ⇄ বাংলা UI toggle; responsive mobile + desktop

## Stack
Vanilla HTML + CSS + JavaScript. No build step, no dependencies, no backend, zero network requests.

## Prerequisites
Any modern browser (Chrome, Firefox, Edge, Safari). That's it.

## Install
No install needed. Open `index.html` in a browser, or serve the folder:
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Dev commands
None — there is no build, bundler, or test runner in the repo. Tests live outside the repo (see Testing).

## Env
None. No API keys, no `.env`, no secrets of any kind.

## Testing
Headless-Chromium checks via puppeteer-core (test script kept outside the repo):
- 100 generated passwords at length 16 are all unique
- Charset respected: digits-only output matches `/^\d+$/`
- Length respected at min (8) and max (64)
- Unchecking all sets shows an inline error and generates nothing
- Entropy math: 16 chars × log2(87) ≈ 103.1 bits → rated "Strong"
- Memorable mode: lowercase-only, pronounceable, exact requested length
- Copy button writes the password to the clipboard
- **Privacy: `localStorage` is empty after generation — nothing is persisted**
- BN/EN toggle rewrites all labels
- 390px mobile viewport: no horizontal overflow, zero console errors

## Deployment
GitHub Pages compatible: static files only. Enable Pages on the repo (branch `main`, folder `/ (root)`).

## Limitations
- Entropy bits and crack times are **estimates**, not guarantees; real-world attack speed depends on the attacker's hardware and the hashing algorithm used by the site you protect.
- Memorable mode trades strength for pronounceability (smaller pool: 25 letters); use a longer length there.
- Clipboard copy needs a secure context (HTTPS/localhost); otherwise use the manual fallback.
- This tool generates passwords; it does not store them. Use a password manager to keep them.

## Status
Built 2026-10-11. All checks passing, zero console errors.
