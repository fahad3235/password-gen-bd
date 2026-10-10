// i18n strings for password-gen-bd. `lang` is module-global; no persistence by design.
const I18N = {
  en: {
    appTitle: "Password Generator BD",
    yourPassword: "Your password",
    pressGenerate: "Press Generate",
    copy: "Copy",
    copied: "Copied to clipboard ✓",
    copyFailed: "Copy failed — select and copy manually",
    strength: "Strength",
    entropy: "Entropy",
    length: "Length",
    charSets: "Character sets",
    lower: "Lowercase",
    upper: "Uppercase",
    digits: "Digits",
    symbols: "Symbols",
    options: "Options",
    noAmbiguous: "Exclude ambiguous characters",
    memorable: "Memorable mode (pronounceable)",
    memorableHint: "Memorable mode uses easy syllables (lowercase only).",
    generate: "Generate password",
    privacyTitle: "Private by design.",
    privacy: "Passwords are generated on your device with crypto.getRandomValues and are never stored, logged, or sent anywhere.",
    setError: "Select at least one character set.",
    weak: "Weak",
    fair: "Fair",
    strong: "Strong",
    fortress: "Fortress",
    crack: (t) => `≈ ${t} to crack (estimate)`,
    unit: (n, one, many) => `${n} ${n === 1 ? one : many}`,
    sec: "sec", secs: "secs", min: "min", mins: "mins",
    hr: "hour", hrs: "hours", day: "day", days: "days",
    yr: "year", yrs: "years", veryLong: "millions of years",
  },
  bn: {
    appTitle: "পাসওয়ার্ড জেনারেটর বিডি",
    yourPassword: "আপনার পাসওয়ার্ড",
    pressGenerate: "জেনারেট চাপুন",
    copy: "কপি",
    copied: "ক্লিপবোর্ডে কপি হয়েছে ✓",
    copyFailed: "কপি ব্যর্থ — নিজে সিলেক্ট করে কপি করুন",
    strength: "শক্তি",
    entropy: "এনট্রপি",
    length: "দৈর্ঘ্য",
    charSets: "অক্ষরের সেট",
    lower: "ছোট হাতের",
    upper: "বড় হাতের",
    digits: "সংখ্যা",
    symbols: "চিহ্ন",
    options: "অপশন",
    noAmbiguous: "বিভ্রান্তিকর অক্ষর বাদ দিন",
    memorable: "সহজে মনে রাখার মোড",
    memorableHint: "মনে রাখার মোডে সহজ সিলেবল ব্যবহার হয় (শুধু ছোট হাতের)।",
    generate: "পাসওয়ার্ড তৈরি করুন",
    privacyTitle: "গোপনীয়তা নিশ্চিত।",
    privacy: "পাসওয়ার্ড আপনার ডিভাইসেই crypto.getRandomValues দিয়ে তৈরি হয় — কোথাও সংরক্ষণ, লগ বা পাঠানো হয় না।",
    setError: "অন্তত একটি অক্ষরের সেট বেছে নিন।",
    weak: "দুর্বল",
    fair: "মোটামুটি",
    strong: "শক্তিশালী",
    fortress: "দুর্গ",
    crack: (t) => `ফাটাতে ≈ ${t} (আনুমানিক)`,
    unit: (n, one, many) => `${bnDigits(n)} ${n === 1 ? one : many}`,
    sec: "সেকেন্ড", secs: "সেকেন্ড", min: "মিনিট", mins: "মিনিট",
    hr: "ঘণ্টা", hrs: "ঘণ্টা", day: "দিন", days: "দিন",
    yr: "বছর", yrs: "বছর", veryLong: "কোটি কোটি বছর",
  }
};

function bnDigits(n) {
  const map = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯", ".": "." };
  return String(n).split("").map((c) => map[c] || c).join("");
}

function fmtNum(n, lang) {
  return lang === "bn" ? bnDigits(n) : String(n);
}
