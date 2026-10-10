// password-gen-bd — offline password generator.
// Uses crypto.getRandomValues ONLY (never Math.random). No storage by design.

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?",
};
const AMBIGUOUS = new Set("0OIl1".split(""));
const MEM_CONSONANTS = "bcdfghjkmnpqrstvwxz";
const MEM_VOWELS = "aeiou";
const GUESSES_PER_SEC = 1e10; // for crack-time ESTIMATE only

let lang = "en";
const $ = (id) => document.getElementById(id);

/**
 * computeStrength(length, poolSize) — the entropy math, in one place.
 * bits = length × log2(poolSize). Rating: Weak <50 / Fair 50–80 /
 * Strong 80–110 / Fortress >110. Crack time = 2^(bits−1) / 1e10 guesses·sec⁻¹,
 * shown as a rough, explicitly-labeled estimate (no fake precision).
 */
function computeStrength(length, poolSize) {
  const t = I18N[lang];
  const bits = length * Math.log2(poolSize);
  let label, color;
  if (bits < 50) { label = t.weak; color = "#dc2626"; }
  else if (bits < 80) { label = t.fair; color = "#d97706"; }
  else if (bits <= 110) { label = t.strong; color = "#16a34a"; }
  else { label = t.fortress; color = "#2563eb"; }

  const seconds = Math.pow(2, bits - 1) / GUESSES_PER_SEC;
  let span;
  if (seconds < 1) span = t.unit(1, t.sec, t.secs);
  else if (seconds < 60) span = t.unit(Math.round(seconds), t.sec, t.secs);
  else if (seconds < 3600) span = t.unit(Math.round(seconds / 60), t.min, t.mins);
  else if (seconds < 86400) span = t.unit(Math.round(seconds / 3600), t.hr, t.hrs);
  else if (seconds < 31557600) span = t.unit(Math.round(seconds / 86400), t.day, t.days);
  else if (seconds < 31557600 * 1000) span = t.unit(Math.round(seconds / 31557600), t.yr, t.yrs);
  else span = t.veryLong;

  return { bits, label, color, crack: t.crack(span) };
}

// Rejection-sampled uniform int in [0, max) from crypto randomness.
function randomInt(max) {
  const limit = Math.floor(256 / max) * max;
  const buf = new Uint8Array(1);
  let v;
  do {
    crypto.getRandomValues(buf);
    v = buf[0];
  } while (v >= limit);
  return v % max;
}

function pickFrom(str) {
  return str[randomInt(str.length)];
}

function activePool() {
  let pool = "";
  const chosen = [];
  for (const key of ["lower", "upper", "digits", "symbols"]) {
    if ($("set" + key[0].toUpperCase() + key.slice(1)).checked) {
      let chars = SETS[key];
      if ($("optNoAmbiguous").checked) {
        chars = chars.split("").filter((c) => !AMBIGUOUS.has(c)).join("");
      }
      if (chars) { pool += chars; chosen.push(chars); }
    }
  }
  return { pool, chosen };
}

function generateRandom(length, pool, chosen) {
  // Fill, then guarantee one char from each selected set (positions shuffled).
  const out = new Array(length);
  for (let i = 0; i < length; i++) out[i] = pickFrom(pool);
  const pos = out.map((_, i) => i);
  for (let i = pos.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [pos[i], pos[j]] = [pos[j], pos[i]];
  }
  chosen.forEach((setChars, k) => { out[pos[k]] = pickFrom(setChars); });
  return out.join("");
}

function generateMemorable(length) {
  // Alternating consonant–vowel syllables; lowercase only, easy to read aloud.
  let s = "";
  let useConsonant = randomInt(2) === 0;
  while (s.length < length) {
    s += useConsonant ? pickFrom(MEM_CONSONANTS) : pickFrom(MEM_VOWELS);
    useConsonant = !useConsonant;
  }
  return s.slice(0, length);
}

function showError(msg) {
  const el = $("setError");
  el.textContent = msg;
  el.hidden = !msg;
}

function renderResult(password, poolSize) {
  const out = $("passwordOut");
  out.textContent = password;
  out.classList.remove("placeholder");
  $("copyMsg").textContent = "";
  const length = password.length;
  const s = computeStrength(length, poolSize);
  $("strengthLabel").textContent = s.label;
  $("entropyBits").textContent = fmtNum(Math.round(s.bits * 10) / 10, lang) + " bits";
  $("crackTime").textContent = s.crack;
  const fill = $("meterFill");
  fill.style.width = Math.min(100, (s.bits / 128) * 100) + "%";
  fill.style.background = s.color;
}

function onGenerate() {
  const length = parseInt($("lengthRange").value, 10);
  if ($("optMemorable").checked) {
    showError("");
    renderResult(generateMemorable(length), MEM_CONSONANTS.length + MEM_VOWELS.length);
    return;
  }
  const { pool, chosen } = activePool();
  if (!pool || !chosen.length) {
    showError(I18N[lang].setError);
    return;
  }
  showError("");
  renderResult(generateRandom(length, pool, chosen), pool.length);
}

async function onCopy() {
  const pw = $("passwordOut").textContent;
  if (!pw || $("passwordOut").classList.contains("placeholder")) return;
  const msg = $("copyMsg");
  try {
    await navigator.clipboard.writeText(pw);
    msg.textContent = I18N[lang].copied;
  } catch (e) {
    // Fallback for non-secure contexts: select + execCommand.
    const ta = document.createElement("textarea");
    ta.value = pw;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      msg.textContent = I18N[lang].copied;
    } catch (e2) {
      msg.textContent = I18N[lang].copyFailed;
    }
    document.body.removeChild(ta);
  }
}

function applyI18n() {
  const t = I18N[lang];
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) el.textContent = t[key];
  });
  const out = $("passwordOut");
  if (out.classList.contains("placeholder")) out.textContent = t.pressGenerate;
  $("copyBtn").title = t.copy;
  $("langToggle").textContent = lang === "en" ? "বাংলা" : "English";
  showError($("setError").hidden ? "" : t.setError);
}

$("genBtn").addEventListener("click", onGenerate);
$("copyBtn").addEventListener("click", onCopy);
$("lengthRange").addEventListener("input", () => {
  $("lengthVal").textContent = fmtNum($("lengthRange").value, lang);
});
$("optMemorable").addEventListener("change", () => {
  const mem = $("optMemorable").checked;
  ["Lower", "Upper", "Digits", "Symbols"].forEach((k) => { $("set" + k).disabled = mem; });
});
$("langToggle").addEventListener("click", () => {
  lang = lang === "en" ? "bn" : "en";
  $("lengthVal").textContent = fmtNum($("lengthRange").value, lang);
  applyI18n();
});

applyI18n();
