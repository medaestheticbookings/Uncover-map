/**
 * Wrap the app in a password.
 *
 * A static host has no server, so a password that is merely *checked* in
 * JavaScript is theatre — the page is still sitting there in view-source.
 * This encrypts the whole app instead: the published file holds ciphertext
 * and nothing else, and the password is the only way to get the plaintext
 * back. Wrong password means AES-GCM fails to authenticate, so there is no
 * comparison to tamper with either.
 *
 *   node tools/lock.mjs index.html <password> ../evzo/uncover/index.html
 *
 * The plaintext must not be published anywhere else, or the lock is moot.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";

const [, , src, password, out] = process.argv;
if (!src || !password || !out) {
  console.error("usage: node tools/lock.mjs <src.html> <password> <out.html>");
  process.exit(1);
}

const ITER = 310000; // OWASP's PBKDF2-SHA256 floor, and still instant on a phone
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));

const base = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(password),
  "PBKDF2",
  false,
  ["deriveKey"],
);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" },
  base,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"],
);
const cipher = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv },
  key,
  new TextEncoder().encode(readFileSync(src, "utf8")),
);

const b64 = (u8) => Buffer.from(u8).toString("base64");
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#121628">
<meta name="robots" content="noindex,nofollow">
<title>Uncover</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=DM+Sans:wght@400;500&display=swap">
<style>
:root{--fog:#121628;--panel:rgba(18,22,40,.86);--line:rgba(255,255,255,.10);--text:#f3f1ec;--muted:#a3a8bd;--accent:#ff8a3d;--accent-ink:#1b0f05;color-scheme:dark}
*{box-sizing:border-box}
html,body{height:100%;margin:0;background:var(--fog);color:var(--text);font-family:"DM Sans",ui-sans-serif,system-ui,sans-serif}
body{display:grid;place-items:center;padding:24px}
.card{width:100%;max-width:360px;background:var(--panel);border:1px solid var(--line);border-radius:22px;padding:28px 24px;text-align:center}
h1{font-family:"Bricolage Grotesque",ui-sans-serif,system-ui,sans-serif;font-weight:800;font-size:30px;letter-spacing:-.02em;margin:0 0 6px}
h1 span{color:var(--accent)}
p{color:var(--muted);font-size:14px;line-height:1.5;margin:0 0 20px}
input{width:100%;padding:14px 16px;border-radius:14px;border:1px solid var(--line);background:rgba(255,255,255,.06);color:var(--text);font:500 16px inherit;text-align:center}
input:focus{outline:2px solid var(--accent);outline-offset:2px}
button{width:100%;margin-top:12px;padding:15px;border:0;border-radius:14px;background:var(--accent);color:var(--accent-ink);font-family:"Bricolage Grotesque",sans-serif;font-weight:800;font-size:16px;cursor:pointer}
button:disabled{opacity:.5;cursor:default}
.err{color:#ff8e8e;font-size:13px;min-height:18px;margin-top:12px}
</style>
</head>
<body>
<main class="card">
  <h1>Uncover<span>.</span></h1>
  <p>Not open yet. If you were given a password, this is where it goes.</p>
  <form id="f">
    <input id="p" type="password" autocomplete="current-password" autofocus aria-label="Password">
    <button id="b" type="submit">Open</button>
  </form>
  <div class="err" id="e" role="alert"></div>
</main>
<script>
(() => {
  const D = ${JSON.stringify({ salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(cipher)), iter: ITER })};
  const raw = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const f = document.getElementById('f'), p = document.getElementById('p'),
        b = document.getElementById('b'), e = document.getElementById('e');

  f.onsubmit = async ev => {
    ev.preventDefault();
    if (!p.value) return;
    b.disabled = true; b.textContent = 'Opening…'; e.textContent = '';
    try {
      const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(p.value), 'PBKDF2', false, ['deriveKey']);
      const key = await crypto.subtle.deriveKey(
        { name:'PBKDF2', salt: raw(D.salt), iterations: D.iter, hash:'SHA-256' },
        base, { name:'AES-GCM', length:256 }, false, ['decrypt']);
      // A wrong password fails here: GCM will not authenticate the tag, so
      // there is no equality check for anyone to patch out.
      const plain = await crypto.subtle.decrypt({ name:'AES-GCM', iv: raw(D.iv) }, key, raw(D.ct));
      const html = new TextDecoder().decode(plain);
      try { sessionStorage.setItem('uncover.pw', p.value); } catch (_) {}
      document.open(); document.write(html); document.close();
    } catch (_) {
      e.textContent = 'Not that one.';
      p.value = ''; p.focus();
      b.disabled = false; b.textContent = 'Open';
    }
  };

  // Remembered for this tab only, so a reload mid-walk does not ask again.
  try {
    const saved = sessionStorage.getItem('uncover.pw');
    if (saved) { p.value = saved; f.requestSubmit(); }
  } catch (_) {}
})();
</script>
</body>
</html>
`;
writeFileSync(out, page);
console.log(`Locked ${src} -> ${out} (${(page.length / 1024).toFixed(1)} kB)`);
